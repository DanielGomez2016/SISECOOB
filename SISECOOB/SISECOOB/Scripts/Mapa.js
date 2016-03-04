var cache = {};
var urlMapa = '/Mapa';
var xhrLocalizar;

var initMap = function (content,options) {
    var background = undefined;

    if (options != undefined && options.background != undefined) {
        background = options.background;
    }
    else
        background = new ol.layer.Tile({
            style: 'Road',
            source: new ol.source.MapQuest({ layer: 'osm' })
        });

    var manzanas = new ol.layer.Tile({
        source: new ol.source.TileArcGISRest({
            url: "http://mapas.electo.mx/ArcGIS/rest/services/Elementos_Electorales/Manzanas_Color_2015/MapServer"
        })
    });

    
    var map = new ol.Map({
        target: content,
        layers: [background],
        renderer: 'canvas',
        view: new ol.View({
            center: ol.proj.transform([-102.8777852, 23.4481877], 'EPSG:4326', 'EPSG:3857'),
            maxZoom: 18,
            minZoom: 5,
            zoom: 5
        })
    });

    var vPuntos = new ol.layer.Vector({
        id: 'puntos',
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#fff'
                }),
                stroke: new ol.style.Stroke({
                    color: '#333',
                    width: 4
                })
            })
        })
    });

    
    map.addLayer(vPuntos);


    map.bufferActivo = false;
    map.extent = options ? options.extent : undefined;


    // Función para calcular el extent
    map.getExtent = function () { return this.getView().calculateExtent(this.getSize()) }
    // Convertir coordenada a latlong
    map.translateToLongLat = function (coordinate) {
        return ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    }
    map.translateToXY = function (coordinate) {
        return ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
    }
    map.toGeographic = function (coordinate) {
        if (Math.abs(coordinate[0]) < 180 && Math.abs(coordinate[1]) < 90)
            return;

        if ((Math.abs(coordinate[0]) > 20037508.3427892) || (Math.abs(coordinate[1]) > 20037508.3427892))
            return;

        var x = coordinate[0];
        var y = coordinate[1];
        var num3 = x / 6378137.0;
        var num4 = num3 * 57.295779513082323;
        var num5 = Math.floor(parseFloat((num4 + 180.0) / 360.0));
        var num6 = num4 - (num5 * 360.0);
        var num7 = 1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * y) / 6378137.0)));
        coordinate[0] = num6;
        coordinate[1] = num7 * 57.295779513082323;

        return coordinate;
    }
    map.centerAndZoom = function (coord, zoom) {
        var view = map.getView();
        var duration = 2000;
        var start = +new Date();
        var delay = 0;

        if (view.getZoom() > 10) {
            // Cuando se esta viendo de un zoom mayor a 10 vamos a disminuir el zoom para que se agregue un efecto de alejar y luego acerar a la ubicación
            var zoomout = ol.animation.zoom({
                duration: duration,
                resolution: view.getResolution(),
                start: start
            });

            map.beforeRender(zoomout);
            view.setZoom(10);
            // Se incrementa el tiempo de la animación para que no se empalme con la otra animación de ubicar
            start = +new Date() + duration;
            delay = 1;
        }


        setTimeout(function () {
            // Se establece una animación para el centrado de la ubicación, para que no sea de golpe
            var pan = ol.animation.pan({
                duration: duration,
                source: view.getCenter(),
                start: start
            });
            // Se establece una animación para el zoom a determinado nivel para que igual no se muestre de golpe
            var zoomin = ol.animation.zoom({
                duration: duration,
                resolution: view.getResolution(),
                start: start
            });

            // Al agregar esto se va a realizar la animación de pan y zoom
            map.beforeRender(pan, zoomin);
            // Cuando ejecutemos la zoom y centrado se ejecutara la animación
            view.setZoom(zoom);
            view.setCenter(coord);
        }, duration * delay);

    }
    map.getVector = function (vector) {
        var vec = undefined;
        map.getLayers().getArray().map(function (e) {
            if (e != undefined && e.get('id') == vector) {
                vec = e;
                return;
            }
        });

        return vec;
    }
    map.dibujarPunto = function (vector,coord) {
        var iconGeometry = new ol.geom.Point(coord);
        map.getVector(vector).getSource().addFeature(new ol.Feature({
            geometry: iconGeometry
        }));
    }
    map.agregarGeometria = function (vector,geometria,feature) {
        var geo;

        switch (geometria.type) {
            case 'Point':
                geo = new ol.geom.Point(geometria.coordinates);
                break;
            case 'MultiPoint':
                geo = new ol.geom.ol.geom.MultiPoint(geometria.coordinates);
                break;
            case 'Polygon':
                geo = new ol.geom.Polygon(geometria.coordinates);
                break;
            case 'MultiPolygon':
                geo = new ol.geom.MultiPolygon(geometria.coordinates);
                break;
        }

        if (feature == undefined) feature = {};

        feature.geometry = geo;

        map.getVector(vector).getSource().addFeature(new ol.Feature(feature));
    }
    map.activateBuffer = function () {
        if (map.bufferActivo == true) {
            $('#xCentro').val('');
            $('#yCentro').val('');
            if( map.getVector('buffer'))
                map.getVector('buffer').getSource().clear();
            map.un('click', Busqueda.dibujarBufferSeleccion);
        }
        else 
            map.on('click', Busqueda.dibujarBufferSeleccion);
        
        map.bufferActivo = !map.bufferActivo;
        $('div[data-radio]').toggleClass('hide');
    }
    map.ubicarPersona = function (id) {
        $.ajax({
            url: '/Mapa/Ubicar',
            type: 'post',
            data: { id: id },
            beforeSend: function () {
                Loading('Localizando persona...');
            },
            complete: function () {
                Loading();
            },
            success: function (data) {
                if (data != null) {
                    data = map.translateToXY(map.toGeographic(data));
                    map.dibujarPunto('puntos', data);
                    map.centerAndZoom(data, 17);
                }
                else
                    AlertError('No se ha localizado a la persona');
            },
            error: function () {
                AlertError('No se ha localizado a la persona');
            }
        });

    }
    map.localizarArea = function (params) {

        var crearVector = function (data) {
            var layer = map.getVector('area');
            if (layer == undefined) {
                // Si no sea ha cargado aun esta capa creamos los estilos que tendrá,
                // estos estilos cambian de color dependiendo del partido
                layer = new ol.layer.Vector({
                    id: 'area',
                    source: new ol.source.Vector(),
                    style: (function () {

                        return function (feature, resolution) {

                        
                            var color = 'rgba(255,255,255,0.3)';
                            if (feature.get('color') != undefined)
                                color = feature.get('color');

                            var styleSeccion = new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'rgba(0,0,0,0.6)',
                                    width: 2
                                }),
                                fill: new ol.style.Fill({
                                    color: color
                                }),
                                text: new ol.style.Text({
                                    textAlign: 'center',
                                    baseline: 'bottom',
                                    font: '16px Calibri,sans-serif',
                                    text: '',
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            });

                            var styleInfo = new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'rgba(0,0,0,0.6)',
                                    width: 1
                                }),
                                text: new ol.style.Text({
                                    textAlign: 'center',
                                    baseline: 'bottom',
                                    font: '14px Calibri,sans-serif',
                                    offsetY: 18,
                                    text: '',
                                    fill: new ol.style.Fill({
                                        color: '#333'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 3
                                    })
                                })
                            });

                            return [styleSeccion]
                        };
                    }())
                });

                map.addLayer(layer);
            }


            layer.getSource().clear();

            var esMulti = false;

            data = Terraformer.WKT.parse(data);
            if (data.coordinates != undefined) {
                // Se tiene que convertir la latitud y longitud en coordenadas de XY
                for (var m in data.coordinates)
                    for (var n in data.coordinates[m]) {
                        if (data.coordinates[m][n].length == 2)
                            data.coordinates[m][n] = map.translateToXY(map.toGeographic(data.coordinates[m][n]));
                        else {
                            for (var o in data.coordinates[m][n])
                                data.coordinates[m][n][o] = map.translateToXY(map.toGeographic(data.coordinates[m][n][o]));
                            esMulti = true;
                        }
                    }
                       
                // Creamos el polígono y le pasamos las propiedades que debe tener
                var poli;
                if (esMulti == false)
                    poli = new ol.Feature(new ol.geom.Polygon(data.coordinates));
                else
                    poli = new ol.Feature(new ol.geom.MultiPolygon(data.coordinates));

                poli.setProperties(data);
                // Al agregar el poligo al vector automáticamente se ponen los estilos que debe tener.
                layer.getSource().addFeature(poli);
                map.setExtent(poli.getGeometry().getExtent());
            }
        }

        if (params.entidad == undefined || params.entidad == '') {
            map.centerAndZoom(ol.proj.transform([-102.8777852, 23.4481877], 'EPSG:4326', 'EPSG:3857'),5);
        }
        else {
            if (xhrLocalizar && xhrLocalizar.readyState != 4)
                xhrLocalizar.abort();

            xhrLocalizar = $.ajax({
                url: '/Mapa/LocalizarArea',
                type: 'post',
                data: {
                    entidad: params.entidad,
                    municipio: params.municipio,
                    seccion: params.seccion,
                    distritoFederal: params.distritoFederal,
                    distritoLocal: params.distritoLocal,
                    colonia: params.colonia
                },
                success: function (e) {
                    if (e.result == true) {
                        try {
                            crearVector(e.data);
                        }
                        catch (e) {
                            AlertError('No se ha podido ubicar');
                        }
                    }
                    else {
                        AlertError(e.message, 'No se ha podido ubicar');
                    }

                }


            });
        }

    }
    map.ubicarEsecman = function (esecman,callback) {

        if (esecman != undefined) {
            $.ajax({
                url: '/Mapa/UbicarEsecman',
                type: 'get',
                data: {
                    esecman: esecman,
                },
                success: function (e) {
                    if (e != null) {
                        try {
                            var coord = map.translateToXY(map.toGeographic(e));
                            map.dibujarPunto('puntos', coord);
                            map.centerAndZoom(coord, 17);
                        }
                        catch (ex) {
                            AlertError('No se ha podido ubicar');
                        }
                    }
                    else
                        AlertError('No se ha podido ubicar');

                    if (callback)
                        callback(e);
                }


            });
        }

    }
    map.setExtent = function (extent) {
        map.getView().fitExtent(extent, map.getSize());
    }


    if (map.extent != undefined)
        map.setExtent(map.extent);

    InfoGeometry.init(map);

    return map;
}

