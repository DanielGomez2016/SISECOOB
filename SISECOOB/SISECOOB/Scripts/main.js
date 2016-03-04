/// <reference path="bootstrap.js" />
/// <reference path="bootstrap.js" />
var Alerta = function (mensaje, titulo, delay, tipo) {
    $.pnotify({
        title: titulo,
        text: mensaje,
        type: tipo,
        history: false,
        delay: delay
    });
}

var AlertError = function (mensaje, titulo, delay) {
    Alerta(mensaje, titulo, delay, 'error');
}

var AlertSuccess = function (mensaje, titulo, delay) {
    Alerta(mensaje, titulo, delay, 'success');
}

var AlertInfo = function (mensaje, titulo, delay) {
    Alerta(mensaje, titulo, delay, 'info');
}

var AlertWarning = function (mensaje, titulo, delay) {
    Alerta(mensaje, titulo, delay, 'warning');
}

var Loading = function (message, target) {
    /***
        Muestra/Oculta el loading. v1.6
    ***/
    var content = target == undefined ? document.body : target;
    var loading = $(content).find('#modal_loading');

    if (loading.length == 0) {
        $(content).append('<div id="modal_loading"><div class="bks"></div><div class="content"><img src="/content/images/ajax-loading.gif" /><div class="modal-body"> <p>Guardando registro</p></div> </div></div>');
        loading = $(content).find('#modal_loading');
    }
    if (message != undefined) {
        loading.show();
        loading.find('.modal-body').html(message);
    }
    else
        loading.hide();
}

String.prototype.format = function (data) {
    /***
        Imitar la función de c#. v1.5
    ***/

    var text = this;

    for (var index in data) {

        var pattern = '{' + index + '}';
        var valor = data[index];
        while (text.indexOf(pattern) != -1) {
            text = text.replace(pattern, valor == null || valor == undefined ? '' : valor);
        }

    }

    return text;
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

/*var getDateFromNet = function (myCSharpString) {
    var date = new Date(parseInt(myCSharpString.replace(/\/Date\((-?\d+)\)\//, '$1')));
    return date.getFullYear() + "/" +
           (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "/" +
           ((date.getUTCDate() < 9 ? '0' : '') + date.getUTCDate()) + ' ' +
           (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
           (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
           (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
}*/

var getDateFromNet = function (dateTime) {
    var date = new Date(parseInt(dateTime.substr(6)));
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = ("0" + date.getSeconds()).slice(-2);
    var miliseconds = date.getMilliseconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = ("0" + (hours ? hours : 12)).slice(-2);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ":" + seconds + " " + ampm;
    var formated = year + "/" + month + "/" + day + " " + strTime;
    return formated;
}


// Cargar municipios genérico
var cargarMunicipios = function (entidad, distritoFederal, callback) {
    $.ajax({
        url: '/Utilidades/CargarMunicipios',
        type: 'post',
        data: {
            entidad: entidad,
            distritoFederal: distritoFederal
        },
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (callback)
                callback(data);
            else
                console.warn('No se especifico una función para el retorno');
        }
    });
}

var cargarSecciones = function (entidad, municipio, distritoFederal, callback) {
    $.ajax({
        url: '/Utilidades/CargarSecciones',
        type: 'post',
        data: { entidad: entidad, municipio: municipio, distritoFederal: distritoFederal },
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (callback)
                callback(data);
            else
                console.warn('No se especifico una función para el retorno');
        }
    });
}

var cargarDistritosFederales = function (entidad, callback) {
    $.ajax({
        url: '/Utilidades/CargarDistritosFederales',
        type: 'post',
        data: { entidad: entidad },
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (callback)
                callback(data);
            else
                console.warn('No se especifico una función para el retorno');
        }
    });
}

var cargarRegiones = function (entidad, distritoFederal, callback) {
    $.ajax({
        url: '/Utilidades/CargarRegiones',
        type: 'post',
        data: { entidad: entidad, distritoFederal: distritoFederal },
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (callback)
                callback(data);
            else
                console.warn('No se especifico una función para el retorno');
        }
    });
}


var cargarPromotores = function (callback) {
    $.ajax({
        url: '/Promovidos/CargarPromotores',
        type: 'post',
        data: {},
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (callback)
                callback(data);
            else
                console.warn('No se especifico una función para el retorno');
        }
    });
}

var generarPromotores = function (selector, text, predef) {
    if (text == undefined || text == null || text == '')
        text = '';
    var select = $(selector);
    cargarPromotores(function (data) {
        if (predef != false)
            select.html('<option value="">' + text + '</option>');
        data.map(function (e) {
            select.append('<option value="{numero}">{nombre}</option>'.format(e));
        });
    });
}

var generarBotonExportar = function (id) {
    // Detectar los formatos a exportar
    var content = document.querySelector(id);
    var csv = content.getAttribute('data-csv'),
        excel = content.getAttribute('data-excel'),
        pdf = content.getAttribute('data-pdf');

    var formid = content.getAttribute('data-form');

    if (formid == undefined) throw 'No se especifico el formulario para realizar la busqueda.';


    // Construir el objeto
    var html = '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                    '<span class="glyphicon glyphicon-floppy-save" ></span>' +
                    '<span>Exportar</span>' +
                    '<span class="caret"></span>' +
                    '<span class="sr-only">Toggle Dropdown</span>' +
               ' </button>' +
               '<ul class="dropdown-menu" role="menu">' +
                    (csv != undefined ? '<li role="presentation"><a  role="menuitem" tabindex="-1" data-export="{0}?tipo=1" style="cursor:pointer">Texto Plano (CSV)</a> </li>'.format([csv]) : '') +
                    (excel != undefined ? '<li role="presentation"><a  role="menuitem" tabindex="-1" data-export="{0}?tipo=2" style="cursor:pointer">Excel (XLSX)</a></li>'.format([excel]) : '') +
                    (pdf != undefined ? '<li role="presentation"><a  role="menuitem" tabindex="-1" data-export="{0}?tipo=3" style="cursor:pointer">PDF (PDF)</a></li>'.format([pdf]) : '') +
                '</ul>';


    content.innerHTML += html;

    var exportar = function (url) {
        Loading('Exportando');
        var params = $(formid).serialize();
        var link = document.createElement("a");
        link.href = '/Exportaciones/' + url + '&' + params;
        link.click();
        Loading();
    }

    $(content).find('[data-export]').click(function () {
        exportar(this.getAttribute('data-export'));
    })
}

