let appState = {
  screen: "welcome",
  inspectorName: "",
  points: []
};

let nameInput, startButton;
let aspectInput, impactInput, commentInput;
let possibleDamageInput, impactSizeInput, criticalityInput;
let saveButton, viewMapButton, exportPdfButton, shareButton;
let mapDiv;
let exportWordButton;
let photoPlaceholder = "Foto capturada (simulado)";

function setup() {
  createCanvas(400, 700);
  loadLeafletResources();

  if (appState.screen === "welcome") {
    drawWelcomeScreen();
  }
}

function drawWelcomeScreen() {
  background("#1b3d2f");
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text("Inspeção de Campo", width / 2, 100);
  textSize(14);
  text("Digite seu nome para iniciar", width / 2, 160);

  nameInput = createInput();
  nameInput.position(50, 200);
  nameInput.size(300, 40);
  nameInput.input(() => {
    appState.inspectorName = nameInput.value();
  });

  startButton = createButton("Começar");
  startButton.position(50, 260);
  startButton.size(300, 50);
  startButton.style("background-color", "#4CAF50");
  startButton.style("color", "#ffffff");
  startButton.style("border-radius", "10px");
  startButton.mousePressed(() => {
    appState.screen = "form";
    nameInput.remove();
    startButton.remove();
    drawInspectionForm();
  });
}
function drawInspectionForm() {
  background("#1b3d2f");
  fill(255);
  textAlign(CENTER);
  textSize(18);
  text(`Responsável: ${appState.inspectorName}`, width / 2, 30);

  let y = 60;

  // Aspecto observado
  aspectInput = createInput();
  aspectInput.position(20, y);
  aspectInput.size(360, 40);
  aspectInput.attribute("placeholder", "Aspecto observado");
  y += 50;

  // Tipo de erosão
  impactInput = createSelect();
  impactInput.option("Tipo de erosão");
  impactInput.option("Laminar");
  impactInput.option("Sulco");
  impactInput.option("Ravina");
  impactInput.option("Voçoroca");
  impactInput.position(20, y);
  impactInput.size(360, 40);
  y += 50;

  // Possível dano
  possibleDamageInput = createSelect();
  possibleDamageInput.option("Possível Dano");
  possibleDamageInput.option("Dano à estrutura industrial");
  possibleDamageInput.option("Dano às construções civis");
  possibleDamageInput.option("Dano aos acessos");
  possibleDamageInput.option("Dano ao meio ambiente");
  possibleDamageInput.position(20, y);
  possibleDamageInput.size(360, 40);
  y += 50;

  // Dimensões do impacto
  impactSizeInput = createSelect();
  impactSizeInput.option("Dimensões do Impacto");
  impactSizeInput.option("Pequeno");
  impactSizeInput.option("Médio");
  impactSizeInput.option("Grande");
  impactSizeInput.position(20, y);
  impactSizeInput.size(360, 40);
  y += 50;

  // Criticidade
  criticalityInput = createSelect();
  criticalityInput.option("Criticidade");
  for (let i = 1; i <= 5; i++) {
    criticalityInput.option(i);
  }
  criticalityInput.position(20, y);
  criticalityInput.size(360, 40);
  y += 50;

  // Comentário
  commentInput = createInput();
  commentInput.position(20, y);
  commentInput.size(360, 40);
  commentInput.attribute("placeholder", "Comentário adicional");
  y += 50;

  // Botão de salvar ponto
  saveButton = createButton("Salvar Ponto");
  saveButton.position(20, y);
  saveButton.size(360, 50);
  saveButton.style("background-color", "#4CAF50");
  saveButton.style("color", "#ffffff");
  saveButton.style("border-radius", "10px");
  saveButton.mousePressed(savePoint);
  y += 60;
  // Botão de visualizar no mapa
  viewMapButton = createButton("Visualizar no Mapa");
  viewMapButton.position(20, y);
  viewMapButton.size(360, 50);
  viewMapButton.style("background-color", "#4CAF50");
  viewMapButton.style("color", "#ffffff");
  viewMapButton.style("border-radius", "10px");
  viewMapButton.mousePressed(showMap);
  y += 60;

  // Botão exportar PDF
  exportPdfButton = createButton("Exportar PDF");
  exportPdfButton.position(20, y);
  exportPdfButton.size(360, 50);
  exportPdfButton.style("background-color", "#4CAF50");
  exportPdfButton.style("color", "#ffffff");
  exportPdfButton.style("border-radius", "10px");
  exportPdfButton.mousePressed(exportToPDF);
  y += 60;

  // Lista de pontos salvos
  let yList = y + 20;
  textAlign(LEFT);
  textSize(14);
  for (let i = 0; i < appState.points.length; i++) {
    const p = appState.points[i];
    text(`Ponto ${i + 1}: ${p.aspect} (${p.datetime})`, 20, yList);
    yList += 20;
  }
}