var Busqueda = {
    buscar: function (data,page) {

        data.map(function (e) {
            if (e.name == 'page') {
                if (page == undefined) {
                    Busqueda.detener();
                    page = 1;
                }

                e.value = page;
            }

            if (e.name == 'pageSize') {
                e.value = 200;
            }
        });

        // Cargar el extent
        var extent = map.getExtent();
        extent = {
            min: [extent[0], extent[1]],
            max: [extent[2], extent[3]],
        };

        data.push({
            name: 'xmin',
            value: extent.min[0]
        });
        data.push({
            name: 'ymin',
            value: extent.min[1]
        });
        data.push({
            name: 'xmax',
            value: extent.max[0]
        });
        data.push({
            name: 'ymax',
            value: extent.max[1]
        });

        Busqueda.xhr = $.ajax({
            url: urlMapa + '/BuscarPersonas',
            type: 'post',
            data: data,
            beforeSend: function () {
                Loading('Cargando datos... <br> <a class="btn btn-default btn-xs" onclick="Busqueda.detener()"><span class="fontawesome-remove-sign"></span> Detener</button>', '#map');
            },
            complete:function(){},
            success: function (result) {

                Busqueda.mostrarResultados(result,page == 1);
                if (result.length > 0) {
                    page++;
                    Busqueda.buscar(data,page);
                }
                else {
                    Loading(null,'#map');
                }
            }
        });
    },
    dibujarBufferSeleccion : function (e) {

        if (map == undefined) throw 'No se ha declarado el mapa';

        if (map.bufferActivo) {
            var vec = map.getVector('buffer');

            if (vec == undefined) {
                vec = new ol.layer.Vector({
                    id: 'buffer',
                    source: new ol.source.Vector({ projection: map.getView().getProjection() })
                });
                map.addLayer(vec);
            }
            else
                vec.getSource().clear();

            var wgs84Sphere = new ol.Sphere(6378137);
            var radio = parseInt($('#rad').val());
            var unidad = parseInt($('#unidad').val());
            if(!(radio > 0)){
                AlertError('No has especificado el radio');
                return;
            }
            var circulo = new ol.Feature(ol.geom.Polygon.circular(wgs84Sphere,map.translateToLongLat( e.coordinate), radio * unidad, 64).clone().transform('EPSG:4326','EPSG:3857'));
            vec.getSource().addFeature(circulo);

            var xy = e.coordinate;
            $('#xCentro').val(xy[0]);
            $('#yCentro').val(xy[1]);
            $('#radio').val(radio * unidad);
           
        }
    },
    mostrarResultados: function (data,limpiar) {

    var layer = map.getVector('busquedaPersona');
    if (layer == undefined) {
        layer = Vectores.busquedaPersonas('busquedaPersona');
        map.addLayer(layer);

        $('[data-capas]').append('<li class="col-md-12 col-sm-12"><label><input type="checkbox" data-layer="busquedaPersona" data-nombre="busquedaPersona" checked> Búsqueda agrupada</label></li>');

    }
    else if(limpiar == true || limpiar == undefined)
        layer.getSource().clear();

    if (!$('[data-mas="busqueda"]').hasClass('hide'))
        $('[data-mas="busqueda"]').click();

    if (data.length == 0) return;


    if (data[0].tipo == "entidad") {
        // Resultados de por entidad
        data.map(function (e) {
            if (e.center != undefined)
                layer.getSource().addFeature(new ol.Feature({
                    geometry: new ol.geom.Point(e.center),
                    name: e.nombre,
                    total: e.total,
                    type: e.tipo,
                    entidad: e.entidad
                }));
        });
    }
    else if (data[0].tipo == "seccion") {
        // Resultados de por sección
        data.map(function (e) {
            if (e.geometria != undefined) {

                e.geometria = Terraformer.WKT.parse(e.geometria);

                layer.getSource().addFeature(new ol.Feature({
                    geometry: new ol.geom.MultiPolygon(e.geometria.coordinates),
                    name: 'Sec. ' + e.seccion,
                    numero: e.numero,
                    total: e.total,
                    type: e.tipo,
                    seccion: e.seccion,
                    entidad: e.entidad
                }));
            }
        });
    }
    else if (data[0].tipo == "esecman") {
        // Resultados de por manzana
        data.map(function (e) {
            if (e.geometria != undefined)

                e.geometria = Terraformer.WKT.parse(e.geometria);

                layer.getSource().addFeature(new ol.Feature({
                    geometry: new ol.geom.MultiPolygon(e.geometria.coordinates),
                    name: '',
                    esecman: e.esecman,
                    total: e.total,
                    type: e.tipo,
                    entidad: e.entidad
                }));
        });
    }
    else if (data[0].tipo == "distritoFederal") {
        // Resultados de por manzana
        data.map(function (e) {
            if (e.geometria != undefined) {
                
                e.geometria = Terraformer.WKT.parse(e.geometria);

                layer.getSource().addFeature(new ol.Feature({
                    geometry: new ol.geom.MultiPolygon(e.geometria.coordinates),
                    name: 'Distrito Federal:' + e.distrito,
                    numero: e.distrito,
                    total: e.total,
                    type: e.tipo,
                    distritoFederal: e.distrito,
                    entidad: e.entidad
                }));
            }
        });
    }
    else if (data[0].tipo == "distritoLocal") {
        // Resultados de por manzana
        data.map(function (e) {
            if (e.geometria != undefined) {

                e.geometria = Terraformer.WKT.parse(e.geometria);

                layer.getSource().addFeature(new ol.Feature({
                    geometry: new ol.geom.MultiPolygon(e.geometria.coordinates),
                    name: 'Distrito Local:' + e.distrito,
                    numero: e.distrito,
                    total: e.total,
                    type: e.tipo,
                    distritoLocal: e.distrito,
                    entidad: e.entidad
                }));
            }
        });
    }
    },
    detener: function () {
        if (Busqueda.xhr && Busqueda.xhr.readyState != 4)
            Busqueda.xhr.abort();

        Loading(null, '#map');
    },
    xhr: undefined
}

