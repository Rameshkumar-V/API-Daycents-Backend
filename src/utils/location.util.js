// Get bounding box around the given lat/long coordinates
exports.getBoundingBox = (lat, lon, radius) => {
    const earthRadius = 6371; // Radius of the earth in km
  
    const deltaLat = radius / earthRadius;
    const deltaLon = radius / (earthRadius * Math.cos(Math.PI * lat / 180));
  
    return {
      minLat: lat - deltaLat * (180 / Math.PI),
      maxLat: lat + deltaLat * (180 / Math.PI),
      minLon: lon - deltaLon * (180 / Math.PI),
      maxLon: lon + deltaLon * (180 / Math.PI),
    };
  };
  
  // Calculate distance between two lat/lon points using Haversine formula
  exports.getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const deg2rad = deg => deg * (Math.PI / 180);
    const R = 6371; // Radius of the earth in km
  
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in km
  };
  