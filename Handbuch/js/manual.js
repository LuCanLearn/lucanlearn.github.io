// +---------------------------------------------------------------------------
// +  Datei: LuCanLearn/lucanlearn.github.io/Handbuch/js/manual.js
// +  AutorIn:  w dot doeringer ( at protonmail dot com)
// +  Beschreibung: standalone; simple org
// +  KorrektorIn:
// +  Status:   2025/10/30 validiert mit js[hl]int.com
// +  Revision: 2026/02/09 - Details am Ende der Datei
// +---------------------------------------------------------------------------
//
// --- IIFE: Inmediately invoked function expression --------------------------
(function (){
  'use strict';
  //
  // --- reuse some elements --------------------------------------------------
  const body = document.querySelector('body');  // exception for bad selectors
  if (!body) { alert('no body element; exiting...'); return; }
  //
  if (window.location.hash) {
    body.classList.add('url-with-fragment');
  }
  //
  //
}());
//
// +---------------------------------------------------------------------------
// +  Liste der Aenderungen
// +  Datenelement       Datum        AutorIn            Beschreibung
// +---------------------------------------------------------------------------
// +  Modul              2025/10/30   wd                 erste Version
// +
//
//  Ende der Datei
//
