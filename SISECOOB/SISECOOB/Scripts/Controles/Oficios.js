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
        data: { id: "" },
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
    var tcuentas = new Array();
    var cuentas = new Array();
    var montos = new Array();
    var form = $('#nuevooficio form');

    $('#nuevooficio input[name=cuentas]').each(function () {
        cuentas.push($(this).val());
    });

    $('#nuevooficio input[name=montos]').each(function () {
        montos.push($(this).val());
    });

    $('#nuevooficio select[name=tipocuenta]').each(function () {
        tcuentas.push($(this).val());
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

//llenar los telefonos al momento de editar la escuela
function llenarcuentas(id) {
    $.ajax({
        type: "GET",
        url: '/Oficios/Cuentas',
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
            var html = '<tr name="cuenta" data-control="x{x}">'
                      + '<td>{opciones}</td>'
                      + '<td><input name="cuentas" class="form-control" value="{ceunta}"/></td>'
                      + '<td><input name="montos" class="form-control" value="{monto}"/></td>'
                      + '<td><button type="button" data-cont="x{x}" class="btn-sm btn-danger" name="btneliminar">'
                      + '<span class="glyphicon glyphicon-trash"></span></button></td></tr>';
            var x = 1;
            data.datos.map(function (e) {
                e.x = x;
                e.opciones = '<select class="form-control" name="tipocuenta">';

                for (var i = 0; i < data.tc.length; i++) {
                    if (data.tc[i].tipo == e.tipo) {
                        e.opciones += '<option value="' + data.tc[i].id + '" selected="selected">' + data.tc[i].tipo + '</option>'
                    } else {
                        e.opciones += '<option value="' + data.tc[i].id + ' ">' + data.tc[i].tipo + '</option>'
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

            llenarcuentas(id);
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

    var tiposcuentas = new Array();
    var cuentas = new Array();
    var montos = new Array();
    var form = $('#editaroficio form');

    $('#nuevooficio select[name=tipocuenta]').each(function () {
        tiposcuentas.push($(this).val());
    });

    $('#nuevooficio input[name=cuentas]').each(function () {
        cuentas.push($(this).val());
    });

    $('#nuevooficio input[name=montos]').each(function () {
        montos.push($(this).val());
    });

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

