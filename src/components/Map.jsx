import { load } from "@2gis/mapgl";
import { useEffect } from "react";
import { MapWrapper } from "./MapWrapper";

export const MAP_CENTER = [39.737111, 54.629221];

export const Map = () => {
  console.log("Map компонент рендерится");
  useEffect(() => {
    console.log("useEffect ВЫПОЛНЯЕТСЯ - создаем карту");
    let map;
    load().then((mapglAPI) => {
      console.log("Карта загружена, создаем экземпляр");
      map = new mapglAPI.Map("map-container", {
        center: MAP_CENTER,
        zoom: 14.5,
        key: "c89fa1d6-faa6-4e43-806c-b57da7014cdc",
        style: "481e6458-f3e9-49bf-894b-cb96e4df2c91",
      });
    });

    return () => {
      console.log("Очистка - уничтожаем карту");
      map && map.destroy();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapWrapper />
    </div>
  );
};
