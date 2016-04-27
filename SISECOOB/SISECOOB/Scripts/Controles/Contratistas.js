//javascript de inicio de pagina carga las funciones necesarias
$(document).ready(function () {
    $.validator.setDefaults({
        ignore: '.ignore'
    });

    //nos permite solo marcar un checkbox con el mismo name
    //$('input[type=checkbox]').live('click', function () {
    //    var parent = $(this).attr('name');
    //    $('[name=' + parent + ']').prop('checked', false);
    //    $(this).attr('checked', 'checked');
    //});

    //paginacion de las tablas
    pag = new Paginacion({
        content: $('#tcontratista .paginacion'),
        search: buscar,
        pageSize: 15,
        info: true
    });


    //realiza la busqueda en nuestra pagina
    $('#fBusqueda').submit(function (e) {
        e.preventDefault();
        buscar();
    });

    setTimeout(function () {
        buscar();
    }, 2000);
});

//funcion de javascript para buscar usuarios y llenar la tabla
function buscar() {
    var form = $('#fBusqueda');

    $('#page').val(pag.getCurrentPage());
    $('#pageSize').val(pag.getPageSize());

    $.ajax({
        type: "GET",
        url: '/Contratistas/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tcontratista tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-1">{id}</td>'
                + '<td class="col-md-2">{nombre}</td>'
                + '<td class="col-md-1">{rfc}</td>'
                + '<td class="col-md-1">{curp}</td>'
                + '<td class="col-md-2">{vigencia}</td>'
                + '<td class="col-md-2">{email}</td>'
                + '<td class="col-md-3">'
                + '<button type="button" name="detalle" value="{id}" class="btn btn-default">Detalle</button>'
                + '<button type="button" name="editar" value="{id}" class="btn btn-info">Editar</button>'
                + ' <button type="button" name="eliminar" value="{id}" class="btn btn-danger">Eliminar</button></td></tr>';

            data.datos.map(function (e) {
                temp = html.format(e);
                t.append(temp);
            });
        }
        else
            t.html('<tr><td class="text-center" colspan="6">No se encontraron resultados</td></tr>');

        pag.updateControls(data.total);
    });
}

//funcion javascript para abrir la vista de crear un nuevo municipio en un modal

$('#Nuevo').click(function () {
    Nuevo();
});

function Nuevo() {
    $('#titulo').text('Nuevo Contratista');
    $.ajax({
        type: 'POST',
        url: '/Contratistas/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#nuevocontratista').find('.modal-body form').remove();
            $('#nuevocontratista').find('.modal-body').append(html);
            $('#nuevocontratista').modal('show');
        },
        error: function () {
            AlertError('No se pudo cargar el formulario. Intente nuevamente.');
        }
    });
}

$('#guardar').click(function () {
    Crear();
});

function Crear() {
    var tipotelefono = new Array();
    var telefonos = new Array();
    var form = $('#nuevocontratista form');

    $('#nuevocontratista select[name=tipotelefono]').each(function () {
        tipotelefono.push($(this).val());
    });

    $('#nuevocontratista input[name=telefonos]').each(function () {
        telefonos.push($(this).val());
    });

    form.removeData('validator');
    form.removeData('unobtrusiveValidation');
    $.validator.unobtrusive.parse(form);
    if (form.valid()) {
        var url = null;
        var params = null;
        params = form.serializeArray();
        if (params != null) {
            $.ajax({
                type: 'POST',
                url: '/Contratistas/Create',
                data: params,
                beforeSend: function () {
                    Loading("Guardando");
                },
                complete: function () {
                    Loading();
                    $('#nuevocontratista').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha guardado el registro exitosamente.', 'Contratista');
                        buscar();
                    } else {
                        AlertError(data.message, 'Contratista');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Contratista');
                }
            });
        }
    }
}


