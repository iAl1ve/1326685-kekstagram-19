'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';

  var StatusCode = {
    OK: 200,
    INVALID_REQUEST: 400,
    NOT_FOUND: 404
  };
  var TIMEOUT_IN_MS = 10000;
  var READY_STATE_LOAD = 4;

  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK && xhr.readyState === READY_STATE_LOAD) {
        onLoad(xhr.response);
      } else {
        onError('Фотографии не смогли загрузиться с сервера. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      var error;
      switch (xhr.status) {
        case StatusCode.INVALID_REQUEST:
          error = 'Неверный запрос ';
          break;
        case StatusCode.NOT_FOUND:
          error = 'Ничего не найдено ';
          break;
        default:
          error = 'Ошибка соединения с сервером: ';
      }
      onError(error + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = {
    load: loadData
  };

})();
