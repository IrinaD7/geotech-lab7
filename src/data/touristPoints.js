export const touristRoutePoints = [
  { id: 1, name: "Рязанский кремль", coords: [39.748336, 54.635804] },
  { id: 2, name: "Набережная", coords: [39.747443, 54.635992] },
  { id: 3, name: "Музей истории ВДВ", coords: [39.736315, 54.633091] },
  { id: 4, name: "Площадь Победы", coords: [39.711204, 54.629153] },
  { id: 5, name: "Театр драмы", coords: [39.757433, 54.621241] },
];

export const touristGeoJSON = {
  type: "FeatureCollection",
  features: touristRoutePoints.map((point) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: point.coords,
    },
    properties: {
      name: point.name,
      id: point.id,
    },
  })),
};
