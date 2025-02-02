// +---------------------------------------------------------------------------
// +  Datei: Werkzeuge/modules/ntools.js                               UTF-8
// +  AutorIn:  w dot doeringer ( at hs-worms dot de)
// +  Beschreibung: Utilities, class Prefix
// +  KorrektorIn:
// +  Status:   2018/10/07 validiert mit js[hl]int.com
// +  Revision: 2018/10/07 - Details am Ende der Datei
// +---------------------------------------------------------------------------
//
'use strict';  // linters
//
import { syslog } from './syslog.js';
//
// +---------------------------------------------------------------------------
// +  allmasks - alle zulässigen netmasks
// +  2018/03/01, wd
// +---------------------------------------------------------------------------
const allmasks = [
  0x00000000,    // /0     0.0.0.0
  0x80000000,    // /1     128.0.0.0
  0xc0000000,    // /2     192.0.0.0
  0xe0000000,    // /3     224.0.0.0
  0xf0000000,    // /4     240.0.0.0
  0xf8000000,    // /5     248.0.0.0
  0xfc000000,    // /6     252.0.0.0
  0xfe000000,    // /7     254.0.0.0
  0xff000000,    // /8     255.0.0.0
  0xff800000,    // /9     255.128.0.0
  0xffc00000,    // /10    255.192.0.0
  0xffe00000,    // /11    255.224.0.0
  0xfff00000,    // /12    255.240.0.0
  0xfff80000,    // /13    255.248.0.0
  0xfffc0000,    // /14    255.252.0.0
  0xfffe0000,    // /15    255.254.0.0
  0xffff0000,    // /16    255.255.0.0
  0xffff8000,    // /17    255.255.128.0
  0xffffc000,    // /18    255.255.192.0
  0xffffe000,    // /19    255.255.224.0
  0xfffff000,    // /20    255.255.240.0
  0xfffff800,    // /21    255.255.248.0
  0xfffffc00,    // /22    255.255.252.0
  0xfffffe00,    // /23    255.255.254.0
  0xffffff00,    // /24    255.255.255.0
  0xffffff80,    // /25    255.255.255.128
  0xffffffc0,    // /26    255.255.255.192
  0xffffffe0,    // /27    255.255.255.224
  0xfffffff0,    // /28    255.255.255.240
  0xfffffff8,    // /29    255.255.255.248
  0xfffffffc,    // /30    255.255.255.252
  0xfffffffe,    // /31    255.255.255.254
  0xffffffff     // /32    255.255.255.255
];
//
// +-------------------------------------------------------------------------
// +  unsign - negative Zahl in ihren 32bit unsigned Wert wandeln - wegen
// +    der vorzeichenhafteten Arithmetik (&, |) auf 32bit Zahlen.
// +    + und * sind ok (?)
// +    Effective JS: >>> konvertiert in 32bit unsigned
// +  Revision: 2014/02/01, wd
// +-------------------------------------------------------------------------
const unsign = (n) => { return n >>> 0; };
//
// +-------------------------------------------------------------------------
// +  aton - ascii-to-number: ASCII nach 32bit IP-adress
// +  Achtung: << mit sign-extension - interpretiert den linken
// +    Operanden als signed 32-bit number!
// +    Bei Fehler wird -1 zurückgegeben
// +  Revision: 2018/03/01, wd
// +-------------------------------------------------------------------------
export const aton = (address) => {  // string im Format a.b.c.d
  //
  try {
    if (!address) { throw Error('Leere Adresse.'); }
    if (typeof address !== 'string') { throw Error(`Adresse ist kein string: ${address}`); }
    //
    // --- a.b.c.d ? ----------------------------------------------------------
    const parts = address.split('.');
    if (parts.length !== 4) { throw Error(`Syntax: Adresse (a.b.c.d)? : ${address}`); }
    //
    parts.forEach((byte, idx) => {
      if (!byte) { throw Error('Leeres Byte ' + idx + ' bei ' + address); }
    });
    //
    // --- Adresse in Zahl konvertieren ---------------------------------------
    let res = 0;
    parts.forEach((byte, idx) => {
      const n = Number(byte), bad = !Number.isSafeInteger(n) || n < 0 || n > 255;
      if (bad) { throw Error(`Byte ${idx} mit Wert: ${byte}`); }
      res = res * 256 + n;  // //// ** EXP ???? TODO jshint ???
    });
    //
    return res >>> 0;  // res ??
    //
  } catch (e) { syslog.error(e); return -1; }
};
//
// +-------------------------------------------------------------------------
// +  ntoa - number to ASCII - IP-Adresse in dezimale Punktenotation
// +    Im Fehlerfall wird der leere string zurückgegeben.
// +    >>> ist unsigned shift.
// +  Revision: 2018/10/07, wd
// +-------------------------------------------------------------------------
export const ntoa = (address) => {  // u32int
  //
  let byte1 = 0, byte2 = 0, byte3 = 0, byte4 = 0;
  //
  try {
    if (address === undefined) { throw Error('Leere Adresse'); }  // 0 ist ok!
    if (!Number.isSafeInteger(address)) { throw Error(`Kein Integer: ${address}`); }
    if (unsign(address) !== address)  { throw Error(`Kein u32int: ${address}`); }
    //
    // --- in Bytes zerlegen ------------------------------------------------
    byte1 = (address & 0xff000000) >>> 24;
    byte2 = (address & 0x00ff0000) >>> 16;
    byte3 = (address & 0x0000ff00) >>> 8;
    byte4 = address & 0x000000ff;
    //
    // --- res --------------------------------------------------------------
    return '' +
      byte1.toString() + '.' + byte2.toString() + '.' +
      byte3.toString() + '.' + byte4.toString();
    //
  } catch (e) { syslog.error(e); return null; }
};
//
// +---------------------------------------------------------------------------
// +  Prefix - Präfixinformation zu dem Adressbereich aus den Parametern
// +    berechnen: bits, len, mask, upper, lower
// +  Vorsicht: & und | sind vorzeichenbehaftet auf 32 Bits
// +  AutorIn:  w dot doeringer ( at hs-worms dot de)
// +  Beschreibung: Fehler werfen Ausnahmen im constructor!
// +  Revision: 2010/03/10, wd
// +---------------------------------------------------------------------------
export const Prefix = class {
  //
  // --- Präfixinformation im Objekt ablegen
  constructor (sprefix) {
    //
    try {
      if (typeof sprefix !== 'string') { throw Error(`${sprefix} ist kein string`); }
      //
      // --- string zerlegen (Achtung: leerer string -> 0 ---------------------
      const parts = sprefix.trim().split(/\s*[\/#]\s*/);
      if (!parts[0]) { throw Error(`Syntax - leere Pseudo-Adresse?: ${sprefix}`); }
      if (!parts[1]) { throw Error(`Syntax - unzulässige Länge: ${sprefix}`); }
      //
      // --- Teile umrechnen --------------------------------------------------
      const bits = aton(parts[0]);  // syslogs Fehler
      if (bits < 0) { throw Error('aton meldet Fehler'); }
      const len = parseInt(parts[1], 10);
      if (!Number.isSafeInteger(len)) { throw Error(`${parts[1]} ist kein Integer`); }
      if (len < 0 || len > 32) { throw Error(`Länge unzuässig: ${parts[1]}`); }
      //
      // --- Objekt aufbauen ----------------------------------------------------
      this.source = sprefix;
      this.bits = bits;                                     // [Pseudo-]IP-Adresse
      this.len = len;                                       // Länge
      this.mask = allmasks[len];                            // netmask
      this.lower = unsign(bits & this.mask);                // kleinste Adresse
      this.upper = unsign(this.lower | (~this.mask & 0xffffffff)); // oberste Adresse
      //
    } catch (e) { syslog.error(e); throw Error('Prefix constructor'); }
  }
  //
  // --- contains -------------------------------------------------------------
  contains (prefix) {  // string oder Prefix-Object
    try {
      // --- prefix ist eine Zeichenkette -> in Objekt wandeln; wirft Ausnahme
      if (typeof prefix === 'string') { prefix = new Prefix (prefix); }
      //
      // --- muss jetzt ein Prefix-Objekt sein
      if (!(prefix instanceof Prefix)) { throw Error('Keine Prefix-Objekt!'); }
      //
      // ---
      return this.lower <= prefix.lower && prefix.upper <= this.upper;
      //
    } catch (e) { syslog.error(e); return false; }
  }
  //
  // --- is (equal) -----------------------------------------------------------
  is (prefix) {  // string oder Prefix-Object
    try {
      // --- prefix ist eine Zeichenkette -> in Objekt wandeln; wirft Ausnahme
      if (typeof prefix === 'string') { prefix = new Prefix (prefix); }
      //
      // --- muss jetzt ein Prefix-Objekt sein
      if (!(prefix instanceof Prefix)) { throw Error('Keine Prefix-Objekt!'); }
      //
      return this.contains(prefix) && this.len === prefix.len;
      //
    } catch (e) { syslog.error(e); return false; }
  }
  //
  // --- includes -------------------------------------------------------------
  includes (address) {  // string oder bits
    try {
      // --- address ist eine Zeichenkette -> wandeln
      if (typeof address === 'string') { address = aton(address); }
      //
      if (address < 0) { throw Error(`aton Fehler bei ${address}`); }
      if (!Number.isSafeInteger(address) || address !== unsign(address)) { throw Error(`Adresse? ${address}`); }
      //
      return this.lower <= address && address <= this.upper;
      //
    } catch (e) { syslog.error(e); return false; }
  }
  //
  // --- asStrings ------------------------------------------------------------
  asStrings () {
    return {
      source: this.source,
      bits: ntoa(this.bits),
      len: this.len.toString(10),
      mask: this.mask.toString(16),
      lower: ntoa(this.lower),
      upper: ntoa(this.upper)
    };
  }
  //
};
//
// +---------------------------------------------------------------------------
// +  Liste der Aenderungen
// +  Datenelement       Datum        AutorIn            Beschreibung
// +---------------------------------------------------------------------------
// +  Modul              2018/03/01   wd                 erste Version
//
//  Ende der Datei
//
