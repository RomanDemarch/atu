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
  const showCommunesHandler = (landId) => {
    const layer = landLayersRef.current[landId];
    if (!layer) return;
    const bounds = layer.getBounds();
    setSelectedLand(landId);
    setView("communes");
    setBounds(bounds);
  };

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

  const [view, setView] = useState("lands");
  const [selectedLand, setSelectedLand] = useState(null);
  const [bounds, setBounds] = useState(null);

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

  const html = ReactDOMServer.renderToString(<CustomPopup props={feature.properties} type="land" onShowCommunes={showCommunesHandler} />);
    layer.bindPopup(html, { maxWidth: "auto", minWidth: 100 });
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


  const html = ReactDOMServer.renderToString(<CustomPopup props={feature.properties} type="commune" />);
    layer.bindPopup(html, { maxWidth: "auto", minWidth: 100 });
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
        {view === "lands" && (<GeoJSON data={lands} style={landStyle} onEachFeature={handleLandClick} />)}
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

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-800">Проект оптимизации АТУ Беларуси</h1>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Исследование структуры и оптимизации административно-территориального устройства Беларуси: история, современность, международный опыт и авторская модель.
        </p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <Link to="/history" className="p-4 rounded-2xl shadow hover:shadow-lg bg-white border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700">История АТУ</h2>
          <p className="text-sm text-gray-500">Эволюция деления белорусских земель</p>
        </Link>
        <Link to="/modern" className="p-4 rounded-2xl shadow hover:shadow-lg bg-white border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700">Современное АТУ</h2>
          <p className="text-sm text-gray-500">Структура Республики Беларусь</p>
        </Link>
        <Link to="/foreign" className="p-4 rounded-2xl shadow hover:shadow-lg bg-white border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700">Международный опыт</h2>
          <p className="text-sm text-gray-500">Реформы в СНГ и Европе</p>
        </Link>
        <Link to="/model-map" className="p-4 rounded-2xl shadow hover:shadow-lg bg-white border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700">Авторская модель</h2>
          <p className="text-sm text-gray-500">Карта оптимизации АТУ</p>
        </Link>
      </main>
    </div>
  );
}

function Section({ title, content }) {
  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">{title}</h1>
        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{content}</div>
        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:underline">← Вернуться на главную</Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<Section title="История АТУ" content={"Белорусские земли..."} />} />
        <Route path="/modern" element={<Section title="Современное АТУ" content={"Республика Беларусь..."} />} />
        <Route path="/foreign" element={<Section title="Международный опыт" content={"Реформы АТУ в Польше..."} />} />
        <Route path="/model-map" element={<ModelMap />} />
      </Routes>
    </Router>
  );
}
