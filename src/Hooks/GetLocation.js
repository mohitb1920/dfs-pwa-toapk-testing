import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (localStorage.getItem("DfsWeb.locationData") == null) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationD = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(locationD);
            localStorage.setItem(
              "DfsWeb.locationData",
              JSON.stringify(locationD)
            );
            setError(null); // Clear any previous error
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setError("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
              default:
                setError("An unknown error occurred.");
                break;
            }
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    } else {
    }
  };

  // Optionally, you can automatically fetch the location when the hook is used
  useEffect(() => {
    getLocation();
  }, []); // Empty dependency array to run only once on component mount

  return { getLocation };
};

export default useGeolocation;
