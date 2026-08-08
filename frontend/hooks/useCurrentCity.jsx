import { useEffect, useState } from "react";

const useCurrentCity = () => {
    const [city, setCity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding will go here
                    // latitude + longitude -> city

                    console.log("Latitude:", latitude);
                    console.log("Longitude:", longitude);

                    // Temporary
                    setCity("Dhaka");
                } catch (error) {
                    console.error("City detection error:", error);
                    setError("Unable to determine your city.");
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Location permission error:", error);

                setError("Location permission denied.");
                setLoading(false);
            }
        );
    }, []);

    return {
        city,
        loading,
        error,
    };
};

export default useCurrentCity;