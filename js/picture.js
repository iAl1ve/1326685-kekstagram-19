'use strict';

(function () {
  var userListPictures = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

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

    for (var i = 0; i < window.data.countImg; i++) {
      fragment.appendChild(renderPicture(window.data.photos[i]));
    }

    listPictures.appendChild(fragment);
  };

  addListPicture(userListPictures);
})();
