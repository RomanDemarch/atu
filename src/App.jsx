import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import ReactDOMServer from "react-dom/server";
import CustomPopup from "@/components/CustomPopup";
import lands from "./data/Lands.json";
import communes from "./data/Communes.json";

function FitBounds({ bounds }) {
  const map = useMap();
  if (bounds) {
    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const boundsWidth = Math.abs(ne.lng - sw.lng);
    const boundsHeight = Math.abs(ne.lat - sw.lat);
    const mapBounds = map.getBounds();
    const mapWidth = Math.abs(mapBounds.getNorthEast().lng - mapBounds.getSouthWest().lng);
    const mapHeight = Math.abs(mapBounds.getNorthEast().lat - mapBounds.getSouthWest().lat);
    const currentZoom = map.getZoom();
    const zoomAdjustmentX = Math.log2(mapWidth / boundsWidth);
    const zoomAdjustmentY = Math.log2(mapHeight / boundsHeight);
    const zoomAdjustment = Math.min(zoomAdjustmentX, zoomAdjustmentY);
    const targetZoom = Math.floor((currentZoom + zoomAdjustment) * 10) / 10;
    map.flyTo(center, targetZoom, { animate: true, duration: 0.75 });
  }
  return null;
}

function ModelMap() {
  const [view, setView] = useState("lands");
  const [selectedLand, setSelectedLand] = useState(null);
  const [bounds, setBounds] = useState(null);
  const mapRef = useRef(null);
  const mapBoundsRef = useRef(null);
  const landLayersRef = useRef({});

  useEffect(() => {
    const map = mapRef.current;
    if (map && !mapBoundsRef.current) {
      mapBoundsRef.current = map.getBounds();
    }
  }, []);

  useEffect(() => {
    const showHandler = (e) => {
      const { landId } = e.detail;
      const layer = landLayersRef.current[landId];
      if (!layer) return;
      const bounds = layer.getBounds();
      setSelectedLand(landId);
      setView("communes");
      setBounds(bounds);
    };

    const backHandler = () => {
      setSelectedLand(null);
      setView("lands");
      setBounds(mapBoundsRef.current);
    };

    window.addEventListener("showCommunes", showHandler);
    window.addEventListener("backToLands", backHandler);

    return () => {
      window.removeEventListener("showCommunes", showHandler);
      window.removeEventListener("backToLands", backHandler);
    };
  }, []);

  const landStyle = {
    color: "#DD2233",
    weight: 4,
    fillOpacity: 0,
  };

  const communeStyle = {
    color: "#222222",
    weight: 1,
    fillOpacity: 0,
  };

  const handleLandClick = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedLand(feature.properties.OBJECTID);
        const layerBounds = layer.getBounds();
        setBounds(layerBounds);
        landLayersRef.current[feature.properties.OBJECTID] = layer;
      },
    });

    const html = ReactDOMServer.renderToString(
      <CustomPopup props={feature.properties} type="land" />
    );

    layer.bindPopup(html, { maxWidth: "auto", minWidth: 100 });

    layer.on("popupopen", () => {
      const button = document.querySelector(".show-communes-btn");
      if (button) {
        button.addEventListener("click", () => {
          window.dispatchEvent(
            new CustomEvent("showCommunes", {
              detail: { landId: feature.properties.OBJECTID },
            })
          );
          document.querySelector(".leaflet-popup-close-button")?.click();
        });
      }
    });
  };

  const handleCommuneClick = (feature, layer) => {
    const html = ReactDOMServer.renderToString(
      <CustomPopup props={feature.properties} type="commune" />
    );

    layer.bindPopup(html, { maxWidth: "auto", minWidth: 100 });

    layer.on("popupopen", () => {
      const button = document.querySelector(".back-to-lands-btn");
      if (button) {
        button.addEventListener("click", () => {
          window.dispatchEvent(new CustomEvent("backToLands"));
          document.querySelector(".leaflet-popup-close-button")?.click();
        });
      }
    });
  };

  const filterCommunes = (communes, parentId) =>
    communes.features.filter((c) => c.properties.PARENT === parentId);

  const maxBounds = [
    [50.0, 20.0],
    [57.0, 36.0],
  ];

  return (
    <div className="h-screen w-full">
      <MapContainer center={[53.7, 27.9]} zoom={7} minZoom={6} maxBounds={maxBounds} maxBoundsViscosity={1.0} className="h-full w-full z-0"
        whenCreated={(map) => (mapRef.current = map)}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {view === "lands" && (
          <GeoJSON data={lands} style={landStyle} onEachFeature={handleLandClick} />
        )}
        {view === "communes" && selectedLand && (
          <GeoJSON
            data={{
              type: "FeatureCollection",
              features: filterCommunes(communes, selectedLand),
            }}
            style={communeStyle}
            onEachFeature={handleCommuneClick}
          />
        )}
        <FitBounds bounds={bounds} />
      </MapContainer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModelMap />} />
      </Routes>
    </Router>
  );
}
