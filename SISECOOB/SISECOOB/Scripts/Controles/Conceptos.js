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
        content: $('#tconcepto .paginacion'),
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
        url: '/Conceptos/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tconcepto tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-2">{clave}</td>'
                + '<td class="col-md-2">{concepto}</td>'
                + '<td class="col-md-3">{desc}</td>'
                + '<td class="col-md-1">{unidad}</td>'
                + '<td class="col-md-1">{precio}</td>'
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

//funcion javascript para abrir la vista de crear un nuevo municipio en un modal

$('#Nuevo').click(function () {
    Nuevo();
});

function Nuevo() {
    $('#titulo').text('Nuevo Concepto');
    $.ajax({
        type: 'POST',
        url: '/Conceptos/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#NuevaConcepto').find('.modal-body form').remove();
            $('#NuevaConcepto').find('.modal-body').append(html);
            $('#NuevaConcepto').modal('show');
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

    var form = $('#NuevaConcepto form');

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
                url: '/Conceptos/Create',
                data: params,
                beforeSend: function () {
                    Loading("Guardando");
                },
                complete: function () {
                    Loading();
                    $('#NuevaConcepto').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha guardado el registro exitosamente.', 'Concepto');
                        buscar();
                    } else {
                        AlertError(data.message, 'Concepto');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Concepto');
                }
            });
        }
    }
}

//abrir modal para actualizar la informacion del municipio
$('#tconcepto').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Concepto');
    $.ajax({
        type: 'POST',
        url: '/Conceptos/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#EditarConcepto').find('.modal-body form').remove();
            $('#EditarConcepto').find('.modal-body').append(html);
            $('#EditarConcepto').modal('show');
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

    var form = $('#EditarConcepto form');

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
                url: '/Conceptos/Edicion',
                data: params,
                beforeSend: function () {
                    Loading("Actualizando");
                },
                complete: function () {
                    Loading();
                    $('#EditarConcepto').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Concepto');
                        buscar();
                    } else {
                        AlertError(data.message, 'Concepto');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Concepto');
                }
            });
        }
    }
}

//eliminar el municipio

$('#tconcepto').on('click', 'button[name="eliminar"]', function () {
    Eliminar($(this).val());
});

    function Eliminar(id) {

        $("#Eliminarmodal").modal("show");
        $("#eliminarID").val(id);

        $("#tituloElimina").text("¿ Quieres ELIMINAR este Oficio ?");
        $("#btnElimina").val("Si, Eliminar Oficio");
        $("#btnElimina").addClass('btn-danger');

        $('#titulo').text('Eliminar Oficio');
    }

    $("#btnElimina").click(function () {
        Elimina($("#eliminarID").val());
    });

function Elimina(id) {
    $.ajax({
        type: 'POST',
        url: 'Conceptos/Elimina',
        data: { id: id },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha Eliminado el registro exitosamente.', 'Concepto');
                $("#Eliminarmodal").modal("hide");
                buscar();
            } else {
                AlertError(data.message, 'Concepto');
            }
        },
        error: function () {
            AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Concepto');
        }
    });
}