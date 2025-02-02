'use strict';const container=document.createElement('ul');container.className='syslog';const stripe=(a)=>{let b=0;[...container.children].forEach((c)=>{c.classList.remove('ui-state-highlight'),a&&a!==c.dataset.type||(b+=1,b%2&&c.classList.add('ui-state-highlight'))})};container.addEventListener('click',function(a){a.preventDefault(),a.stopPropagation();const b=a.target.closest('#syslog ul li');if(!b)return container.dataset.type='',void stripe();const c=b.dataset.type;container.dataset.type=container.dataset.type?'':c,stripe(container.dataset.type)}),window.addEventListener('keyup',function(a){(container.offsetWidth||container.offsetHeight||container.getClientRects().length)&&('Escape'!==a.key||(a.stopImmediatePropagation(),container.dataset.type='',stripe()))});const doPANIC=()=>{container.remove();const a=document.querySelector('html');a.innerHTML=`
    <head>
      <title>Fatal Error!</title>
      <style>
        body { padding:0em; margin:0em; background-color:white; }
        h2 { margin-left:0.5em; }
        .ui-state-highlight { background-color:rgba(0,102,255,0.15); }
        ul.syslog { list-style-type:none; padding:0em; }
        ul.syslog li { padding:0.25em 0.5em; border:none; }
        ul.syslog li[data-type="panic"] { background-color:red; color:white; }
        ul.syslog p { padding:0em; margin:0em; }
        ul.syslog span:nth-of-type(2) { display:inline-block; width:1.25ch; }
        ul.syslog[data-type="log"] li:not([data-type="log"]) { display:none; }
        ul.syslog[data-type="info"] li:not([data-type="info"]) { display:none; }
        ul.syslog[data-type="warn"] li:not([data-type="warn"]) { display:none; }
        ul.syslog[data-type="error"] li:not([data-type="error"]) { display:none; }
        ul.syslog[data-type="panic"] li:not([data-type="panic"]) { display:none; }
        ul.syslog li[data-type="panic"] { display:block!important; }
      </style>
    </head>
    <body id="syslog">
      <h2>Fatal error. Log data following.</h2>
    </body>
  `,a.querySelector('body').appendChild(container)},addEntry=(a,b,c=!1)=>{let d=b,e='',f='',g='';'object'==typeof b&&(d=b.message||'?',e=((b.fileName||b.filename||'').match(/([^\/]+\/)?[^\/]+$/)||[''])[0]||'',f=b.lineno||b.lineNumber||'',g=b.colno||b.columnNumber||'');const h=new Date,i=(a)=>a.toString().padStart(2,'0'),j=`${i(h.getHours())}:${i(h.getMinutes())}:${i(h.getSeconds())}`,k=e?` | ${e} (${f}, ${g})`:'',l=`<span>${j}</span> | <span>${a.charAt(0)}</span> | <span>${d}</span><span>${k}</span>`,m=`<li data-type="${a}" title="${a}"><p>${l}</p></li>`,n=container.querySelector('li:last-of-type > p');if(!n||n.innerHTML.trim()!==l.trim())container.insertAdjacentHTML('beforeend',m);else{const a=n.dataset.count;n.dataset.count=a?+a+1+'':'2'}if(stripe(),c){const a=(a)=>{if('granted'!==a)return;const b={body:d},c=new Notification('syslog',b);setTimeout(()=>c.close(),5e3)};if('denied'===Notification.permission)return;try{Notification.requestPermission().then(a)}catch(b){Notification.requestPermission(a)}}};window.addEventListener('error',function(a){a.preventDefault(),addEntry('panic',a,!0),doPANIC()}),document.addEventListener('DOMContentLoaded',function(){const a=document.querySelector('#syslog');if(a){const b=a.dataset.target||'',c=b?a.querySelector(`#syslog ${b}`):a;c.appendChild(container),a.addEventListener('click',function(a){a.stopPropagation(),a.preventDefault(),container.dispatchEvent(new CustomEvent('click'))})}}),addEntry('info','syslog v1.0 &ndash; Ready Player One');export const syslog={log:(a)=>addEntry('log',a),info:(a)=>addEntry('info',a),warn:(a)=>addEntry('warn',a,!0),error:(a)=>addEntry('error',a,!0),panic:(a)=>{addEntry('panic',a,!0),doPANIC()}};Object.freeze(syslog);