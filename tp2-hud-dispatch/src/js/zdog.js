import Zdog from "zzz";

const canvasSelector = "#hudLogo";
const canvas = document.querySelector(canvasSelector);

if (!canvas) {
  console.warn("Canvas #hudLogo introuvable");
} else {
  const illo = new Zdog.Illustration({
    element: canvasSelector, 
    dragRotate: false,
    resize: true 
  });

  // disque de fond
  new Zdog.Ellipse({
    addTo: illo,
    diameter: 20,
    stroke: 8,
    color: "#071326"
  });

  // anneau lumineux bleu
  new Zdog.Ellipse({
    addTo: illo,
    diameter: 20,
    stroke: 3,
    color: "#27e0ff"
  });

  // anneau intérieur rose
  new Zdog.Ellipse({
    addTo: illo,
    diameter: 11,
    stroke: 3,
    color: "#ff3b7f",
    translate: { z: 3 }
  });

  // petit disque central
  new Zdog.Ellipse({
    addTo: illo,
    diameter: 5,
    stroke: 3,
    color: "#27e0ff",
    translate: { z: 4 }
  });

  // éclair stylisé au centre
  new Zdog.Shape({
    addTo: illo,
    path: [
      { x: -2, y: -6, z: 5 },
      { x: 0,  y: -2, z: 5 },
      { x: -1, y: -2, z: 5 },
      { x: 2,  y: 3,  z: 5 },
      { x: 0,  y: 1,  z: 5 },
      { x: 1,  y: 1,  z: 5 }
    ],
    closed: true,
    stroke: 1,
    fill: true,
    color: "#ffeb3b"
  });

  function animate() {
    illo.rotate.y += 0.02;
    illo.rotate.x = Math.sin(Date.now() / 1200) * 0.15;

    illo.updateRenderGraph(); 
    requestAnimationFrame(animate);
  }

  animate();
}