var BusquedaPersonas = {
    buscar: function (data) {

        // Cargar el extent
        var extent = map.getExtent();

        extent = {
            min: [extent[0], extent[1]],
            max: [extent[2], extent[3]],
        };

        data.push({
            name: 'xmin',
            value: extent.min[0]
        });
        data.push({
            name: 'ymin',
            value: extent.min[1]
        });
        data.push({
            name: 'xmax',
            value: extent.max[0]
        });
        data.push({
            name: 'ymax',
            value: extent.max[1]
        });

        $.ajax({
            url: urlMapa + '/ListarPersonas',
            type: 'post',
            data: data,
            beforeSend: function () {
                Loading('Cargando datos', '#map');
            },
            success: BusquedaPersonas.mostrarResultados
        });
    },
    mostrarResultados: function (data) {

        var t = $('#tResultados tbody').empty();

        var layer = map.getVector('listaPersonas');

        if (layer == undefined) {
            layer = Vectores.listaPersonas('listaPersonas');
            map.addLayer(layer);
            $('[data-capas]').append('<li class="col-md-12 col-sm-12"><label><input type="checkbox" data-layer="listaPersonas" data-nombre="listaPersonas" checked> Búsqueda</label></li>');
        }
        else
            layer.getSource().clear();

        if (data.total > 0) {
            total = data.total;
            var html = '<tr onclick="map.centerAndZoom({coordenadas}, 17)"><td>{star}</td><td>{nombre}</td><td>{ocr}</td><td>{domicilio}</td></tr>';
            data.data.map(function (e) {
                e.star = e.activo == true ? '<span class="entypo-star"></span>' : '';
                e.geometria = Terraformer.WKT.parse(e.geometria);
                e.coordenadas =  '['+e.geometria.coordinates.toString() +']';
                map.agregarGeometria('listaPersonas', e.geometria, e);
                if(data.length == 1)
                    map.centerAndZoom(e.geometria.coordinates, 17);
                temp = html.format(e);
                t.append(temp);
            });
        }
        else {
            t.html('<tr><td class="text-center" colspan="15">No se encontraron resultados</td></tr>');
        }
        pag.updateControls(data.total);

        $('#tabOpciones a[href="#Resultados"]').tab('show')
    }
}

var BusquedaEventos = {
    buscar: function (data) {
        $.ajax({
            url: urlMapa + '/ListarEventos',
            type: 'post',
            data: data,
            beforeSend: function () {
                Loading('Cargando eventos', '#map');
            },
            success: BusquedaEventos.mostrarResultados
        });
    },
    mostrarResultados: function (data) {

        var t = $('#tEventos tbody').empty();

        var layer = map.getVector('puntos');
        layer.getSource().clear();

        if (data.total > 0) {
            total = data.total;
            var html = '<tr data-lat={latitud} data-long={longitud}><td>{nombre}</td><td>{fecha}</td><td>{horario}</td></tr>';
            data.data.map(function (e) {
                if ((e.latitud != null && e.latitud != undefined) && (e.longitud != null && e.longitud != undefined))
                {
                    try
                    {
                        map.dibujarPunto('puntos', map.translateToXY([e.longitud, e.latitud]));
                    }
                    catch(z)
                    {}
                }
                temp = html.format(e);
                t.append(temp);
            });
        }
        else {
            t.html('<tr><td class="text-center" colspan="3">No se encontraron resultados</td></tr>');
        }
        pag2.updateControls(data.total);

        $('#tabOpciones a[href="#Eventos"]').tab('show');
    }
}

var EnvioSms = {
    enviar: function (data) {

        // Cargar el extent
        var extent = map.getExtent();
        extent = {
            min: [extent[0], extent[1]],
            max: [extent[2], extent[3]],
        };

        data.push({
            name: 'xmin',
            value: extent.min[0]
        });
        data.push({
            name: 'ymin',
            value: extent.min[1]
        });
        data.push({
            name: 'xmax',
            value: extent.max[0]
        });
        data.push({
            name: 'ymax',
            value: extent.max[1]
        });

        $.ajax({
            url: urlMapa + '/EnviarSms',
            type: 'post',
            data: data,
            beforeSend: function () {
                Loading('Generando Solicitud', '#map');
            },
            success: function (data) {
                if (data.result) {
                    AlertSuccess('Se ha generado la solicitud de envió exitosamente', 'Envió Sms');
                } else
                    AlertError(data.message, 'Envió Sms');
            }
        });
    }
}
 
var Toolbar = {
    zoomIn: function () {
        map.getView().setZoom(map.getView().getZoom() + 1);
    },
    zoomOut: function () {
        map.getView().setZoom(map.getView().getZoom() - 1);
    },
    fullScreen: function () {
        if (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
        ) {
            var i = document.querySelector("#content-map");

            if (!document.mozFullScreen && !document.webkitIsFullScreen) {
                if (i.mozRequestFullScreen) {
                    i.mozRequestFullScreen();
                } else {
                    i.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else {
                    document.webkitCancelFullScreen();
                }
            }
        }
        else {
            $('#map').toggleClass('fullScreen');
        }
    },
    showLayers: function () {
        $('#content-layers').toggle();
    },
    showBuscador: function () {
        if (!$('#BusquedaPersona').is(':visible')) {
            $('#tabOpciones a[href="#BusquedaPersona"]').tab('show')
            $('#content-opciones').show();
        }
        else {
            $('#content-opciones').hide();
        }
    },
    showToolbar: function () {
        var boton = $(this);
        boton.toggleClass('fa-chevron-right');
        boton.toggleClass('fa-chevron-left');

        boton.parents('.toolbar').find('.opciones').slideToggle('fast');
    },
    showPredeterminadas: function () {
        if (!$('#ListaConsultas').is(':visible')) {
            $('#tabOpciones a[href="#Consultas"]').tab('show')
            $('#content-opciones').show();
        }
        else {
            $('#content-opciones').hide();
        }
    },
    showEventos: function () {
        if (!$('#FormularioEventos').is(':visible')) {
            $('#tabOpciones a[href="#Eventos"]').tab('show')
            $('#content-opciones').show();
        }
        else {
            $('#content-opciones').hide();
        }
    }
}

var hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(hex);
    return result ? [
       parseInt(result[1], 16),
       parseInt(result[2], 16),
       parseInt(result[3], 16)
    ]: null;
}

