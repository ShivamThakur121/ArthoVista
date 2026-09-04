import * as faceapi from '@vladmandic/face-api';

let isLoaded = false;
let loadPromise = null;

const LOCAL_MODEL_URL = '/models';
const CDN_MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

/**
 * Loads essential face-api models with singleton caching and parallel fetches.
 * Subsequent calls return instantly without re-fetching from network or disk.
 */
export const loadEssentialFaceModels = () => {
  if (isLoaded) {
    return Promise.resolve(true);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      // Parallel fetch from local public/models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(LOCAL_MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(LOCAL_MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(LOCAL_MODEL_URL)
      ]);
      // Background-load fallback ssdMobilenetv1 without blocking
      faceapi.nets.ssdMobilenetv1.loadFromUri(LOCAL_MODEL_URL).catch(() => { });
      isLoaded = true;
      return true;
    } catch (localErr) {
      console.warn('Local biometric models failed, falling back to CDN:', localErr);
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(CDN_MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(CDN_MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(CDN_MODEL_URL)
        ]);
        faceapi.nets.ssdMobilenetv1.loadFromUri(CDN_MODEL_URL).catch(() => { });
        isLoaded = true;
        return true;
      } catch (cdnErr) {
        console.error('All biometric model sources failed:', cdnErr);
        loadPromise = null; // allow retry
        throw cdnErr;
      }
    }
  })();

  return loadPromise;
};

export const areFaceModelsLoaded = () => isLoaded;

/**
 * Idle-time preloader to warm up face recognition models in background
 */
export const preloadFaceModelsInBackground = () => {
  if (isLoaded || loadPromise) return;
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loadEssentialFaceModels().catch(() => { });
      });
    } else {
      setTimeout(() => {
        loadEssentialFaceModels().catch(() => { });
      }, 1000);
    }
  }
};
