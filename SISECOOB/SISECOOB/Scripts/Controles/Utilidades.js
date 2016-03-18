//javascript de inicio de pagina carga las funciones necesarias
$(document).ready(function () {
    setTimeout(function () {
        menu();
    }, 500);
});


function menu() {


    $.ajax({
        url: '/Utilidades/CargarMenu',
        type: 'get',
        cache: true,
        success: function (data) {
            
            var t = $('#menu-link');

            if (data.total > 0) {
                var html = '<tr><td class="col-md-3">{id}</td>'
                    + '<td class="col-md-3">{nombre}</td>'
                    + '<td class="col-md-3">{municipio}</td>'
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
        }
    });
}