var importarDatos = function () {
    var config = {
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        template: undefined,
        id: undefined, // Opcional
        callback: undefined // Opcional
    }

    config.template = this.getAttribute('data-template');
    config.id = this.getAttribute('data-id');
    config.callback = this.getAttribute('data-callback');

    if (config.template == undefined) {
        throw 'No se especifico el témplate';
    }

    var htmlDialog = '<div id="modalImportar" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 id="titulo" class="modal-title">Importación de Datos</h4></div><div class="modal-body"><form id="frmImportarModal"><fieldset><div class="col-md-12 col-sm-12 form-group"><div class="col-md-12 col-sm-12 input-group"><span class="input-group-addon glyphicon glyphicon-file"></span><input type="file" name="archivo" id="archivo" class="form-control" accept="{accept}" /></div><div class="col-md-12 col-sm-12"><span class="field-validation-valid" data-valmsg-for="archivo" data-valmsg-replace="true"></span></div><div class="col-md-12 col-sm-12"><br /><a href="/Importaciones/Template/{template}">Descargar Plantilla</a></div></div></fieldset></form></div><div class="modal-footer"><button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Cancelar</button><button onclick="$(\'#frmImportarModal\').submit()" type="button" class="btn btn-sm btn-primary">Importar</button></div></div></div></div>';
    htmlDialog = htmlDialog.format(config);

    // Removemos cualquier modal que ya este creado para luego agregar el nuevo
    if ($(document.body).find('#modalImportar').length > 0)
        $(document.body).find('#modalImportar').remove();
    $(document.body).append(htmlDialog);

    var diag = $('#modalImportar').modal('show');

    // Crear evento del form
    diag.find('form').submit(function (e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append('archivo', $(this).find('input[type="file"]')[0].files[0]);
        formData.append('tipo', config.template);
        formData.append('id', config.id);

        // Para ir incrementando el progressbar
        var progressHandlingFunction = function (e) {
            if (e.lengthComputable) {
                $('#progressbar').width((e.loaded * 100 / e.total) + '%');

                if (e.loaded == e.total) $('#progressbar').parent().remove();
            }
        }

        $.ajax({
            url: '/Importaciones/Importar',
            type: 'post',
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            data: formData,
            xhr: function () {
                // Esto se encargara del progessbar
                myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
                }
                return myXhr;;
            },
            beforeSend: function () {
                Loading('Subiendo archivo <div  class="progress progress-striped"><div id="progressbar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>');
            },
            complete: function () {
                Loading();
            },
            success: function (resp) {
                if (resp.result == true) {
                    AlertSuccess('El archivo se ha subido exitosamente. Se han registrado {registros} de {total}.'.format(resp.data), 'Subir archivo');

                    $(diag).modal('hide');

                    if (config.callback)
                        eval(config.callback);
                }
                else {
                    AlertError(resp.message, 'Error al subir archivo');
                }
            }
        });
    });
}


$.urlParam = function (key) {
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && unescape(result[1]) || "";
}

var cargarFiltros = function (content) {

    // Detectar si se encuentra un contenedor con el atributo [data-filtros]
    var filtros = content == undefined ? $('[data-filtros]')[0] : $(content)[0];  // Solo debe hacer uno.

    if (filtros != undefined)
        $.ajax({
            url: '/Utilidades/Filtros',
            type: 'get',
            dataType: 'html',
            beforeSend: function () {
                Loading('Cargando filtros');
            },
            complete: function () {
                Loading()
            },
            success: function (html) {

                // Agregar antes de todo
                if (filtros.getAttribute("data-filtros") == 'top') {
                    filtros.innerHTML = html + filtros.innerHTML;
                }
                    // Agregar después de todo
                else {
                    filtros.innerHTML += html;
                }


                // Poner valores por default
                $(filtros).find('#entidad').val($(filtros).find('#entidad').attr('data-default'));
                $(filtros).find('#distritoFederal').val($(filtros).find('#distritoFederal').attr('data-default'));
                $(filtros).find('#region').val($(filtros).find('#region').attr('data-default'));

                // Ejecutar accion despues de cargar los filtros
                var callback = filtros.getAttribute('data-filtros-callback');
                if (callback)
                    eval(callback);

                bindAutcomplete($(filtros).find('#colonia'));

                // Componentes a eliminar de la lista
                var ignorelist = filtros.getAttribute('data-filtros-ignore');
                if (ignorelist != undefined)
                    $(filtros).find(ignorelist).parent('div').remove();

            }
        });
}

