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
        content: $('#toficio .paginacion'),
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
        url: '/Oficios/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#toficio tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-1">{id}</td>'
                + '<td class="col-md-1">{fechaoficio}</td>'
                + '<td class="col-md-1">{fecharecibo}</td>'
                + '<td class="col-md-1">{tipo}</td>'
                + '<td class="col-md-1">{recibido}</td>'
                + '<td class="col-md-1">{programa}</td>'
                + '<td class="col-md-1">{asunto}</td>'
                + '<td class="col-md-2">{desc}</td>'
                + '<td class="col-md-3">'
                + '<button type="button" name="detalle" value="{id}" class="btn btn-default">Detalle</button> '
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
    $('#titulo').text('Nuevo Oficio');
    $.ajax({
        type: 'POST',
        url: '/Oficios/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#nuevooficio').find('.modal-body form').remove();
            $('#nuevooficio').find('.modal-body').append(html);
            $('#nuevooficio').modal('show');
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
    var form = $('#nuevooficio form');

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
                url: '/Oficios/Create',
                data: params,
                beforeSend: function () {
                    Loading("Guardando");
                },
                complete: function () {
                    Loading();
                    $('#nuevooficio').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha guardado el registro exitosamente.', 'Oficio');
                        buscar();
                    } else {
                        AlertError(data.message, 'Oficio');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Oficio');
                }
            });
        }
    }
}


//abrir modal para actualizar la informacion del municipio
$('#toficio').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Oficio');
    $.ajax({
        type: 'POST',
        url: '/Oficios/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#editaroficio').find('.modal-body form').remove();
            $('#editaroficio').find('.modal-body').append(html);
            $('#editaroficio').modal('show');

            llenarTelefono(id);
        },
        error: function () {
            AlertError('No se pudo cargar el registro. Intente nuevamente.');
        }
    });
}


$('#Editando').click(function () {
    Editando();
});

function Editando() {

    var form = $('#editaroficio form');

    $.validator.unobtrusive.parse(form);
    var url = null;
    var params = null;
    params = form.serializeArray();
    if (params != null) {
        $.ajax({
            type: 'POST',
            url: '/Oficios/Edicion',
            data: params,
            beforeSend: function () {
                Loading("Actualizando");
            },
            complete: function () {
                Loading();
                $('#editaroficio').modal('hide');
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Oficio');
                    buscar();
                } else {
                    AlertError(data.message, 'Oficio');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Oficio');
            }
        });
    }
}

//eliminar el municipio

$('#toficio').on('click', 'button[name="eliminar"]', function () {
    Elimina($(this).val());
});

function Elimina(id) {
    $.ajax({
        type: 'POST',
        url: '/Oficios/Elimina',
        data: { id: id },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha Eliminado el registro exitosamente.', 'Oficio');
                buscar();
            } else {
                AlertError(data.message, 'Oficio');
            }
        },
        error: function () {
            AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Oficio');
        }
    });
}


//abrir modal para detalle la informacion del contratista
$('#toficio').on('click', 'button[name="detalle"]', function () {
    Detalles($(this).val());
});

function Detalles(id) {
    $('#titulo').text('Detalle Oficio');

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
            $('#detalleoficio').find('.modal-body form').remove();
            $('#detalleoficio').find('.modal-body').append(html);
            $('#detalleoficio').modal('show');
        },
        error: function () {
            AlertError('No se pudo cargar el formulario. Intente nuevamente.');
        }
    });
}

$('.datepicker').datetimepicker({
    //timeFormat: "hh:mm tt",
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

//$.datepicker.setDefaults($.datepicker.regional['es']);


//function addMinutes(date, minutes) {
//    return new Date(date.getTime() + minutes * 60000);
//}