var Tematicos = {
    cargarTematicosElectorales : function (content) {
        $.ajax({
            url: urlMapa + '/CargarTematicosElectoral',
            type: 'get',
            success: function (data) {
                $(content).empty();
                data.map(function (e) {
                    $(content).append('<li class="col-md-12 col-sm-12 row"><label><input type="checkbox" data-layer="historico" data-anio="{anio}" data-eleccion="{tipoEleccion}" data-tipo="primera"> {tipoEleccion} {anio} - Primera Fuerza</label></li>'.format(e))
                              .append('<li class="col-md-12 col-sm-12 row"><label><input type="checkbox" data-layer="historico" data-anio="{anio}" data-eleccion="{tipoEleccion}" data-tipo="segunda" > {tipoEleccion} {anio} - Segunda Fuerza</label></li>'.format(e))
                              .append('<li class="col-md-12 col-sm-12 row"><label><input type="checkbox" data-layer="historico" data-anio="{anio}" data-eleccion="{tipoEleccion}" data-tipo="tercera"> {tipoEleccion} {anio} - Tercera Fuerza</label></li>'.format(e));
                });

                if (data.length == 0)
                    $(content).parents('li').addClass('hide');

                $('[data-tematicos]').delegate('[data-layer]', 'change', function () {
                    Tematicos.cargarTematico(this);
                });
            }
        });
    },
    cachearTematico : function (name, data) {
        if(!cache.hasOwnProperty(name) && data != undefined)
            cache[name] = data;
    
        return cache[name];
    },
    cargarTematico : function (obj) {
        var layer = obj.getAttribute('data-layer');
        var activar = $(obj).is(':checked');

        switch(layer){
            case 'historico':
                var anio = obj.getAttribute('data-anio'),
                    eleccion = obj.getAttribute('data-eleccion'),
                    tipo = obj.getAttribute('data-tipo');

                Tematicos.cargarInformacionTematicoElectoral(tipo, eleccion, anio, activar);

                // Se registra el tematico para cargar informacion al dar clic en feature
                InfoGeometry[ tipo + eleccion + anio] = function (feature,layer) {
                    InfoGeometry.tematicoElectoralGenerico(feature, layer);
                }
                break;
            case 'avance':
                var tipo = obj.getAttribute('data-tipo');

                Tematicos.cargarInformacionTematicoAvancePromocion(tipo, activar);
                break;
            case 'activados':
                Tematicos.cargarInformacionPromovidos('activados', '/CargarActivados', Colores.activados, activar);
                break;
            case 'activistas':
                Tematicos.cargarInformacionPromovidos('activistas', '/CargarActivistas',Colores.activistas, activar);
                break;
        }
    },
    cargarInformacionTematicoElectoral : function (tipo, eleccion, anio, activar) {

        var name = tipo + eleccion + anio;
        var data = Tematicos.cachearTematico(name);
        var layer = map.getVector(name);
        var layerInfoSeccion = map.getVector(name+'InfoSeccion');
        var layerInfoVotacion = map.getVector(name + 'InfoVotacion');

        

        if (layer != undefined) {
            // Si ya hay información sobre esta capa solo la vamos a encender/apagar
            layer.setVisible(activar);
            layerInfoSeccion.setVisible(activar);
            layerInfoVotacion.setVisible(activar);
        }
        else {

            layer = Vectores.historicoElectoral({
                name: name
            });
            layerInfoSeccion = Vectores.historicoElectoral({
                name: name+'InfoSeccion',
                resolution: 200,
                infoSeccion: true
            });
            layerInfoVotacion = Vectores.historicoElectoral({
                name: name + 'InfoVotacion',
                resolution: 50,
                infoVotacion: true
            });

            map.addLayer(layer);
            map.addLayer(layerInfoSeccion);
            map.addLayer(layerInfoVotacion);

            var loop = function (page) {
                // Cargamos la información sobre la capa a cargar
                $.ajax({
                    url: urlMapa + '/CargarInformacionTematicoElectoral',
                    type: 'post',
                    data: {
                        tipo: tipo,
                        eleccion: eleccion,
                        anio: anio,
                        cliente: $('#cliente').val(),
                        page: page,
                        pageSize: 50
                    },
                    success: function (data) {

                        data.map(function (e) {
                            if (e.geometria != undefined) {
                                e.geometria = Terraformer.WKT.parse(e.geometria);
                                // Se tiene que convertir la latitud y longitud en coordenadas de XY
                                // Creamos el polígono y le pasamos las propiedades que debe tener
                                var poli = new ol.Feature(new ol.geom.MultiPolygon(e.geometria.coordinates));
                                poli.setProperties(e);
                                // Al agregar el poligo al vector automáticamente se ponen los estilos que debe tener.
                                layer.getSource().addFeature(poli);
                                layerInfoSeccion.getSource().addFeature(poli);
                                layerInfoVotacion.getSource().addFeature(poli);
                            }

                        });

                        
                        if (data.length > 0) {
                            page++;
                            loop(page);
                        }
                    }

                });
            }
            loop(1);
        }

    
    },
    cargarInformacionTematicoAvancePromocion : function (tipo,activar) {

        var name = 'avance-'+tipo;
        var layer = map.getVector(name);
        var layerInfoSeccion = map.getVector(name + 'InfoSeccion');
        var layerInfoAvance = map.getVector(name + 'InfoAvance');

        if (layer != undefined) {
            // Si ya hay información sobre esta capa solo la vamos a encender/apagar
            layer.setVisible(activar);
            layerInfoSeccion.setVisible(activar);
            layerInfoAvance.setVisible(activar);
        }
        else {
            layer = Vectores.avancePromocion({
                name: name
            });
            layerInfoSeccion = Vectores.avancePromocion({
                name: name + 'InfoSeccion',
                resolution: 100,
                infoSeccion: true
            });
            layerInfoAvance = Vectores.avancePromocion({
                name: name + 'InfoAvance',
                resolution: 20,
                infoAvance: true
            });

            map.addLayer(layer);
            map.addLayer(layerInfoSeccion);
            map.addLayer(layerInfoAvance);

            var loop = function (page) {
                // Cargamos la información sobre la capa a cargar
                $.ajax({
                    url: urlMapa + '/CargarInformacionTematicoAvancePromocion',
                    type: 'post',
                    data: {
                        tipoAvance: tipo,
                        cliente: $('#cliente').val(),
                        page: page,
                        pageSize: 50
                    },
                    success: function (data) {

                        data.map(function (e) {
                            if (e.geometria != undefined) {
                                e.geometria = Terraformer.WKT.parse(e.geometria);

                                // Creamos el polígono y le pasamos las propiedades que debe tener
                                var poli = new ol.Feature(new ol.geom.MultiPolygon(e.geometria.coordinates));
                                poli.setProperties(e);
                                // Al agregar el poligo al vector automáticamente se ponen los estilos que debe tener.
                                layer.getSource().addFeature(poli);
                                layerInfoSeccion.getSource().addFeature(poli);
                                layerInfoAvance.getSource().addFeature(poli);
                            }

                        });

                        if (data.length > 0) {
                            page++;
                            loop(page);
                        }
                    }

                });

            }

            loop(1);
        }
    },
    cargarInformacionPromovidos: function (name, url, hexColor, activar) {
        var data = Tematicos.cachearTematico(name);
        var layer = map.getVector(name);
        var layer2 = map.getVector(name + '5');


        if (layer != undefined) {
            // Si ya hay información sobre esta capa solo la vamos a encender/apagar
            layer.setVisible(activar);
            layer2.setVisible(activar);
        }
        else {
            
            layer = Vectores.activados(name, undefined, hexColor);
            layer2 = Vectores.activados(name, 5, hexColor);

            map.addLayer(layer);
            map.addLayer(layer2);

            var loop = function (page) {
                $.ajax({
                    url: urlMapa + url,
                    type: 'post',
                    data: {
                        page: page,
                        pageSize: 100
                    },
                    success: function (data) {
  
                        data.map(function (e) {
                            
                            var feature = new ol.Feature({geometry: new ol.geom.Point(e.geometria)});
                            feature.setProperties(e);

                            layer.getSource().addFeature(feature);
                            layer2.getSource().addFeature(feature);
                        });


                        if (data.length > 0) {
                            page++;
                            loop(page);
                        }
                    }

                });
            }

            loop(1);
        }
    }
}

