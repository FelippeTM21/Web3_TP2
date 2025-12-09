import { animate } from "animejs";

animate(".panel", {
  borderColor: [
    "rgba(27, 33, 63, 1)",
    "rgba(39, 224, 255, 0.9)"
  ],
  duration: 2200,
  alternate: true,
  easing: "easeInOutSine",
  loop: true
});

