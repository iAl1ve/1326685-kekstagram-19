'use strict';

window.util = function () {
  var KEY_ESC = 27;
  var KEY_ENTER = 13;

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

  return {
    isEscEvent: onEscPress,
    isEscFormEvent: onEscPressForm,
    isEnterEvent: onEnterPress,
    removeChild: removeChildOfParent
  };
}();