var Capas = {
    _TileArcGISRest: 'TileArcGISRest',
    _TileWMS: 'TileWMS',
    cargarCapas: function (content) {
        $.ajax({
            type: 'GET',
            url: urlMapa + '/CargarCapas',
            success: function (data) {

                if (data.length == 0) {
                    $(content).parent().hide();
                }
                else {
                    data.map(function (e) {

                        e.title = e.extras != undefined && e.extras.hasOwnProperty('title') ? e.extras.title : e.title = e.nombre;
                        e.checked = e.extras != undefined && e.extras.hasOwnProperty('visible') && e.extras.visible == true ? 'checked="checked"' : '';

                        $(content).append('<li class="col-md-12 col-sm-12"><label><input type="checkbox" data-layer="capa" data-nombre="{nombre}"  data-source="{tipoSource}" {checked}> {title}</label></li>'.format(e))
                        Capas.cargarServicio(e.nombre, e.url,e.tipoSource, e.parametros, e.extras);
                    });

                    $('[data-capas]').delegate('[data-layer]', 'change', function () {
                        Capas.mostrar(this.getAttribute('data-nombre'), $(this).is(':checked'));
                    });
                }
            }
        });
    },
    cargarServicio : function (id,url,tipoSource,params,extras) {


        var source = undefined;

        switch(tipoSource){
            case Capas._TileArcGISRest:
                source = new ol.source.TileArcGISRest(params);
                break;
            case Capas._TileWMS:
                source = new ol.source.TileWMS(params);
                break;

        }

        var vectorLayer = new ol.layer.Tile({
            id: id,
            source: source,
            visible: extras.visible
        })

        map.addLayer(vectorLayer);

      
    },
    mostrar: function (id, activar) {
        var topLayer = map.getVector(id);
        var layers = map.getLayers();

        if (activar) {
            layers.remove(topLayer);
            layers.push(topLayer);
        }

        topLayer.setVisible(activar);
    }
}


var ConsultaPredeterminada = {
    init: function () {

        // Registrar la consulta
        $('#fConsulta').submit(function (e) {
            e.preventDefault();
            if ($(this).valid()) {
                $('#frmBusquedaPersona').find('#page').val(pag.getCurrentPage());
                $('#frmBusquedaPersona').find('#pageSize').val(pag.getPageSize());
                var params = $(this).serializeArray();
                $.each($('#frmBusquedaPersona').serializeArray(), function (i, v) {
                    params.push(v);
                });
                $.each(ConsultaPredeterminada.cargarCapas(), function (i, v) {
                    params.push({ name: 'capas', value: v });
                });
                $.each(ConsultaPredeterminada.cargarTematicos(), function (i, v) {
                    params.push({ name: 'tematicos', value: v });
                });
                params.push({ name: 'inegi', value: null });

                $.ajax({
                    type: "POST",
                    url: urlMapa + "/GuardarConsulta",
                    data: params,
                    success: function (data) {
                        if (data.result == true) {
                            ConsultaPredeterminada.buscarConsultas();
                            AlertSuccess('Se ha guardado la consulta exitosmanete', 'Mapa');
                        } else
                            AlertError(data.message, 'Mapa');
                    }
                });
            }
        });

        // Cargar la consulta
        $('#ListaConsultas ul').on('change', 'input:checkbox', function () {
            $('#ListaConsultas ul input:checkbox').not(this).prop('checked', false);
            if (ConsultaPredeterminada.actual != $(this).data('id')) {
                ConsultaPredeterminada.actual = $(this).data('id');
                $('[data-tematicos] input:checkbox').prop('checked', false);
                $('[data-capas] input:checkbox').prop('checked', false);
            }
            ConsultaPredeterminada.cargarConsulta($(this).data('id'), $(this).is(':checked'));
        });

        // Eliminar la consulta
        $('#ListaConsultas ul').on('click', 'li .close', function () {
            if (confirm('Desea eliminar la consulta seleccionada')) {
                var field = $(this).closest('li');
                $.ajax({
                    type: "POST",
                    url: urlMapa + "/EliminarConsulta",
                    data: { nombre: field.find('input:checkbox').data('id') },
                    success: function (data) {
                        if (data.result) {
                            field.remove();
                            AlertSuccess('Se ha eliminado la consulta exitosmanete', 'Mapa');
                        } else
                            AlertError(data.message, 'Mapa');
                    }
                });
            }
        });

        ConsultaPredeterminada.buscarConsultas();
    },
    cargarCapas: function () {
        var capas = [];
        $('[data-capas] input:checkbox:checked').each(function () {
            var temp = $(this).data();
            capas.push(Object.keys(temp).map(function (key) {
                return '[data-' + key + '="' + temp[key] + '"]'
            }).join(''));
        });
        return capas;
    },
    cargarTematicos: function () {
        var tematicos = [];
        $('[data-tematicos] input:checkbox:checked').each(function () {
            var temp = $(this).data();
            tematicos.push(Object.keys(temp).map(function (key) {
                return '[data-' + key + '="' + temp[key] + '"]'
            }).join(''));
        });
        return tematicos;
    },
    buscarConsultas: function () {
        $.ajax({
            type: "GET",
            url: urlMapa + "/BuscarConsultas",
            data: {}
        })
        .done(function (data) {
            var t = $('#ListaConsultas ul').empty();
            ConsultaPredeterminada.consultas = {};

            var html = '<li><label><input type="checkbox" data-id="{nombre}" /> {nombre}</label>{extra}</li>';
            data.map(function (e) {
                if (e.eliminable == true)
                    e.extra = '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                else
                    e.extra = '';

                temp = html.format(e);
                t.append(temp);
                ConsultaPredeterminada.consultas[e.nombre] = e;
            });
        });
    },
    cargarConsulta: function (nombre, activo) {
        data = ConsultaPredeterminada.consultas[nombre];
        if (data == undefined) {
            $.ajax({
                type: "GET",
                url: urlMapa + "/CargarConsulta",
                data: {
                    nombre: nombre
                },
                success: function (nData) {
                    data = nData;
                }
            });
        }


        if ((data.tematicos != null && data.tematicos.length > 0) || (data.capas != null && data.capas.length > 0)) {
            $('#content-layers').show();

            if (data.tematicos != null && data.tematicos.length > 0) {
                $.each(data.tematicos, function (i, v) {
                    var f = $('[data-tematicos] input:checkbox' + v);
                    if (f.length > 0) {
                        f.prop('checked', !$(f).is(':checked'));
                        Tematicos.cargarTematico(f[0]);
                    }
                });
            }
            if (data.capas != null && data.capas.length > 0) {
                $.each(data.capas, function (i, v) {
                    var f = $('[data-capas] input:checkbox' + v);
                    if (f.length > 0) {
                        f.prop('checked', !$(f).is(':checked'));
                        Capas.mostrar(f[0], $(f).is(':checked'));
                    }
                });
            }
        }

        // Cargar filtros
        if (data.filtro != null && activo) {

            for(var m in data.filtro){
                $('#frmBusquedaPersona').find('[name="'+m+'"]').val('');
                if(data.filtro[m] != '' && data.filtro[m] != undefined){
                    $('#frmBusquedaPersona').find('[name="' + m + '"]').val(data.filtro[m]);
                }
            }

            $('#frmBusquedaPersona').find('#municipio').attr('data-default', data.filtro.municipio)
            $('#frmBusquedaPersona').find('#entidad').change();
            

            setTimeout(function () {
                $('#frmBusquedaPersona').submit();
            }, 1500); 
        }

        if (data.inegi != null && data.inegi != '' && activo)
            CargarTematicosINEGI(data.inegi);
    },
    consultas: undefined,
    actual: undefined
}

