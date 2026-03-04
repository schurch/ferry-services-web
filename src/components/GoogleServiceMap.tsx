import type React from "react";
import { useEffect, useRef } from "react";
import { GOOGLE_MAPS_API_KEY } from "../constants";
import type { GoogleMapPoint } from "../maps/points";
import { formatRelativeTime } from "../utils/date";

let googleMapsApiLoadPromise: Promise<void> | null = null;

function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if ((window as { google?: unknown }).google) {
    return Promise.resolve();
  }

  if (googleMapsApiLoadPromise) {
    return googleMapsApiLoadPromise;
  }

  googleMapsApiLoadPromise = new Promise((resolve, reject) => {
    const callbackName = "__initFerryGoogleMaps";

    (window as Record<string, unknown>)[callbackName] = () => {
      resolve();
      delete (window as Record<string, unknown>)[callbackName];
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps script."));
    document.head.appendChild(script);
  });

  return googleMapsApiLoadPromise;
}

export function GoogleServiceMap({
  serviceArea,
  points
}: {
  serviceArea: string;
  points: GoogleMapPoint[];
}): React.JSX.Element {
  const mapMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !mapMountRef.current) {
      return;
    }

    let cancelled = false;

    void loadGoogleMapsApi(GOOGLE_MAPS_API_KEY).then(() => {
      if (cancelled || !mapMountRef.current) return;

      const googleMaps = (window as { google: any }).google.maps;
      const center = points[0]
        ? { lat: points[0].latitude, lng: points[0].longitude }
        : { lat: 57, lng: -5 };

      const map = new googleMaps.Map(mapMountRef.current, {
        center,
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      const bounds = new googleMaps.LatLngBounds();
      const infoWindow = new googleMaps.InfoWindow();

      points.forEach((point) => {
        const marker = new googleMaps.Marker({
          position: { lat: point.latitude, lng: point.longitude },
          map,
          title: point.label,
          icon:
            point.type === "vessel"
              ? {
                  path: "M12 2C9 2 5.5 4.5 5.5 8.5v2.3L3 13.2V16h2v2h2v2h10v-2h2v-2h2v-2.8l-2.5-2.4V8.5C18.5 4.5 15 2 12 2z",
                  fillColor: "#0b72e7",
                  fillOpacity: 0.95,
                  strokeColor: "#ffffff",
                  strokeWeight: 1.2,
                  scale: 1.6,
                  anchor: new googleMaps.Point(12, 12)
                }
              : {
                  path: googleMaps.SymbolPath.CIRCLE,
                  fillColor: "#21bfaa",
                  fillOpacity: 0.95,
                  strokeColor: "#ffffff",
                  strokeWeight: 1.4,
                  scale: 7
                }
        });

        bounds.extend(marker.getPosition());

        const details =
          point.type === "vessel"
            ? `Vessel: ${point.label}<br/>Speed: ${point.speed == null ? "unknown" : `${point.speed.toFixed(1)} kn`}<br/>Last received: ${formatRelativeTime(point.lastReceived ?? null)}`
            : `Location: ${point.label}`;

        marker.addListener("click", () => {
          infoWindow.setContent(`${details}<br/>${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`);
          infoWindow.open({ anchor: marker, map });
        });
      });

      if (points.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(10);
      } else if (points.length > 1) {
        map.fitBounds(bounds, 24);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [points]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-shell">
        <div className="map-missing-key">
          Google Maps requires an API key. Set <code>VITE_GOOGLE_MAPS_API_KEY</code> and reload to render
          location and vessel markers for {serviceArea}.
        </div>
      </div>
    );
  }

  return (
    <div className="map-shell">
      <div className="map-mount" ref={mapMountRef} aria-label={`${serviceArea} map`} />
    </div>
  );
}
