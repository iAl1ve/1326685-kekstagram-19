'use strict';

var COUNT_IMG = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_AVATAR_COUNT = 1;
var MAX_AVATAR_COUNT = 6;
var AVATAR_SIZE = 35;

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
var bigPictureImg = document.querySelector('.big-picture__img');
var bigPictureLike = document.querySelector('.likes-count');
var bigPictureDescription = document.querySelector('.social__caption');
var bigPictureComments = document.querySelector('.social__comments');
var bigPictureCountComments = document.querySelector('.comments-count');

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

var showBigPicture = function (currentPhoto) {
  bigPictureImg.querySelector('img').src = currentPhoto.url;

  bigPictureLike.textContent = currentPhoto.like;
  bigPictureDescription.textContent = currentPhoto.description;
  bigPictureCountComments.textContent = currentPhoto.comments.length;

  // Удаляем все комментарии из шаблона и показываем сгенерированные
  removeChildOfParrent(bigPictureComments);
  showCommentsPicture(currentPhoto.comments);

  // Cкрываем по условию блок счётчика комментариев и загрузки новых
  document.querySelector('.social__comment-count').classList.add('hidden');
  document.querySelector('.comments-loader').classList.add('hidden');
};

var photos = [];
createPhotos(photos);
var currentBigPhoto = photos[0];

addListPicture(userListPictures);
showBigPicture(currentBigPhoto);

bigPicture.classList.remove('hidden');
bodyElement.classList.add('modal-open');
