import { load } from "@2gis/mapgl";
import { useEffect, useRef, useState } from "react";
import { Directions } from "@2gis/mapgl-directions";
import { MapWrapper } from "./MapWrapper";
import geoData from "./../data/data.json";
import { touristGeoJSON, touristRoutePoints } from "./../data/touristPoints";

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

const touristLayer = {
  id: "tourist-points-layer",
  filter: ["==", ["sourceAttr", "id"], "tourist-source"],
  type: "point",
  style: {
    iconImage: "marker",
    iconWidth: 28,
    iconHeight: 28,
    textField: ["get", "name"],
    textFont: ["Noto Sans"],
    textColor: "#008080",
    textHaloColor: "#ffffff",
    textHaloWidth: 2,
    textSize: 14,
    textOffset: [0, -20],
    textPriority: 100,
    iconPriority: 90,
  },
};

export const Map = () => {
  const mapRef = useRef(null);
  const [viewMode, setViewMode] = useState("points");
  const [showRoute, setShowRoute] = useState(true);
  const directionsRef = useRef(null);

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

      new mapglAPI.GeoJsonSource(map, {
        data: geoData,
        attributes: { visible: true },
      });

      new mapglAPI.GeoJsonSource(map, {
        data: touristGeoJSON,
        attributes: { id: "tourist-source" },
      });

      const directions = new mapglAPI.Directions(map, {
        directionsApiKey: "c89fa1d6-faa6-4e43-806c-b57da7014cdc",
      });
      directionsRef.current = directions;

      const routeCoordinates = touristRoutePoints.map((p) => p.coords);

      map.on("styleload", () => {
        map.addLayer(viewMode === "points" ? pointsLayer : heatmapLayer);
        map.addLayer(touristLayer);

        if (showRoute) {
          directions.pedestrianRoute({
            points: routeCoordinates,
            style: {
              routeLineColor: "#008080",
              routeLineWidth: 6,
              substrateLineWidth: 8,
            },
          });
        }
      });
    });

    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  const toggleViewMode = () => {
    const map = mapRef.current;
    if (!map) return;

    try {
      map.removeLayer("dtp-points-layer");
    } catch (e) {}
    try {
      map.removeLayer("dtp-heatmap-layer");
    } catch (e) {}

    const newMode = viewMode === "points" ? "heatmap" : "points";
    setViewMode(newMode);
    map.addLayer(newMode === "points" ? pointsLayer : heatmapLayer);
  };

  const toggleRoute = () => {
    const directions = directionsRef.current;
    if (!directions) return;

    if (showRoute) {
      directions.clear(); // Удаляем маршрут
    } else {
      const routeCoordinates = touristRoutePoints.map((p) => p.coords);
      directions.pedestrianRoute({
        points: routeCoordinates,
        style: {
          routeLineColor: "#008080",
          routeLineWidth: 6,
          substrateLineWidth: 8,
        },
      });
    }
    setShowRoute(!showRoute);
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
        <button onClick={toggleViewMode} class="btn btn-blue">
          {viewMode === "points"
            ? "Показать тепловую карту"
            : "Показать точки ДТП"}
        </button>

        <button onClick={toggleRoute} class="btn btn-red">
          {showRoute
            ? "Скрыть туристический маршрут"
            : "Показать туристический маршрут"}
        </button>
      </div>
    </div>
  );
};
