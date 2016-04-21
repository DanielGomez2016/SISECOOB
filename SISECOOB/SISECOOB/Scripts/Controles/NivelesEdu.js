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
        content: $('#tNiveles .paginacion'),
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
        url: '/NivelesEducativos/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tNiveles tbody').empty();

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
    $('#titulo').text('Nuevo Nivel');
    $.ajax({
        type: 'POST',
        url: '/NivelesEducativos/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#NuevoNivel').find('.modal-body form').remove();
            $('#NuevoNivel').find('.modal-body').append(html);
            $('#NuevoNivel').modal('show');
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

    var form = $('#NuevoNivel form');
    params = form.serializeArray();
    if (params != null) {
        $.ajax({
            type: 'POST',
            url: '/NivelesEducativos/Create',
            data: params,
            beforeSend: function () {
                Loading("Guardando");
            },
            complete: function () {
                Loading();
                $('#NuevoNivel').modal('hide');
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha guardado el registro exitosamente.', 'Niveles Educativos');
                    buscar();
                } else {
                    AlertError(data.message, 'Niveles Educativos');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Niveles Educativos');
            }
        });
    }
}


//abrir modal para actualizar la informacion del municipio
$('#tNiveles').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Nivel');
    $.ajax({
        type: 'POST',
        url: '/NivelesEducativos/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#EditarNivel').find('.modal-body form').remove();
            $('#EditarNivel').find('.modal-body').append(html);
            $('#EditarNivel').modal('show');
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

    var form = $('#EditarNivel form');

    $.validator.unobtrusive.parse(form);
        var url = null;
        var params = null;
        params = form.serializeArray();
        if (params != null) {
            $.ajax({
                type: 'POST',
                url: '/NivelesEducativos/Edicion',
                data: params,
                beforeSend: function () {
                    Loading("Actualizando");
                },
                complete: function () {
                    Loading();
                    $('#EditarNivel').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Niveles Educativos');
                        buscar();
                    } else {
                        AlertError(data.message, 'Niveles Educativos');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Niveles Educativos');
                }
            });
        }
}

//eliminar el municipio

$('#tNiveles').on('click', 'button[name="eliminar"]', function () {
    Elimina($(this).val());
});

function Elimina(id) {
    $.ajax({
        type: 'POST',
        url: '/NivelesEducativos/Elimina',
        data: { id: id },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha Eliminado el registro exitosamente.', 'Niveles Educativos');
                buscar();
            } else {
                AlertError(data.message, 'Niveles Educativos');
            }
        },
        error: function () {
            AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Niveles Educativos');
        }
    });
}