'use strict';

(function () {
  var KEY_ESC = 27;
  var KEY_ENTER = 13;
  var DEBOUNCE_INTERVAL = 500;

  var textHashtags = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');

  // Закрытие формы по нажатию ESC
  var onEscPressForm = function (evt, action) {
    if (evt.target.className !== textHashtags.className && evt.target.className !== textDescription.className) {
      if (evt.keyCode === KEY_ESC) {
        action();
      }
    }
  };

  // Закрытие формы по нажатию ESC
  var onEscPress = function (evt, action) {
    if (evt.keyCode === KEY_ESC) {
      action();
    }
  };

  var onEnterPress = function (evt, action) {
    if (evt.keyCode === KEY_ENTER) {
      action();
    }
  };

  // Удаляем всех детей родительского элемента
  var removeChildOfParent = function (elementParent) {
    while (elementParent.firstChild) {
      elementParent.removeChild(elementParent.firstChild);
    }
  };

  var onDebounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  // Генерируем случайное целое число в диапазоне, включая минимальное и максимальное, для генерации свойств персонажа
  var getRandomIntegerInRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var onShuffleArr = function (arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      var j = getRandomIntegerInRange(0, arr.length - 1);
      var buffer = arr[i];
      arr[i] = arr[j];
      arr[j] = buffer;
    }

    return arr;
  };

  window.util = {
    isEscEvent: onEscPress,
    isEscFormEvent: onEscPressForm,
    isEnterEvent: onEnterPress,
    debounce: onDebounce,
    shuffle: onShuffleArr,
    removeChild: removeChildOfParent
  };
})();
