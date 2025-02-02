'use strict';import{syslog}from'./syslog.js';import{getMessage as dict}from'./sysdict.js';import{store as lstore}from'./localStorage.js';const body=document.querySelector('body');document.querySelector('html').classList.add('js-active');const theme=(a)=>{const b=function(a){return a.match(/\/([^\/]+)\/[^\/]*$/)[1]||''},c=[...document.querySelectorAll('link[href*=vendor][href$=css]')];if(c&&c.length){if(a&&'string'!=typeof a)return void syslog.error(Error(dict('e6')));if(!a)return b(c[0].href);else{const d=a.trim(),e=b(c[0].href);if(!e)return;d!==e&&(c.forEach((a)=>{const b=a.getAttribute('href').replace(e,d);a.setAttribute('href',b)}),lstore('theme',d))}}};((a)=>{a&&(a.insertAdjacentHTML('afterbegin',`
      <h2 style="display:none;">ARIA</h2>
      <aside id="heaven">
        <table class="raw with-border">
          <tbody><tr><td></td></tr><tr><td></td></tr></tbody>
        </table>
      </aside>
      <ul id="statusBar" class="ui-state-active">
        <li><p>&nbsp;</p></li>
      </ul>
    `),a.querySelector('#heaven').addEventListener('click',function(a){a.stopPropagation(),a.preventDefault();const b=body.dataset.control;body.dataset.control=b?'':'active'}),body.addEventListener('click',function(){delete body.dataset.control}),window.addEventListener('keydown',function(a){'Escape'===a.key&&delete body.dataset.control}))})(document.querySelector('#control')),((a)=>{a&&(a.addEventListener('click',function(a){const b=a.target.closest('#navigator li');if(b){const a=b.dataset.display;if(a){const c=body.dataset.display;body.dataset.display=a,body.dispatchEvent(new CustomEvent(a,{detail:{previousDisplay:c}})),lstore('data-display',a);const d=b.dataset.exec;d&&body.dispatchEvent(new CustomEvent(d),{detail:{previousDisplay:c}})}}}),a.addEventListener('display',function(a){if(a.stopPropagation(),!a.detail)return void syslog.warn(Error(dict('e7')));const b=a.detail.previousDisplay;b&&(body.dataset.display=b)}))})(document.querySelector('#navigator')),((a)=>{if(!a)return;if(document.querySelector('#search'))return;body.insertAdjacentHTML('beforeend','<section id="search" class="ui-widget ui-widget-content fullwidth"><h2>search</h2></section>');const b=body.querySelector('#search');if(!b)return void syslog.error(Error(dict('e8')));let c=`
    <form method="get" action="https://duckduckgo.com" role="search">
      <input type="search" name="q" value="" placeholder="duckduckgo in hs-worms.de"
        autocomplete="off"
        title="Geben Sie hier Ihren Suchbegriff ein."
        class="ui-widget-content"
        data-events="default"
      />
      <input type="hidden" name="sites" value="campus.hs-worms.de,campus.fh-worms.de" />
      <input type="hidden" name="kl" value="de-de"/>
    </form>
  `;b.insertAdjacentHTML('beforeend',c),c=`
    <form method="get" action="https://www.google.com/search" role="search">
      <input type="search" name="q" value="" placeholder="Suchen in hs-worms.de"
        autocomplete="off"
        title="Geben Sie hier Ihren Suchbegriff ein."
        class="ui-widget-content"
        data-events="default"
      />
      <input type="hidden" name="as_sitesearch" value="https://campus.fh-worms.de."/>
    </form>
  `,b.insertAdjacentHTML('beforeend',c),b.addEventListener('change',function(a){a.stopPropagation(),a.target.blur()}),body.addEventListener('search',function(a){a.stopPropagation(),a.preventDefault();const c=b.querySelector('input:first-of-type');c&&!c.value&&c.focus()})})(document.querySelector('#navigator')&&document.querySelector('#navigator').querySelector('li[data-display=search]')),((a)=>{if(!a)return;body.insertAdjacentHTML('beforeend',`<section id="themes" class="ui-widget ui-widget-content fullwidth">
      <h2>Themes</h2>
      <ul class="ui-widget-content"></ul>
     </section>
    `);const b=body.querySelector('#themes > ul');if(!b)return void syslog.error(Error(dict('e8')));['hs-worms','cupertino','redmond','smoothness','sunny','dark-hive','ui-lightness','ui-darkness','blitzer','overcast','south-street','start','vader','eggplant','flick','pepper-grinder','humanity','excite-bike','mint-choc','black-tie','trontastic'].forEach((a)=>{const c=a===theme()?'ui-state-hover':'';b.insertAdjacentHTML('beforeend',`<li class="${c}">${a.trim()}</li>`)});let c='';body.addEventListener('themes',function(a){a.stopPropagation(),a.preventDefault(),c=a.detail.previousDisplay});const d=document.querySelector('#navigator'),e=[...b.children];b.addEventListener('click',function(a){a.stopPropagation(),a.preventDefault();const b=a.target.textContent.trim();b===theme()&&(d.dispatchEvent(new CustomEvent('display',{detail:{previousDisplay:c}})),c=''),e.forEach((a)=>{a.classList.remove('ui-state-hover')}),a.target.classList.add('ui-state-hover'),theme(b)})})(document.querySelector('#navigator')&&document.querySelector('#navigator').querySelector('li[data-display=themes]')),body.insertAdjacentHTML('beforeend','<div id="background" class="ui-widget ui-widget-content error-log"></div>'),window.addEventListener('keydown',function(a){if('Enter'===a.key){const b=a.target,c=b.nextElementSibling;'entertabs'in b.dataset&&c&&c.focus()}});