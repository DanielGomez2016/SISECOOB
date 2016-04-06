//javascript de inicio de pagina carga las funciones necesarias
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


    $('#municipio').live('change', function () {
        var municipio = $(this).val();
        
        $.ajax({
            type: 'POST',
            url: '/Utilidades/CargarLocalidades',
            data: { municipio :  municipio },
            success: function (data) {
                var t = $('#localidad').empty();
                t.append('<option value="0">Seleccione Localidad</option>');

                if (data.datos.length > 0) {
                    var html = '<option value="{id}">{nombre}</option>'

                    data.datos.map(function (e) {
                        temp = html.format(e);
                        t.append(temp);
                    });
                }
            },
            error: function () {
                AlertError('No se pudo cargar el formulario. Intente nuevamente.');
            }
        });
    });

    $('#Municipio_fk').live('change', function () {
        var municipio = $(this).val();

        $.ajax({
            type: 'POST',
            url: '/Utilidades/CargarLocalidades',
            data: { municipio: municipio },
            success: function (data) {
                var t = $('#Localidad_fk').empty();
                t.append('<option value="0">Seleccione Localidad</option>');

                if (data.datos.length > 0) {
                    var html = '<option value="{id}">{nombre}</option>'

                    data.datos.map(function (e) {
                        temp = html.format(e);
                        t.append(temp);
                    });
                }
            },
            error: function () {
                AlertError('No se pudo cargar el formulario. Intente nuevamente.');
            }
        });
    });

    //paginacion de las tablas
    pag = new Paginacion({
        content: $('#tLocalidad .paginacion'),
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
        url: '/Escuelas/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tescuela tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-3">{clave}</td>'
                + '<td class="col-md-3">{nombre}</td>'
                + '<td class="col-md-3">{localidad}</td>'
                + '<td class="text-right col-md-3">'
                + ' <button type="button" name="detalle" value="{id}" class="btn btn-default">Detalle</button>'
                + ' <button type="button" name="editar" value="{id}" class="btn btn-info">Editar</button>'
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

//funcion javascript para abrir la vista de crear un nueva escuela en un modal

$('#Nuevo').click(function () {
    Nuevo();
});

function Nuevo() {
    $('#titulo').text('Nueva Escuela');
    $.ajax({
        type: 'POST',
        url: '/Escuelas/Formulario',
        data: { id: 0 },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#nuevaescuela').find('.modal-body form').remove();
            $('#nuevaescuela').find('.modal-body').append(html);
            $('#nuevaescuela').modal('show');
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

    var form = $('#nuevaescuela form');

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
                url: '/Escuelas/Create',
                data: params,
                beforeSend: function () {
                    Loading("Guardando");
                },
                complete: function () {
                    Loading();
                    $('#nuevaescuela').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha guardado el registro exitosamente.', 'Escuelas');
                        buscar();
                    } else {
                        AlertError(data.message, 'Escuelas');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Escuelas');
                }
            });
        }
    }
}

//abrir modal para actualizar la informacion del municipio
$('#tescuela').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Escuela');
    $.ajax({
        type: 'POST',
        url: '/Escuelas/Formulario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#editarescuela').find('.modal-body form').remove();
            $('#editarescuela').find('.modal-body').append(html);
            $('#editarescuela').modal('show');
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

    var form = $('#editarescuela form');

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
                url: '/Escuelas/Edicion',
                data: params,
                beforeSend: function () {
                    Loading("Actualizando");
                },
                complete: function () {
                    Loading();
                    $('#editarescuela').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Escuelas');
                        buscar();
                    } else {
                        AlertError(data.message, 'Escuelas');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Escuelas');
                }
            });
        }
    }
}

//eliminar el municipio

$('#tescuela').on('click', 'button[name="eliminar"]', function () {
    Elimina($(this).val());
});

function Elimina(id) {
    $.ajax({
        type: 'POST',
        url: '/Escuelas/Elimina',
        data: { id: id },
        beforeSend: function () {
            Loading("Eliminando");
        },
        complete: function () {
            Loading();
        },
        success: function (data) {
            if (data.result == true) {
                AlertSuccess('Se ha Eliminado el registro exitosamente.', 'Escuelas');
                buscar();
            } else {
                AlertError(data.message, 'Escuelas');
            }
        },
        error: function () {
            AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Escuelas');
        }
    });
}

//abrir modal para detalle la informacion del municipio
$('#tescuela').on('click', 'button[name="detalle"]', function () {
    Detalles($(this).val());
});

function Detalles(id) {
    $('#titulo').text('Detalle Escuela');

    $.ajax({
        type: "GET",
        url: '/Escuelas/Details',
        data: { id: id },
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#detallado').empty();

        if (data.datos.length > 0) {
            var html = '<fieldset>'
                      +'<div class="col-md-12 col-sm-12">'
                      +'<div class="col-md-4"><label><h6>Nombre:</h6> {nombre}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Clave:</h6> {clave}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Nivel:</h6> {nivel}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Municipio:</h6> {municipio}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Localidad:</h6> {localidad}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Domicilio:</h6> {domicilio}</lavel></div>'
                      + '<div class="col-md-4"><label><h6># Alumnos:</h6> {alumnos}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Turno:</h6> {turno}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Director:</h6> {director}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Zona:</h6> {zona}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Sector:</h6> {sector}</lavel></div>'
                      + '<div class="col-md-4"><label><h6>Tipo predio:</h6> {tipopredio}</lavel></div>'
                      +'</div></fieldset>';

            data.datos.map(function (e) {
                temp = html.format(e);
                t.append(temp);
            });
            $('#detalleescuela').modal('show');
        }
        else
            t.html('<tr><td class="text-center" colspan="6">No se encontraron resultados</td></tr>');

        pag.updateControls(data.total);
    });
}