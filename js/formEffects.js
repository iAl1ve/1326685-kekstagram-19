'use strict';

(function () {
  var SCALE_STEP = 25;

  var imageUploadPreview = document.querySelector('.img-upload__preview img');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var effectList = document.querySelector('.effects__list');
  var imgEffectSlider = document.querySelector('.img-upload__effect-level');

  // Изменяем масштаб фотографии
  var onChangeScaleControl = function (evt) {
    var scale = evt.target.className === scaleControlSmaller.className ? -SCALE_STEP : SCALE_STEP;
    scale = Number(scaleControlValue.value) + scale;
    if (scale <= 100 && scale > 0) {
      scaleControlValue.value = scale;
      scale /= 100;
      imageUploadPreview.style.transform = 'scale(' + scale + ')';
    }
  };

  // Переключаем эффекты
  var onChangeEffectRadio = function (evt) {
    // Сбрасываем по умолчанию при переключении
    window.slider.reset();
    var currentEffect = evt.target.value !== 'none' ? 'effects__preview--' + evt.target.value : null;
    evt.target.checked = true;
    imageUploadPreview.classList.add(currentEffect);
    if (currentEffect === null) {
      imgEffectSlider.classList.add('hidden');
    } else {
      imgEffectSlider.classList.remove('hidden');
    }
  };

  var setEffectImage = function (value) {
    imageUploadPreview.style.filter = value;
  };

  var setEffectLevel = function (effectValue) {
    var currentEffect = effectList.querySelector('input[name=effect]:checked').value;
    switch (currentEffect) {
      case 'chrome':
        setEffectImage('grayscale(' + (effectValue / 100).toFixed(2) + ')');
        break;
      case 'sepia':
        setEffectImage('sepia(' + (effectValue / 100).toFixed(2) + ')');
        break;
      case 'marvin':
        setEffectImage('invert(' + effectValue + '%)');
        break;
      case 'phobos':
        setEffectImage('blur(' + (effectValue * 0.03) + 'px)');
        break;
      case 'heat':
        setEffectImage('brightness(' + (1 + (effectValue * 0.02)) + ')');
        break;
      default:
        imageUploadPreview.style = null;
    }
  };

  window.formEffects = {
    onSetLevel: setEffectLevel,
    onChange: onChangeEffectRadio,
    onScaleControl: onChangeScaleControl
  };
})();
