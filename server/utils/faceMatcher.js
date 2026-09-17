/**
 * Biometric Face Descriptor Matcher (ResNet-34 Deep Neural Embeddings)
 * 
 * Computes exact Euclidean distance on L2 unit-norm 128-D facial feature descriptors.
 * 
 * Threshold benchmarks:
 * - Same Person: Euclidean distance typically 0.15 - 0.38 (<= 0.48 -> MATCH)
 * - Different Person: Euclidean distance typically 0.70 - 1.10 (> 0.48 -> REJECTED)
 */

/**
 * Normalizes any embedding vector to a clean unit-norm 128-D descriptor
 * Automatically handles 128-D or 256-D legacy vectors.
 * @param {Array<number>} vec 
 * @returns {Array<number>}
 */
const normalizeVector = (vec) => {
  if (!vec || !Array.isArray(vec) || vec.length === 0) return [];
  // Extract the 128-D deep neural representation
  const v = vec.length >= 128 ? vec.slice(0, 128) : vec;

  let sumSq = 0;
  for (let i = 0; i < v.length; i++) {
    sumSq += v[i] * v[i];
  }
  const norm = Math.sqrt(sumSq) || 1.0;
  return v.map(x => x / norm);
};

/**
 * Computes Euclidean Distance between two normalized 128-D vectors
 */
const calculateEuclideanDistance = (vec1, vec2) => {
  const len = Math.min(vec1.length, vec2.length);
  if (len === 0) return 1.0;

  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Math.pow(vec1[i] - vec2[i], 2);
  }
  
  return Math.sqrt(sum);
};

/**
 * Computes Cosine Similarity between two normalized vectors
 */
const calculateCosineSimilarity = (vec1, vec2) => {
  const len = Math.min(vec1.length, vec2.length);
  if (len === 0) return 0;

  let dot = 0;
  for (let i = 0; i < len; i++) {
    dot += vec1[i] * vec2[i];
  }
  return Math.max(0, Math.min(1, dot));
};

/**
 * Strict Multi-Frame Biometric Verification
 * @param {Array<number>} liveDescriptor Live webcam face descriptor
 * @param {Array<Array<number>>} registeredEmbeddings Enrolled biometrics in database
 * @param {number} threshold Match distance cutoff (default: 0.35)
 */
const verifyFace = (liveDescriptor, registeredEmbeddings, threshold = 0.35) => {
  if (!registeredEmbeddings || registeredEmbeddings.length === 0) {
    return { verified: false, minDistance: 1.0, medianDistance: 1.0, matchCount: 0, message: 'No registered biometrics' };
  }

  const normLive = normalizeVector(liveDescriptor);
  if (normLive.length < 128) {
    return { verified: false, minDistance: 1.0, medianDistance: 1.0, matchCount: 0, message: 'Invalid live face descriptor' };
  }

  const distances = [];
  const similarities = [];

  for (const registered of registeredEmbeddings) {
    try {
      const normReg = normalizeVector(registered);
      if (normReg.length >= 128) {
        const dist = calculateEuclideanDistance(normLive, normReg);
        const sim = calculateCosineSimilarity(normLive, normReg);
        distances.push(dist);
        similarities.push(sim);
      }
    } catch (err) {
      console.error('Error matching descriptor vector:', err.message);
    }
  }

  if (distances.length === 0) {
    return { verified: false, minDistance: 1.0, medianDistance: 1.0, matchCount: 0, message: 'Distance computation failed' };
  }

  const sorted = [...distances].sort((a, b) => a - b);
  const minDistance = sorted[0];

  // Top-3 closest frames average
  const topK = sorted.slice(0, Math.min(3, sorted.length));
  const topKAvg = topK.reduce((a, b) => a + b, 0) / topK.length;

  const mid = Math.floor(sorted.length / 2);
  const medianDistance = sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;

  const matchCount = distances.filter(d => d <= threshold).length;
  const matchRatio = matchCount / distances.length;

  // Strict enterprise verification criteria:
  // 1. Best matching enrolled frame distance <= 0.35 (threshold)
  // 2. Top-3 closest enrolled frames average <= 0.38
  // 3. Different person (colleague) is consistently > 0.40 -> REJECTED
  const verified = (minDistance <= threshold && topKAvg <= 0.38) || (minDistance <= 0.30);

  console.log(`[FaceVerify] dims=${normLive.length} min=${minDistance.toFixed(4)} topKAvg=${topKAvg.toFixed(4)} median=${medianDistance.toFixed(4)} matchCount=${matchCount}/${distances.length} ratio=${(matchRatio*100).toFixed(1)}% threshold=${threshold} → ${verified ? 'PASS' : 'FAIL'}`);

  return {
    verified,
    minDistance,
    topKAvg,
    medianDistance,
    matchCount,
    totalEmbeddings: distances.length,
    threshold,
    dimensions: normLive.length
  };
};

module.exports = {
  normalizeVector,
  calculateEuclideanDistance,
  calculateCosineSimilarity,
  verifyFace
};
