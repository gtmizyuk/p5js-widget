let t, tMirror, cnv, theta, controlBoard, gridPrivate;
let sliderShapeTurtle,
  sliderSizeTurtle,
  sliderHeadingTurtle,
  sliderPenSize,
  colorPicker,
  btnSaveCanvasTurtle,
  btnSaveCoordsTurtle;
let checkItems = {};
let coords = []; // координати для текстового файлу
let coordsTitle = false;
let startTurtleX, startTurtleY;
let progress = []; // стани Черепашки

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(mClick);

  colorPicker = createColorPicker("#ed225d"); // Cerise
  colorPicker.position(10, 220);

  controlBoard = createGraphics(windowWidth, windowHeight);

  gridPrivate = createGraphics(width, height);

  // основний примірник Черепашки
  t = new Turtle();

  [startTurtleX, startTurtleY] = t.getPosition();
  t.setColor(colorPicker.color(), colorPicker.color());
  t.write(`(${startTurtleX}, ${startTurtleY})`, {
    horizontal: LEFT,
    vertical: BOTTOM,
  });

  // невидимий примірник Черапашки для роботи за лаштунками
  tMirror = new Turtle();
  tMirror.penColor = color(255, 0);

  // створити сітку
  createGrid(
    (step = 50),
    (colorLines = color(0, 50)),
    (colorAxis = color(11, 114, 159)),
    (linesThickness = 1),
    (axisThickness = 2)
  );

  // створити слайдери
  createSliders();

  // створити чекбокси
  createCheckBoxes();

  // ствторити кнопки:
  // зберегти зображeння у форматі PNG
  btnSaveCanvasTurtle = createButton("зберегти полотно png");
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
  t.place();
  interfaceItems();
  image(controlBoard, 0, 0, controlBoard.width, controlBoard.height);
}

function createGrid(
  step = 50,
  colorLines = color(0, 50),
  colorAxis = color(11, 114, 159),
  linesThickness = 1,
  axisThickness = 2
) {
  // сітка
  gridPrivate.stroke(colorLines);
  gridPrivate.strokeWeight(linesThickness);
  for (let i = 0; i < gridPrivate.width / 10; i++) {
    gridPrivate.line(i * step, 0, i * step, gridPrivate.height);
  }
  for (let j = 0; j < gridPrivate.height / 10; j++) {
    gridPrivate.line(0, j * step, gridPrivate.width, j * step);
  }
  // центральні лінії
  gridPrivate.stroke(colorAxis); // за замовчуванням Cerulean
  gridPrivate.strokeWeight(axisThickness);
  gridPrivate.line(
    gridPrivate.width / 2,
    0,
    gridPrivate.width / 2,
    gridPrivate.height
  );
  gridPrivate.line(
    0,
    gridPrivate.height / 2,
    gridPrivate.width,
    gridPrivate.height / 2
  );
}

function mClick() {
  // по кліку малюємо Черепашку, її координати та фіксуємо кожен її стан
  t.setShape(t.shapes[sliderShapeTurtle.value()]);
  t.setShapeSize(sliderSizeTurtle.value());
  t.setHeading(theta);
  t.setPenSize(sliderPenSize.value());
  t.setColor(colorPicker.color());
  t.setFillColor(colorPicker.color());

  let [turtleX, turtleY] = t.calculateMouseXY(mouseX, mouseY);
  t.setPosition(turtleX, turtleY);

  tMirror.setPosition(turtleX, turtleY);

  if (coordsTitle) {
    t.write(`(${turtleX}, ${turtleY})`, { horizontal: LEFT, vertical: BOTTOM });
  }
  coords.push([turtleX, turtleY]);

  let startState = {
    turtleShape: 3,
    turtleSize: 1,
    turtleHeading: 0,
    penSize: 1,
    colorTurtlePen: "rgba(237, 34, 93, 1)",
    turtleX: 0,
    turtleY: 0,
    coordsTitle: true,
    penIsUp: false,
  };
  progress.splice(0, 1, startState);

  let currentState = {
    turtleShape: sliderShapeTurtle.value(),
    turtleSize: sliderSizeTurtle.value(),
    turtleHeading: theta,
    penSize: sliderPenSize.value(),
    colorTurtlePen: colorPicker.color(),
    turtleX: turtleX,
    turtleY: turtleY,
    coordsTitle: coordsTitle,
    penIsUp: t.penIsUp,
  };
  progress.push(currentState);
}

