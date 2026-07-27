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

const FaceEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const videoReadyRef = useRef(false);

  const [employee, setEmployee] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedEmbeddings, setCapturedEmbeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('Initialize camera to start face enrollment');

  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
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
      setFeedback('Downloading face recognition models...');
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        setFeedback('Models loaded. Click "Start Camera" to begin.');
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setError('Failed to load face detection models. Check internet connection.');
      } finally {
        setLoading(false);
      }
    };
    loadModels();

    return () => { stopCamera(); };
  }, []);

  const startCamera = async () => {
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
      const video = videoRef.current;
      video.srcObject = stream;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play()
            .then(() => {
              videoReadyRef.current = true;
              resolve();
            })
            .catch(reject);
        };
        video.onerror = reject;
        setTimeout(resolve, 3000);
      });

      setCameraActive(true);
      setFeedback('Camera active. Align your face in the circle, then click "Capture Face".');
    } catch (err) {
      console.error('Webcam start error:', err.name, err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Click the 🔒 icon in the address bar → Camera → Allow, then refresh.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No webcam found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another app (Teams, Zoom, etc.). Close it and try again.');
      } else {
        setError(`Webcam error: ${err.message || err.name}`);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    videoReadyRef.current = false;
    setCameraActive(false);
    setCapturing(false);
  }, []);

  const resetEnrollment = () => {
    setCapturedEmbeddings([]);
    setProgress(0);
    setCapturing(false);
    setFeedback('Reset. Start camera and capture again.');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startEnrollmentCapture = () => {
    if (!cameraActive || !modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Camera feed not ready yet. Please wait a moment and try again.');
      return;
    }

    setCapturing(true);
    setFeedback('Scanning... Keep still and look directly at the camera.');

    const embeddingsList = [];

    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const vid = videoRef.current;
      const cvs = canvasRef.current;

      if (vid.readyState < 2 || vid.videoWidth === 0) return;

      const displaySize = { width: vid.videoWidth, height: vid.videoHeight };

      if (cvs.width !== displaySize.width || cvs.height !== displaySize.height) {
        cvs.width = displaySize.width;
        cvs.height = displaySize.height;
        faceapi.matchDimensions(cvs, displaySize);
      }

      const detection = await faceapi
        .detectSingleFace(vid, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      const ctx = cvs.getContext('2d');
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      if (detection) {
        const resized = faceapi.resizeResults(detection, displaySize);
        faceapi.draw.drawDetections(cvs, resized);
        faceapi.draw.drawFaceLandmarks(cvs, resized);

        const descriptorArray = Array.from(detection.descriptor);
        embeddingsList.push(descriptorArray);

        const count = embeddingsList.length;
        setProgress((count / TARGET_FRAME_COUNT) * 100);
        setFeedback(`Captured ${count} / ${TARGET_FRAME_COUNT} frames...`);

        if (count >= TARGET_FRAME_COUNT) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setCapturedEmbeddings(embeddingsList);
          setCapturing(false);
          setFeedback('✅ Biometric capture complete! Click "Save Biometrics" to enroll.');
          stopCamera();
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        setFeedback('No face detected — position your face in the circle and ensure good lighting.');
      }
    }, 700);
  };

  const handleSaveEmbeddings = async () => {
    if (capturedEmbeddings.length < TARGET_FRAME_COUNT) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/employees/${id}/face-embeddings`, {
        embeddings: capturedEmbeddings
      });
      if (res.data.success) {
        alert('Biometric credentials saved successfully!');
        navigate('/admin/employees');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save biometric profile.');
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
