'use strict';

(function () {
  var COUNT_IMG = 25;
  var ERROR_STYLE_TEXT = 'position: absolute; left: 0%; right: 0%;z-index: 100; margin: 0 auto; height: auto; text-align: center; line-height: 1.2em; background-color: red; padding: 6px 0px;';
  var ERROR_STYLE_FONTSIZE = '26px';
  var photos = [];
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

  // Показываем изображения и добавляем в массив для отображения
  var onSuccessLoad = function (pictures) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < COUNT_IMG; i++) {
      fragment.appendChild(renderPicture(pictures[i]));
      photos.push({
        url: pictures[i].url,
        description: pictures[i].description,
        likes: pictures[i].like,
        comments: pictures[i].comments
      });
    }
    userListPictures.appendChild(fragment);
  };

  var onErrorLoad = function (errorMessage) {
    var node = document.createElement('div');
    node.style = ERROR_STYLE_TEXT;
    node.style.fontSize = ERROR_STYLE_FONTSIZE;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onSuccessLoad, onErrorLoad);

  window.picture = {
    photos: photos
  };
})();
