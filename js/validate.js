'use strict';

(function () {
  var HASHTAG_COUNT = 5;
  var HASHTAG_LENGTH = 20;
  var COMMENTS_LENGTH = 140;

  var textHashtags = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');

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

    if (hashtags.length > HASHTAG_COUNT) {
      errorMessage += 'Нельзя указать больше ' + HASHTAG_COUNT + ' хэш-тегов. ';
    } else if (findDuplicateHashtags(hashtags)) {
      errorMessage += 'Один и тот же хэш-тег не может быть использован дважды. ';
    }

    hashtags.forEach(function (hashtag) {
      switch (true) {
        case (hashtag.length > HASHTAG_LENGTH) :
          errorMessage += 'Максимальная длина одного хэш-тега 20 символов, включая решётку. ';
          break;
        case (hashtag === '#') :
          errorMessage += 'Хеш-тег не может состоять только из одной решётки. ';
          break;
        case (hashtag[0] !== '#' && hashtag.length > 0) :
          errorMessage += 'Хэш-тег должен начинаться с символа # (решётка). ';
          break;
        case (/[^a-zA-Z0-9А-Яа-я]/.test(hashtag.substr(1, (hashtag.length - 1)))) :
          errorMessage += 'Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т.п.), символы пунктуации (тире, дефис, запятая и т.п.), эмодзи и т.д. ';
          break;
      }
    });

    var validate = errorMessage.length > 1 ? false : true;
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

  window.validate = {
    hashtags: validateHashtags,
    comment: validateComment
  };
})();
