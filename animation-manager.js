var AnimationManager = function (renderer) {
  this.renderer = renderer;
}

AnimationManager.prototype.update = function (collection) {
  for (var i = 0; i < collection.length; i++) {
    var animations = collection[i].playAnimations;
    for (var j = 0; j < animations.length; j++) {
      var animation = animations[j];
      if (animation.type === 'RAY') {
        renderer.renderLine(animation.beginPosition.x, animation.beginPosition.y,
                            animation.endPosition.x, animation.endPosition.y,
                            animation.style, animation.width);
      }

      animation.currentFrame++;
      if (animation.currentFrame >= animation.lengthInFrames) {
        animations.splice(j, 1);
      }
    }
  }
}