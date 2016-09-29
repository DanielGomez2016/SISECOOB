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
        content: $('#ttipos .paginacion'),
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

//funcion de javascript para buscar deptos y llenar la tabla
function buscar() {
    var form = $('#fBusqueda');

    $('#page').val(pag.getCurrentPage());
    $('#pageSize').val(pag.getPageSize());

    $.ajax({
        type: "GET",
        url: '/Departamentos/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tdepto tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-3">{id}</td>'
                + '<td class="col-md-3">{nombre}</td>'
                + '<td class="col-md-3">{jefe}</td>'
                + '<td class="text-right col-md-3">'
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

//funcion javascript para abrir la vista de crear un nuevo depto en un modal

$('#Nuevo').click(function () {
    Nuevo();
});

function Nuevo() {
    $('#titulo').text('Nuevo Departamento');
    $.ajax({
        type: 'POST',
        url: '/Departamentos/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#nuevodepto').find('.modal-body form').remove();
            $('#nuevodepto').find('.modal-body').append(html);
            $('#nuevodepto').modal('show');
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

    var form = $('#nuevodepto form');
    params = form.serializeArray();
    if (params != null) {
        $.ajax({
            type: 'POST',
            url: '/Departamentos/Create',
            data: params,
            beforeSend: function () {
                Loading("Guardando");
            },
            complete: function () {
                Loading();
                $('#nuevodepto').modal('hide');
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha guardado el registro exitosamente.', 'Departamentos');
                    buscar();
                } else {
                    AlertError(data.message, 'Departamentos');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Departamentos');
            }
        });
    }
}


//abrir modal para actualizar la informacion del depto
$('#tdepto').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Departamento');
    $.ajax({
        type: 'POST',
        url: '/Departamentos/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#editardepto').find('.modal-body form').remove();
            $('#editardepto').find('.modal-body').append(html);
            $('#editardepto').modal('show');
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

    var form = $('#editardepto form');

    $.validator.unobtrusive.parse(form);
    var url = null;
    var params = null;
    params = form.serializeArray();
    if (params != null) {
        $.ajax({
            type: 'POST',
            url: '/Departamentos/Edicion',
            data: params,
            beforeSend: function () {
                Loading("Actualizando");
            },
            complete: function () {
                Loading();
                $('#editardepto').modal('hide');
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Departamentos');
                    buscar();
                } else {
                    AlertError(data.message, 'Departamentos');
                }
            },
            error: function () {
                AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Departamentos');
            }
        });
    }
}

//eliminar el depto

$('#tdepto').on('click', 'button[name="eliminar"]', function () {
    Elimina($(this).val());
});

function Elimina(id) {
    $.ajax({
        type: 'POST',
        url: '/Departamentos/Elimina',
        data: { id: id },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha Eliminado el registro exitosamente.', 'Departamentos');
                buscar();
            } else {
                AlertError(data.message, 'Departamentos');
            }
        },
        error: function () {
            AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Departamentos');
        }
    });
}