var Filtros = {
    init: function (content) {
        // Detectar si se encuentra un contenedor con el atributo [data-filtros]
        var filtros = content == undefined ? $('[data-filtros]')[0] : $(content)[0];  // Solo debe hacer uno.

        if (filtros != undefined)
            $.ajax({
                url: '/Utilidades/Filtros',
                type: 'get',
                dataType: 'html',
                beforeSend: function () {
                    Loading('Cargando filtros');
                },
                complete: function () {
                    Loading()
                },
                success: function (html) {

                    // Agregar antes de todo
                    if (filtros.getAttribute("data-filtros") == 'top') {
                        filtros.innerHTML = html + filtros.innerHTML;
                    }
                        // Agregar después de todo
                    else {
                        filtros.innerHTML += html;
                    }


                    // Poner valores por default
                    $(filtros).find('#entidad').val($(filtros).find('#entidad').attr('data-default'));
                    $(filtros).find('#distritoFederal').val($(filtros).find('#distritoFederal').attr('data-default'));
                    $(filtros).find('#region').val($(filtros).find('#region').attr('data-default'));

                    // Ejecutar accion despues de cargar los filtros
                    var callback = filtros.getAttribute('data-filtros-callback');
                    if (callback)
                        eval(callback);

                    bindAutcomplete($(filtros).find('#colonia'), '/ListadoNominal/AutocompleteColonia');

                    // Componentes a eliminar de la lista
                    var ignorelist = filtros.getAttribute('data-filtros-ignore');
                    if (ignorelist != undefined)
                        $(filtros).find(ignorelist).parent('div').remove();

                    Filtros.bind(filtros);
                }
            });

       
    },
    // Nuevo
    bind: function (content) {
        $(content).delegate('select[data-filtro]', 'change', function () {
            var selectEntidades = $(this).parents('form').find('select[data-filtro="entidad"]');
            var selectMunicipios = $(this).parents('form').find('select[data-filtro="municipio"]');
            var selectDistritosFederales = $(this).parents('form').find('select[data-filtro="distritoFederal"]');
            var selectDistritosLocales = $(this).parents('form').find('select[data-filtro="distritoLocal"]');
            var selectRegiones = $(this).parents('form').find('select[data-filtro="region"]');
            var selectSecciones = $(this).parents('form').find('select[data-filtro="seccion"]');
            var selectCuadrantes = $(this).parents('form').find('select[data-filtro="cuadrante"]');

            if (($(this).attr('readonly') != undefined && $(this).attr('data-default') != undefined) && $(this).val() != $(this).attr('data-default')) return;

            var entidad = $(selectEntidades) != undefined && $(selectEntidades).val() != null ? $(selectEntidades).val() : undefined;
            var municipio = $(selectMunicipios) != undefined && $(selectMunicipios).val() != null ? $(selectMunicipios).val() : undefined;
            var distritoFederal = $(selectDistritosFederales) != undefined && $(selectDistritosFederales).val() != null ? $(selectDistritosFederales).val() : undefined;
            var distritoLocal = $(selectDistritosLocales) != undefined && $(selectDistritosLocales).val() != null ? $(selectDistritosLocales).val() : undefined;
            var region = $(selectRegiones) != undefined && $(selectRegiones).val() != null ? $(selectRegiones).val() : undefined;
            var seccion = $(selectSecciones) != undefined && $(selectSecciones).val() != null ? $(selectSecciones).val() : undefined;
            var cuadrante = $(selectCuadrantes) != undefined && $(selectCuadrantes).val() != null ? $(selectCuadrantes).val() : undefined;

            if ($.inArray($(this).data('filtro'), ['entidad', 'distritoFederal', 'distritoLocal', 'region', 'cuadrante', 'municipio']) > -1 && selectSecciones.length > 0)
                Filtros.cargarSecciones(entidad, distritoFederal, distritoLocal, region, cuadrante, municipio, function (data) {
                    Filtros.cargarCatalogos(data, selectSecciones, 'Todas las secciones');
                });

            if ($.inArray($(this).data('filtro'), ['entidad', 'distritoFederal', 'distritoLocal', 'region', 'cuadrante']) > -1)
                Filtros.cargarMunicipios(entidad, distritoFederal, distritoLocal, region, cuadrante, function (data) {
                    Filtros.cargarCatalogos(data, selectMunicipios, 'Todos los municipios')
                });

            if (selectCuadrantes.length > 0 && $.inArray($(this).data('filtro'), ['entidad', 'distritoFederal', 'distritoLocal', 'region']) > -1)
                Filtros.cargarCuadrantes(entidad, distritoFederal, distritoLocal, region, function (data) {
                    Filtros.cargarCatalogos(data, selectCuadrantes, 'Todos los cuadrantes');
                });

            if (selectRegiones.length > 0 && $.inArray($(this).data('filtro'), ['entidad', 'distritoFederal', 'distritoLocal']) > -1)
                Filtros.cargarRegiones(entidad, distritoFederal, distritoLocal, function (data) {
                    Filtros.cargarCatalogos(data, selectRegiones, 'Todas las zonas');
                });

            if (selectDistritosLocales.length > 0 && $.inArray($(this).data('filtro'), ['entidad', 'distritoFederal']) > -1)
                Filtros.cargarDistritosLocales(entidad, distritoFederal, function (data) {
                    Filtros.cargarCatalogos(data, selectDistritosLocales, 'Todos los distritos');
                });

            if (selectDistritosFederales.length > 0 && $.inArray($(this).data('filtro'), ['entidad']) > -1)
                Filtros.cargarDistritosFederales(entidad, function (data) {
                    Filtros.cargarCatalogos(data, selectDistritosFederales, 'Todos los distritos');
                });
        });
    },
    // Viejo
    bind2: function () {
        
        $(document.body).delegate('select[data-filtro="entidad"]', 'change', function () {
            var selectMunicipios = $(this).parents('form').find('select[data-filtro="municipio"]');
            var selectDistritosFederales = $(this).parents('form').find('select[data-filtro="distritoFederal"]');
            var selectRegiones = $(this).parents('form').find('select[data-filtro="region"]');
            $(this).parents('form').find('select[data-filtro="seccion"]').empty();

            if (($(this).attr('readonly') != undefined && $(this).attr('data-default') != undefined) && $(this).val() != $(this).attr('data-default')) return;

            cargarMunicipios($(this).val(), undefined, function (data) {
                $(selectMunicipios).html('<option value="">Todos los municipios</option>');
                data.map(function (e) {
                    $(selectMunicipios).append('<option value="{numero}">{nombre}</option>'.format(e));
                });

                $(selectMunicipios).val(parseInt($(selectMunicipios).data('default')));

                if ($(selectMunicipios).val() != null && $(selectMunicipios).data('editable') != undefined) {
                    $(selectMunicipios).attr('readonly', true);
                }
            });

            cargarDistritosFederales($(this).val(), function (data) {
                $(selectRegiones).html('<option value="">Todas las regiones</option>');
                $(selectDistritosFederales).html('<option value="">Todos los distritos</option>');
                data.map(function (e) {
                    $(selectDistritosFederales).append('<option value="{numero}">{nombre}</option>'.format(e));
                });

                $(selectDistritosFederales).val(parseInt($(selectDistritosFederales).data('default')));

                if ($(selectDistritosFederales).val() != null && $(selectDistritosFederales).data('editable') != undefined) {
                    $(selectDistritosFederales).attr('readonly', true);
                }
            });

            cargarRegiones($(this).val(), undefined, function (data) {
                $(selectRegiones).html('<option value="">Todas las zonas</option>');
                data.map(function (e) {
                    $(selectRegiones).append('<option value="{numero}">{nombre}</option>'.format(e));
                });

                $(selectRegiones).val(parseInt($(selectRegiones).data('default')));

                if ($(selectRegiones).val() != null && $(selectRegiones).data('editable') != undefined) {
                    $(selectRegiones).attr('readonly', true);
                }
            });
        });

        $(document.body).delegate('select[data-filtro="municipio"]', 'change', function () {
            var selectEntiaddes = $(this).parents('form').find('select[data-filtro="entidad"]');
            var selectSecciones = $(this).parents('form').find('select[data-filtro="seccion"]');
            var selectDistritoFederal = $(this).parents('form').find('select[data-filtro="distritoFederal"]');


            if (($(this).attr('readonly') != undefined && $(this).attr('data-default') != undefined) && $(this).val() != $(this).attr('data-default')) return;


            cargarSecciones($(selectEntiaddes).val(), $(this).val(), selectDistritoFederal.val(), function (data) {
                $(selectSecciones).html('<option value="">Todas las secciones</option>');
                data.map(function (e) {
                    $(selectSecciones).append('<option value="{numero}">{nombre}</option>'.format(e));
                });
            });

        });

        $(document.body).delegate('select[data-filtro="distritoFederal"]', 'change', function () {
            var selectEntidades = $(this).parents('form').find('select[data-filtro="entidad"]');
            var selectRegiones = $(this).parents('form').find('select[data-filtro="region"]');
            var selectMunicipios = $(this).parents('form').find('select[data-filtro="municipio"]');
            var selectSecciones = $(this).parents('form').find('select[data-filtro="seccion"]');

            if (($(this).attr('readonly') != undefined && $(this).attr('data-default') != undefined) && $(this).val() != $(this).attr('data-default')) return;

            cargarRegiones($(selectEntidades).val(), $(this).val(), function (data) {
                $(selectRegiones).html('<option value="">Todas las zonas</option>');
                data.map(function (e) {
                    $(selectRegiones).append('<option value="{numero}">{nombre}</option>'.format(e));
                });

                $(selectRegiones).val(parseInt($(selectRegiones).data('default')));

                if ($(selectRegiones).val() != null && $(selectRegiones).data('editable') != undefined) {
                    $(selectRegiones).attr('readonly', true);
                }
            });

            cargarMunicipios($(selectEntidades).val(), $(this).val(), function (data) {
                $(selectMunicipios).html('<option value="">Todos los municipios</option>');
                data.map(function (e) {
                    $(selectMunicipios).append('<option value="{numero}">{nombre}</option>'.format(e));
                });
            });

            cargarSecciones($(selectEntidades).val(), undefined, $(this).val(), function (data) {
                $(selectSecciones).html('<option value="">Todas las secciones</option>');
                data.map(function (e) {
                    $(selectSecciones).append('<option value="{numero}">{nombre}</option>'.format(e));
                });
            });
        });
    },
    cargarCatalogos : function (data, select, def) {
        if (data.length == 0)
            def = "";

        $(select).html('<option value="" selected>' + def + '</option>');
        data.map(function (e) {
            $(select).append('<option value="{numero}">{nombre}</option>'.format(e));
        });

        $(select).val(parseInt($(select).data('default')));

        if ($(select).val() != null && $(select).data('editable') != undefined) {
            $(select).attr('readonly', true);
        }
    },
    cargarMunicipios : function (entidad, distritoFederal, distritoLocal, region, cuadrante, callback) {
        $.ajax({
            url: '/Utilidades/CargarMunicipios',
            type: 'post',
            data: {
                entidad: entidad,
                distritoFederal: distritoFederal,
                distritoLocal: distritoLocal,
                region: region,
                cuadrante: cuadrante
            },
            beforeSend: function () {
                Loading('');
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (callback)
                    callback(data);
                else
                    console.warn('No se especifico una función para el retorno');
            }
        });
    },
    cargarSecciones : function (entidad, distritoFederal, distritoLocal, region, cuadrante, municipio, callback) {
    $.ajax({
        url: '/Utilidades/CargarSecciones',
        type: 'post',
        data: { entidad: entidad, distritoFederal: distritoFederal, distritoLocal: distritoLocal, region: region, cuadrante: cuadrante, municipio: municipio },
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (callback)
                callback(data);
            else
                console.warn('No se especifico una función para el retorno');
        }
    });
},
    cargarDistritosFederales : function (entidad, callback) {
        $.ajax({
            url: '/Utilidades/CargarDistritosFederales',
            type: 'post',
            data: { entidad: entidad },
            beforeSend: function () {
                Loading('');
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (callback)
                    callback(data);
                else
                    console.warn('No se especifico una función para el retorno');
            }
        });
    },
    cargarDistritosLocales : function (entidad, distritoFederal, callback) {
        $.ajax({
            url: '/Utilidades/CargarDistritosLocales',
            type: 'post',
            data: { entidad: entidad, distritoFederal: distritoFederal },
            beforeSend: function () {
                Loading('');
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (callback)
                    callback(data);
                else
                    console.warn('No se especifico una función para el retorno');
            }
        });
    },
    cargarRegiones : function (entidad, distritoFederal, distritoLocal,  callback) {
        $.ajax({
            url: '/Utilidades/CargarRegiones',
            type: 'post',
            data: { entidad: entidad, distritoFederal: distritoFederal, distritoLocal: distritoLocal },
            beforeSend: function () {
                Loading('');
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (callback)
                    callback(data);
                else
                    console.warn('No se especifico una función para el retorno');
            }
        });
    },
    cargarCuadrantes : function (entidad, distritoFederal, distritoLocal, region, callback) {
    $.ajax({
        url: '/Utilidades/CargarCuadrantes',
        type: 'post',
        data: { entidad: entidad, distritoFederal: distritoFederal, distritoLocal: distritoLocal, region: region },
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (callback)
                callback(data);
            else
                console.warn('No se especifico una función para el retorno');
        }
    });
}
}

