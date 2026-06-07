import React from "react";

export const MapWrapper = React.memo(
  () => {
    console.log("MapWrapper рендерится");
    return (
      <div id="map-container" style={{ width: "100%", height: "100%" }}></div>
    );
  },
  () => true,
);
