'use strict';

(function () {
  var SCALE_STEP = 25;
  var HASHTAG_COUNT = 5;
  var HASHTAG_LENGTH = 20;
  var COMMENTS_LENGTH = 140;

  var bodyElement = document.querySelector('body');

  var uploadFileInput = document.querySelector('#upload-file');
  var uploadImageOverlay = document.querySelector('.img-upload__overlay');
  var closeUploadImageForm = document.querySelector('#upload-cancel');
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadSubmitButton = document.querySelector('#upload-submit');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var imageUploadPreview = document.querySelector('.img-upload__preview');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var effectRadio = document.querySelectorAll('.effects__radio');
  var textHashtags = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');


  // Закрытие формы загрузки изображения по ESC
  var onKeyCloseUploadImageForm = function (evt) {
    window.util.isEscFormEvent(evt, onCloseUploadImageForm);
  };

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

  // Насыщенность
  var onChangeEffectLevelPin = function (moveEvt) {
    moveEvt.preventDefault();
    var sliderLineCoords = effectLevelLine.getBoundingClientRect();
    var sliderCoords = {
      left: sliderLineCoords.left + pageXOffset,
      width: sliderLineCoords.width
    };
    var levelPinCoords = effectLevelPin.getBoundingClientRect().left + pageXOffset;
    var saturation = ((levelPinCoords - sliderLineCoords.left + effectLevelPin.offsetWidth / 2) / sliderCoords.width).toFixed(2);
    effectLevelValue.value = saturation * 100;
  };

  // Переключаем эффекты
  var onChangeEffectRadio = function (evt) {
    imageUploadPreview.querySelector('img').className = '';
    var currentEffect = evt.target.value !== 'none' ? 'effects__preview--' + evt.target.value : null;
    imageUploadPreview.querySelector('img').classList.add(currentEffect);
    // Сбрасываем по умолчанию при переключении
    effectLevelPin.style.left = '100%';
    effectLevelDepth.style.width = '100%';
    imageUploadPreview.style.filter = '';
    effectLevelValue.value = 100;
  };

  // Добавляем события на эффекты
  var onAddEffectRadio = function () {
    effectRadio.forEach(function (element) {
      element.addEventListener('change', onChangeEffectRadio);
    });
  };

  // Удаляем события на эффекты
  var onDeleteEffectRadio = function () {
    effectRadio.forEach(function (element) {
      element.removeEventListener('change', onChangeEffectRadio);
    });
  };

  // Поиск повторяющихся элементов
  var findDuplicateHashtags = function (elements) {
    var duplicatesFound = false;
    var buffer = '';
    if (elements.length > 1) {
      for (var i = 0; i < elements.length; i++) {
        buffer = elements[i];
        for (var j = i + 1; j < elements.length; j++) {
          if (buffer.toLocaleLowerCase() === elements[j].toLocaleLowerCase()) {
            duplicatesFound = true;
            break;
          }
        }
      }
    }

    return duplicatesFound;
  };

  // Процесс валидации хэштегов
  var validateHashtags = function () {
    var hashtags = textHashtags.value.split(' ');
    var errorMessage = '';
    var validate = true;

    if (hashtags.length > HASHTAG_COUNT) {
      errorMessage += 'Нельзя указать больше пяти хэш-тегов. ';
      validate = false;
    } else if (findDuplicateHashtags(hashtags)) {
      errorMessage += 'Один и тот же хэш-тег не может быть использован дважды. ';
      validate = false;
    }

    hashtags.forEach(function (hashtag) {
      switch (true) {
        case (hashtag.length > HASHTAG_LENGTH) :
          errorMessage += 'Максимальная длина одного хэш-тега 20 символов, включая решётку. ';
          validate = false;
          break;
        case (hashtag === '#') :
          errorMessage += 'Хеш-тег не может состоять только из одной решётки. ';
          validate = false;
          break;
        case (hashtag[0] !== '#' && hashtag.length > 0) :
          errorMessage += 'Хэш-тег должен начинаться с символа # (решётка). ';
          validate = false;
          break;
        case (/[^a-zA-Z0-9А-Яа-я]/.test(hashtag.substr(1, (hashtag.length - 1)))) :
          errorMessage += 'Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т.п.), символы пунктуации (тире, дефис, запятая и т.п.), эмодзи и т.д. ';
          validate = false;
          break;
      }
    });

    textHashtags.setCustomValidity(errorMessage);

    return validate;
  };

  var validateComment = function () {
    var validate = true;
    if (textDescription.value.length > COMMENTS_LENGTH) {
      textDescription.setCustomValidity('Длина комментария к изображению не должна превышать ' + COMMENTS_LENGTH + ' символов');
      validate = false;
    }

    return validate;
  };

  // Отправка формы по ENTER
  var onEnterSubmitImageForm = function (evt) {
    window.util.isEnterEvent(evt, onSubmitImageForm);
  };

  // Функция отключения события при закрытии формы
  var disableEventsListener = function () {
    closeUploadImageForm.removeEventListener('click', onCloseUploadImageForm);
    scaleControlSmaller.removeEventListener('click', onChangeScaleControl);
    scaleControlBigger.removeEventListener('click', onChangeScaleControl);
    document.removeEventListener('keydown', onKeyCloseUploadImageForm);
    onDeleteEffectRadio();
    uploadForm.removeEventListener('submit', onSubmitImageForm);
    uploadSubmitButton.removeEventListener('click', onSubmitImageForm);
    uploadSubmitButton.removeEventListener('keydown', onEnterSubmitImageForm);
    bodyElement.classList.remove('modal-open');
  };

  var onSubmitImageForm = function (evt) {
    evt.preventDefault();
    if (validateHashtags() && validateComment()) {
      disableEventsListener();
      uploadForm.submit();
    }
  };

  var onCloseUploadImageForm = function () {
    uploadImageOverlay.classList.add('hidden');
    uploadFileInput.addEventListener('change', onChangeUploadFile);
    disableEventsListener();
    uploadForm.reset();
  };

  // Открываем форму загрузки изображения, подключаем события
  var onChangeUploadFile = function () {
    uploadImageOverlay.classList.remove('hidden');
    bodyElement.classList.add('modal-open');
    scaleControlValue.value = 100;
    document.addEventListener('keydown', onKeyCloseUploadImageForm);
    uploadFileInput.removeEventListener('change', onChangeUploadFile);
    closeUploadImageForm.addEventListener('click', onCloseUploadImageForm);
    scaleControlSmaller.addEventListener('click', onChangeScaleControl);
    scaleControlBigger.addEventListener('click', onChangeScaleControl);
    onAddEffectRadio();
    effectLevelPin.addEventListener('mouseup', onChangeEffectLevelPin);
    uploadForm.addEventListener('submit', onSubmitImageForm);
    uploadSubmitButton.addEventListener('click', onSubmitImageForm);
    uploadSubmitButton.addEventListener('keydown', onEnterSubmitImageForm);
  };

  uploadFileInput.addEventListener('change', onChangeUploadFile);
})();
