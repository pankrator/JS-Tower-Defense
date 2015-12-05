var INITIAL_LINE_WIDTH = 1
var INITIAL_STROKE_STYLE = "black";
var INITIAL_FILL_STYLE = "black";

var Renderer = function (canvas, context) {
  this.canvas = canvas;
  this.context = context;
}

Renderer.prototype.clear = function () {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Renderer.prototype.renderCircle = function (x, y, radius, style, isFilled) {
  this.context.beginPath();
  this.context.arc(x, y, radius, 0, Math.PI * 2, 0);
  
  if (isFilled) {
    this.context.fillStyle = style || INITIAL_FILL_STYLE;
    this.context.fill();
  } else {
    this.context.strokeStyle = style || INITIAL_STROKE_STYLE;
    this.context.stroke();
  }
}

Renderer.prototype.renderRect = function (x, y, width, height, style, isFilled) {
  this.context.beginPath();
  this.context.rect(x, y, width, height);
  if (isFilled) {
    this.context.fillStyle = style || INITIAL_FILL_STYLE;
    this.context.fill();
  } else {
    this.context.strokeStyle = style || INITIAL_STROKE_STYLE;
    this.context.stroke();
  }
}

Renderer.prototype.renderLine = function (fromx, fromy, tox, toy, style, width) {
  this.context.beginPath();
  this.context.strokeStyle = style || INITIAL_STROKE_STYLE;
  this.context.lineWidth = width || INITIAL_LINE_WIDTH;
  this.context.moveTo(fromx, fromy);
  this.context.lineTo(tox, toy);
  this.context.stroke();
}

Renderer.prototype.renderText = function (x, y, text) {
  this.context.font = 'bold 16px Calibri';
  this.context.fillStyle = INITIAL_FILL_STYLE;
  this.context.fillText(text, x, y);
}

Renderer.prototype.renderPath = function (path, style) {
  var points = path.points;
  for (var i = 0; i < points.length - 1; i++) {
    this.renderLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, style);
  }
}

Renderer.prototype.renderTower = function (tower) {
  renderer.renderRect(tower.x - tower.width / 2, tower.y - tower.height / 2, tower.width, tower.height, "blue", true);
  if (DEBUG) {
    renderer.renderCircle(tower.x, tower.y, tower.range, "red");
    
    // if (tower.target) {
    //   renderer.renderLine(tower.x, tower.y, tower.target.x, tower.target.y, "green");
    // }
  }
}

Renderer.prototype.renderEnemy = function (enemy) {
  if (!enemy.isDead) {
    this.renderCircle(enemy.position.x, enemy.position.y, enemy.radius, "yellow", true);
  }
}