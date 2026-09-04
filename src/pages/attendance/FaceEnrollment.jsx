import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as faceapi from '@vladmandic/face-api';
import confetti from 'canvas-confetti';
import { api } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  Scan,
  AlertCircle,
  Video,
  Play,
  RotateCcw
} from 'lucide-react';

import { loadEssentialFaceModels, areFaceModelsLoaded } from '../../utils/faceModelLoader';

const FaceEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const videoReadyRef = useRef(false);

  const [employee, setEmployee] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(areFaceModelsLoaded());
  const [cameraActive, setCameraActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedEmbeddings, setCapturedEmbeddings] = useState([]);
  const [loading, setLoading] = useState(!areFaceModelsLoaded());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('Initialize camera to start face enrollment');

  const TARGET_FRAME_COUNT = 15;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        if (res.data.success) {
          setEmployee(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch employee details.');
      }
    };
    fetchEmployee();
  }, [id]);

  useEffect(() => {
    const loadModels = async () => {
      if (areFaceModelsLoaded()) {
        setModelsLoaded(true);
        setLoading(false);
        setFeedback('Biometric models loaded. Click "Start Camera" to begin.');
        return;
      }
      setFeedback('Initializing biometric engine...');
      try {
        await loadEssentialFaceModels();
        setModelsLoaded(true);
        setFeedback('Biometric models loaded. Click "Start Camera" to begin.');
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setError('Failed to load face detection models. Check internet connection.');
      } finally {
        setLoading(false);
      }
    };
    loadModels();

    return () => { stopCamera(); };
  }, [id]);

  const isAdminEmployee = employee?.role === 'Admin' || employee?.email?.toLowerCase() === 'shivamthakur12012@gmail.com' || employee?.employeeId === 'ADMIN001';

  const startCamera = async () => {
    if (isAdminEmployee) return;
    setError('');
    videoReadyRef.current = false;

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
      } catch (constraintErr) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          videoReadyRef.current = true;
        };
      }

      setCameraActive(true);
      setFeedback('Camera active. Align your face in the circle, then click "Capture Face".');
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Click the 🔒 icon in the address bar → Camera → Allow, then refresh.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No webcam found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another app (Teams, Zoom, etc.). Close it and try again.');
      } else {
        setError(`Unable to access camera (${err.message}). Check permissions.`);
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    videoReadyRef.current = false;
    setCameraActive(false);
    setCapturing(false);
  }, []);

  const resetCapture = () => {
    stopCamera();
    setProgress(0);
    setCapturedEmbeddings([]);
    setError('');
    setFeedback('Reset. Start camera and capture again.');
  };

  const captureFrames = async () => {
    if (isAdminEmployee) return;
    if (!cameraActive || !modelsLoaded) return;
    if (!videoRef.current || !videoReadyRef.current) {
      setError('Camera feed not ready yet. Please wait a moment and try again.');
      return;
    }

    setCapturing(true);
    setError('');
    setFeedback('Scanning... Keep still and look directly at the camera.');

    const tempEmbeddings = [];
    let frameCount = 0;

    intervalRef.current = setInterval(async () => {
      try {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          tempEmbeddings.push(Array.from(detection.descriptor));
          frameCount++;
          const currentProgress = Math.min(100, Math.round((frameCount / TARGET_FRAME_COUNT) * 100));
          setProgress(currentProgress);
          setFeedback(`Enrolling biometrics: ${frameCount}/${TARGET_FRAME_COUNT} angles scanned...`);

          if (frameCount >= TARGET_FRAME_COUNT) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setCapturedEmbeddings(tempEmbeddings);
            setCapturing(false);
            setFeedback('Capture complete! Click "Save Biometrics" to register.');

            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          }
        } else {
          setFeedback('Face not detected clearly. Move slightly closer and center your face.');
        }
      } catch (err) {
        console.error('Frame detection error:', err);
      }
    }, 200);
  };

  const handleSave = async () => {
    if (isAdminEmployee) return;
    if (capturedEmbeddings.length < TARGET_FRAME_COUNT) {
      setError('Insufficient facial frames. Please complete the full capture scan.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/employees/${id}/face-embeddings`, {
        embeddings: capturedEmbeddings
      });

      if (res.data.success) {
        stopCamera();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          navigate('/admin/employees');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save face embeddings to server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p className="text-sm font-medium">Loading biometric engine...</p>
      </div>
    );
  }

  if (isAdminEmployee) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-6">
        <button
          onClick={() => navigate('/admin/employees')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employee List
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
            <Scan className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Biometric Enrollment Exempt
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              System Administrator accounts (<strong className="font-mono text-slate-900 dark:text-slate-200">{employee?.email || 'shivamthakur12012@gmail.com'}</strong>) are permanently exempt from biometric facial scans and attendance tracking.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate('/admin/employees')}
              className="px-6 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors"
            >
              Return to Employee Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <button
        onClick={() => { stopCamera(); navigate('/admin/employees'); }}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employee List
      </button>

      {employee && (
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-600 font-bold flex items-center justify-center text-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {employee.profilePhoto ? (
              <img src={employee.profilePhoto} alt={employee.fullName} className="w-full h-full object-cover" />
            ) : (
              employee.fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{employee.fullName}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {employee.employeeId} • {employee.designation || 'Staff'}</p>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              employee.faceEmbeddings && employee.faceEmbeddings.length > 0
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
            }`}>
              {employee.faceEmbeddings && employee.faceEmbeddings.length > 0 ? 'Face Enrolled' : 'Pending Enrollment'}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">

        <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ transform: 'scaleX(-1)' }}
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />
          <canvas
            ref={canvasRef}
            style={{ transform: 'scaleX(-1)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            className={cameraActive ? 'block' : 'hidden'}
          />

          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className={`w-64 h-64 md:w-72 md:h-72 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${
                capturing ? 'border-emerald-400/80 animate-pulse' : 'border-primary-400/60'
              }`}>
                <Scan className={`w-8 h-8 ${capturing ? 'text-emerald-400/60' : 'text-primary-400/40'} animate-pulse`} />
              </div>
            </div>
          )}

          {!cameraActive && (
            <div className="flex flex-col items-center gap-3 text-slate-500 py-16 text-center">
              <Video className="w-16 h-16 stroke-[1.2] opacity-40 animate-pulse" />
              <div>
                <p className="text-sm font-semibold">Webcam Feed Inactive</p>
                <p className="text-xs">Click "Start Camera" to initialize the capture portal.</p>
              </div>
            </div>
          )}

          {capturing && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800 text-white flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Capturing biometric descriptors</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-primary-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center md:text-left">
            {feedback}
          </p>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                disabled={!modelsLoaded}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm transition-all"
              >
                Stop Camera
              </button>
            )}

            {cameraActive && !capturing && capturedEmbeddings.length < TARGET_FRAME_COUNT && (
              <button
                onClick={startEnrollmentCapture}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all"
              >
                <Scan className="w-4 h-4" />
                Capture Face
              </button>
            )}

            {capturedEmbeddings.length > 0 && !capturing && (
              <button
                onClick={resetEnrollment}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Re-enroll
              </button>
            )}

            {capturedEmbeddings.length >= TARGET_FRAME_COUNT && (
              <button
                onClick={handleSaveEmbeddings}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all disabled:opacity-70"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Save Biometrics
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FaceEnrollment;
