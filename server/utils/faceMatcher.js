const calculateEuclideanDistance = (vec1, vec2) => {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must be of the same length to calculate distance.');
  }

  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.pow(vec1[i] - vec2[i], 2);
  }
  
  return Math.sqrt(sum);
};

const verifyFace = (liveDescriptor, registeredEmbeddings, threshold = 0.45) => {
  if (!registeredEmbeddings || registeredEmbeddings.length === 0) {
    return { verified: false, minDistance: 1.0, medianDistance: 1.0, matchCount: 0, message: 'No registered biometrics' };
  }

  const distances = [];

  for (const registered of registeredEmbeddings) {
    try {
      const dist = calculateEuclideanDistance(liveDescriptor, registered);
      distances.push(dist);
    } catch (err) {
      console.error('Error matching descriptor vector:', err.message);
    }
  }

  if (distances.length === 0) {
    return { verified: false, minDistance: 1.0, medianDistance: 1.0, matchCount: 0, message: 'Distance computation failed' };
  }

  const sorted = [...distances].sort((a, b) => a - b);
  const minDistance = sorted[0];

  const mid = Math.floor(sorted.length / 2);
  const medianDistance = sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;

  const matchCount = distances.filter(d => d < threshold).length;
  const matchRatio = matchCount / distances.length;

  const verified = medianDistance < threshold && matchRatio >= 0.40;

  console.log(`[FaceVerify] min=${minDistance.toFixed(4)} median=${medianDistance.toFixed(4)} matchCount=${matchCount}/${distances.length} ratio=${(matchRatio*100).toFixed(1)}% threshold=${threshold} → ${verified ? 'PASS' : 'FAIL'}`);

  return {
    verified,
    minDistance,
    medianDistance,
    matchCount,
    totalEmbeddings: distances.length,
    threshold
  };
};

module.exports = {
  calculateEuclideanDistance,
  verifyFace
};
