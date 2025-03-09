// +---------------------------------------------------------------------------
// +  Datei: LuCanLearn/lucanlearn.github.io/js/lcl.js
// +  AutorIn:  w dot doeringer ( at protonmail dot com)
// +  Beschreibung: standalone; simple org
// +  KorrektorIn:
// +  Status:   2025/03/09 validiert mit js[hl]int.com
// +  Revision: 2025/03/09 - Details am Ende der Datei
// +---------------------------------------------------------------------------
//
// --- IIFE: Inmediately invoked function expression --------------------------
(function (){
  'use strict';
  //
  // --- install GLOBAL event handler -----------------------------------------
  //   https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event
  window.addEventListener("error", (event) => {
    alert(`${event.type}:${event.message} \n  ${event.filename} (${event.lineno}, ${event.colno})`);
    return true;   // avoid further default actions at UI - only for "error"
  });
  //
  // --- extract attribute value from element ---------------------------------
  // ---   returns value or null on error ???
  const extractValue = (element, attribute) => {
    try {
      if (!element || !attribute) {
        throw TypeError('bad parameter(s)');
      }
      const attributes = element.attributes;
      if (!attributes) { throw ReferenceError('no attributes'); }
      const attr = attributes[attribute];
      if (!attr) { throw TypeError(`no ${attribute}`); }
      return attr.value;
    }
    catch(e) {
      alert(`${e.type}:${e.message}`);
      return null;
    }
  };

  // --- toggle appropriate class named in data-js attribute of button  -------
  const marker = "data-js";  // identifies button, value of attr is class-name
  const body = document.querySelector('body');    // exception for bad selector
  if (!body) { alert('no body element; exiting...'); return; }
  const button = body.querySelector(`button[${marker}]`);
  if (!button) {
    alert('no <button> found');
    return;
  }
  //
  // --- install toggle handler -----------------------------------------------
  try {
    // --- get class-name for toggle from attr ${marker}
    const cls = extractValue(button, `${marker}`);
    if (!cls) { throw new Error('No class name?'); }
    //
    // --- install handler
    button.addEventListener('pointerup', function (event) {
      event.stopPropagation(); event.preventDefault();
      body.classList.toggle(cls);
    });
  } catch(e) {
    alert(`Could not extract class name \n ${e.type}:${e.message}`);
    return;
  }
  //
  // --- pointer-events "clean-up" !!!!
  // --- capture random click events - click also released after pointerup ----
  // ---   for a and button elements; just to make sure ???
  // --    triggers for ANY click - ignore??
  body.addEventListener('click', function(event) {
    event.stopPropagation(); event.preventDefault();
    // alert('click bubbled to body element');
  });
  //
  // --- load functions to execute before ...
  // document.addEventListener("DOMContentLoaded, f());
  //
  //
}());
//
// +---------------------------------------------------------------------------
// +  Liste der Aenderungen
// +  Datenelement       Datum        AutorIn            Beschreibung
// +---------------------------------------------------------------------------
// +  Modul              2025/02/19   wd                 erste Version
// +                     2025/03/06   wd                 pointerup event
//
//  Ende der Datei
//
