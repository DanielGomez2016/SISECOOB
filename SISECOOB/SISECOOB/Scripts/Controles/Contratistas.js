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
            var html = '<tr><td class="col-md-3">{id}</td>'
                + '<td class="col-md-3">{clave}</td>'
                + '<td class="col-md-3">{nombre}</td>'
                + '<td class="text-right col-md-3">'
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

    var form = $('#nuevocontratista form');
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
                    AlertError(data.message, 'Departamentos');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Contratista');
            }
        });
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

    var form = $('#editarcontratista form');

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


//abrir modal para ver la informacion del contratista
$('#tcontratista').on('click', 'button[name="detalle"]', function () {
    Editar($(this).val());
});

function Editar(id) {
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
            AlertError('No se pudo cargar el registro. Intente nuevamente.');
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