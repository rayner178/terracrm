"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ProjectMap({ projects }: { projects: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl" />;

  const getColor = (type: string) => {
    switch(type) {
      case 'MARINO': return '#0ea5e9'; // sky-500
      case 'TERRESTRE': return '#22c55e'; // green-500
      case 'HUMEDAL': return '#0d9488'; // teal-600
      default: return '#64748b'; // slate-500
    }
  };

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer 
        center={[18.38, -68.89]} // Aproximado Bayahibe, Rep. Dom.
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {projects.map(project => {
          if (!project.geojson) return null;
          
          return (
            <GeoJSON 
              key={project.id} 
              data={project.geojson}
              style={{
                color: getColor(project.ecosystemType),
                weight: 2,
                fillOpacity: 0.4
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-slate-800">{project.name}</h3>
                  <p className="text-xs text-slate-500">{project.description}</p>
                  <div className="mt-2 text-xs font-medium px-2 py-1 bg-slate-100 inline-block rounded">
                    {project.ecosystemType} - {project.status}
                  </div>
                </div>
              </Popup>
            </GeoJSON>
          );
        })}
      </MapContainer>
    </div>
  );
}
