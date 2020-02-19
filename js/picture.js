'use strict';

(function () {
  var COUNT_IMG = 25;
  var COUNT_IMG_RANDOM = 10;
  var ERROR_STYLE_TEXT = 'position: absolute; left: 0%; right: 0%;z-index: 100; margin: 0 auto; height: auto; text-align: center; line-height: 1.2em; background-color: red; padding: 6px 0px;';
  var ERROR_STYLE_FONTSIZE = '26px';
  var defaultPhotos = [];
  var randomPhotos = [];
  var discussedPhotos = [];
  var userListPictures = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var imgFilters = document.querySelector('.img-filters');
  var filterRandom = document.querySelector('#filter-random');
  var filterDiscussed = document.querySelector('#filter-discussed');

  // Генерируем изображения
  var renderPicture = function (photo) {
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__img').alt = photo.description;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

    return photoElement;
  };

  var updatePictures = function (photos) {
    var fragment = document.createDocumentFragment();
    var allPictures = document.querySelectorAll('.picture');

    allPictures.forEach(function (element) {
      element.remove();
    });
    var count = photos.length > COUNT_IMG ? COUNT_IMG : photos.length;
    for (var i = 0; i < count; i++) {
      fragment.appendChild(renderPicture(photos[i]));
    }
    userListPictures.appendChild(fragment);
  };

  var showRandomPhotos = function () {
    randomPhotos = window.util.shuffle(defaultPhotos.slice()).slice(0, COUNT_IMG_RANDOM);

    updatePictures(randomPhotos);
  };

  var showDiscussedPhotos = function () {
    discussedPhotos = defaultPhotos.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });

    updatePictures(discussedPhotos);
  };

  var onApplyFilterEvent = window.util.debounce(function (evt) {
    if (evt.target.classList.contains('img-filters__button')) {
      var currentFilterButton = imgFilters.querySelector('.img-filters__button--active');
      currentFilterButton.classList.remove('img-filters__button--active');

      switch (evt.target) {
        case filterRandom:
          showRandomPhotos();
          break;
        case filterDiscussed:
          showDiscussedPhotos();
          break;
        default:
          updatePictures(defaultPhotos);
      }
      evt.target.classList.add('img-filters__button--active');
    }
  });

  // Показываем изображения и добавляем в массив для отображения
  var onSuccessLoad = function (pictures) {
    pictures.forEach(function (element, index) {
      defaultPhotos.push({
        url: element.url,
        description: element.description,
        likes: element.likes,
        comments: element.comments,
        id: index
      });
    });
    updatePictures(pictures);

    imgFilters.classList.remove('img-filters--inactive');
    imgFilters.addEventListener('click', onApplyFilterEvent);
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
    photos: defaultPhotos
  };
})();
