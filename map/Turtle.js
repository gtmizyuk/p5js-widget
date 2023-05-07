class Turtle {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.tX = this.calculateTurtleXY()[0];
    this.tY = this.calculateTurtleXY()[1];
    this.penSize = 1;
    this.penColor = color(0);
    this.fillColor = color(255, 0);
    this.bgColor = color(255, 255);
    this.angle = 0.0;

    this.shapes = ["blank", "circle", "square", "triangle"];
    this.shape = this.shapes[3];
    this.shapeSizeMin = 1;
    this.shapeSize = this.shapeSizeMin;
    this.shapeSizeMax = 20;

    this.penIsUp = false;
    this.penModeText = "унизу";

    this.isVisibleTurtle = true;
    this.isVisibleCompass = false;

    this.createGrid = createGraphics(width, height);
    this.gridColor = color(0, 50);
    this.stepGrid = 50;

    this.heightDashboard = 25;
    this.colorDashboardBg = color(97, 112, 125); // Payne's gray
    this.colorDashboardText = color(245, 251, 239); //Ivory
    this.createDashboard = createGraphics(width, this.heightDashboard);
    this.author = createGraphics(width, height);
  }

  getPosition() {
    [this.tX, this.tY] = this.calculateTurtleXY();
    return [this.tX, this.tY];
  }
  
  setPosition(newX, newY){
    this.goto(newX, newY);
  }

  setPenSize(s) {
    this.penSize = s;
  }

  setBgColor(c = this.bgColor) {
    this.bgColor = color(c);
    background(this.bgColor);
  }

  setColor(c = this.penColor, f = this.fillColor) {
    this.penColor = color(c);
    this.fillColor = color(f);
  }

  setFillColor(f = this.fillColor) {
    this.fillColor = color(f);
  }

  beginFill() {
    fill(this.fillColor);
  }

  endFill() {
    noFill();
  }

  left(angle) {
    this.right(-angle);
  }

  right(angle) {
    this.angle += angle;
  }

  signHeading(angle = this.angle) {
    if (angle < 0) {
      return angle % 360;
    } else if (angle > 0) {
      let a = 360 - (angle % 360);
      if (a === 360) {
        return 0;
      } else {
        return a;
      }
    }
    return 0;
  }

  getCurrentHeading() {
    // напрями стрілки компасу і Черепашки на полотні
    return this.angle;
  }

  getHeading() {
    // значення кутів на компасі і дашборді
    return abs(this.signHeading());
  }

  setHeading(angle) {
    this.angle = -angle;
  }

  penUp() {
    this.penIsUp = true;
  }

  penDown() {
    this.penIsUp = false;
  }

  forward(distance) {
    let rad = radians(this.angle);
    let newX = this.x + distance * cos(rad);
    let newY = this.y + distance * sin(rad);
    this.forwardXY(newX, newY);
  }

  back(distance) {
    this.forward(-distance);
  }

  footPrint(x, y, newX, newY) {
    if (!this.penIsUp) {
      stroke(this.penColor);
      strokeWeight(this.penSize);
      line(x, y, newX, newY);
    }
  }

  forwardXY(newX, newY) {
    this.footPrint(this.x, this.y, newX, newY);
    this.x = newX;
    this.y = newY;
    noFill();
    [this.tX, this.tY] = this.calculateTurtleXY();
  }

  goto(newX, newY) {
    [this.tX, this.tY] = this.calculateTurtleXY();
    noFill();
    push();
    translate(width / 2, height / 2);
    scale(1, -1);
    this.footPrint(this.tX, this.tY, newX, newY);
    this.x = newX;
    this.y = newY;
    [this.x, this.y] = this.calculateTurtleXYnormal();
    pop();
  }

  home() {
    this.setHeading(0);
    this.forwardXY(width / 2, height / 2);
  }

  clr() {
    clear();
  }

  oval(r = 30, e = 30) {
    strokeWeight(this.penSize);
    if (!this.penIsUp) {
      strokeWeight(this.penSize);
      stroke(this.penColor);
      this.beginFill(this.fillColor);
      ellipse(this.x, this.y, r * 2, e * 2);
      this.endFill();
    }
  }

  polygon(vertices = [[]]) {
    if (vertices[0].length) {
      if (!this.penIsUp) {
        let vertexX, vertexY;
        vertices.push(this.getPosition());
        strokeWeight(this.penSize);
        stroke(this.penColor);
        this.beginFill(this.fillColor);
        beginShape();
        for (const verte of vertices) {
          [this.x, this.y] = verte;
          [vertexX, vertexY] = this.calculateTurtleXYnormal();
          vertex(vertexX, vertexY);
        }
        endShape(CLOSE);
        this.endFill();
        [this.x, this.y] = [vertexX, vertexY];
        [this.tX, this.tY] = this.calculateTurtleXY();
      }
    }
  }

  write(
    txt = "",
    alignment = { horizontal: CENTER, vertical: CENTER },
    font = { font: "sans-serif", size: 12, style: NORMAL }
  ) {
    noStroke();
    fill(this.penColor);
    textAlign(alignment.horizontal || CENTER, alignment.vertical || CENTER);
    textFont(font.font || "sans-serif");
    textSize(font.size || 12);
    textStyle(font.style || NORMAL);
    text(txt, this.x, this.y);
  }

  setShape(shape = this.shape) {
    this.shape = shape;
  }

  setShapeSize(s = this.shapeSize) {
    if (s < this.shapeSizeMin || s > this.shapeSizeMax) {
      this.shapeSize = 1;
    } else {
      this.shapeSize = s;
    }
  }

  showTurtleShape(shape, scope) {
    if (this.shapes.includes(shape)) {
      strokeWeight(0.3);
      stroke(this.bgColor);
      fill(this.penColor);
      if (shape === "circle") {
        circle(0, 0, 10 * scope);
      } else if (shape === "square") {
        rectMode(CENTER);
        rect(0, 0, 10 * scope, 10 * scope);
      } else if (shape === "triangle") {
        triangle(-5 * scope, -5 * scope, 5 * scope, 0, -5 * scope, 5 * scope);
      }
      strokeWeight(2);
      fill(this.bgColor);
      point(0, 0);
      noFill();
    }
  }

  showTurtle() {
    this.isVisibleTurtle = true;
  }

  hideTurtle() {
    this.isVisibleTurtle = false;
  }

  displayTurtleInPlace() {
    if (this.isVisibleTurtle) {
      this.showTurtleShape(this.shape, this.shapeSize);
    }
  }

  showCompass() {
    this.isVisibleCompass = true;
  }

  displayCompass() {
    noStroke();
    //stroke(235, 235, 235); // Anti-flash white
    fill(163, 227, 255); // Uranian Blue
    circle(0, 0, 90);
    fill(254, 185, 95); // Hunyadi yellow
    rectMode(CENTER);
    rect(0, 0, 36, 36);
    fill(3, 64, 120); // Indigo dye
    triangle(-18, -18, 18, 0, -18, 18);
    fill(163, 227, 255); // Uranian Blue
    circle(0, 0, 2);
    //this.showTurtleShape(this.shape);
  }

  rotateTurtle() {
    let rad = radians(this.getCurrentHeading());
    push();
    translate(this.x, this.y);
    rotate(rad);
    this.displayTurtleInPlace();
    pop();
  }

  rotateCompas() {
    if (this.isVisibleCompass) {
      let rad = radians(this.getCurrentHeading());
      push();
      translate(width - 30, height - 30);
      rotate(rad);
      this.displayCompass();
      pop();
    }
  }

  showCompassAngle() {
    if (this.isVisibleCompass) {
      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      textStyle(BOLD);
      text(`${abs(this.getHeading())}\u00B0`, width - 30, height - 62.5);
    }
  }

  grid(step = this.stepGrid, c = this.gridColor, axis = color(11, 114, 159)) {
    this.setStepGrid(step);
    this.createGrid.stroke(color(c));
    for (let i = 0; i < this.createGrid.width / 10; i++) {
      this.createGrid.line(
        i * this.stepGrid,
        0,
        i * this.stepGrid,
        this.createGrid.height
      );
    }
    for (let j = 0; j < this.createGrid.height / 10; j++) {
      this.createGrid.line(
        0,
        j * this.stepGrid,
        this.createGrid.width,
        j * this.stepGrid
      );
    }
    // центральні лінії
    this.createGrid.stroke(axis); // за замовчуванням Cerulean
    this.createGrid.strokeWeight(2);
    this.createGrid.line(
      this.createGrid.width / 2,
      0,
      this.createGrid.width / 2,
      this.createGrid.height
    );
    this.createGrid.line(
      0,
      this.createGrid.height / 2,
      this.createGrid.width,
      this.createGrid.height / 2
    );
    image(this.createGrid, 0, 0, this.createGrid.width, this.createGrid.height);
  }

  setStepGrid(step = this.stepGrid) {
    this.stepGrid = step;
  }

  getStepGrid() {
    return this.stepGrid;
  }

  dashboard() {
    const stripText = "JavaScript Turtle Graphics";
    let [tX, tY] = this.getPosition();
    let [mX, mY] = this.calculateMouseXY();

    this.createDashboard.stroke(this.colorDashboardBg);
    this.createDashboard.fill(this.colorDashboardBg);
    this.createDashboard.rect(
      0,
      0,
      this.createDashboard.width,
      this.heightDashboard
    );
    this.createDashboard.textSize(15);
    this.createDashboard.textAlign(LEFT, CENTER);
    this.createDashboard.fill(this.colorDashboardText);

    if (!this.penIsUp) {
      this.penModeText = "унизу";
    } else {
      this.penModeText = "вгорі";
    }
    this.createDashboard.text(
      `${stripText} | Олівець: ${this.penModeText} | Кут: ${abs(
        this.getHeading()
      )}\u00B0 | Черепашка: (${tX}, ${tY}) | Вказівник: (${mX}, ${mY})`,
      5,
      12.5
    );
    image(
      this.createDashboard,
      0,
      0,
      this.createDashboard.width,
      this.heightDashboard
    );
  }

  creator() {
    const developer = "Олександр Мізюк";
    const emj = "❤️";
    const authorText = ` Розроблено з ${emj} ${developer} `;
    const colorAuthorTextBg = color(97, 112, 125); // Payne's gray
    const colorAuthorText = color(245, 251, 239); // Ivory

    const authorTextWidth = this.author.textWidth(authorText);
    this.author.strokeWeight(0);
    this.author.textSize(12);
    this.author.fill(colorAuthorTextBg);
    this.author.rect(
      0,
      this.author.height - 44.5,
      authorTextWidth + 8,
      25,
      0,
      15,
      15,
      0
    );
    this.author.textAlign(LEFT, CENTER);
    this.author.fill(colorAuthorText);
    this.author.text(authorText, 2, this.author.height - 30);
    image(this.author, 0, 0, this.author.width, this.author.height);
  }

  calculateTurtleXY(tX = 0, tY = 0) {
    if ((this.x > width / 2) && (this.y < height / 2)) {
      tX = abs(Math.round(this.x - width / 2));
      tY = abs(int(this.y - height / 2));
    }
    if ((this.x < width / 2) && (this.y < height / 2)) {
      tX = -abs(int(this.x - width / 2));
      tY = abs(int(this.y - height / 2));
    }
    if ((this.x < width / 2) && (this.y > height / 2)) {
      tX = -abs(int(this.x - width / 2));
      tY = -abs(Math.round(this.y - height / 2));
    }
    if ((this.x > width / 2) && (this.y > height / 2)) {
      tX = abs(Math.round(this.x - width / 2));
      tY = -abs(Math.round(this.y - height / 2));
    }
    if ((this.x === width / 2) && (this.y !== height / 2)) {
      tX = 0;
      if (this.y < height / 2) {
        tY = abs(int(this.y - height / 2));
      }
      if (this.y > height / 2) {
        tY = -abs(Math.round(this.y - height / 2));
      }
    }
    if ((this.x !== width / 2) && (this.y === height / 2)) {
      tY = 0;
      if (this.x > width / 2) {
        tX = abs(Math.round(this.x - width / 2));
      }
      if (this.x < width / 2) {
        tX = -abs(int(this.x - width / 2));
      }
    }
    if ((this.x === width / 2) && (this.y === height / 2)) {
      tX = 0;
      tY = 0;
    }
    return [tX, tY];
  }

  calculateTurtleXYnormal(tX = 0, tY = 0) {
    if ((this.x > 0) && (this.y > 0)) {
      tX = int(this.x + width / 2);
      tY = abs(int(this.y - height / 2));
    }
    if ((this.x < 0) && (this.y > 0)) {
      tX = int(this.x + width / 2);
      tY = abs(int(this.y - height / 2));
    }
    if ((this.x < 0) && (this.y < 0)) {
      tX = int(this.x + width / 2);
      tY = int(height / 2 - this.y);
    }
    if ((this.x > 0) && (this.y < 0)) {
      tX = int(this.x + width / 2);
      tY = int(height / 2 - this.y);
    }
    if ((this.x === 0) && (this.y !== 0)) {
      tX = width / 2;
      if (this.y > 0) {
        tY = int(height / 2 - this.y);
      }
      if (this.y < 0) {
        tY = int(height / 2 - this.y);
      }
    }
    if ((this.x !== 0) && (this.y === 0)) {
      tY = height / 2;
      if (this.x > 0) {
        tX = int(this.x + width / 2);
      }
      if (this.x < 0) {
        tX = int(this.x + width / 2);
      }
    }
    if ((this.x === 0) && (this.y === 0)) {
      tX = width / 2;
      tY = height / 2;
    }
    return [tX, tY];
  }

  calculateMouseXY(mX = mouseX, mY = mouseY) {
    if ((mouseX > width / 2) && (mouseY < height / 2)) {
      mX = abs(Math.round(mouseX - width / 2));
      mY = abs(int(mouseY - height / 2));
    }
    if ((mouseX < width / 2) && (mouseY < height / 2)) {
      mX = -abs(int(mouseX - width / 2));
      mY = abs(int(mouseY - height / 2));
    }
    if ((mouseX < width / 2) && (mouseY > height / 2)) {
      mX = -abs(int(mouseX - width / 2));
      mY = -abs(Math.round(mouseY - height / 2));
    }
    if ((mouseX > width / 2) && (mouseY > height / 2)) {
      mX = abs(Math.round(mouseX - width / 2));
      mY = -abs(Math.round(mouseY - height / 2));
    }
    if ((mouseX === width / 2) && (mouseY !== height / 2)) {
      mX = 0;
      if (mouseY < height / 2) {
        mY = abs(int(mouseY - height / 2));
      }
      if (mouseY > height / 2) {
        mY = -abs(Math.round(mouseY - height / 2));
      }
    } else if ((mouseX !== width / 2) && (mouseY === height / 2)) {
      mY = 0;
      if (mouseX > width / 2) {
        mX = abs(Math.round(mouseX - width / 2));
      }
      if (mouseX < width / 2) {
        mX = -abs(int(mouseX - width / 2));
      }
    }
    return [mX, mY];
  }

  place() {
    this.rotateTurtle();
  }
  compass() {
    this.rotateCompas();
    this.showCompassAngle();
    this.showCompass();
  }
}
