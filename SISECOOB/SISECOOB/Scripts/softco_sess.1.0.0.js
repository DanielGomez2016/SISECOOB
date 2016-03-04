/*!
 * Softco (c) 2015
 *
 * Sess 1.0.0
 * ult. rev. 2015/Jun/8
 *
 * Permite controlar que los usuarios puedan ingresar al sistema
 * en un solo dispositivo o en varios dependiendo de la configuracion
 * del usuario.
 *
 * Los comentarios agregados se elimiaran automaticamente con la
 * compresion del bundling de ASP.NET no hace falta quitarlos manualmente
 */
var Sess = function (config) {
  'use strict';

  config = $.extend({
    proyect: "default",                   // nombre de proyecto
    distance: 3,                          // tiempo entre ping
    sessionTolerance: 5,                  // tiempo limite entre ping
    url: {
      others: "Control/Others",           // endpoint: informacion de otros
      clean: "Control/Clean",             // endpoint: cerrar otras sesiones
      check: "Control/Check",             // endpoint: verificar validez sesion
    },
    conflict: function () { },            // callback: mostrar burbuja de conflicto
    othersInfo: function () { },          // callback: mostrar info de otros
    correct: function () { },             // callback: limpiar burbujas, todo OK
    sessionExpired: function (code) { },  // callback: sesion terminada
    clean: function () { }                // callback: destruye otras sesiones
  }, config);

  var xhr,
      localkey = "__" + config.proyect + "_sess__",
      persist = {
        last_ping: new Date().toString(),
        bother: true,
        proyect: config.proyect
      };

  /**
   * Manejador simple de valores en localstorage(HTML5)
   */
  var manager = {
    retrieve: function (name) {
      var serialized = localStorage.getItem(name);
      try {
        return serialized ? JSON.parse(serialized) : undefined;
      } catch (Exception) {
        return undefined;
      }
    },
    save: function (name, value) {
      return localStorage.setItem(name, value);
    }
  };

  /**
   * Se guarda en localstorage(HTML5) el valor de la ultima peticion
   * al endpoint Control/Check
   */
  var last_ping = {
    set: function (value) {
      var localValue = manager.retrieve(localkey) || persist;
      localValue.last_ping = value;
      manager.save(localkey, JSON.stringify(localValue));
    },
    get: function () {
      var localValue = manager.retrieve(localkey);
      return localValue ? localValue.last_ping : undefined;
    },
    clear: function () {
      this.set("");
    },
    /**
     * Valida que el last_ping no sea mas viejo que config.sessionTolerance,
     * de ser asi el valor no es valido y por tanto se borra.
     * Esto es util cuando se inicia sesion despues de un periodo largo
     */
    validate: function (value) {
      if (!value)
        return false;

      var minutes_elapsed = (new Date() - new Date(value)) / 60000;
      return minutes_elapsed < config.sessionTolerance;
    }
  };

  /**
   * Se guarda en localstorage(HTML5) el valor de "bother". Si el valor es
   *   true:
   *     informa cuando se detecta otro
   *     dispositivo con mismas credenciales
   *   false:
   *     deja de informar acerca de otros dispositivos
   */
  var bother = {
    set: function (value) {
      var localValue = manager.retrieve(localkey) || persist;
      localValue.bother = value;
      manager.save(localkey, JSON.stringify(localValue));
    },
    get: function () {
      var localValue = manager.retrieve(localkey);
      return localValue ? localValue.bother : undefined;
    }
  };

  /**
   * Manejador de peticiones
   */
  var request = function (url, callback) {
    var data = manager.retrieve(localkey);

    if (xhr) {
      xhr.abort();
    }

    if (!$.isFunction(callback)) {
      callback = function () { };
    }

    if (data && !last_ping.validate(data.last_ping)) {
      data.last_ping = undefined;
      last_ping.clear();
    }

    xhr = $.ajax({
      url: url,
      data: data,
      method: "post",
      beforeSend: function () { },
      complete: function () { },
      error: function () { },
      success: callback
    });
  };

  /**
   * Flujo principal, revisa el resultado del controlador y
   * ejecuta un bloque de código dependiendo de la situacion
   */
  var check = function (msg) {
    last_ping.set(new Date().toString());

    // Todo correcto
    if (msg === "1") {
      config.correct();
    }

    // Otras personas con mismas credenciales
    else if (msg === "2") {
      config.conflict();
    }

    // Sesion terminada
    else if (msg === "3" || msg === "4") {
        config.sessionExpired(msg);

        // Desplegar login en modal
        loadLogin();
    }
  };

  /**
   * API para llamar el metodo de manera interna
   */
  var othersInfo = function () {
    $.post(config.url.others, config.othersInfo);
  };

  /**
   * Destruye otras sesiones
   */
  var clean = function () {
    $.post(config.url.clean, config.clean);
  };

  /**
   * Ejecuta la funcion check
   */
  var execute = function () {
    request(config.url.check, check);
  };


  /**
   * Carga el login en un modal para enviar que tenga que recargar la pagina
   */
  var loadLogin = function () {

      if (ConfirmDialog) {

          $.ajax({
              url: '/Account/LoginAjax',
              type: 'get',
              success: function (html) {
                  ConfirmDialog.show({
                      title: 'Iniciar sesión',
                      text: html,
                      negativeButton: false,
                      positiveButtonText: 'Iniciar sesión',
                      closeModalOnAction:false,
                      callback: function (result) {
                          if (result == true) {
                              loginSuccess = function () {
                                  $('#modalConfirm').modal('hide');
                              };

                              $('#modalConfirm form').submit();
                          }
                      }
                  });
              }
          });
      }
      else {
          location.reload();
      }
  };

  /**
   * Inicializa el proceso principal, regresa un objeto con
   * funciones internas(API) para manipular el proceso por fuera
   */
  var init = function () {
    execute();
    setInterval(execute, 1000 * 60 * config.distance);

    //public API
    return {
      // Destruye las sesiones
      clean: clean,
      // Regresa el objeto manejador de la propiedad bother
      bother: bother,
      // Envia la peticion y ejecuta el callback
      othersInfo: othersInfo
    };
  };


   

  // Se ejecuta y regresa el resultado de la funcion init
  return init();
};