function createSliders() {
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

function slidersHeadlines() {
  // текстові заголовки для слайдерів
  controlBoard.textAlign(LEFT, CENTER);
  controlBoard.noStroke();
  controlBoard.fill(254, 185, 95); // Hunyadi yellow
  controlBoard.stroke(235, 235, 235); // Anti-flash white
  controlBoard.rect(-1, t.heightDashboard + 10, 155, 295, 0, 4, 4, 0);
  controlBoard.noStroke();
  controlBoard.fill(97, 112, 125, 255); // Payne's gray

  controlBoard.text(`форма: ${t.shapes[sliderShapeTurtle.value()]}`, 10, 50);
  //t.setShape(t.shapes[sliderShapeTurtle.value()]);

  controlBoard.text(`розмір: ${sliderSizeTurtle.value()}`, 10, 90);
  //t.setShapeSize(sliderSizeTurtle.value());

  theta = sliderHeadingTurtle.value() === 360 ? 0 : sliderHeadingTurtle.value();
  controlBoard.text(`кутова орієнтація: ${theta}\u00B0`, 10, 130);
  tMirror.setHeading(theta);

  controlBoard.text(`товщина олівця: ${sliderPenSize.value()}`, 10, 170);
  //t.setPenSize(sliderPenSize.value());

  controlBoard.text(`колір: ${colorPicker.color()}`, 10, 210);
  //t.setColor(colorPicker.color());
  //t.setFillColor(colorPicker.color());
  controlBoard.fill(255, 255);
}

function createCheckBoxes() {
  // чекбокс для вимкнення/увімкнення:
  // олівця
  checkItems.pen = createCheckbox("олівець", true);
  checkItems.pen.changed(checkedVisiblePen);
  checkItems.pen.position(10, 250);
  checkItems.pen.addClass("chk");

  // написи для координат
  checkItems.coords = createCheckbox("написи", false);
  checkItems.coords.changed(checkedVisibleCoords);
  checkItems.coords.position(75, 250);
  checkItems.coords.addClass("chk");

  // сітки, за замовчуванням вимкнена
  checkItems.gridPrivate = createCheckbox("сітка", false);
  checkItems.gridPrivate.changed(checkedVisibleGrid);
  checkItems.gridPrivate.position(75, 225);
  checkItems.gridPrivate.addClass("chk");
}

function checkedVisiblePen() {
  // олівець на полотні?
  if (checkItems.pen.checked()) {
    t.penIsUp = false;
    tMirror.penIsUp = false;
  } else {
    t.penIsUp = true;
    tMirror.penIsUp = true;
  }
}

function checkedVisibleCoords() {
  // чи увімкнено написи координат на полотні?
  if (checkItems.coords.checked()) {
    coordsTitle = true;
  } else {
    coordsTitle = false;
  }
}

function checkedVisibleGrid() {
  // чи увімкнено сітку?
  if (checkItems.gridPrivate.checked()) {
    image(gridPrivate, 0, 0, gridPrivate.width, gridPrivate.height);
  } else {
    clear();
    memoryProgress();
    image(gridPrivate, gridPrivate.width, gridPrivate.height);
  }
}

function memoryProgress() {
  // відновити кожен стан Черепашки, коли сітка вимикається
  if (progress.length > 0) {
    let statePrev = progress[0];
    stateMemory(
      statePrev.turtleShape,
      statePrev.turtleSize,
      statePrev.turtleHeading,
      statePrev.penSize,
      statePrev.colorTurtlePen,
      0,
      0,
      statePrev.turtleX,
      statePrev.turtleY,
      statePrev.coordsTitle,
      statePrev.penIsUp
    );
    for (let i = 1; i < progress.length; i++) {
      let state = progress[i];
      stateMemory(
        state.turtleShape,
        state.turtleSize,
        state.turtleHeading,
        state.penSize,
        state.colorTurtlePen,
        state.turtleX,
        state.turtleY,
        statePrev.turtleX,
        statePrev.turtleY,
        state.coordsTitle,
        state.penIsUp
      );
      statePrev = progress[i];
    }
  } else {
    t.write(`(${startTurtleX}, ${startTurtleY})`, {
      horizontal: LEFT,
      vertical: BOTTOM,
    });
  }
}

function stateMemory(
  turtleShape,
  turtleSize,
  turtleHeading,
  penSize,
  colorTurtlePen,
  turtleX,
  turtleY,
  turtleXPrev,
  turtleYPrev,
  coordsTitle,
  penIsUp
) {
  // відновити місце, де була Черепашка, та її властивості
  t.setShape(t.shapes[turtleShape]);
  t.setShapeSize(turtleSize);
  t.setHeading(turtleHeading);
  t.setPenSize(penSize);
  t.setColor(colorTurtlePen);
  [t.tX, t.tY] = t.calculateTurtleXY();
  noFill();
  push();
  translate(width / 2, height / 2);
  scale(1, -1);
  if (!penIsUp) {
    stroke(colorTurtlePen);
    strokeWeight(penSize);
    line(turtleXPrev, turtleYPrev, turtleX, turtleY);
  }
  t.x = turtleX;
  t.y = turtleY;
  [t.x, t.y] = t.calculateTurtleXYnormal();
  pop();
  t.place();
  if (coordsTitle) {
    t.write(`(${turtleX}, ${turtleY})`, { horizontal: LEFT, vertical: BOTTOM });
  }
}

function interfaceItems() {
  // елементи інтерфейсу
  tMirror.dashboard();
  tMirror.compass();
  slidersHeadlines();
  checkedVisiblePen();
  checkedVisibleCoords();
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
}

function saveCanvasTurtle() {
  // зберегти зображення полотна у файл
  saveCanvas(cnv, "turtle", "png");
}

function saveCoordsTurtle() {
  // зберегти координати Черепашки у текстовий файл
  let content = "0,0\r\n";
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
