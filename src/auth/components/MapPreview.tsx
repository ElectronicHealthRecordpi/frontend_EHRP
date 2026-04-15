import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmFiaW9mZXJuYW5kZXp2eGQiLCJhIjoiY21hd3pmN281MGt6OTJtb2l4eTQ1emVmaCJ9.cNzeKYxiNAkYsXrJk1Offg';

interface MapPreviewProps {
    latitude: number;
    longitude: number;
}

export function MapPreview({ latitude, longitude }: MapPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [longitude, latitude],
            zoom: 14,
            interactive: false,
        });

        new mapboxgl.Marker({ color: '#059669' })
            .setLngLat([longitude, latitude])
            .addTo(map);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [latitude, longitude]);

    return (
        <div
            ref={containerRef}
            className="w-full h-36 rounded-lg overflow-hidden border border-gray-200"
        />
    );
}
