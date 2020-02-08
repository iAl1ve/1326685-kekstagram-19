'use strict';

(function () {
  var COUNT_IMG = 25;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_AVATAR_COUNT = 1;
  var MAX_AVATAR_COUNT = 6;

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

  var photos = [];

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

  createPhotos(photos);

  window.data = {
    photos: photos,
    countImg : COUNT_IMG
  };

})();
