

//------------------------------------------------------------- 
//PAGE LOADER
head.js("/Content/assets/js/pace/pace.js", function() {

    paceOptions = {
        ajax: false, // disabled
        document: false, // disabled
        eventLag: false, // disabled
        elements: {
            selectors: ['.my-page']
        }
    };

});



//Notificaciones
head.js("/Content/assets/js/pnotify/jquery.pnotify.min.js");

//Main
head.js("/Scripts/main.js");

