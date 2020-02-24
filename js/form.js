'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var bodyElement = document.querySelector('body');

  var uploadFileInput = document.querySelector('#upload-file');
  var uploadImageOverlay = document.querySelector('.img-upload__overlay');
  var closeUploadImageForm = document.querySelector('#upload-cancel');
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadSubmitButton = document.querySelector('#upload-submit');
  var imageUploadPreview = document.querySelector('.img-upload__preview img');
  var imgEffectSlider = document.querySelector('.img-upload__effect-level');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectRadio = document.querySelectorAll('.effects__radio');
  var scaleControlSmaller = document.querySelector('.scale__control');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
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

  // Добавляем события на эффекты
  var onAddEffectRadio = function () {
    effectRadio.forEach(function (element) {
      element.addEventListener('change', window.formEffects.change);
    });
  };

  // Удаляем события на эффекты
  var deleteEffectRadio = function () {
    effectRadio.forEach(function (element) {
      element.removeEventListener('change', window.formEffects.change);
    });
  };

  // Отправка формы по ENTER
  var onEnterSubmitImageForm = function (evt) {
    window.util.isEnterEvent(evt, onSubmitImageForm);
  };

  var clearDataForm = function () {
    window.slider.reset('all');
    textHashtags.setCustomValidity('');
    textDescription.setCustomValidity('');
    uploadForm.reset();
  };

  // Функция отключения события при закрытии формы
  var disableEventsListener = function () {
    closeUploadImageForm.removeEventListener('click', onCloseUploadImageForm);
    scaleControlSmaller.removeEventListener('click', window.formEffects.scaleControl);
    scaleControlBigger.removeEventListener('click', window.formEffects.scaleControl);
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
    if (window.validate.hashtags() && window.validate.comment()) {
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
    scaleControlSmaller.addEventListener('click', window.formEffects.scaleControl);
    scaleControlBigger.addEventListener('click', window.formEffects.scaleControl);
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
})();
