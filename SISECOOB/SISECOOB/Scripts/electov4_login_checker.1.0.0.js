/**
 * Los comentarios agregados se elimiaran automaticamente con la
 * compresion del bundling de ASP.NET no hace falta quitarlos
 */
$(function () {
  /**
   * Solo se ejecuta su hay un modal donde mostrar información
   */
   var $modal = $("#conflicto_sesion");
    if ($modal.length) {
      var $devices = $("#devices_sesion"),
          pnotify = {
            dom: undefined,
            tipo: undefined,
            visible: false,
            remember: false
          };

      var electov4Sess = Sess({
        proyect: "electov4",  // proyect name
        distance: 3,          // minutes between requests
        sessionTolerance: 5,  // session minutes tolerance
        url: {                // urls declaration
          others: "/Control/Others",
          clean: "/Control/Clean",
          check: "/Control/Check",
        },
        /**
         * Informa al usuario que hay otros dispositivos con una sesion
         * activa con las mismas credenciales, dandole opcion de cerrar
         * las demas sesiones
         */
        conflict: function() {
          if (!pnotify.visible || (pnotify.visible && pnotify.tipo !== "conflict")) {
            var no_bother = electov4Sess.bother.get();

            if (no_bother !== null && no_bother === false) {
              return false;
            }

            $.pnotify_remove_all();
            pnotify.tipo = "conflict";
            pnotify.visible = true;
            pnotify.dom = $.pnotify({
              title: "Conflicto",
              text: "Otros equipos mantienen sesión activa con su usuario. Haga clic en esta notificación para mas detalles",
              type: "warning",
              history: false,
              hide: false,
              before_close: function (PNotify) {
                if (!$devices.is(":visible")) {
                  pnotify.visible = false;
                }
              }
            });
            pnotify.dom.on("click", function () {
              if (!$devices.is(":visible")) {
                electov4Sess.othersInfo();
              }
            });
          }
        },
        /**
         * Muestra en pantalla la informacion de los otros dispositivos que
         * mantienen la sesion activa con las mismas credenciales
         */
        othersInfo: function (msg) {
          $devices.empty();

          if (msg instanceof Array) {
            if (msg.length) {
              msg.forEach(function (e, i) {
                var ua = new UAParser(e.sg);
                var $dev = $("<div>", { "class": "device_session", "style": "padding-top:15px" });
                $dev.append("<div><b>Sistema Operativo:</b> " + ua.getOS().name + " " + ua.getOS().version + "</div>")
                    .append("<div><b>Navegador:</b> " + ua.getBrowser().name + " " + ua.getBrowser().version + "</div>")
                    .append("<div><b>IP:</b> " + e.ip + "</div>")
                    .append("<div><b>Ultimo Acceso:</b> " + e.tm + "</div>");
                $devices.append($dev);
              });
            } else {
              $devices.append("<br><br>Al parecer las demas sesiones se han cerrado, no es necesario realizar otra acción.");
            }
          } else {
            $devices.append("<br><br>Uh, parece que su sesión terminó. Inicie sesión nuevamente");
          }

          $modal.modal("show");
        },
        /**
         * Todo correcto
         */
        correct: function() {
          if (pnotify.visible) {
            $.pnotify_remove_all();
            pnotify.visible = false;
          }
        },
        /**
         * Informa al usuario que la sesion ha expirado
         * explicando la razon de ello
         */
        sessionExpired: function(msg) {
          var text = msg === "3" ?
              "La sesión ha caducado, inicie sesión nuevamente" :
              "Otra persona inició sesion con su mismo usuario";

          if (!pnotify.visible || (pnotify.visible && pnotify.tipo !== "session_end")) {
            $.pnotify_remove_all();
            pnotify.tipo = "session_end";
            pnotify.visible = true;
            pnotify.dom = $.pnotify({
              title: "Sesión Terminada",
              text: text,
              type: "warning",
              history: false,
              hide: false
            });
          }
        },
        /**
         * Se ejecuta al cerrar todas las demas sesiones
         */
        clean: function() {
          $.pnotify_remove_all();
          pnotify.visible = false;
          AlertSuccess("Se cerraron las demas sesiones correctamente", "Correcto");
          $modal.modal("hide");
        }
      });

      $modal.find(".ok").click(function () {
        if (confirm("No se mostrará este mensaje en el futuro, esta seguro de esto?")) {
          electov4Sess.bother.set(false);
          $.pnotify_remove_all();
          pnotify.visible = false;
          $modal.modal("hide");
        }
      });
      $modal.on("hidden.bs.modal", function () {
        if (!pnotify.dom.is(":visible"))
          pnotify.visible = false;
      });
      $modal.find(".cerrar").click(electov4Sess.clean);

      // expose API to DOM
      window.electov4Sess = electov4Sess;
    }
});
