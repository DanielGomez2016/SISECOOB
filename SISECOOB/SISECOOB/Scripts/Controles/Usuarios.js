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
            var html = '<tr><td class="col-md-3">{Nombre} {ApellidoP} {ApellidoM}</td>'
                + '<td class="col-md-2">{Email}</td>'
                + '<td class="col-md-1">{UserName}</td>'
                + '<td class="col-md-1">{Rol}</td>'
                + '<td class="col-md-1">{Zona}</td>'
                + '<td class="text-right col-md-4">'
                + '<button type="button" name="editar" value="{id}" class="btn btn-info">Editar</button>'
                + ' {BtnActiva} {BtnSupervisa}'
                + ' <button type="button" name="Elimina" value="{id}" class="btn btn-danger">Eliminar</button></td></tr>';
            var x = 1;
            data.datos.map(function (e) {

                if (e.Activo == 1) {

                    e.BtnActiva = '<input type="button" id="Activo' + x + '" name="activar" value="Activo" data-elemento="' + x + '" data-id="' + e.id + '" data-value="' + e.Activo + '" data-value2="" class="btn btn-success"><input id="segundovalor' + x + '" type="hidden" value="" />';
                }
                else {
                    e.BtnActiva = '<input type="button" id="Activo' + x + '" name="activar" value="Activar" data-elemento="' + x + '" data-id="' + e.id + '" data-value="' + e.Activo + '" data-value2="" class="btn btn-desactivo"><input id="segundovalor' + x + '" type="hidden" value="" />';   
                }
                if (e.Supervisor == 1 && e.Activo == 1) {

                    e.BtnSupervisa = '<input type="button" id="Supervisa' + x + '" name="supervisor" value="Supervisor" data-elemento="' + x + '" data-id="' + e.id + '" data-value="' + e.Supervisor + '" class="btn btn-primary"><input id="Suval' + x + '" type="hidden" value="" />';
                    x++
                }
                if (e.Supervisor == 1 && e.Activo == 0) {

                    e.BtnSupervisa = '<input type="button" id="Supervisa' + x + '" name="supervisor" value="Supervisor" data-elemento="' + x + '" data-id="' + e.id + '" data-value="' + e.Supervisor + '" disabled="true" class="btn btn-primary"><input id="Suval' + x + '" type="hidden" value="" />';
                    x++
                }
                if (e.Supervisor == 0 && e.Activo == 1) {
                    e.BtnSupervisa = '<input type="button" id="Supervisa' + x + '" name="supervisor" value="Supervisor" data-elemento="' + x + '" data-id="' + e.id + '" data-value="' + e.Supervisor + '" class="btn btn-warning"><input id="Suval' + x + '" type="hidden" value="" />';
                    x++
                }
                if (e.Supervisor == 0 && e.Activo == 0) {
                    e.BtnSupervisa = '<input type="button" id="Supervisa' + x + '" name="supervisor" value="Supervisor" data-elemento="' + x + '" data-id="' + e.id + '" data-value="' + e.Supervisor + '" disabled="true" class="btn btn-warning"><input id="Suval' + x + '" type="hidden" value="" />';
                    x++
                }

                //if (e.Zona == 0) {
                //    e.ZonaNombre = 'Chihuahua'
                //}
                //else {
                //    e.ZonaNombre = 'Juarez'
                //}

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
                        AlertSuccess('Se ha guardado el registro exitosamente.', 'Usuario');
                        buscar();
                    } else {
                        AlertError(data.message, 'Usuario');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Usuario');
                }
            });
        }
    }
}

//abrir modal para actualizar la informacion del usuario
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

//funcion para guardar los cambios editados del usuario

$('#Editando').click(function () {
    Editando();
});

function Editando() {

    var form = $('#EditarUsuario form');

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
                url: 'UsersAdmin/Edit',
                data: params,
                beforeSend: function () {
                    Loading("Guardando");
                },
                complete: function () {
                    Loading();
                    $('#EditarUsuario').modal('hide');
                },
                success: function (data) {
                    if (data.result == true) {
                        AlertSuccess('Se ha Actualizado el registro exitosamente.', 'Usuarios');
                        buscar();
                    } else {
                        AlertError(data.message, 'Usuario');
                    }
                },
                error: function () {
                    AlertError('No se pudo guardar el registro. Intente nuevamente.', 'Usuarios');
                }
            });
        }
    }
}