var Connection = {
    init: function () {
        setInterval(Connection.updateStatus, 1000 * 20);
    },
    isOnline: function (ip, callback) {
        if (!this.inUse) {
            this.status = false;
            this.inUse = true;
            this.callback = callback;// Buscando conexion
            this.ip = ip;
            var _that = this;
            this.img = new Image();
            this.img.onload = function () {
                _that.inUse = false;
                _that.callback(true);//Conectado

            };
            this.img.onerror = function (e) {
                if (_that.inUse) {
                    _that.inUse = false;
                    _that.callback(true, e);//Conectado
                }

            };
            this.start = new Date().getTime();
            this.img.src = ip;
            this.timer = setTimeout(function () {
                if (_that.inUse) {
                    _that.inUse = false;
                    _that.callback(false);//Sin conexion
                }
            }, 3000);
        }
    },
    updateStatus: function () {
        Connection.isOnline('http://electo.mx/health.html', Connection.showMessage);
    },
    showMessage: function (status, e) {
        if (status) {
            $(document.body).find('#blockScreen').remove();
            $(document.body).find('#blockText').remove();
        } else {
            var statusScreen = '<div id="blockScreen" class="block-screen"><div id="blockText" class="block-screen-text text-center"> <h1>:(</h1><h3>Se ha perdido la conexión a internet. <br><br><button type="button" class="btn btn-default" onclick="$(\'#blockScreen\').remove()">Aceptar</button><h3></div></div>';

            var screen = $(document.body).find('#blockScreen');
            if (screen.length == 0)
                $(document.body).append(statusScreen);
        }
    }

}

