(function(){'use strict';const a=document.createElement('div');a.setAttribute('style','position:absolute; z-index:50; top:1em; left:1em; width:30%; padding:1em 2em; font-size:75%; cursor:crosshair;'),a.classList.add('ui-widget','ui-widget-content','ui-state-error'),a.innerHTML=`
    Ihr Browser unterstützt keine ECMA6 Module. Interaktive Elemente dieser
    Webseite funktionieren deshalb nur sehr eingeschränkt, im
    Gegensatz zu den aktuellen Versionen von Firefox, Chrome, Opera und Safari.
    Firefox benötigt allerdings aktuell noch die explizite Freigabe über
    about:config und dom.modules.enabled.
    `,a.addEventListener('click',function(b){b.stopPropagation(),b.preventDefault(),a.remove()}),document.querySelector('body').appendChild(a)})();