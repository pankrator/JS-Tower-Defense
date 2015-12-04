var NEAR_THRESHOLD = 6;

var Path = function (points) {
  this.points = points;
}

Path.prototype.addPoint = function (point, index) {
  if (index) {
    this.points.splice(index, 0, point);
  } else {
    this.points.push(point);
  }
}

Path.prototype.removePoint = function (index) {
  this.points.splice(index, 1);
}

var PathManager = function () {};

PathManager.prototype.followPath = function (object, path) {
  if (object.currentPathIndex == path.points.length) {
    object.reachedEnd = true;
    return;
  }
  
  if (object.currentPathIndex == undefined || object.currentPathIndex == null) {
    object.currentPathIndex = 0;
  }
  var nextPoint = path.points[object.currentPathIndex];
  // TODO: Fix the next line!!
  var direction = new Vector(nextPoint.x - object.position.x, nextPoint.y - object.position.y).normalized();
  
  // TODO: Set only direction and change position from PhysicsManager
  Vector.add(object.position, direction.multiply(object.speed), object.position);
  
  if (Math.abs(nextPoint.x - object.position.x) < NEAR_THRESHOLD &&
      Math.abs(nextPoint.y - object.position.y) < NEAR_THRESHOLD &&
      object.currentPathIndex < path.points.length) {      
    object.currentPathIndex++;
  }
}