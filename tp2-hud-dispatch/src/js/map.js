import maplibregl from "maplibre-gl";

const mapContainerId = "map";
const mapElement = document.getElementById(mapContainerId);

if (mapElement) {
  const map = new maplibregl.Map({
    container: mapContainerId, 
    style: "https://tiles.openfreemap.org/styles/bright",
    // laval
    center: [-73.7071, 45.6125],
    zoom: 12
  });

  // contrôles  zoom et rotation
  map.addControl(new maplibregl.NavigationControl(), "top-right");

  //positions des héros
  const heroPositions = {
    Centre: [-73.7071, 45.6125],
    Nord:   [-73.7071, 45.64],
    Sud:    [-73.7071, 45.585],
    Ouest:  [-73.76,   45.6125],
    Est:    [-73.65,   45.6125]
  };

  // marqueurs des héros
  Object.entries(heroPositions).forEach(([quartier, coords]) => {
    const el = document.createElement("div");
    el.className = "map-hero-marker"; // style géré en CSS
    el.title = `Présence héroïque – Secteur ${quartier}`;

    new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(map);
  });

  // clic sur la carte donne alerte + petit son 
  map.on("click", (e) => {
    const msg = `Inspection de la position (${e.lngLat.lng.toFixed(
      3
    )}, ${e.lngLat.lat.toFixed(3)})`;

    if (window.pushHudAlert) {
      window.pushHudAlert(msg);
    }
    if (window.playMapPing) {
      window.playMapPing();
    }
  });

  //  fonction appelée par main.js pour centrer sur un secteur quand cliques sur hero
  window.focusHeroOnMap = function (quartier) {
    const coords = heroPositions[quartier];
    if (!coords) return;

    map.easeTo({
      center: coords,
      zoom: 13,
      duration: 900
    });
  };
}