var Colores = {
    activados: '#137832',
    activistas: '#EE1A31'
}

var Vectores = {
    busquedaPersonas: function(name){
        return (new ol.layer.Vector({
            id: 'busquedaPersona',
            source: new ol.source.Vector(),
            style: (function () {

                return function (feature, resolution) {
                    var agrupadoStyle = [new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#333',
                            width: 2
                        }),
                        text: new ol.style.Text({
                            baseline: 'top',
                            textAlign: 'center',
                            font: '12px Calibri,sans-serif',
                            text: feature.get('name'),
                            fill: new ol.style.Fill({
                                color: '#333'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#fff',
                                width: 3
                            })
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(100,100,100,0.5)'
                        })
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 2
                        }),
                        text: new ol.style.Text({
                            textAlign: 'center',
                            baseline: 'bottom',
                            font: '12px Calibri,sans-serif',
                            offsetY: 12,
                            text: feature.get('total'),
                            fill: new ol.style.Fill({
                                color: '#333'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#fff',
                                width: 3
                            })
                        })
                    })];

                    return agrupadoStyle;
                };
            }())
        }));
    },
    listaPersonas: function (name) {
        return (new ol.layer.Vector({
            id: name,
            source: new ol.source.Vector(),
            style: (function () {

                return function (feature, resolution) {

                    var pesoRed = parseInt(feature.get('pesoRed'));
                    var color = pesoRed > 0 ? Colores.activistas : Colores.activados;

                    var styleSeccion = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 4,
                            fill: new ol.style.Fill({
                                color: color
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#333',
                                width: 1
                            })
                        })
                    });

                    return [styleSeccion]
                };
            }())
        }));
    },
    activados: function (name, resolution, color) {
        return (new ol.layer.Vector({
            id: name + (resolution != undefined ? resolution : ''),
            source: new ol.source.Vector(),
            maxResolution: resolution,
            style: (function () {

                return function (feature, resolution) {

                    var total = feature.get('total');
     
                    var styles = [];

                    var styleSeccion = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 1
                        }),
                        image: new ol.style.Circle({
                            radius: 8,
                            fill: new ol.style.Fill({
                                color: color
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#333',
                                width: 1
                            })
                        })
                    });

                    var styleInfo = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 1
                        }),
                        text: new ol.style.Text({
                            textAlign: 'center',
                            baseline: 'middle',
                            font: '10px Calibri,sans-serif',
                            text: total,
                            fill: new ol.style.Fill({
                                color: '#fff'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#333',
                                width: 1
                            })
                        })
                    });

                    styles.push(styleSeccion);

                    if (resolution != undefined)
                        styles.push(styleInfo);

                    return styles;
                };
            }())
        }));

    },
    avancePromocion: function (options) {
        var getAvance = function (avance, meta) {
            avance = parseInt(avance);
            meta = parseInt(meta);
            var result = 0;

            if (isNaN(avance)) avance = 0;
            if (isNaN(meta)) meta = 0;

            if (isFinite(avance / meta)) {
                result = avance * 100 / meta;
            }

            return result;
        }


        return (new ol.layer.Vector({
            id: options.name,
            source: new ol.source.Vector(),
            maxResolution: options.resolution,
            style: (function () {

                return function (feature, resolution) {

                    var avance = feature.get('avance'),
                        meta = feature.get('meta'),
                        result = getAvance(avance, meta),
                        color = hexToRgb(partido);

                    color.push(result / 100); // Agregar opacidad dependiendo de la avance

                    var styleSeccion = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 1
                        }),
                        fill: new ol.style.Fill({
                            color: color
                        })
                    });

                    var styleInfoSeccion = new ol.style.Style({
                        text: new ol.style.Text({
                            textAlign: 'center',
                            baseline: 'bottom',
                            font: '14px Calibri,sans-serif',
                            text: 'Sec. ' + feature.get('seccion'),
                            fill: new ol.style.Fill({
                                color: '#000'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#fff',
                                width: 3
                            })
                        })
                    });

                    var styleInfoAvance = new ol.style.Style({
                        text: new ol.style.Text({
                            textAlign: 'center',
                            baseline: 'bottom',
                            font: '12px Calibri,sans-serif',
                            offsetY: 16,
                            text: 'Avance: ' + avance + ' de ' + meta + ' (' + result.toFixed(2) + '%)',
                            fill: new ol.style.Fill({
                                color: '#333'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#fff',
                                width: 3
                            })
                        })
                    });

                    var styles = [];

                    if (options.resolution == undefined)
                        styles.push(styleSeccion);

                    if (options.infoSeccion == true)
                        styles.push(styleInfoSeccion);

                    if (options.infoAvance == true)
                        styles.push(styleInfoAvance);

                    return styles;
                };
            }())
        }));
    },
    historicoElectoral: function (options) {
       
        return (new ol.layer.Vector({
            id: options.name,
            source: new ol.source.Vector(),
            maxResolution: options.resolution,
            style: (function () {
                return function (feature, resolution) {
                    var color = '#ccc';
                    if (feature.get('color') != undefined)
                        color = feature.get('color');

                    var styleSeccion = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 1
                        }),
                        fill: new ol.style.Fill({
                            color: color
                        })
                    });

                    var styleInfoSeccion = new ol.style.Style({
                        text: new ol.style.Text({
                            textAlign: 'center',
                            baseline: 'middle',
                            font: '16px Calibri,sans-serif',
                            text: 'Sec. ' + feature.get('seccion'),
                            fill: new ol.style.Fill({
                                color: '#000'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#fff',
                                width: 2
                            })
                        })
                    });

                    var styleInfoAvance = new ol.style.Style({
                        text: new ol.style.Text({
                            textAlign: 'center',
                            baseline: 'middle',
                            font: '14px Calibri,sans-serif',
                            offsetY: 18,
                            text: 'Votos: ' + feature.get('totalVotosFuerza') + ' - LN: ' + feature.get('totalLN'),
                            fill: new ol.style.Fill({
                                color: '#333'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#fff',
                                width: 2
                            })
                        })
                    });

                    var styles = [];

                    if (options.resolution == undefined)
                        styles.push(styleSeccion);
                    if (options.infoSeccion == true)
                        styles.push(styleInfoSeccion);
                    if (options.infoVotacion == true)
                        styles.push(styleInfoAvance);

                    return styles;
                };
            }())
        }));
    },
    consultaInegi: function (options) {

        return (new ol.layer.Vector({
            id: options.name,
            source: new ol.source.Vector(),
            maxResolution: options.resolution,
            style: (function () {
                return function (feature, resolution) {
                    var color = '#ccc';
                    if (feature.get('color') != undefined)
                        color = feature.get('color');

                    var styleSeccion = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 1
                        }),
                        fill: new ol.style.Fill({
                            color: color
                        })
                    });

                    var styles = [];

                    styles.push(styleSeccion);
   
                    return styles;
                };
            }())
        }));
    }

}

