// Cargar css y scrtips necesarios
head.load('Content/plugins/lightGallery-master/css/lightgallery.min.css');
head.load('Content/plugins/lightGallery-master/js/lightgallery.min.js', function () {

    // Plugins
    head.load('Content/plugins/lightGallery-master/js/lg-thumbnail.min.js');
    head.load('Content/plugins/lightGallery-master/js/lg-fullscreen.min.js');
    head.load('Content/plugins/lightGallery-master/js/lg-zoom.min.js');

    // Activar elementos que usaran el plugin
    $(document).ready(function () {

        $("[data-gallery]").lightGallery();
        
    });
});
