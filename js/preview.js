'use strict';

(function () {
  var AVATAR_SIZE = 35;
  var COMMENTS_COUNT = 5;

  var bodyElement = document.querySelector('body');
  var userListPictures = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = document.querySelector('#picture-cancel');
  var bigPictureImg = document.querySelector('.big-picture__img');
  var bigPictureLike = document.querySelector('.likes-count');
  var bigPictureDescription = document.querySelector('.social__caption');
  var bigPictureCountComments = document.querySelector('.comments-count');
  var bigPictureComments = document.querySelector('.social__comments');

  // Cкрываем по условию блок счётчика комментариев и загрузки новых
  document.querySelector('.social__comment-count').classList.add('hidden');
  document.querySelector('.comments-loader').classList.add('hidden');

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
    var countComments = comments.length > COMMENTS_COUNT ? COMMENTS_COUNT : comments.length;
    for (var i = 0; i < countComments; i++) {
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
    window.util.removeChild(bigPictureComments);
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
      showBigPicture(window.picture.photos[arr.indexOf(element)]);
    }
  };

  // Открытие большой фотографию по ENTER
  var openEnterBigPicture = function (evt) {
    window.util.isEnterEvent(evt, openBigPicture);
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
    window.util.isEscEvent(evt, onCloseBigPicture);
  };

  userListPictures.addEventListener('click', openBigPicture);
  userListPictures.addEventListener('keydown', openEnterBigPicture);
})();
