/**
 * 256-Dimensional Biometric Facial Embedding Generator
 * 
 * Fuses deep neural representations (128-D ResNet-34) with
 * scale-invariant landmark spatial morphology vectors (128-D),
 * producing an L2-normalized 256-dimensional biometric embedding.
 */

// Euclidean distance helper
const dist = (p1, p2) => {
  if (!p1 || !p2) return 0;
  const dx = (p1.x || 0) - (p2.x || 0);
  const dy = (p1.y || 0) - (p2.y || 0);
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Extracts a normalized 128-D geometric morphology vector from 68 landmarks
 * @param {Array<{x: number, y: number}>} pts 68 facial landmark positions
 * @param {{x: number, y: number, width: number, height: number}} box Face bounding box
 * @returns {Array<number>} 128-length array of normalized geometric features
 */
const extractGeometricFeatures128 = (pts, box) => {
  if (!pts || pts.length < 68) {
    return new Array(128).fill(0);
  }

  // 1. Reference points & scale normalization
  const leftEyeOuter = pts[36];
  const rightEyeOuter = pts[45];
  const noseTip = pts[30];
  const chin = pts[8];
  const mouthCenter = pts[66] || pts[57];

  // Inter-ocular baseline distance for scale invariance
  const interOcularDist = Math.max(10, dist(leftEyeOuter, rightEyeOuter));
  const faceCenter = {
    x: (leftEyeOuter.x + rightEyeOuter.x) / 2,
    y: (leftEyeOuter.y + rightEyeOuter.y) / 2
  };

  const geoFeatures = [];

  // 2. Relative normalized coordinate offsets for 43 primary landmark points (86 values)
  const keyIndices = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, // Jawline (9 points = 18 values)
    17, 19, 21, 22, 24, 26,         // Eyebrows (6 points = 12 values)
    27, 28, 29, 30, 31, 33, 35,     // Nose (7 points = 14 values)
    36, 37, 38, 39, 40, 41,         // Left Eye (6 points = 12 values)
    42, 43, 44, 45, 46, 47,         // Right Eye (6 points = 12 values)
    48, 50, 52, 54, 56, 57, 58, 62, 66 // Mouth & Lips (9 points = 18 values)
  ];

  for (let idx of keyIndices) {
    const pt = pts[idx] || faceCenter;
    const nx = (pt.x - faceCenter.x) / interOcularDist;
    const ny = (pt.y - faceCenter.y) / interOcularDist;
    geoFeatures.push(nx, ny);
  } // 86 values

  // 3. Structural invariant ratios & angles (10 values)
  const faceHeight = Math.max(10, dist(faceCenter, chin));
  const eyeToNose = dist(faceCenter, noseTip);
  const noseToChin = dist(noseTip, chin);
  const mouthWidth = dist(pts[48], pts[54]);
  const leftEyeWidth = dist(pts[36], pts[39]);
  const rightEyeWidth = dist(pts[42], pts[45]);
  const jawWidth = dist(pts[0], pts[16]);

  geoFeatures.push(
    faceHeight / interOcularDist,
    eyeToNose / interOcularDist,
    noseToChin / interOcularDist,
    mouthWidth / interOcularDist,
    leftEyeWidth / interOcularDist,
    rightEyeWidth / interOcularDist,
    jawWidth / interOcularDist,
    (eyeToNose + 1e-5) / (noseToChin + 1e-5),
    (mouthWidth + 1e-5) / (interOcularDist + 1e-5),
    (jawWidth + 1e-5) / (faceHeight + 1e-5)
  ); // +10 values = 96 values

  // Facial triangle area & angle ratios (10 values)
  const dNoseLeftEye = dist(noseTip, leftEyeOuter);
  const dNoseRightEye = dist(noseTip, rightEyeOuter);
  const dNoseMouth = dist(noseTip, mouthCenter);
  const dChinMouth = dist(chin, mouthCenter);

  geoFeatures.push(
    dNoseLeftEye / interOcularDist,
    dNoseRightEye / interOcularDist,
    dNoseMouth / interOcularDist,
    dChinMouth / interOcularDist,
    (dNoseLeftEye + 1e-5) / (dNoseRightEye + 1e-5),
    dist(pts[17], pts[26]) / interOcularDist, // Brow span
    dist(pts[19], pts[24]) / interOcularDist, // Inner brow span
    dist(pts[31], pts[35]) / interOcularDist, // Nose base width
    dist(pts[37], pts[41]) / (leftEyeWidth + 1e-5), // Left EAR ratio
    dist(pts[43], pts[47]) / (rightEyeWidth + 1e-5)  // Right EAR ratio
  ); // +10 values = 106 values

  // Normalized jawline curvature vectors (22 values)
  for (let i = 0; i <= 10; i++) {
    const pJaw = pts[i] || chin;
    const dxChin = (pJaw.x - chin.x) / interOcularDist;
    const dyChin = (pJaw.y - chin.y) / interOcularDist;
    geoFeatures.push(dxChin, dyChin);
  } // +22 values = exactly 128 values

  return geoFeatures.slice(0, 128);
};

/**
 * L2 unit-norm normalization
 * @param {Array<number>} vec 
 * @returns {Array<number>}
 */
const l2Normalize = (vec) => {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq) || 1.0;
  return vec.map(v => Math.round((v / norm) * 1000000) / 1000000);
};

/**
 * Generates an L2-normalized 256-dimensional facial embedding vector
 * @param {object} detection faceapi detection object with descriptor and landmarks
 * @returns {Array<number>} 256-dimensional normalized embedding vector
 */
export const generate256dEmbedding = (detection) => {
  if (!detection) return null;

  // 1. Neural Descriptor (128 dimensions)
  const neural128 = detection.descriptor
    ? Array.from(detection.descriptor)
    : new Array(128).fill(0);

  // 2. Geometric Morphology Vector (128 dimensions)
  const pts = detection.landmarks
    ? (detection.landmarks.positions || (typeof detection.landmarks.getPositions === 'function' ? detection.landmarks.getPositions() : []))
    : [];
  const box = detection.detection ? detection.detection.box : { x: 0, y: 0, width: 100, height: 100 };
  const geo128 = extractGeometricFeatures128(pts, box);

  // 3. Fuse into 256 dimensions: [Neural 128-D, Morphology 128-D]
  const fused256 = [...neural128.slice(0, 128), ...geo128.slice(0, 128)];

  // Ensure exact 256 length
  while (fused256.length < 256) fused256.push(0);

  // 4. L2 Unit Normalization across all 256 dimensions
  return l2Normalize(fused256.slice(0, 256));
};
