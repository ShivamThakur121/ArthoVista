import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';
import confetti from 'canvas-confetti';
import { api, useAuth } from '../../context/AuthContext';
import { 
  Camera, 
  MapPin, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  UserCheck,
  Building,
  Navigation
} from 'lucide-react';

const AttendancePortal = () => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [todayStatus, setTodayStatus] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [systemFeedback, setSystemFeedback] = useState('Standby - Please fetch GPS coordinates first.');

  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

  useEffect(() => {
    fetchTodayStatus();
    loadFaceModels();

    return () => {
      stopCamera();
    };
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const res = await api.get('/attendance/today');
      if (res.data.success) {
        setTodayStatus(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadFaceModels = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    } catch (err) {
      console.error('Error loading face-api models:', err);
      setError('Biometric engine failed to load. Check internet connection.');
    }
  };

  const resolveGPS = () => {
    setGpsLoading(true);
    setError('');
    setSuccess('');
    setAddress('');
    setSystemFeedback('Locating device position...');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'User-Agent': 'AttendanceHubSystem/1.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            setAddress(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } else {
            setAddress(`Coords: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
          setSystemFeedback('GPS Coordinates resolved. Activate webcam to verify attendance.');
        } catch (err) {
          console.warn('Geocoding rate limit/failure, falling back:', err);
          setAddress(`Coords: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setSystemFeedback('GPS coordinates resolved (offline address fallback).');
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        console.error('GPS Geolocation error:', err);
        let msg = 'Failed to retrieve location.';
        if (err.code === 1) msg = 'Location access denied. Please enable location permissions.';
        setError(msg);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const startCamera = async () => {
    setError('');
    setSuccess('');

    const wireStream = async (stream) => {
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(resolve).catch(reject);
        };
        video.onerror = reject;
        if (video.readyState >= 2) resolve();
        setTimeout(resolve, 3000);
      });
    };

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
      } catch (_constraintErr) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      await wireStream(stream);
      setCameraActive(true);
      setSystemFeedback('Webcam ready. Keep face inside frame and click verify.');
    } catch (err) {
      console.error('Webcam error:', err.name, err.message);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access in browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No webcam detected. Please connect a camera and try again.');
      } else {
        setError(`Cannot access webcam: ${err.message || err.name}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleMarkAttendance = async (actionType) => {
    if (!coords) {
      setError('Please resolve your GPS coordinates first.');
      return;
    }
    if (!cameraActive) {
      setError('Please start the camera before verifying biometrics.');
      return;
    }

    const video = videoRef.current;

    if (!video || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Camera feed not ready yet. Please wait a moment and try again.');
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');
    setSystemFeedback('Scanning face and matching biometrics...');

    try {
      const canvas = canvasRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };

      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);

      const detectionPromise = faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.60 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('FACE_DETECTION_TIMEOUT')), 15000)
      );

      const detection = await Promise.race([detectionPromise, timeoutPromise]);

      if (!detection) {
        setError('No face detected. Align your face inside the webcam bounds and look at the camera.');
        setSystemFeedback('Face not detected. Please retry.');
        setProcessing(false);
        return;
      }

      const resizedDetections = faceapi.resizeResults(detection, displaySize);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      const userAgent = navigator.userAgent;
      const platform = navigator.platform;

      const endpoint = actionType === 'check-in' ? '/attendance/check-in' : '/attendance/check-out';
      const res = await api.post(endpoint, {
        faceDescriptor: Array.from(detection.descriptor),
        gps: {
          lat: coords.lat,
          lng: coords.lng,
          address: address
        },
        deviceInfo: platform,
        browser: userAgent
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        setSystemFeedback('Verified! Attendance recorded successfully.');
        triggerSuccessCelebration();
        stopCamera();
        fetchTodayStatus();
      }
    } catch (err) {
      console.error(err);
      if (err.message === 'FACE_DETECTION_TIMEOUT') {
        setError('Face detection timed out. Ensure good lighting and try again.');
        setSystemFeedback('Detection timeout. Please retry.');
      } else {
        setError(err.response?.data?.message || 'Biometric verification or geofencing failure.');
        setSystemFeedback('Access Denied. Check coordinates and alignment.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const triggerSuccessCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const formatTimeString = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (loadingStatus || !modelsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p className="text-sm font-medium">Booting biometric engines & loading maps...</p>
      </div>
    );
  }

  const hasBiometrics = user?.hasBiometrics;
  if (!hasBiometrics) {
    return (
      <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-amber-200/50 dark:border-amber-900/30 bg-amber-50/20 text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Biometrics Registration Required</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          You cannot mark attendance because you do not have face recognition data registered on your profile. Please contact an HR administrator to complete your biometrics enrollment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div className="lg:col-span-7 space-y-6">
        
        {/* Office Shift Information Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Official Shift Start: <strong>10:00 AM IST</strong></span>
          </div>
          <span className="text-[11px] opacity-80">
            Mon – Sat Active • Check-ins after 10:00 AM marked Late
          </span>
        </div>
        
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl animate-fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-2xl animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
            />

            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-full border-2 border-dashed border-primary-500/40 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-primary-500/30" />
                </div>
              </div>
            )}

            {!cameraActive && (
              <div className="flex flex-col items-center gap-3 text-slate-500 py-16 text-center">
                <Camera className="w-16 h-16 stroke-[1.2] opacity-40" />
                <div>
                  <p className="text-sm font-semibold">Webcam Feed Inactive</p>
                  <p className="text-xs">GPS + Face Verification are required to unlock attendance access.</p>
                </div>
              </div>
            )}

            {processing && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white">
                <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-6 py-4 rounded-2xl shadow-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  <span className="text-sm font-semibold">Authenticating Biometrics...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Terminal Status</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{systemFeedback}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                <button
                  onClick={resolveGPS}
                  disabled={gpsLoading || processing}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-50 transition-colors"
                >
                  {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                  {coords ? 'Refresh Location' : 'Fetch GPS'}
                </button>

                {coords && !cameraActive && (
                  <button
                    onClick={startCamera}
                    disabled={processing}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Activate Camera
                  </button>
                )}
              </div>
            </div>

            {cameraActive && !processing && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {(!todayStatus || !todayStatus.checkIn) && (
                  <button
                    onClick={() => handleMarkAttendance('check-in')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-[0.98] transition-all"
                  >
                    Verify Check-In
                  </button>
                )}

                {todayStatus && todayStatus.checkIn && (!todayStatus.checkOut) && (
                  <button
                    onClick={() => handleMarkAttendance('check-out')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-primary-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all col-start-2"
                  >
                    Verify Check-Out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="lg:col-span-5 space-y-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            Today's Log details
            {todayStatus?.status && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                todayStatus.status === 'Present'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : todayStatus.status === 'Late'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                  : todayStatus.status === 'Half Day'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {todayStatus.status}
              </span>
            )}
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                todayStatus && todayStatus.checkIn 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400">Check-In</p>
                {todayStatus?.checkIn?.time ? (
                  <div className="mt-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatTimeString(todayStatus.checkIn.time)}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {todayStatus.checkIn.gps?.address || 'GPS Address'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Pending Check-In</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                todayStatus && todayStatus.checkOut 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400">Check-Out</p>
                {todayStatus?.checkOut?.time ? (
                  <div className="mt-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatTimeString(todayStatus.checkOut.time)}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {todayStatus.checkOut.gps?.address || 'GPS Address'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Pending Check-Out</p>
                )}
              </div>
            </div>

            {todayStatus && todayStatus.workHours > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">

                {todayStatus.status === 'Half Day' && (
                  <div className="flex items-start gap-2.5 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-2xl">
                    <span className="text-orange-500 text-base leading-none mt-0.5">⚠️</span>
                    <div>
                      <p className="text-xs font-bold text-orange-700 dark:text-orange-400">Half Day Recorded</p>
                      <p className="text-[11px] text-orange-600 dark:text-orange-500 mt-0.5">
                        You worked <span className="font-bold">{todayStatus.workHours} hrs</span> — less than the required 8 hrs full shift.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Work Hours</span>
                    <p className={`text-lg font-bold ${
                      todayStatus.status === 'Half Day'
                        ? 'text-orange-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {todayStatus.workHours} hrs
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Overtime</span>
                    <p className="text-lg font-bold text-primary-500">{todayStatus.overtime || 0} hrs</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3">
            Location geofencing
          </h3>

          <div className="space-y-3.5">
            {coords ? (
              <>
                <div className="flex gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Resolved Coordinates</span>
                    <p className="font-mono text-slate-500 dark:text-slate-400 mt-0.5">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Resolved Location Address</span>
                    <p className="text-slate-550 dark:text-slate-400 mt-0.5 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="p-3 bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-2xl flex items-center justify-between text-xs text-primary-700 dark:text-primary-400">
                  <span className="font-medium">Office Geofencing check:</span>
                  <span className="font-bold">Active Radius 500m</span>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Navigation className="w-8 h-8 mx-auto stroke-[1.5] mb-2 animate-bounce" />
                <p className="text-xs">Location verification required.</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Please click "Fetch GPS" to begin check-in.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AttendancePortal;
