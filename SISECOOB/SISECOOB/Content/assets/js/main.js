//Sliding Effect Control

head.js("/Content/assets/js/skin-select/skin-select.js");

//Showing Date
head.js("/Content/assets/js/clock/date.js");

//Bootstrap
//head.js("/Content/assets/js/bootstrap.js");


//------------------------------------------------------------- 



//TOOL TIP

head.js("/Content/assets/js/tip/jquery.tooltipster.js", function() {

    $('.tooltip-tip-x').tooltipster({
        position: 'right'

    });

    $('.tooltip-tip').tooltipster({
        position: 'right',
        animation: 'slide',
        theme: '.tooltipster-shadow',
        delay: 1,
        offsetX: '-12px',
        onlyOne: true

    });
    $('.tooltip-tip2').tooltipster({
        position: 'right',
        animation: 'slide',
        offsetX: '-12px',
        theme: '.tooltipster-shadow',
        onlyOne: true

    });
    $('.tooltip-top').tooltipster({
        position: 'top'
    });
    $('.tooltip-right').tooltipster({
        position: 'right'
    });
    $('.tooltip-left').tooltipster({
        position: 'left'
    });
    $('.tooltip-bottom').tooltipster({
        position: 'bottom'
    });
    $('.tooltip-reload').tooltipster({
        position: 'right',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    $('.tooltip-fullscreen').tooltipster({
        position: 'left',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    //For icon tooltip


 
});
//------------------------------------------------------------- 

//NICE SCROLL

head.js("/Content/assets/js/nano/jquery.nanoscroller.js", function() {

    $(".nano").nanoScroller({
        //stop: true 
        scroll: 'top',
        scrollTop: 0,
        sliderMinHeight: 40,
        preventPageScrolling: true
        //alwaysVisible: false

    });

});
//------------------------------------------------------------- 



//-------------------------------------------------------------

//SEARCH MENU
head.js("/Content/assets/js/search/jquery.quicksearch.js", function () {

    $('input.id_search').quicksearch('#menu-showhide li, .menu-left-nest li');



});
//-------------------------------------------------------------



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


//DIGITAL CLOCK
head.js("/Content/assets/js/clock/jquery.clock.js", function() {

    var offset = new Date().getTimezoneOffset() / -60;

    //clock
    $('#digital-clock').clock({
        offset: offset,
        type: 'digital'
    });


});


//Notificaciones
head.js("/Content/assets/js/pnotify/jquery.pnotify.min.js");

//Main
head.js("/Scripts/main.js");