//abrir modal para actualizar la informacion del municipio
$('#tcontratista').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Contratista');
    $.ajax({
        type: 'POST',
        url: '/Contratistas/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#editarcontratista').find('.modal-body form').remove();
            $('#editarcontratista').find('.modal-body').append(html);
            $('#editarcontratista').modal('show');

            llenarTelefono(id);
        },
        error: function () {
            AlertError('No se pudo cargar el registro. Intente nuevamente.');
        }
    });
}

//llenar los telefonos al momento de editar la escuela
function llenarTelefono(id) {
    $.ajax({
        type: "GET",
        url: '/Contratistas/telefonos',
        data: { id: id },
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#ttelefonos tbody');

        if (data.datos.length > 0) {
            var html = '<tr name="telefono" data-control="x{x}">'
                      + '<td>{opciones}</td>'
                      + '<td><input name="telefonos" class="form-control" value="{tel}"/></td>'
                      + '<td><button type="button" data-cont="x{x}" class="btn-sm btn-danger" name="btneliminar">'
                      + '<span class="glyphicon glyphicon-trash"></span></button></td></tr>';
            var x = 1;
            data.datos.map(function (e) {
                e.x = x;
                e.opciones = '<select class="form-control" name="tipotelefono">';

                for (var i = 0; i < data.op.length; i++) {
                    if (data.op[i].tipo == e.tipo) {
                        e.opciones += '<option value="' + data.op[i].id + '" selected="selected">' + data.op[i].tipo + '</option>'
                    } else {
                        e.opciones += '<option value="' + data.op[i].id + ' ">' + data.op[i].tipo + '</option>'
                    }
                }
                e.opciones += '</select>';

                temp = html.format(e);
                t.append(temp);
                x++;
            });
        }
    });
}

$('#Editando').click(function () {
    Editando();
});

function Editando() {

    var tipotelefono = new Array();
    var telefonos = new Array();
    var form = $('#editarcontratista form');

    $('#editarcontratista select[name=tipotelefono]').each(function () {
        tipotelefono.push($(this).val());
    });

    $('#editarcontratista input[name=telefonos]').each(function () {
        telefonos.push($(this).val());
    });

    $.validator.unobtrusive.parse(form);
    var url = null;
    var params = null;
    params = form.serializeArray();
    if (params != null) {
        $.ajax({
            type: 'POST',
            url: '/Contratistas/Edicion',
            data: params,
            beforeSend: function () {
                Loading("Actualizando");
            },
            complete: function () {
                Loading();
                $('#editarcontratista').modal('hide');
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Contratistas');
                    buscar();
                } else {
                    AlertError(data.message, 'Contratistas');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Contratistas');
            }
        });
    }
}

//eliminar el municipio

$('#tcontratista').on('click', 'button[name="eliminar"]', function () {
    Elimina($(this).val());
});

function Elimina(id) {
    $.ajax({
        type: 'POST',
        url: '/Contratistas/Elimina',
        data: { id: id },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha Eliminado el registro exitosamente.', 'Contratista');
                buscar();
            } else {
                AlertError(data.message, 'Contratista');
            }
        },
        error: function () {
            AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Contratista');
        }
    });
}


//abrir modal para detalle la informacion del contratista
$('#tcontratista').on('click', 'button[name="detalle"]', function () {
    Detalles($(this).val());
});

function Detalles(id) {
    $('#titulo').text('Detalle Contratista');

    $.ajax({
        type: 'POST',
        url: '/Contratistas/Details',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#detallecontratista').find('.modal-body form').remove();
            $('#detallecontratista').find('.modal-body').append(html);
            $('#detallecontratista').modal('show');
        },
        error: function () {
            AlertError('No se pudo cargar el formulario. Intente nuevamente.');
        }
    });
}

$('.datepicker').datetimepicker({
    timeFormat: "hh:mm tt",
    dateFormat: 'yy/mm/dd',
    stepMinute: 5,
    controlType: 'select',
});

$.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: '<Ant',
    nextText: 'Sig>',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    weekHeader: 'Sm',
    dateFormat: 'yy/mm/dd',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};

$.datepicker.setDefaults($.datepicker.regional['es']);


function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}