var loadScript = function (filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

var bindAutcomplete = function (element, url, callback) {
    loadScript("/Scripts/jquery-ui-1.8.24.min.js", "js");
    loadScript("/Content/themes/base/jquery.ui.autocomplete.css", "css");
    loadScript("/Content/themes/base/css", "css");

    // Tratar de enlazar el evento hasta que ya este cargado el script
    var detectAutocompelte = setInterval(function () {

        try {

            $(element).autocomplete({
                source: url,
                select: callback
            });

            clearInterval(detectAutocompelte);

        }
        catch (e) { }

    }, 1000);


}

var paginate = function (table, pager, nPP) {
    var currentPage = 0;
    var numPerPage = nPP;
    var $table = $(table);
    var $pager = $(pager);
    var numRows = $table.find('tbody tr').length;
    var numPages = Math.ceil(numRows / numPerPage);

    $pager.find('li').remove();

    $table.bind('repaginate', function () {
        $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
    });

    $table.trigger('repaginate');

    $('<li><a href="#">&laquo;</a></li>').bind('click', function (event) {
        currentPage = hasPrevious(currentPage);
        $table.trigger('repaginate');
        $pager.find('li.page-number').siblings().removeClass('active');
        $pager.find('li#p' + (currentPage + 1)).addClass('active');
    }).appendTo($pager);

    for (var page = 0; page < numPages; page++) {
        $('<li id="p' + (page + 1) + '" class="page-number"><a href="#">' + (page + 1) + '</a></li>').bind('click', { newPage: page }, function (event) {
            currentPage = event.data['newPage'];
            $table.trigger('repaginate');
            $(this).addClass('active').siblings().removeClass('active');
        }).appendTo($pager);
    }

    $('<li><a href="#">&raquo;</a></li>').bind('click', function (event) {
        currentPage = hasNext(currentPage, numPages);
        $table.trigger('repaginate');
        $pager.find('li.page-number').siblings().removeClass('active');
        $pager.find('li#p' + (currentPage + 1)).addClass('active');
    }).appendTo($pager);

    $pager.find('li.page-number:first').addClass('active');
}

var hasNext = function (currentPage, numPages) {
    if (currentPage + 1 < numPages)
        return currentPage + 1;
    else
        return currentPage;
}

var hasPrevious = function (currentPage) {
    if (currentPage - 1 >= 0)
        return currentPage - 1;
    else
        return currentPage;
}

// Validaciones para el plugin datetimepicker
// Se necarga de validar que rangos de fechas
var dateValidation = function (calendar, input, start, end, tipo) {
    if (input.data('validation') == 'max') { // Fecha Fin
        var date = get_date($(start).val(), tipo);
        var times = get_times($(start).val(), 'min', $(end).val(), tipo);
        calendar.setOptions({
            minDate: date,
            maxDate: false,
            allowTimes: times
        })
    } else if (input.data('validation') == 'min') { // Fecha Inicio
        var date = get_date($(end).val(), tipo);
        var times = get_times($(end).val(), 'max', $(start).val(), tipo);
        calendar.setOptions({
            minDate: false,
            maxDate: date,
            allowTimes: times
        })
    }
}

// Se encarga de obtener las fechas permitidas, devuelve falso si no hay una fecha seleccionada
var get_date = function (input, tipo) {
    if (input == '') {
        return false;
    } else {
        // Split the date, divider is '/'
        var parts = input.match(/(\d+)/g);
        if (tipo == 1)
            return parts[0] + '/' + parts[1] + '/' + parts[2];// Año/Mes/Dia
        else
            return parts[2] + '/' + parts[0] + '/' + parts[1];// Mes/Dia/Año
    }
}

// Se encarga de obtener las horas permitidas, devuelve falso si no hay una fecha seleccionada
var get_times = function (input, type, input2, tipo) {
    if (input == '') {
        return false;
    } else {
        // Split the date, divider is '/'
        var parts = input.match(/(\d+)/g);

        // Obtiene las horas permitidas si la fecha es la misma
        if (get_date(input, tipo) == get_date(input2, tipo) && parts.length > 3) {
            var times = [];
            if (type == 'min') {
                if (parts[4] > 0)
                    parts[3]++;
                for (var i = parts[3]; i < 24; i++) {
                    times.push(i + ':00');
                }
            } else {
                if (parts[4] > 0)
                    parts[3]--;
                for (var i = parts[3]; i > -1; i--) {
                    times.push(i + ':00');
                }
            }
            return times;
        } else if (parts.length == 2) {
            var times = [];
            if (type == 'min') {
                if (parts[1] == 59)
                    parts[0]++;
                for (var i = parts[0]; i < 24; i++) {
                    times.push(i + ':00');
                }
            } else {
                if (parts[1] == 0)
                    parts[0]--;
                for (var i = parts[0]; i > -1; i--) {
                    times.push(i + ':00');
                }
            }
            return times;
        }
        return false;
    }
}

//var Notificacion = {
//    init: function () {
//        var htmlDialog = '<div id="mNotificacion" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Notificaciones</h4></div><div class="modal-body"><table id="tNotificaciones" class="table"><thead><tr><th>Emisor</th><th>Mensaje</th><th>Fecha de Registro</th></tr></thead><tbody><tr><td colspan="3" class="text-center">No se encontraron resultados</td></tr></tbody></table></div></div></div></div>';

//        // Removemos cualquier modal que ya este creado para luego agregar el nuevo
//        if ($(document.body).find('#mNotificacion').length > 0)
//            $(document.body).find('#mNotificacion').remove();
//        $(document.body).append(htmlDialog);

//        Notificacion.cargarNotificaciones();
//        //setInterval(Notificacion.cargarNotificaciones, 1000 * 60 * 5);
//    },
//    cargarNotificaciones: function () {
//        $.ajax({
//            type: "GET",
//            url: '/Notificaciones/CargarPendientes',
//            data: {},
//            beforeSend: function () { },
//            complete: function () { },
//            error: function () { }
//        })
//        .done(function (data) {
//            try
//            {
//                data.map(function (e) {
//                    AlertInfo('<a href="#" onclick="Notificacion.cargarEnvio(\'{emisor}\')"><b>{emisor} dice:</b></a> {mensaje}<br><sub class="pull-right">{fechaRegistro}</sub>'.format(e), 'Notificación', 1000 * 60 * 5);
//                });
//            }
//            catch (e) { }
//        });
//    },
//    enviar: function () {
//        if ($(document.body).find('#mNotificacion').length > 0) {
//            var form = $('#mNotificacion #frmNotificacion');
//            if (form.valid()) {
//                $.ajax({
//                    type: "POST",
//                    url: '/Notificaciones/Enviar',
//                    data: form.serialize(),
//                    beforeSend: function () {
//                        Loading('Guardando');
//                    }
//                })
//                .always(function () {
//                    Loading();
//                })
//                .done(function (data) {
//                    if (data.result) {
//                        AlertSuccess('Se ha creado la notificación exitosamente', 'Notificaciones');
//                        $('#mNotificacion').modal('hide');
//                    } else
//                        AlertError(data.message, 'Notificaciones');
//                });
//            }
//        }
//    },
//    cargarEnvio: function (usuario) {
//        $.ajax({
//            type: 'GET',
//            url: '/Notificaciones/Enviar',
//            data: {}
//        })
//        .always(function () {
//            Loading();
//        })
//        .done(function (html) {
//            var htmlDialog = '<div id="mNotificacion" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Notificaciones</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Cancelar</button><button onclick="$(\'#mNotificacion form\').submit()" type="button" class="btn btn-sm btn-primary">Guardar</button></div></div></div></div>';

//            // Removemos cualquier modal que ya este creado para luego agregar el nuevo
//            if ($(document.body).find('#mNotificacion').length > 0)
//                $(document.body).find('#mNotificacion').remove();
//            $(document.body).append(htmlDialog);

//            $('#mNotificacion .modal-body').html(html);

//            if (usuario) {
//                $('#mNotificacion #idUsuarioDestinatario').val($('#mNotificacion #idUsuarioDestinatario option:contains(' + usuario + ')').val());
//            }

//            $('#mNotificacion').modal('show');
//        });
//    }
//}

var Promotores = {
    cargar: function (selector, data, callback) {


        $.ajax({
            url: '/Promovidos/CargarPromotores',
            type: 'post',
            data: data,
            beforeSend: function () {
                $(selector).html('<option value="">Cargando lista...</option>');
            },
            complete: function () { },
            success: function (e) {
                $(selector).html('<option value=""></option>');

                e.map(function (promotor) {
                    $(selector).append('<option value="{id}">{nombre}</option>'.format(promotor));
                });

                if (callback)
                    callback(e);
            },
            error: function () {
                $(selector).html('<option value=""></option>');
            }
        });
    }
};

var ReportarError = {
    init: function () {
        var htmlDialog = '<div id="mReporteError" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Reporte de Falla</h4></div><div class="modal-body">'
        + '<fieldset><img src="" class="img-rounded img-responsive"><form><div class="col-md-12 col-sm-12 form-group"><label>Descripción</label><textarea id="descripcion" name="descripcion" rows="6" class="form-control" required="required"></textarea><div><span class="field-validation-valid" data-valmsg-for="descripcion" data-valmsg-replace="true"></span></div></div></form><h5 class="text-right"><small>Esta opción es solo para reportar fallas de la plataforma, no para proporcionar soporte técnico.</small></h5></fieldset>'
        + '</div><div class="modal-footer"><button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Cancelar</button><button onclick="ReportarError.enviar()" type="button" class="btn btn-sm btn-primary">Enviar</button></div></div></div></div>';

        // Removemos cualquier modal que ya este creado para luego agregar el nuevo
        if ($(document.body).find('#mReporteError').length > 0)
            $(document.body).find('#mReporteError').remove();
        $(document.body).append(htmlDialog);

        ReportarError.capturarPantalla();
        $('#mReporteError').modal('show');
    },
    capturarPantalla: function () {
        html2canvas([document.body], {
            proxy: false,
            onrendered: function (canvas) {
                var img = canvas.toDataURL();
                $('#mReporteError img').attr('src', img);
            }
        });
    },
    enviar: function () {
        loadScript("/Scripts/jquery.validate.min.js", "js");
        loadScript("/Scripts/jquery.validate.unobtrusive.min.js", "js");
        loadScript("/Scripts/jquery.validate.messages.js", "js");

        var form = $('#mReporteError form');
        if (form.valid()) {
            var params = form.serializeArray();
            params.push({ name: 'uri', value: $('#mReporteError img').attr('src') });

            $.ajax({
                type: "POST",
                url: '/Utilidades/ReportarFalla',
                data: params,
                beforeSend: function () {
                    Loading('Enviando');
                }
            })
            .always(function () {
                Loading();
            })
            .done(function (data) {
                if (data.result) {
                    AlertSuccess('Se ha reportado la falla exitosamente', 'Reporte de fallas');
                    $('#mReporteError').modal('hide');
                } else
                    AlertError(data.message, 'Reporte de fallas');
            });
        }
    },
}

$('#mReporteError form').submit(function (e) {
    e.preventDefault();
    ReportarError.enviar();
});

var ConfirmDialog = {
    html: '<div id="modalConfirm" class="modal fade"  tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" >{title}</h4></div><div class="modal-body">{text}</div><div class="modal-footer">{buttons}</div></div></div></div>',
    show: function (options) {

        var _opDefault = {
            text: '',
            title: '',
            buttons: undefined,
            callback: function () { },
            positiveButton: true,
            positiveButtonText: 'Aceptar',
            positiveButtonClass: 'btn btn-primary',
            negativeButton: true,
            negativeButtonText: 'Cancelar',
            negativeButtonClass: 'btn btn-default',
            closeModalOnAction: true
        };

        $.extend(_opDefault,options,true);

        if ($('#modalConfirm').length > 0)
            $('#modalConfirm').remove();

        if (_opDefault.buttons == undefined) {
            _opDefault.buttons = '';
            if (_opDefault.positiveButton == true) {
                _opDefault.buttons += '<button class="' + _opDefault.positiveButtonClass + '" data-confirm="true">' + _opDefault.positiveButtonText + '</button>';
            }
            if (_opDefault.negativeButton == true) {
                _opDefault.buttons += '<button class="' + _opDefault.negativeButtonClass + '" data-confirm="false">' + _opDefault.negativeButtonText + '</button>';
            }

            if (_opDefault.buttons.length == 0)
                throw 'No se especificaron los botones de acción';
            else {

            }
                
        }
        
        $(document.body).append(ConfirmDialog.html.format(_opDefault));


        $('#modalConfirm').delegate('[data-confirm]', 'click', function () {
            if(_opDefault.closeModalOnAction == true) $('#modalConfirm').modal('hide');
            if (_opDefault.callback) {
                _opDefault.callback(this.getAttribute('data-confirm') == 'true');
            }
        });

        $('#modalConfirm').modal({
            backdrop: 'static',
            keyboard: false,
            show:true
        });
    }
}

var pagExportar;

var Exportar = {
    generarBotonExportar: function (id) {
        var content = document.querySelector(id);
        var tipo = content.getAttribute('data-tipo');
        var form = content.getAttribute('data-form');

        content.innerHTML += '<button type="button" class="btn btn-default" data-export="{0}" data-form={1}><span class="glyphicon glyphicon-floppy-save"></span><span>Exportar</span></button>'.format([tipo, form]);

        $(content).find('[data-export]').click(function () {
            Exportar.mostrarReportes(this);
        });

        loadScript("/Scripts/Paginacion.js", "js");
        loadScript("/Scripts/plugins/jqueryDatetimepicker/jquery.datetimepicker.js", "js");
        loadScript("/Content/plugins/jqueryDatetimepicker/jquery.datetimepicker.css", "css");
    },
    mostrarReportes: function (element) {
        var tipo = $(element).data('export');
        var form = $(element).data('form');

        var htmlDialog = '<div id="modalExportar" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Exportar Reporte</h4></div><div class="modal-body"><form id="frmArchivo"><div class="col-md-12 form-group"><input type="hidden" name="tipo" value="{0}" /><div class="col-md-4"><label>Periodo</label><input type="text" name="fechaInicio" class="form-control fecha" data-validation="min" /></div><div class="col-md-4"><br /><input type="text" name="fechaFin" class="form-control fecha" data-validation="max" /></div><div class="col-md-1"><br /><input type="submit" class="btn btn-primary" value="Buscar"></div></div></form><table id="tArchivos" class="table"><thead><tr><th>Fecha</th><th></th></tr></thead><tbody><tr><td colspan="2">No se encontraron resultados</td></tr></tbody><tfoot><tr><td colspan="2"><div class="paginacion"></div></td></tr></tfoot></table></div><div class="modal-footer"><button type="button" class="btn btn-primary" onclick="Exportar.solicitar(\'{0}\',\'{1}\');">Generar Solicitud</button></div></div><!-- /.modal-content --></div><!-- /.modal-dialog --></div><!-- /.modal -->'.format([tipo, form]);

        // Removemos cualquier modal que ya este creado para luego agregar el nuevo
        if ($(document.body).find('#modalExportar').length > 0)
            $(document.body).find('#modalExportar').remove();
        $(document.body).append(htmlDialog);

        pagExportar = new Paginacion({
            content: $('#modalExportar .paginacion'),
            search: Exportar.cargarReportes,
            pageSize: 15,
            info: true
        });

        $('#modalExportar #frmArchivo .fecha').datetimepicker({
            lang: 'es',
            format: 'Y/m/d',
            timepicker: false,
            onChangeDateTime: function (ct, input) {
                dateValidation(this, input, '#modalExportar #frmArchivo .fecha[data-validation="min"]', '#modalExportar #frmArchivo .fecha[data-validation="max"]', 1);
            },
            onShow: function (ct, input) {
                dateValidation(this, input, '#modalExportar #frmArchivo .fecha[data-validation="min"]', '#modalExportar #frmArchivo .fecha[data-validation="max"]', 1);
            }
        });

        $('#modalExportar').modal('show');

        $('#modalExportar #frmArchivo').submit(function (e) {
            e.preventDefault();
            Exportar.cargarReportes();
        });

        $('#modalExportar #tArchivos').on('click', '[data-archivo]', function () {
            var link = document.createElement("a");
            link.href = $(this).data('archivo');
            link.click();
        });

        Exportar.cargarReportes();
    },
    cargarReportes: function () {
        var form = $('#modalExportar #frmArchivo');
        var params = form.serializeArray();

        params.push({ name: 'page', value: pagExportar.getCurrentPage() });
        params.push({ name: 'pageSize', value: pagExportar.getPageSize() });

        $.ajax({
            url: '/Exportaciones/BuscarArchivos',
            type: 'POST',
            data: params,
            beforeSend: function () {
                Loading('Cargando');
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                var t = $('#modalExportar #tArchivos tbody').empty();

                if (data.total > 0) {
                    var html = '<tr><td>{fecha}</td><td><button class="btn btn-default pull-right" data-archivo="{archivo}">Descargar</button></td></tr>';
                    data.datos.map(function (e) {
                        temp = html.format(e);
                        t.append(temp);
                    });
                }
                else
                    t.html('<tr><td class="text-center" colspan="2">No se encontraron resultados</td></tr>');

                pagExportar.updateControls(data.total);
            }
        });
    },
    solicitar: function (tipo, id) {
        var form = $(id);

        $.ajax({
            url: '/Exportaciones/RegistrarSolicitud',
            type: 'POST',
            data: { filtros: JSON.stringify(form.serializeObject()), tipo: tipo },
            beforeSend: function () {
                Loading('Solicitando Reporte');
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha generado la solicitud exitosamente, su reporte sera enviado a su correo', 'Exportacion');
                    $('#modalExportar').modal('hide');
                } else
                    AlertError(data.message, 'Exportacion');
            }
        });
    }
}

