var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
var dayNames = ["Domingo, ", "Lunes, ", "Martes, ", "Miercoles, ", "Jueves, ", "Viernes, ", "Sabado, "]

var newDate = new Date();
newDate.setDate(newDate.getDate());
$('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
