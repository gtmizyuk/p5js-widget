let t, cnv, theta, controlBoard;
let sliderShapeTurtle, sliderSizeTurtle, sliderHeadingTurtle, sliderPenSize, colorPicker, btnSaveCanvasTurtle, btnSaveCoordsTurtle;
let checkItems = {};
let coords = [];
let coordsTitle = false;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(mClick);
  
  colorPicker = createColorPicker("#ed225d"); // Cerise
  colorPicker.position(10, 220);

  controlBoard = createGraphics(windowWidth, windowHeight);

  // примірник Черепашки
  t = new Turtle();

  // мапа
  t.grid(50, color(0, 50), color(11, 114, 159)); // Cerulean

  // слайдери 
  createSliders();  
  
  // чекбокси 
  createCheckBoxes();

  // кнопки
  // зберегти зображeння
  btnSaveCanvasTurtle = createButton("зберегти полотно");
  btnSaveCanvasTurtle.mousePressed(saveCanvasTurtle);
  btnSaveCanvasTurtle.position(10, 275);
  btnSaveCanvasTurtle.addClass("btn");
  // зберегти координати
  btnSaveCoordsTurtle = createButton("отримати координати");
  btnSaveCoordsTurtle.mousePressed(saveCoordsTurtle);
  btnSaveCoordsTurtle.position(10, 300);
  btnSaveCoordsTurtle.addClass("btn");
}

function draw() {
  background(255, 0);
  interfaceItems(); 
  t.place(); 
  image(controlBoard, 0, 0, controlBoard.width, controlBoard.height); 
}

function mClick() {  
  if (mouseIsPressed) {
    if (mouseButton === LEFT) {
      let [turtleX, turtleY] = t.calculateMouseXY(mouseX, mouseY);
      t.setPosition(turtleX, turtleY);
      if (coordsTitle) {
        t.write(`(${turtleX}, ${turtleY})`, { horizontal: LEFT, vertical: BOTTOM });
      }
      coords.push([turtleX, turtleY]);
    }
  }
}

function createSliders(){
  // створення слайдерів:
  // для зміни форми Черепашки
  sliderShapeTurtle = createSlider(0, t.shapes.length - 1, 3, 1);
  sliderShapeTurtle.position(10, 55);
  sliderShapeTurtle.style("width", "130px");

  // для зміни розміру Черепашки
  sliderSizeTurtle = createSlider(t.shapeSizeMin, t.shapeSizeMax, 1, 1);
  sliderSizeTurtle.position(10, 95);
  sliderSizeTurtle.style("width", "130px");

  // для зміни кутової орієнтації Черепашки
  sliderHeadingTurtle = createSlider(0, 360, 0, 1);
  sliderHeadingTurtle.position(10, 135);
  sliderHeadingTurtle.style("width", "130px");

  // для зміни товщини олівця
  sliderPenSize = createSlider(1, 20, t.penSize, 1);
  sliderPenSize.position(10, 175);
  sliderPenSize.style("width", "130px");
}

function slidersHeadlines(){
  // текстові заголовки для слайдерів
  controlBoard.textAlign(LEFT, CENTER);
  controlBoard.noStroke();
  controlBoard.fill(254, 185, 95); // Hunyadi yellow
  controlBoard.stroke(235, 235, 235); /* Anti-flash white */
  controlBoard.rect(-1, t.heightDashboard + 10, 155, 295, 0, 4, 4, 0);
  controlBoard.noStroke();
  controlBoard.fill(97, 112, 125, 255); // Payne's gray
   
  controlBoard.text(`форма: ${t.shapes[sliderShapeTurtle.value()]}`, 10, 50);
  t.setShape(t.shapes[sliderShapeTurtle.value()]);

  controlBoard.text(`розмір: ${sliderSizeTurtle.value()}`, 10, 90);
  t.setShapeSize(sliderSizeTurtle.value());

  theta = sliderHeadingTurtle.value() === 360 ? 0 : sliderHeadingTurtle.value();
  controlBoard.text(`кутова орієнтація: ${theta}\u00B0`, 10, 130);
  t.setHeading(theta);

  controlBoard.text(`товщина олівця: ${sliderPenSize.value()}`, 10, 170);
  t.setPenSize(sliderPenSize.value());

  controlBoard.text(`колір: ${colorPicker.color()}`, 10, 210);
  t.setColor(colorPicker.color());  
  controlBoard.fill(255, 255);
}

function createCheckBoxes(){
  // чекбокс для вимкнення/увімкнення:
  // олівця
  checkItems["pen"] = createCheckbox("олівець", true);
  checkItems.pen.changed(checkedVisiblePen);
  checkItems.pen.position(10, 250);
  checkItems.pen.addClass("chk");

  // написи для координат
  checkItems["coords"] = createCheckbox("написи", false);
  checkItems.coords.changed(checkedVisibleCoords);
  checkItems.coords.position(75, 250);
  checkItems.coords.addClass("chk");
}

function checkedVisiblePen() {
  // перемикання режимів олівця
  if (checkItems.pen.checked()) {
    t.penIsUp = false;
  } else {
    t.penIsUp = true;    
  }
}

function checkedVisibleCoords() {
  // перемикання відображення написів координат на полотні
  if (checkItems.coords.checked()) {
    coordsTitle = true;
  } else {
    coordsTitle = false;  
  }
}

function interfaceItems(){
  // елементи інтерфейсу
  t.dashboard();
  t.compass();
  slidersHeadlines(); 
  checkedVisiblePen();
  checkedVisibleCoords();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);  
}

function saveCanvasTurtle() {
  // зберегти зображення полотна у файл
  save(cnv, "turtle.png");
}

function saveCoordsTurtle() {
  // зберегти координати Черепашки у текстовий файл
  let content = "Координати відсутні, спочатку поклікайте мишкою на полотні.";
  content = "0,0\r\n";
  for (const co of coords) {
    content += `${co}\r\n`;
  }
  const link = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = "coords.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

