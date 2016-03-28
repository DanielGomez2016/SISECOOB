﻿//javascript de inicio de pagina carga las funciones necesarias
$(document).ready(function () {
    $.validator.setDefaults({
        ignore: '.ignore'
    });

    //nos permite solo marcar un checkbox con el mismo name
    $('input[type=checkbox]').live('click', function () {
        var parent = $(this).attr('name');
        $('[name=' + parent + ']').prop('checked', false);
        $(this).attr('checked', 'checked');
    });

    //paginacion de las tablas
    pag = new Paginacion({
        content: $('#tmenu .paginacion'),
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
        url: '/Modulos/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tmenu tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-1">{id}</td>'
                + '<td class="col-md-3">{nombre}</td>'
                + '<td class="col-md-3">{direccion}</td>'
                + '<td class="col-md-3">{padre}</td>'
                + '<td class="text-right col-md-4">'
                + '<button type="button" name="editar" value="{id}" class="btn btn-info">Editar</button>'
                + ' <button type="button" name="eliminar" data-val="{nivel}" value="{id}" class="btn btn-danger">Eliminar</button></td></tr>';

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
    $('#titulo').text('Nuevo Modulo');
    $.ajax({
        type: 'POST',
        url: '/Modulos/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#nuevomenu').find('.modal-body form').remove();
            $('#nuevomenu').find('.modal-body').append(html);
            $('#nuevomenu').modal('show');
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

    var form = $('#nuevomenu form');

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
                url: '/Modulos/Create',
                data: params,
                beforeSend: function () {
                    Loading("Guardando");
                },
                complete: function () {
                    Loading();
                    $('#nuevomenu').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha guardado el registro exitosamente.', 'Modulo');
                        buscar();
                    } else {
                        AlertError(data.message, 'Modulo');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Modulo');
                }
            });
        }
    }
}

//abrir modal para actualizar la informacion del municipio
$('#tmenu').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Modulo');
    $.ajax({
        type: 'POST',
        url: '/Modulos/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#editarmenu').find('.modal-body form').remove();
            $('#editarmenu').find('.modal-body').append(html);
            $('#editarmenu').modal('show');
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

    var form = $('#editarmenu form');

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
                url: '/Modulos/Edicion',
                data: params,
                beforeSend: function () {
                    Loading("Actualizando");
                },
                complete: function () {
                    Loading();
                    $('#editarmenu').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Modulo');
                        buscar();
                    } else {
                        AlertError(data.message, 'Modulo');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Modulo');
                }
            });
        }
    }
}

//eliminar el municipio

$('#tmenu').on('click', 'button[name="eliminar"]', function () {
    Eliminar($(this).val(), $(this).data('val'));
});

function Eliminar(id,nivel) {

    $("#Eliminarmodal").modal("show");
    $("#eliminarID").val(id);

    if (nivel > 0) {
        $("#tituloElimina").text("¿ Quieres ELIMINAR a este modulo, ten en cuenta que se eliminaran sus respectivas modulos internos ?");
    }
    else {
        $("#tituloElimina").text("¿ Quieres ELIMINAR a este modulo ?");
    }
    $("#btnElimina").val("Si, Eliminar Municipio");
    $("#btnElimina").addClass('btn-danger');

    $('#titulo').text('Eliminar Municipio');
}

$("#btnElimina").click(function () {
    EliminarMunicipio();
});

function EliminarMunicipio() {
    $.ajax({
        type: 'POST',
        url: '/Municipios/Elimina',
        data: { id: $("#eliminarID").val() },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha eliminado el municipio exitosamente.', 'Municipios');
                $("#Eliminarmodal").modal("hide");
                buscar();
            } else {
                AlertError(data.message, 'Municipios');
            }
        },
        error: function () {
            AlertError('No se pudo eliminar el Municipio. Intente nuevamente.', 'Municipios');
            $("#Eliminarmodal").modal("hide");
        }
    });
}