var InfoGeometry = {
    init: function (map) {

        map.on("click", function (e) {

            var ejecuciones = {};

            map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                var type = layer.get('id');
                // Se almacenara los procesos que se deberán ejecutar con este clic
                // Solo se ejecutaran los que estan registrados en esta variable de InfoGeometry y la primera Feature
                if(InfoGeometry.hasOwnProperty(type) && !ejecuciones.hasOwnProperty(type))
                    ejecuciones[type] = { 
                        feature:feature,
                        layer: layer
                    };
            });

            $(document.body).find('#modalInfoGeometry .modal-body').empty();

            for (var m in ejecuciones)
                InfoGeometry[m](ejecuciones[m].feature, ejecuciones[m].layer);

            
        });

        if ($(document.body).find('#modalInfoGeometry').length == 0) {
            $(document.body).append('<div id="modalInfoGeometry" class="modal fade"><div style="width:60%" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Información en la ubicación seleccionada</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary"  data-dismiss="modal">Aceptar</button></div></div></div></div>');
        }

        
    },
    busquedaPersona: function (feature, layer) {

        var form = $('#modalInfoGeometry #frmModalBusquedaPersonas');
        
        InfoGeometry.busquedaPersonaFeature = feature;

        if (form.length == 0) {
            $('#modalInfoGeometry .modal-body').append('<form id="frmModalBusquedaPersonas"><h3>Activados</h3><input type="hidden" name="page" value="1" /><input type="hidden" name="pageSize" value="10" /></form>');
            $('#modalInfoGeometry #frmModalBusquedaPersonas').append('<table id="tModalBusqueda" class="table table-stripped table-condensed"><thead><tr><th>OCR</th><th>Nombre</th><th>Celular</th><th>Domicilio</th><th>Entidad</th><th>Sección</th><th>Peso Red</th><th>Activista</th></tr></thead><tbody><tr><td colspan="20" class="text-center">Cargado resultados</dt></tr></tbody><tfoot><tr><td colspan="20"><div id="modalPaginador" class="paginacion"></div></td></tr></tfoot><table>')
            form = $('#modalInfoGeometry #frmModalBusquedaPersonas');

            InfoGeometry.busquedaPersonaPaginacion = new Paginacion({
                content: '#frmModalBusquedaPersonas #modalPaginador',
                search: function () {
                    form.submit();
                },
                info:true
            });

            form.submit(function (e) {
                e.preventDefault();

                var tipo = InfoGeometry.busquedaPersonaFeature.get('type');
                var params = [];

                params.push({
                    name: 'page',
                    value: InfoGeometry.busquedaPersonaPaginacion.getCurrentPage()
                });

                params.push({
                    name: 'pageSize',
                    value: InfoGeometry.busquedaPersonaPaginacion.getPageSize()
                });

                if (tipo != 'entidad') {
                    params.push({
                        name: 'entidad',
                        value: InfoGeometry.busquedaPersonaFeature.get('entidad')
                    });
                }

                if (InfoGeometry.busquedaPersonaFeature.get('activado')) {
                    params.push({
                        name: 'esPromotor',
                        value: false
                    });
                }

                if (InfoGeometry.busquedaPersonaFeature.get('activista')) {
                    params.push({
                        name: 'esPromotor',
                        value: true
                    });
                }

                params.push({
                    name: tipo,
                    value: InfoGeometry.busquedaPersonaFeature.get(tipo)
                });


                if (InfoGeometry.xhrBusquedaPersona && InfoGeometry.xhrBusquedaPersona.readyState != 4)
                    InfoGeometry.xhrBusquedaPersona.abort();

                InfoGeometry.xhrBusquedaPersona = $.ajax({
                    url: '/Mapa/ListarPersonas',
                    type: 'post',
                    data: params,
                    beforeSend: function () { },
                    complete: function () { },
                    success: function (e) {

                        var t = form.find('#tModalBusqueda tbody').empty();

                        if (e.total == 0) {
                            t.append('<tr><td class="text-center" colspan="20">No se encontraron resultados</td></tr>');
                        }
                        else {
                            e.data.map(function (data) {
                                t.append('<tr><td>{ocr}</td><td><div style="max-width:150px">{nombre}</div></td><td>{celular}</td><td><div style="max-width:150px">{domicilio}<div></td><td>{entidad}</td><td>{seccion}</td><td>{pesoRed}</td><td><div style="max-width:100px">{promotor}</div></td></tr>'.format(data));
                            });

                        }

                        InfoGeometry.busquedaPersonaPaginacion.updateControls(e.total);
                        $('#modalInfoGeometry').modal('show');
                    }
                });
            });
        }

        form.submit();

    },
    listaPersonas: function (feature, layer) {
        feature.set('type','esecman');
        InfoGeometry.busquedaPersona(feature, layer);
    },
    'avance-electoral': function (feature, layer) {
        $('#modalInfoGeometry').modal('show');

        var grafica = $('#modalInfoGeometry #modalAvanceElectoral');

        if (grafica.length == 0) {
            $('#modalInfoGeometry .modal-body').append('<div id="modalAvanceElectoral" style="width:100%"></div>');
            grafica = $('#modalInfoGeometry #modalAvanceElectoral')
        }

        grafica.hide();
        grafica.highcharts({
            chart: {
                backGroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Avance<br>Electoral',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            credits: false,
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        },
                        format: '{point.name} {y}'
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Avance',
                innerSize: '50%',
                data: [
                    {
                        name: 'Avance',
                        color: Colores.activados,
                        y: feature.get('avance')

                    },
                    {
                        name: 'Meta',
                        color: '#666',
                        y: parseInt(feature.get('meta')) - parseInt(feature.get('avance'))

                    }
                ]
            }]
        });
        setTimeout(function () {
            grafica.show();
            grafica.highcharts().reflow();
        }, 1000);
       
    },
    'avance-sms': function (feature, layer) {
        $('#modalInfoGeometry').modal('show');

        var grafica = $('#modalInfoGeometry #modalAvanceElectoral');

        if (grafica.length == 0) {
            $('#modalInfoGeometry .modal-body').append('<div id="modalAvanceSMS" style="width:100%"></div>');
            grafica = $('#modalInfoGeometry #modalAvanceSMS')
        }

        grafica.hide();
        grafica.highcharts({
            chart: {
                backGroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Avance<br>SMS',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            credits: false,
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        },
                        format: '{point.name} {y}'
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Avance',
                innerSize: '50%',
                data: [
                    {
                        name: 'Avance',
                        color: Colores.activados,
                        y: feature.get('avance')

                    },
                    {
                        name: 'Meta',
                        color: '#666',
                        y: parseInt(feature.get('meta')) - parseInt(feature.get('avance'))

                    }
                ]
            }]
    });
    setTimeout(function () {
        grafica.show();
        grafica.highcharts().reflow();
    }, 1000);
       
    },
    'avance-web': function (feature, layer) {
        $('#modalInfoGeometry').modal('show');

        var grafica = $('#modalInfoGeometry #modalAvanceWEB');

        if (grafica.length == 0) {
            $('#modalInfoGeometry .modal-body').append('<div id="modalAvanceWEB" style="width:100%"></div>');
            grafica = $('#modalInfoGeometry #modalAvanceWEB')
        }

        grafica.hide();
        grafica.highcharts({
            chart: {
                backGroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Avance<br>Tradicional',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            credits: false,
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        },
                        format: '{point.name} {y}'
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Avance',
                innerSize: '50%',
                data: [
                    {
                        name: 'Avance',
                        color: Colores.activados,
                        y: feature.get('avance')

                    },
                    {
                        name: 'Meta',
                        color: '#666',
                        y: parseInt(feature.get('meta')) - parseInt(feature.get('avance'))

                    }
                ]
            }]
        });
        setTimeout(function () {
            grafica.show();
            grafica.highcharts().reflow();
        }, 1000);

    },
    activados: function (feature, layer) {
        feature.set('type', 'esecman');
        feature.set('activado', true);
        InfoGeometry.busquedaPersona(feature, layer);
    },
    activistas: function (feature, layer) {
        feature.set('type', 'esecman');
        feature.set('activista', true);
        InfoGeometry.busquedaPersona(feature, layer);
    },
    tematicoElectoralGenerico: function (feature, layer) {
        
        if ($('#modalInfoGeometry #modalHistoricoElectoral').length == 0) {
            $('#modalInfoGeometry .modal-body').append('<div id="modalHistoricoElectoral"><h3>Históricos Electorales</h3><table id="tHistoricos" class="table table-stripped table-condensed"><thead></thead><tbody></tbody></table></div>');
        }

        if ($('#modalInfoGeometry #tHistoricos').find('[data-eleccion="' + feature.get('tipoEleccion') + '"]').length == 0) {

            $.ajax({
                url: '/Mapa/CargarHistoricosElectorales',
                type: 'POST',
                data: {
                    entidad: feature.get('entidad'),
                    seccion: feature.get('seccion'),
                    tipoEleccion: feature.get('tipoEleccion')
                },
                beforeSend: function () { },
                complete: function () { },
                success: function (data) {

                    $('#modalInfoGeometry').modal('show');
                    var table = $('#modalInfoGeometry #tHistoricos');

                    var categories = [];
                    var series = [];
                    var th = table.find('thead').empty();
                    var tb = table.find('tbody');
                    var header = '<tr><th>Elección</th>{partidos}<th>Total Nulos</th><th>Total Votos</th><th>LN</th></tr>';

                    if (data.length > 0) {
                        var partidos = [];
                        var pHead = '';
                        $.each(data, function (i, v) {
                            $.each(v.votos, function (i2, v2) {
                                if (partidos.indexOf(v2.partido) == -1) {
                                    partidos.push(v2.partido);
                                    pHead += '<th>' + v2.partido + '</th>';
                                }
                            });
                        });

                        th.html(header.format({ partidos: pHead }));

                        var html = '<tr data-eleccion="{eleccion}"><td>{eleccion}</td>{partidos}<td>{nulos}</td><td>{total}</td><td>{totalListado}</td></tr>';

                        data.map(function (e) {


                            e.partidos = '';

                            $.each(partidos, function (i, v) {
                                if (e.votos.length > i && v == e.votos[i].partido)
                                    e.partidos += '<td>' + e.votos[i].total + '</td>';
                                else
                                    e.partidos += '<td>0</td>';
                            });

                            temp = html.format(e);
                            tb.append(temp);
                        });
                    }
                    else {
                        th.html(header.format({ partidos: '' }));
                        tb.html('<tr><td class="text-center" colspan="4">No se encontraron resultados</td></tr>');
                    }

                }
            });
        }
       
    },
    inegi: function(feature, layer){

        if ($('#modalInfoGeometry #mInegi').length == 0) {
            $('#modalInfoGeometry .modal-body').append('<div id="mInegi"><h3>Información del INEGI</h3><ul id="list-inegi" class="list-group"></ul></div>');
        }

        var ul = $('#mInegi').find('#list-inegi');

        var variables = feature.get('variables');

        for (var m in variables) {
            if ($('#mInegi').find('[data-variable="'+m+'"]').length == 0)
                ul.append('<li class="list-group-item" data-variable="'+m+'">' + variables[m].name + '<span class="badge">' + variables[m].valor + (variables[m].tipo == 'promedio' ? '%' :'') + '</span></li>');
        }

        $('#modalInfoGeometry').modal('show');
    }

}

