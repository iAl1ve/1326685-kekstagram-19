'use strict';

var COUNT_IMG = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_AVATAR_COUNT = 1;
var MAX_AVATAR_COUNT = 6;
var AVATAR_SIZE = 35; // Размер фотографии аватарки комментатора
var KEY_ESC = 27;
var KEY_ENTER = 13;
var SCALE_STEP = 25;
var HASHTAG_COUNT = 5;
var HASHTAG_LENGTH = 20;
var COMMENTS_LENGTH = 140;

var COMMENT_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var COMMENT_SURNAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];

var messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var descriptions = [
  'описание фотографии 1',
  'описание фотографии 2',
  'описание фотографии 3',
  'описание фотографии 4',
  'описание фотографии 5'];

// Генерируем случайное целое число в диапазоне, включая минимальное и максимальное, для генерации свойств персонажа
var getRandomIntegerInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var userComments = [
  {
    avatar: 'img/avatar-' + getRandomIntegerInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: messages[getRandomIntegerInRange(0, messages.length - 1)],
    name: COMMENT_NAMES[getRandomIntegerInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomIntegerInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomIntegerInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: messages[getRandomIntegerInRange(0, messages.length - 1)],
    name: COMMENT_NAMES[getRandomIntegerInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomIntegerInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomIntegerInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: messages[getRandomIntegerInRange(0, messages.length - 1)],
    name: COMMENT_NAMES[getRandomIntegerInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomIntegerInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomIntegerInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: messages[getRandomIntegerInRange(0, messages.length - 1)],
    name: COMMENT_NAMES[getRandomIntegerInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomIntegerInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomIntegerInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: messages[getRandomIntegerInRange(0, messages.length - 1)],
    name: COMMENT_NAMES[getRandomIntegerInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomIntegerInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomIntegerInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: messages[getRandomIntegerInRange(0, messages.length - 1)],
    name: COMMENT_NAMES[getRandomIntegerInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomIntegerInRange(0, COMMENT_SURNAMES.length - 1)]
  }
];

var userListPictures = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var bodyElement = document.querySelector('body');
var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = document.querySelector('#picture-cancel');
var bigPictureImg = document.querySelector('.big-picture__img');
var bigPictureLike = document.querySelector('.likes-count');
var bigPictureDescription = document.querySelector('.social__caption');
var bigPictureComments = document.querySelector('.social__comments');
var bigPictureCountComments = document.querySelector('.comments-count');
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


// Cкрываем по условию блок счётчика комментариев и загрузки новых
document.querySelector('.social__comment-count').classList.add('hidden');
document.querySelector('.comments-loader').classList.add('hidden');

// Перемешиваем комментарии для изображений
var shuffleComments = function (arrComments) {
  for (var i = 0; i < arrComments.length - 1; i++) {
    var j = getRandomIntegerInRange(0, arrComments.length - 1);
    var buffer = arrComments[i];
    arrComments[i] = arrComments[j];
    arrComments[j] = buffer;
  }

  return arrComments;
};

// Получим новый случайный массив с комметариями
var getRandomComments = function (arrComments) {
  // Перемешиваем комментарии
  arrComments = shuffleComments(arrComments);

  var newArrComments = arrComments.slice(0, getRandomIntegerInRange(1, arrComments.length - 1));

  return newArrComments;
};

// Создаем массив из 25(COUNT_IMG) сгенерированных JS объектов изображений, начинаем с 1 из-за изображений
var createPhotos = function (arrPhotos) {
  for (var i = 1; i <= COUNT_IMG; i++) {
    arrPhotos.push({
      url: 'photos/' + i + '.jpg',
      description: descriptions[getRandomIntegerInRange(0, descriptions.length - 1)],
      likes: getRandomIntegerInRange(MIN_LIKES, MAX_LIKES),
      comments: getRandomComments(userComments)
    });
  }

  return arrPhotos;
};

// Генерируем изображения
var renderPicture = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__img').alt = photo.description;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};

// Добавляем изображения в контейнер для отображения
var addListPicture = function (listPictures) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < COUNT_IMG; i++) {
    fragment.appendChild(renderPicture(photos[i]));
  }

  listPictures.appendChild(fragment);
};

// Удаляем всех детей родительского элемента
var removeChildOfParrent = function (elementParrent) {
  while (elementParrent.firstChild) {
    elementParrent.removeChild(elementParrent.firstChild);
  }
};

// Показываем комментарии для большого изображения
var renderComments = function (comment) {

  var newComment = document.createElement('li');
  newComment.classList.add('social__comment');

  var newAvatarPicture = document.createElement('img');
  newAvatarPicture.classList.add('social__picture');
  newAvatarPicture.src = comment.avatar;
  newAvatarPicture.alt = comment.name;
  newAvatarPicture.width = AVATAR_SIZE;
  newAvatarPicture.height = AVATAR_SIZE;

  var newCommentText = document.createElement('p');
  newCommentText.classList.add('social__text');
  newCommentText.textContent = comment.message;

  newComment.appendChild(newAvatarPicture);
  newComment.appendChild(newCommentText);

  return newComment;
};

// Показываем все комментарии к фотографии
var showCommentsPicture = function (comments) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < comments.length; i++) {
    fragment.appendChild(renderComments(comments[i]));
  }

  bigPictureComments.appendChild(fragment);
};

// Показываем фотографию в полноразмерном режиме
var showBigPicture = function (currentPhoto) {
  bigPictureImg.querySelector('img').src = currentPhoto.url;

  bigPictureLike.textContent = currentPhoto.like;
  bigPictureDescription.textContent = currentPhoto.description;
  bigPictureCountComments.textContent = currentPhoto.comments.length;

  // Удаляем все комментарии из шаблона и показываем сгенерированные
  removeChildOfParrent(bigPictureComments);
  showCommentsPicture(currentPhoto.comments);

  bigPicture.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
};

// Показываем фотографию в полноразмерном режиме
var openBigPicture = function (evt) {
  // Получим заново список всех сгенерированных изображений
  var picturesArr = userListPictures.querySelectorAll('.picture');
  var element;
  var arr = Array.from(picturesArr);
  if (evt.target.className === 'picture__img') {
    element = evt.target.parentElement;
  } else if (evt.target.className === 'picture') {
    element = evt.target;
  }

  if (evt.target.className === 'picture__img' || evt.target.className === 'picture') {
    document.addEventListener('keydown', onEscPressBigPicture);
    bigPictureClose.addEventListener('click', onCloseBigPicture);
    userListPictures.removeEventListener('keydown', openEnterBigPicture);
    showBigPicture(photos[arr.indexOf(element)]);
  }
};

// Открытие большой фотографию по ENTER
var openEnterBigPicture = function (evt) {
  if (evt.keyCode === KEY_ENTER) {
    openBigPicture();
  }
};

// Функции закрытия полноразмернго режима для просмотра фотографии
var onCloseBigPicture = function () {
  bigPicture.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscPressBigPicture);
  bigPictureClose.removeEventListener('click', onCloseBigPicture);
  userListPictures.addEventListener('keydown', openEnterBigPicture);
};

var onEscPressBigPicture = function (evt) {
  if (evt.keyCode === KEY_ESC) {
    onCloseBigPicture();
  }
};

// Закрытие формы загрузки изображения по ESC
var onKeyCloseUploadImageForm = function (evt) {
  if (evt.target.className !== textHashtags.className && evt.target.className !== textDescription.className) {
    if (evt.keyCode === KEY_ESC) {
      onCloseUploadImageForm();
    }
  }
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
  if (evt.keyCode === KEY_ENTER) {
    onSubmitImageForm();
  }
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

var startApp = function () {
  addListPicture(userListPictures);
  uploadFileInput.addEventListener('change', onChangeUploadFile);
  userListPictures.addEventListener('click', openBigPicture);
  userListPictures.addEventListener('keydown', openEnterBigPicture);

};

var photos = [];
createPhotos(photos);

startApp();

