const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const checkGeofence = (userLat, userLng, officeLat, officeLng, radiusMeters) => {
  const distance = calculateHaversineDistance(userLat, userLng, officeLat, officeLng);
  const inRange = distance <= radiusMeters;

  return {
    inRange,
    distanceMeters: Math.round(distance * 100) / 100,
    radiusMeters
  };
};

const getCurrentCoordinates = (options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) => {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation API is not available in this environment (browser required).'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (err) => reject(err),
      options
    );
  });
};

const USER_LOCATION = { lat: 28.6126546, lng: 77.3660593 };

const EXAMPLE_USAGE = () => {
  const officeCoords = { lat: 28.5921, lng: 77.5297 };
  const radiusMeters = 60;

  return checkGeofence(
    USER_LOCATION.lat,
    USER_LOCATION.lng,
    officeCoords.lat,
    officeCoords.lng,
    radiusMeters
  );
};

module.exports = {
  calculateHaversineDistance,
  checkGeofence,
  getCurrentCoordinates,
  USER_LOCATION,
  EXAMPLE_USAGE
};