//funcion para mostrar un modal que pregunta si deseas activar/desactivar el usuario

$('#tUsuarios').on('click', 'input[name="activar"]', function () {
    ModalActivar($(this).data("id"), $(this).data("value"), $(this).data("elemento"));
});

function ModalActivar (id, value, elemento) {
    $("#modalActivacion").modal("show");
    $("#UsuarioID").val(id);
    $("#Elementoid").val("Activo"+elemento);
    $("#Activa").val(value);
    $("#elemento").val(elemento);
    var nuevoelemento = $("#segundovalor"+elemento);

    if (nuevoelemento.val() != "") {
        $("#Activa").val(nuevoelemento.val());
    }

    if ($("#Activa").val() == 0) {
        $("#titulo1").text("¿ Estas seguro que quieres activar a este usuario ?");
        $("#Activando").val("Si, Activar");
        $("#Activando").removeClass('btn-danger');
        $("#Activando").addClass('btn-primary');

    } else {
        $("#titulo1").text("¿ Estas seguro que quieres desactivar a este usuario ?");
        $("#Activando").val("Si, Desactivar");
        $("#Activando").removeClass('btn-primary');
        $("#Activando").addClass('btn-danger');
    }
}

$("#Activando").click(function () {
    ActivarUsuario();
});

function ActivarUsuario() {
    var boton;
    var btnSup;
    var elem = $("#elemento").val();
    var activo = $("#Activa").val();
    if (activo == 0) {
        $.ajax({
            type: 'POST',
            url: '/UsersAdmin/Activacion',
            data: { iduser: $("#UsuarioID").val(), activo: 1 },
            beforeSend: function () {
                Loading("Activando");
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (data) {
                    ids = 'Supervisa' + elem
                    btnSup = $('#' + ids + '');
                    btnSup.removeAttr('disabled');
                    element = $('#Elementoid').val();
                    boton = $('#' + element + '');
                    boton.removeClass('btn-desactivo');
                    boton.addClass('btn-success');
                    boton.val("Activo");
                    $('#segundovalor'+elem).val(1)
                    AlertSuccess('Se activo correctamente el usuario', 'Usuario');
                    $("#modalActivacion").modal("hide");
                }
            },
            error: function () {
                AlertError('No se pudo activar al usuario.Intente Nuevamente', 'Usuario');
                $("#modalActivacion").modal("hide");
            }
        });

    }
    else {
        $.ajax({
            type: 'POST',
            url: '/UsersAdmin/Activacion',
            data: { iduser: $("#UsuarioID").val(), activo: 0 },
            beforeSend: function () {
                Loading("Desactivando");
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (data) {
                    ids = 'Supervisa' + elem
                    btnSup = $('#' + ids + '');
                    btnSup.attr('disabled', true);
                    element = $('#Elementoid').val();
                    boton = $('#' + element + '');
                    boton.removeClass('btn-success');
                    boton.addClass('btn-desactivo');
                    boton.val("Activar");
                    $('#segundovalor' + elem).val(0)

                    AlertSuccess('Se desactivo correctamente el usuario', 'Usuario');
                    $("#modalActivacion").modal("hide");
                }
            },
            error: function () {
                AlertError('No se pudo desactivar al usuario.\n Intente Nuevamente', 'Usuario');
                $("#modalActivacion").modal("hide");
            }
        });
    }
}

//funcion para cambiar si es supervisor o no es supervisor

$('#tUsuarios').on('click', 'input[name="supervisor"]', function () {
    Supervisor($(this).data("id"), $(this).data("value"), $(this).data("elemento"));
});

