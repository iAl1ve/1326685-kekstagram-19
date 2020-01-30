'use strict';

var COUNT_IMG = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_AVATAR_COUNT = 1;
var MAX_AVATAR_COUNT = 6;

var COMMENT_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var COMMENT_SURNAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];

var message = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var description = [
  'описание фотографии 1',
  'описание фотографии 2',
  'описание фотографии 3',
  'описание фотографии 4',
  'описание фотографии 5'];

// Генерируем случайное целое число в диапазоне, включая минимальное и максимальное, для генерации свойств персонажа
var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var userComment = [
  {
    avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: message[getRandomInRange(0, message.length - 1)],
    name: COMMENT_NAMES[getRandomInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: message[getRandomInRange(0, message.length - 1)],
    name: COMMENT_NAMES[getRandomInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: message[getRandomInRange(0, message.length - 1)],
    name: COMMENT_NAMES[getRandomInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: message[getRandomInRange(0, message.length - 1)],
    name: COMMENT_NAMES[getRandomInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: message[getRandomInRange(0, message.length - 1)],
    name: COMMENT_NAMES[getRandomInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomInRange(0, COMMENT_SURNAMES.length - 1)]
  },
  {
    avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT) + '.svg',
    message: message[getRandomInRange(0, message.length - 1)],
    name: COMMENT_NAMES[getRandomInRange(0, COMMENT_NAMES.length - 1)] + ' ' + COMMENT_SURNAMES[getRandomInRange(0, COMMENT_SURNAMES.length - 1)]
  }
];

var userListPictures = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

// Перемешиваем комментарии для изображений
var shuffleComments = function (arrComments) {
  for (var i = 0; i < arrComments.length - 1; i++) {
    var j = getRandomInRange(0, arrComments.length - 1);
    var buffer = arrComments[i];
    arrComments[i] = arrComments[j];
    arrComments[j] = buffer;
  }

  return arrComments;
};

// Получим новый случай массив с комметариями
var getRandomComments = function (arrComments) {
  // Перешаем комментарии
  arrComments = shuffleComments(arrComments);

  var newArrComments = arrComments.slice(0, getRandomInRange(1, arrComments.length - 1));

  return newArrComments;
};

// Создаем массив из 25(COUNT_IMG) сгенерированных JS объектов изображений, начинаем с 1 из-за изображений
var createPhotos = function (arrPhotos) {
  for (var i = 1; i <= COUNT_IMG; i++) {
    arrPhotos.push({
      url: 'photos/' + i + '.jpg',
      description: description[getRandomInRange(0, description.length - 1)],
      likes: getRandomInRange(MIN_LIKES, MAX_LIKES),
      comments: getRandomComments(userComment)
    });
  }

  return arrPhotos;
};

// Генеруем изображения
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

var photos = [];
createPhotos(photos);

addListPicture(userListPictures);
