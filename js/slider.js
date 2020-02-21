'use strict';

(function () {
  var DEFAULT_EFFECT_VALUE = 100;
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var imageUploadPreview = document.querySelector('.img-upload__preview img');
  var scaleControlValue = document.querySelector('.scale__control--value');

  var changeEffectLevelPin = function () {
    var saturation = (effectLevelPin.offsetLeft / effectLevelLine.clientWidth).toFixed(2) * 100;
    effectLevelValue.value = saturation;
    window.form.setEffectLevel(saturation);
  };

  var moveSetup = function (evt) {
    evt.preventDefault();


    var startCoordsX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startCoordsX - moveEvt.clientX;
      startCoordsX = moveEvt.clientX;

      var newCoordX = effectLevelPin.offsetLeft - shiftX;
      if (newCoordX >= 0 && newCoordX <= effectLevelLine.clientWidth) {
        effectLevelPin.style.left = newCoordX + 'px';
        effectLevelDepth.style.width = newCoordX + 'px';
        changeEffectLevelPin();
      }

    };

    var onMouseUp = function (moveEvt) {
      moveEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var resetSliderValue = function (mode) {
    effectLevelPin.style.left = DEFAULT_EFFECT_VALUE + '%';
    effectLevelDepth.style.width = DEFAULT_EFFECT_VALUE + '%';
    imageUploadPreview.className = '';
    imageUploadPreview.style.filter = null;
    effectLevelValue.value = DEFAULT_EFFECT_VALUE;

    if (mode === 'all') {
      imageUploadPreview.style.transform = null;
      scaleControlValue.value = DEFAULT_EFFECT_VALUE;
    }
  };

  window.slider = {
    move: moveSetup,
    reset: resetSliderValue
  };
})();