function Supervisor(id, value, elemento) {
    $("#modalSupervisor").modal("show");
    $("#SuId").val(id);
    $("#ElementoidS").val("Supervisa" + elemento);
    $("#Supervisor").val(value);
    $("#elementoS").val(elemento);
    var nuevoelemento = $("#Suval" + elemento);

    if (nuevoelemento.val() != "") {
        $("#Supervisor").val(nuevoelemento.val());
    }

    if ($("#Supervisor").val() == 0) {
        $("#tituloSU").text("¿ Quieres hacer supervisor a este usuario ?");
        $("#btnSupervisor").val("Si, hacer Supervisor");
        $("#btnSupervisor").removeClass('btn-danger');
        $("#btnSupervisor").addClass('btn-primary');

    } else {
        $("#tituloSU").text("¿ El usuario ya no sera Supervisor, desea continuar ?");
        $("#btnSupervisor").val("Si, quitar Supervisor");
        $("#btnSupervisor").removeClass('btn-primary');
        $("#btnSupervisor").addClass('btn-danger');
    }
}

$("#btnSupervisor").click(function () {
    ActualSupervisor();
});

function ActualSupervisor() {
    var boton;
    var elem = $("#elementoS").val();
    var activo = $("#Supervisor").val();
    if (activo == 0) {
        $.ajax({
            type: 'POST',
            url: '/UsersAdmin/Supervisor',
            data: { iduser: $("#SuId").val(), activo: 1 },
            beforeSend: function () {
                Loading("Cambiando a supervisor");
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (data) {
                    element = $('#ElementoidS').val();
                    boton = $('#' + element + '');
                    boton.removeClass('btn-warning');
                    boton.addClass('btn-primary');
                    $('#Suval' + elem).val(1)
                    AlertSuccess('Se cambio A Supervisor correctamente al usuario', 'Usuario');
                    $("#modalSupervisor").modal("hide");
                }
            },
            error: function () {
                AlertError('No se pudo hacer el cambio a supervisor .Intente Nuevamente', 'Usuario');
                $("#modalSupervisor").modal("hide");
            }
        });

    }
    else {
        $.ajax({
            type: 'POST',
            url: '/UsersAdmin/Supervisor',
            data: { iduser: $("#SuId").val(), activo: 0 },
            beforeSend: function () {
                Loading("Quitando de Supervisores");
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (data) {
                    element = $('#ElementoidS').val();
                    boton = $('#' + element + '');
                    boton.removeClass('btn-primary');
                    boton.addClass('btn-warning');
                    $('#Suval' + elem).val(0)
                    AlertSuccess('Se a quitado correctamente al usuario de supervisores', 'Usuario');
                    $("#modalSupervisor").modal("hide");
                }
            },
            error: function () {
                AlertError('No se pudo quitar de supervisores .Intente Nuevamente', 'Usuario');
                $("#modalSupervisor").modal("hide");
            }
        });
    }
}


//funcion para eliminar al usuario

$('#tUsuarios').on('click', 'button[name="Elimina"]', function () {
    Eliminar($(this).val());
});

function Eliminar(id) {

    $("#Eliminarmodal").modal("show");
    $("#eliminarID").val(id);

    $("#tituloElimina").text("¿ Quieres ELIMINAR a este Usuario ?");
    $("#btnElimina").val("Si, Eliminar usuario");
    $("#btnElimina").addClass('btn-danger');

    $('#titulo').text('Eliminar Usuario');
}

$("#btnElimina").click(function () {
    EliminaUsuario();
});

function EliminaUsuario(id) {
    $.ajax({
            type: 'POST',
            url: '/UsersAdmin/EliminarUsuario',
            data: { id: $("#eliminarID").val() },
            beforeSend: function () {
                Loading("Eliminando");
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (data.result == true) {
                    AlertSuccess('Se ha eliminado el usuario exitosamente.', 'Usuarios');
                    $("#Eliminarmodal").modal("hide");
                    buscar();
                } else {
                    AlertError(data.message, 'Usuario');
                }
            },
            error: function () {
                AlertError('No se pudo eliminar el usuario. Intente nuevamente.', 'Usuarios');
                $("#Eliminarmodal").modal("hide");
            }
        });
}
