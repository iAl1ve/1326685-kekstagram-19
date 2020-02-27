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
  var bigPictureCountComments = document.querySelector('.social__comment-count');
  var bigPictureComments = document.querySelector('.social__comments');
  var commentsLoader = document.querySelector('.comments-loader');
  var arrComments = [];
  var countCommentsRender;

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

  var addCommentsPicture = function (comments) {
    var fragment = document.createDocumentFragment();
    var fragmentCountComments = document.createDocumentFragment();
    var countComments = comments.length > COMMENTS_COUNT ? COMMENTS_COUNT : comments.length;
    countCommentsRender += countComments;
    for (var i = 0; i < countComments; i++) {
      fragment.appendChild(renderComments(comments.shift()));
    }

    var commentsCountSpan = bigPictureCountComments.querySelector('.comments-count');
    // Удаляем содержимое блока количества комментариев и генерируем новое
    window.util.removeChild(bigPictureCountComments);
    fragmentCountComments.textContent = countCommentsRender + ' из ';
    fragmentCountComments.appendChild(commentsCountSpan);
    fragmentCountComments.innerHtml = fragmentCountComments.innerHtml + ' комментариев';

    // Показываем все блоки
    bigPictureCountComments.appendChild(fragmentCountComments);
    bigPictureComments.appendChild(fragment);
  };

  var onLoadMoreComments = function () {
    addCommentsPicture(arrComments);
    if (arrComments.length === 0) {
      commentsLoader.classList.add('hidden');
    }
  };

  // Подгружаем больше комментариев по ENTER
  var onLoadEnterMoreComments = function (evt) {
    window.util.isEnterEvent(evt, onLoadMoreComments);
  };

  // Показываем первые комментарии к фотографии
  var showCommentsPicture = function (comments) {
    arrComments = comments.slice();
    countCommentsRender = 0;
    // Удаляем все комментарии из шаблона и показываем сгенерированные
    window.util.removeChild(bigPictureComments);

    if (comments.length > COMMENTS_COUNT) {
      commentsLoader.classList.remove('hidden');
    } else {
      commentsLoader.classList.add('hidden');
    }

    bigPictureCountComments.querySelector('.comments-count').textContent = comments.length;

    addCommentsPicture(arrComments);
  };

  // Показываем фотографию в полноразмерном режиме
  var showBigPicture = function (currentPhoto) {
    bigPictureImg.querySelector('img').src = currentPhoto.url;

    bigPictureLike.textContent = currentPhoto.like;
    bigPictureDescription.textContent = currentPhoto.description;

    showCommentsPicture(currentPhoto.comments);

    commentsLoader.addEventListener('click', onLoadMoreComments);
    commentsLoader.addEventListener('keydown', onLoadEnterMoreComments);

    bigPicture.classList.remove('hidden');
    bodyElement.classList.add('modal-open');
  };

  // Показываем фотографию в полноразмерном режиме
  var onOpenBigPicture = function (evt) {
    var element;
    if (evt.target.className === 'picture__img') {
      element = evt.target.parentElement;
    } else if (evt.target.className === 'picture') {
      element = evt.target;
    }

    if (evt.target.className === 'picture__img' || evt.target.className === 'picture') {
      document.addEventListener('keydown', onEscPressBigPicture);
      bigPictureClose.addEventListener('click', onCloseBigPicture);
      userListPictures.removeEventListener('keydown', onOpenEnterBigPicture);

      var currentPhoto = (window.picture.photos).find(function (photo) {
        return photo.url === element.querySelector('.picture__img').getAttribute('src');
      });

      showBigPicture(currentPhoto);
    }
  };

  // Открытие большой фотографию по ENTER
  var onOpenEnterBigPicture = function (evt) {
    window.util.isEnterEvent(evt, onOpenBigPicture);
  };

  // Функции закрытия полноразмернго режима для просмотра фотографии
  var onCloseBigPicture = function () {
    bigPicture.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscPressBigPicture);
    bigPictureClose.removeEventListener('click', onCloseBigPicture);
    commentsLoader.removeEventListener('click', onLoadMoreComments);
    commentsLoader.removeEventListener('keydown', onLoadEnterMoreComments);
    userListPictures.addEventListener('keydown', onOpenEnterBigPicture);
  };

  var onEscPressBigPicture = function (evt) {
    window.util.isEscEvent(evt, onCloseBigPicture);
  };

  userListPictures.addEventListener('click', onOpenBigPicture);
  userListPictures.addEventListener('keydown', onOpenEnterBigPicture);
})();
