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
    var tipotelefono = new Array();
    var telefonos = new Array();
    var form = $('#nuevaescuela form');

    $('#nuevaescuela select[name=tipotelefono]').each(function () {
            tipotelefono.push($(this).val());
    });

    $('#nuevaescuela input[name=telefonos]').each(function () {
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
        url: '/Escuelas/telefonos',
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
                      +'<td>{opciones}</td>'
                      + '<td><input name="telefonos" class="form-control" value="{tel}"/></td>'
                      +'<td><button type="button" data-cont="x{x}" class="btn-sm btn-danger" name="btneliminar">'
                      +'<span class="glyphicon glyphicon-trash"></span></button></td></tr>';
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
                      + '<div class="col-md-6"><label><h4>Nombre: </h4></label> {nombre} </div>'
                      + '<div class="col-md-6"><label><h4>Clave: </h4></label> {clave} </div>'
                      + '<div class="col-md-4"><label><h4>Nivel: </h4></label> {nivel} </div>'
                      + '<div class="col-md-4"><label><h4>Turno: </h4></label> {turno} </div>'
                      + '<div class="col-md-4"><label><h4># Alumnos: </h4></label> {alumnos} </div>'
                      + '<div class="col-md-12"><label><h4>Domicilio: </h4></label> {domicilio}, {localidad}, {municipio} </div>'
                      + '<div class="col-md-12"><label><h4>Director: </h4></label> {director} </div>'
                      + '<div class="col-md-4"><label><h4>Zona: </h4></label> {zona} </div>'
                      + '<div class="col-md-4"><label><h4>Sector: </h4></label> {sector} </div>'
                      + '<div class="col-md-4"><label><h4>Tipo predio: </h4></label> {tipopredio} </div>'
                      + '<div class="col-md-12"><label><h4>Telefonos: </h4></label></div>'
                      + '{tels}'
                      +'</div></fieldset>';

            data.datos.map(function (e) {
                e.tels = '<div class="col-md-12">';

                if (e.telefonos.length > 0) {
                    for (var j = 0; j < e.telefonos.length; j++) {
                        e.tels += '<div class="col-md-6"><label><h4>Tipo Tel:   </h4></label>  ' + e.telefonos[j].tipotel + '  </div><div class="col-md-6"><label><h4>Tel:    </h4></label>  ' + e.telefonos[j].tel + ' </div>';
                    }
                }
                e.tels += '</div>'

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