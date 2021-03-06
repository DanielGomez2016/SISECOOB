﻿//javascript de inicio de pagina carga las funciones necesarias
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
        content: $('#tprograma .paginacion'),
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
        url: '/Programas/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tprograma tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-4">{id}</td>'
                + '<td class="col-md-4">{nombre}</td>'
                + '<td class="text-right col-md-4">'
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
    $('#titulo').text('Nuevo Programa');
    $.ajax({
        type: 'POST',
        url: '/Programas/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#nuevoprograma').find('.modal-body form').remove();
            $('#nuevoprograma').find('.modal-body').append(html);
            $('#nuevoprograma').modal('show');
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

    var form = $('#nuevoprograma form');
    params = form.serializeArray();
    if (params != null) {
        $.ajax({
            type: 'POST',
            url: '/Programas/Create',
            data: params,
            beforeSend: function () {
                Loading("Guardando");
            },
            complete: function () {
                Loading();
                $('#nuevoprograma').modal('hide');
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha guardado el registro exitosamente.', 'Programa');
                    buscar();
                } else {
                    AlertError(data.message, 'Programa');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Programa');
            }
        });
    }
}


//abrir modal para actualizar la informacion del municipio
$('#tprograma').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Programa');
    $.ajax({
        type: 'POST',
        url: '/Programas/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#editarprograma').find('.modal-body form').remove();
            $('#editarprograma').find('.modal-body').append(html);
            $('#editarprograma').modal('show');
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

    var form = $('#editarprograma form');

    $.validator.unobtrusive.parse(form);
    var url = null;
    var params = null;
    params = form.serializeArray();
    if (params != null) {
        $.ajax({
            type: 'POST',
            url: '/Programas/Edicion',
            data: params,
            beforeSend: function () {
                Loading("Actualizando");
            },
            complete: function () {
                Loading();
                $('#editarprograma').modal('hide');
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Programas');
                    buscar();
                } else {
                    AlertError(data.message, 'Programas');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Programas');
            }
        });
    }
}

//eliminar el municipio

$('#tprograma').on('click', 'button[name="eliminar"]', function () {
    Elimina($(this).val());
});

function Elimina(id) {
    $.ajax({
        type: 'POST',
        url: '/Programas/Elimina',
        data: { id: id },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha Eliminado el registro exitosamente.', 'Programas');
                buscar();
            } else {
                AlertError(data.message, 'Programas');
            }
        },
        error: function () {
            AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Programas');
        }
    });
}