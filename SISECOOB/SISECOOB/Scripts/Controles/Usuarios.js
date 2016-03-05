var opcion = 0, actual = null;

//javascript de inicio de pagina carga las funciones necesarias
$(document).ready(function () {
    $.validator.setDefaults({
        ignore: '.ignore'
    });

    //nos permite solo marcar un checkbox con el mismo name
    $('input[type=checkbox]').live('click', function () {
        var parent = $(this).attr('name');
        $('[name='+parent+']').prop('checked', false);
        $(this).attr('checked', 'checked');
    });

    //paginacion de las tablas
    pag = new Paginacion({
        content: $('#tUsuarios .paginacion'),
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
        url: '/UsersAdmin/Buscar',
        data: form.serialize(),
        beforeSend: function () {
            Loading('Buscando');
        }
    })
    .always(function () {
        Loading();
    })
    .done(function (data) {

        var t = $('#tUsuarios tbody').empty();

        if (data.total > 0) {
            var html = '<tr><td class="col-md-1">{Nombre}</td>'
                + '<td class="col-md-2">{ApellidoP}</td>'
                + '<td class="col-md-2">{ApellidoM}</td>'
                + '<td class="col-md-2">{Email}</td>'
                + '<td class="col-md-1">{UserName}</td>'
                + '<td class="col-md-1">{Rol}</td>'
                + '<td class="col-md-1">{ZonaNombre}</td>'
                + '<td class="text-right col-md-2">'
                        + '<button type="button" name="editar" value="{id}" class="btn btn-default">Editar</button>'
                        + ' {BtnActiva}</td></tr>';
            var x = 1;
            data.datos.map(function (e) {

                if (e.Activo > 0) {
                    e.BtnActiva = '<input type="button" id="Activa' + x + '" value="Activo" data-id="' + e.Activo + '" onclick="AbrirActivacion(' + e.id + ', Activa' + x + ');" class="btn btn-success">';
                    x++
                }
                else {
                    e.Activo = '<input type="button" id="Activa' + x + '" value="Inactivo" data-id="' + e.Activo + '" onclick="AbrirActivacion(' + e.id + ', Activa' + x + ');" class="btn btn-desactivo">';
                    x++
                }

                if (e.Zona == 0) {
                    e.ZonaNombre = 'Chihuahua'
                }
                else {
                    e.ZonaNombre = 'Juarez'
                }

                t.append(html.format(e));

            });
        }
        else
            t.html('<tr><td class="text-center" colspan="6">No se encontraron resultados</td></tr>');

        pag.updateControls(data.total);
    });
}

//funcion javascript para abrir la vista de crear un nuevo usuario en un modal

$('#Nuevo').click(function () {
    Nuevo();
});

function Nuevo() {
    $('#titulo').text('Nuevo Usuario');
    $.ajax({
        type: 'POST',
        url: '/UsersAdmin/Formulario',
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#NuevoUsuario').find('.modal-body form').remove();
            $('#NuevoUsuario').find('.modal-body').append(html);
            $('#NuevoUsuario').modal('show');
        },
        error: function () {
            AlertError('No se pudo cargar el formulario. Intente nuevamente.');
        }
    });
}


//funcion para crear al nuevo usuario

$('#guardar').click(function () {
    Crear();
});

function Crear() {

    var form = $('#NuevoUsuario form');

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
                url: 'UsersAdmin/Create',
                data: params,
                beforeSend: function () {
                    Loading("Guardando");
                },
                complete: function () {
                    Loading();
                    $('#NuevoUsuario').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha guardado el registro exitosamente.', '@ViewBag.Title');
                        buscar();
                    } else {
                        AlertError(data.message, 'Usuario');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', '@ViewBag.Title');
                }
            });
        }
    }
}

//actualizar la informacion del usuario
$('#tUsuarios').on('click', 'button[name="editar"]', function () {
    Editar($(this).val());
});

function Editar(id) {
    $('#titulo').text('Editar Usuario');
    $.ajax({
        type: 'POST',
        url: '/UsersAdmin/EditandoUsuario',
        data: { id: id },
        beforeSend: function () {
            Loading("Cargando");
        },
        complete: function () {
            Loading();
        },
        success: function (html) {
            $('#EditarUsuario').find('.modal-body form').remove();
            $('#EditarUsuario').find('.modal-body').append(html);
            $('#EditarUsuario').modal('show');
        },
        error: function () {
            AlertError('No se pudo cargar el registro. Intente nuevamente.');
        }
    });
}