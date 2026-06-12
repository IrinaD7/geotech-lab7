import { load } from "@2gis/mapgl";
import { useEffect, useRef, useState } from "react";
import { MapWrapper } from "./MapWrapper";
import geoData from "./../data/data.json";

export const MAP_CENTER = [39.737111, 54.629221];

const pointsLayer = {
  id: "dtp-points-layer",
  filter: ["all", ["match", ["sourceAttr", "visible"], [true], true, false]],
  type: "point",
  style: {
    iconImage: "car",
    iconWidth: 20,
    iconHeight: 20,
    textField: ["get", "datetime"],
    textFont: ["Noto Sans"],
    textColor: "#333333",
    textHaloColor: "#ffffff",
    textHaloWidth: 2,
    textSize: 12,
    textPriority: 100,
    iconPriority: 100,
  },
};

const heatmapLayer = {
  id: "dtp-heatmap-layer",
  filter: ["all", ["match", ["sourceAttr", "visible"], [true], true, false]],
  type: "heatmap",
  style: {
    color: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(0, 0, 0, 0)",
      0.2,
      "#008080",
      0.4,
      "#70a494",
      0.6,
      "#edbb8a",
      0.8,
      "#de8a5a",
      1,
      "#ce4311",
    ],
    radius: 30,
    intensity: 0.8,
    opacity: 0.8,
  },
};

export const Map = () => {
  const mapRef = useRef(null);
  const [viewMode, setViewMode] = useState("points");

  useEffect(() => {
    let map;
    load().then((mapglAPI) => {
      map = new mapglAPI.Map("map-container", {
        center: MAP_CENTER,
        zoom: 14.5,
        key: "c89fa1d6-faa6-4e43-806c-b57da7014cdc",
        style: "481e6458-f3e9-49bf-894b-cb96e4df2c91",
      });
      mapRef.current = map;

      const data = geoData;

      const source = new mapgl.GeoJsonSource(map, {
        data: data,
        attributes: {
          visible: true,
        },
      });

      const addLayerToMap = () => {
        if (viewMode === "points") {
          map.addLayer(pointsLayer);
        } else {
          map.addLayer(heatmapLayer);
        }
      };

      map.on("styleload", addLayerToMap);

      if (map.getStyle()) {
        addLayerToMap();
      }
    });

    return () => {
      map && map.destroy();
    };
  }, []);

  const toggleViewMode = () => {
    const map = mapRef.current;
    if (map) {
      try {
        map.removeLayer("dtp-points-layer");
      } catch (e) {}
      try {
        map.removeLayer("dtp-heatmap-layer");
      } catch (e) {}

      const newMode = viewMode === "points" ? "heatmap" : "points";
      setViewMode(newMode);

      map.addLayer(newMode === "points" ? pointsLayer : heatmapLayer);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <MapWrapper />
      </div>
      <div
        style={{
          padding: "15px",
          textAlign: "center",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={toggleViewMode}
          style={{
            padding: "10px 20px",
            backgroundColor: "#008080",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#006666")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#008080")}
        >
          {viewMode === "points"
            ? "Показать тепловую карту"
            : "Показать точки ДТП"}
        </button>
      </div>
    </div>
  );
};
