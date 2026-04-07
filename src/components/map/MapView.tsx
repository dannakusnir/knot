"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getBusinessImages } from "@/lib/business-images";

interface MapOffer {
  id: string;
  title: string;
  compensation: string | null;
  category: string | null;
  business_name: string;
  city: string | null;
  lat: number;
  lng: number;
  offer_count: number;
}

interface MapViewProps {
  offers: MapOffer[];
  token: string;
}

export default function MapView({ offers, token }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<MapOffer | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.0, 41.05], // NJ/NY area
      zoom: 10,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    // Add markers for each offer
    offers.forEach((offer) => {
      const imageSet = getBusinessImages(offer.business_name);
      const hasImage = !!imageSet;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "knot-marker";
      el.innerHTML = `
        <div style="
          width: 44px; height: 44px;
          background: #6B705C;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s;
          border: 3px solid white;
        ">
          <span style="color: white; font-size: 11px; font-weight: 700;">
            ${offer.offer_count}
          </span>
        </div>
      `;

      el.addEventListener("mouseenter", () => {
        el.querySelector("div")!.style.transform = "scale(1.15)";
      });
      el.addEventListener("mouseleave", () => {
        el.querySelector("div")!.style.transform = "scale(1)";
      });

      el.addEventListener("click", () => {
        setSelectedOffer(offer);
        map.current?.flyTo({
          center: [offer.lng, offer.lat],
          zoom: 14,
          duration: 800,
        });
      });

      new mapboxgl.Marker(el)
        .setLngLat([offer.lng, offer.lat])
        .addTo(map.current!);
    });

    // Fit to markers if any exist
    if (offers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      offers.forEach((o) => bounds.extend([o.lng, o.lat]));
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 13 });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [offers, token]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Selected offer card */}
      {selectedOffer && (
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <a href={`/c/offers/${selectedOffer.id}`}>
            <div className="bg-white rounded-2xl shadow-lg p-4 active:scale-[0.98] transition-transform">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#CB997E] uppercase tracking-[0.15em] font-semibold">
                    {selectedOffer.business_name}
                  </p>
                  <p className="text-[17px] font-semibold text-[#3D3229] mt-0.5 truncate">
                    {selectedOffer.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {selectedOffer.city && (
                      <span className="text-sm text-[#8A8078]">
                        {selectedOffer.city}
                      </span>
                    )}
                    {selectedOffer.compensation && (
                      <>
                        <span className="text-[#C4BBB2]">·</span>
                        <span className="text-sm text-[#6B705C] font-medium">
                          {selectedOffer.compensation}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#A5A58D]/15 flex items-center justify-center mt-1">
                  <svg
                    className="h-4 w-4 text-[#A5A58D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </a>
          <button
            onClick={() => setSelectedOffer(null)}
            className="absolute -top-2 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center"
          >
            <svg className="h-3.5 w-3.5 text-[#8A8078]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