var INEGI = {
    init: function () {
        if ($(document.body).find('#tematicos ul:first #inegi').length == 0) {
            $('#tematicos ul:first').append('<li><div class="nest"><div  class="title-alt"><h6>Datos INEGI</h6><div class="titleToggle"><a class="nav-toggle-alt" href="#inegi"><span class="entypo-up-open"></span></a></div></div></div><div id="inegi" class="body-nest"><ul data-tematicos="inegi" class="nav nav-third-level"></ul></div></li>');
        }
        if ($(document.body).find('#modalInegi').length == 0) {
            $(document.body).append('<div id="modalInegi" class="modal fade"><div style="width:60%" class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Consultar datos del INEGI</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary" onclick="$(\'#frmInegi\').submit()">Generar</button></div></div></div></div>');
        }

        $('[data-tematicos="inegi"]').delegate('[data-layer]', 'change', function () {
            var layer = map.getVector(this.getAttribute('data-layer'));
            layer.setVisible($(this).is(':checked'));
        });

        $.ajax({
            url: '/Mapa/ConsultaInegi',
            type: 'get',
            beforeSend: function () { },
            complete: function () { },
            success: function (html) {
                $('#modalInegi .modal-body').html(html);
            }

        });
    },
    show:function(){
        $('#modalInegi').modal('show');
    },
    cargarVariables: function (tipo, callback) {

        $.ajax({
            url: '/Mapa/CargarVariablesInegi',
            type: 'get',
            data:{tipo : tipo},
            beforeSend: function () { },
            complete: function () { },
            success: function (data) {

                if (callback)
                    callback(data);
                
            }

        });
    },
    generarConsulta:function(params){

        var name = [];

  
        if (params.secciones == undefined || params.secciones.length == 0) {
            AlertError('No has seleccionado ninguna sección.');
            return;
        }

        if (INEGI.filtros.length == 0) {
            AlertError('No has configurado las variables para generar la consulta.');
            return;
        }


        INEGI.filtros.map(function (e) {
            switch (e.operador) {
                case '>':
                case '<':
                case '=':
                    name.push(e.variable + ' ' + e.operador + ' ' + e.valorInicial);
                    break;
                case '/':
                    name.push('(' + e.variable + ' ENTRE ' + e.valorInicial + ' Y ' + e.valorFinal +')');
                    break;

            }
        });


        params.filtros = INEGI.filtros;

        name = name.join(' Y ');

        AlertSuccess('Iniciando consulta', 'Consulta de INEGI');

        $.ajax({
            url: '/Mapa/ConsultaInegi',
            type: 'post',
            data: JSON.stringify({ consulta: params }),
            contentType: 'application/json',
            beforeSend: function () {
                Loading('Generando consulta');
            },
            success: function (e) {

                if (e.result == true && e.data.length > 0) {
                    $('#inegi ul:first').append('<li class="col-md-12 col-sm-12 row"><label><input type="checkbox" data-layer="' + name + '" checked> ' + name + '</label></li>');

                    // Registrar temático para que se cargue informacion al dar clic en el shape
                    InfoGeometry[name] = function (feature, layer) {
                        InfoGeometry.inegi(feature, layer);
                    }

                    var layer = map.getVector(name);

                    if (layer != undefined) {
                        layer.setVisible(activar);
                    }
                    else {
                        layer = Vectores.consultaInegi({
                            name: name,
                            color: params.color
                        });
                        map.addLayer(layer);
                    }
                       
                    // Obtener máximo para determinar el color
                    var max = 0;

                    e.data.map(function (e) {
                        if (e.variables[params.filtros[0].variable].valor > max)
                            max = e.variables[params.filtros[0].variable].valor;
                    });

                    e.data.map(function (e) {
                        if (e.shape != undefined) {
                            e.shape = Terraformer.WKT.parse(e.shape);
                            var poli = new ol.Feature(new ol.geom.MultiPolygon(e.shape.coordinates));

                            e.color = agregarOpacidad(params.color, e.variables[params.filtros[0].variable].valor, max);

                            poli.setProperties(e);
                            layer.getSource().addFeature(poli);
                        }

                    });

                    INEGI.filtros = [];
                    INEGI.filtrosTexto = [];
                    $('#vistaConsulta').empty();

                    $('#modalInegi').modal('hide');
                    AlertSuccess('Se ha terminado de generar la consulta','Consulta de INEGI');
                }
                else if (e.result == true && e.data.length == 0) {
                    AlertSuccess('Se ha terminado la consulta, pero no se han encontrado resultados.', 'Consulta INEGI');
                }
                else
                    AlertError(e.message,'Consulta INEGI');

            }
        });


       
    }
    
};

var agregarOpacidad = function (color,valor,limite) {
    
    valor = parseInt(valor);
    limite = parseInt(limite);
    var result = 0;

    if (isNaN(valor)) valor = 0;
    if (isNaN(limite)) limite = 0;

    if (isFinite(valor / limite)) {
        result = valor * 100 / limite;
    }

    
    color = hexToRgb(color);

    color.push(result / 100);

    return color;
}