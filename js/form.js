'use strict';

(function () {
  var SCALE_STEP = 25;
  var HASHTAG_COUNT = 5;
  var HASHTAG_LENGTH = 20;
  var COMMENTS_LENGTH = 140;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var bodyElement = document.querySelector('body');

  var uploadFileInput = document.querySelector('#upload-file');
  var uploadImageOverlay = document.querySelector('.img-upload__overlay');
  var closeUploadImageForm = document.querySelector('#upload-cancel');
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadSubmitButton = document.querySelector('#upload-submit');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var imageUploadPreview = document.querySelector('.img-upload__preview img');
  var imgEffectSlider = document.querySelector('.img-upload__effect-level');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectRadio = document.querySelectorAll('.effects__radio');
  var effectList = document.querySelector('.effects__list');
  var textHashtags = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');
  var messageElement;

  // Закрытие формы загрузки изображения по ESC
  var onKeyCloseUploadImageForm = function (evt) {
    window.util.isEscFormEvent(evt, onCloseUploadImageForm);
  };

  // Закрытие формы загрузки изображения по ESC
  var onKeyCloseMessageInForm = function (evt) {
    window.util.isEscFormEvent(evt, onCloseMessageInForm);
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

  // Добавляем события на эффекты
  var onAddEffectRadio = function () {
    effectRadio.forEach(function (element) {
      element.addEventListener('change', onChangeEffectRadio);
    });
  };

  // Удаляем события на эффекты
  var deleteEffectRadio = function () {
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

  var clearDataForm = function () {
    window.slider.reset('all');
    uploadForm.reset();
  };

  // Функция отключения события при закрытии формы
  var disableEventsListener = function () {
    closeUploadImageForm.removeEventListener('click', onCloseUploadImageForm);
    scaleControlSmaller.removeEventListener('click', onChangeScaleControl);
    scaleControlBigger.removeEventListener('click', onChangeScaleControl);
    document.removeEventListener('keydown', onKeyCloseUploadImageForm);
    deleteEffectRadio();
    uploadForm.removeEventListener('submit', onSubmitImageForm);
    uploadSubmitButton.removeEventListener('click', onSubmitImageForm);
    uploadSubmitButton.removeEventListener('keydown', onEnterSubmitImageForm);
    effectLevelPin.removeEventListener('mousedown', window.slider.move);
    bodyElement.classList.remove('modal-open');
  };

  var onCloseMessageInForm = function () {
    window.util.removeChild(messageElement);
    messageElement.remove();
    document.removeEventListener('click', onCloseMessageInForm);
    document.removeEventListener('keydown', onKeyCloseMessageInForm);
  };

  var showMessageInForm = function (status, message) {
    var fragment = document.createDocumentFragment();
    var messageTemplate = document.querySelector('#' + status)
      .content
      .querySelector('.' + status);
    messageElement = messageTemplate.cloneNode(true);
    messageElement.querySelector('.' + status + '__title').textContent = message;
    messageElement.style.zIndex = 10;
    fragment.appendChild(messageElement);
    document.querySelector('main').appendChild(fragment);
    document.addEventListener('click', onCloseMessageInForm);
    document.addEventListener('keydown', onKeyCloseMessageInForm);
  };

  var onSuccessSave = function (data, successMessage) {
    onCloseUploadImageForm();
    showMessageInForm('success', successMessage);
  };

  var onErrorSave = function (errorMessage) {
    showMessageInForm('error', errorMessage);
  };

  var onSubmitImageForm = function (evt) {
    if (validateHashtags() && validateComment()) {
      window.backend.save(new FormData(uploadForm), onSuccessSave, onErrorSave);
      evt.preventDefault();
    }
  };

  var onCloseUploadImageForm = function () {
    uploadFileInput.addEventListener('change', onChangeUploadFile);
    disableEventsListener();
    clearDataForm();
    uploadImageOverlay.classList.add('hidden');
  };

  var addOpenFormEvents = function () {
    window.slider.reset('all');
    imgEffectSlider.classList.add('hidden');
    uploadImageOverlay.classList.remove('hidden');
    bodyElement.classList.add('modal-open');
    document.addEventListener('keydown', onKeyCloseUploadImageForm);
    uploadFileInput.removeEventListener('change', onChangeUploadFile);
    closeUploadImageForm.addEventListener('click', onCloseUploadImageForm);
    scaleControlSmaller.addEventListener('click', onChangeScaleControl);
    scaleControlBigger.addEventListener('click', onChangeScaleControl);
    onAddEffectRadio();
    effectLevelPin.addEventListener('mousedown', window.slider.move);
    uploadForm.addEventListener('submit', onSubmitImageForm);
    uploadSubmitButton.addEventListener('click', onSubmitImageForm);
    uploadSubmitButton.addEventListener('keydown', onEnterSubmitImageForm);
  };

  // Открываем форму загрузки изображения
  var onChangeUploadFile = function () {
    var file = uploadFileInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imageUploadPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
      addOpenFormEvents();
    }
  };

  uploadFileInput.addEventListener('change', onChangeUploadFile);

  window.form = {
    setEffectLevel: setEffectLevel
  };
})();