function savePoint() {
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const coords = pos.coords.latitude + ", " + pos.coords.longitude;

      const newPoint = {
        aspect: aspectInput.value(),
        impact: impactInput.value(),
        comment: commentInput.value(),
        possibleDamage: possibleDamageInput.value(),
        impactSize: impactSizeInput.value(),
        criticality: criticalityInput.value(),
        coordinates: coords,
        datetime: new Date().toLocaleString(),
        photo: photoPlaceholder
      };

      appState.points.push(newPoint);
      alert("Ponto salvo!");

      // Resetar campos
      aspectInput.value("");
      impactInput.selected("Tipo de erosão");
      possibleDamageInput.selected("Possível Dano");
      impactSizeInput.selected("Dimensões do Impacto");
      criticalityInput.selected("Criticidade");
      commentInput.value("");
    },
    function () {
      alert("Não foi possível obter a localização.");
    }
  );
}
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Relatório de Inspeção de Campo", 20, 20);
  doc.setFontSize(12);
  doc.text(`Responsável: ${appState.inspectorName}`, 20, 30);

  let y = 40;

  appState.points.forEach((p, i) => {
    doc.text(`Ponto ${i + 1}: ${p.datetime}`, 20, y);
    y += 6;
    doc.text(`Aspecto: ${p.aspect}`, 20, y); y += 6;
    doc.text(`Tipo de erosão: ${p.impact}`, 20, y); y += 6;
    doc.text(`Dano possível: ${p.possibleDamage}`, 20, y); y += 6;
    doc.text(`Dimensão: ${p.impactSize}`, 20, y); y += 6;
    doc.text(`Criticidade: ${p.criticality}`, 20, y); y += 6;
    doc.text(`Coord: ${p.coordinates}`, 20, y); y += 6;
    doc.text(`Comentário: ${p.comment}`, 20, y); y += 10;
  });

  doc.save("relatorio-inspecao.pdf");
}

function showMap() {
  if (typeof L === "undefined") {
    alert("Mapa ainda está carregando. Aguarde e tente novamente.");
    return;
  }

  mapDiv = createDiv("").id("map");
  mapDiv.style("position", "fixed");
  mapDiv.style("top", "0");
  mapDiv.style("left", "0");
  mapDiv.style("width", "100%");
  mapDiv.style("height", "100%");
  mapDiv.style("z-index", "9999");

  const closeBtn = createButton("Fechar Mapa");
  closeBtn.parent(mapDiv);
  closeBtn.style("position", "absolute");
  closeBtn.style("top", "10px");
  closeBtn.style("right", "10px");
  closeBtn.mousePressed(() => {
    mapDiv.remove();
  });

  const mapCanvas = createDiv().parent(mapDiv);
  mapCanvas.id("leafletmap");
  mapCanvas.style("width", "100%");
  mapCanvas.style("height", "100%");

  const map = L.map("leafletmap").setView([-10, -55], 4);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  appState.points.forEach((p) => {
    const [lat, lon] = p.coordinates.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lon)) {
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(
          `${p.aspect}<br>${p.datetime}<br>Criticidade: ${p.criticality}`
        );
    }
  });
}

function loadLeafletResources() {
  const leafletCSS = document.createElement("link");
  leafletCSS.rel = "stylesheet";
  leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(leafletCSS);

  const leafletJS = document.createElement("script");
  leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  document.head.appendChild(leafletJS);
}
