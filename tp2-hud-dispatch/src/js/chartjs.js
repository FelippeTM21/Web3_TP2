import { Chart } from "chart.js/auto";

// données communes 

const dataParQuartier = [
  { quartier: "Nord",   incidents: 5,  resolution: 82 },
  { quartier: "Centre", incidents: 9,  resolution: 91 },
  { quartier: "Sud",    incidents: 3,  resolution: 76 },
  { quartier: "Est",    incidents: 7,  resolution: 88 },
  { quartier: "Ouest",  incidents: 4,  resolution: 80 }
];

const labels = dataParQuartier.map((r) => r.quartier);

// graphique barres incidents en cours par quartier

const incidentsCanvas = document.querySelector("#incidentsChart");

if (incidentsCanvas) {
  const contexteIncidents = incidentsCanvas.getContext("2d");

  const configIncidents = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Incidents en cours par quartier",
          data: dataParQuartier.map((r) => r.incidents),
          backgroundColor: "rgba(39, 224, 255, 0.5)",
          borderColor: "rgba(39, 224, 255, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#e3f6ff"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#e3f6ff" },
          grid: { color: "rgba(122, 137, 181, 0.25)" }
        },
        y: {
          ticks: { color: "#e3f6ff" },
          grid: { color: "rgba(122, 137, 181, 0.25)" }
        }
      }
    }
  };

  new Chart(contexteIncidents, configIncidents);
}