var printElement = function (title, html, css) {
    var frame = $('<iframe />');
    frame[0].name = "printFrame";
    frame.css({ "position": "absolute", "top": "-1000000px" });
    $("body").append(frame);

    var frameDoc = frame[0].contentWindow ? frame[0].contentWindow : frame[0].contentDocument.document ? frame[0].contentDocument.document : frame[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write('<html><head><title>' + title + '</title></head><body>');
    //Append the external CSS file.
    css.map(function (e) {
        frameDoc.document.write(e);
    });
    //Append the DIV contents.
    frameDoc.document.write(html);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();

    setTimeout(function () {
        window.frames["printFrame"].focus();
        window.frames["printFrame"].print();
        frame.remove();
    }, 500);
}

$(function () {

    $(document.body).delegate('select[readonly]', 'change', function (e) {
        $(this).val($(this).attr('data-default'));
        return false;
    });

    $(document.body).delegate('[data-captura]', 'keypress', function (e) {
        var tipo = this.getAttribute('data-captura').toLowerCase();

        switch (tipo) {
            case 'enteros':
                return /\d/.test(String.fromCharCode(e.keyCode));
                break;
            case 'decimales':
                return /\d|\./.test(String.fromCharCode(e.keyCode)) && /^\d+(\.\d*)?$/.test(this.value + String.fromCharCode(e.keyCode));
                break;
        }

    });


    // Se establecen opciones de ejecución por default cuando se hagan operaciones ajax
    $.ajaxSetup({
        beforeSend: function () {
            Loading('');
        },
        complete: function () {
            Loading(null)
        },
        error: function (data) {
            if (data.responseText)
                AlertError(data.responseText);
            else if(typeof(data) == 'String')
                AlertError(data);
            Loading(null);
        }
    });


    // Cargar filtros en base a los módulos
    //Filtros.init();
    //Notificacion.init();
});

// Cargar scripts extras
// Info de los Autocomplete
head.js('/Scripts/InfoAutocomplete.js');
head.js('/Scripts/bootstrap.min.js');
head.js('/Scripts/bootstrap.js');