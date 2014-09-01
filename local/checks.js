function checkPIVA(value) {
  if (value == '') {
    return '';
  }
  if (value.length != 11) {
    return 'La lunghezza della partita IVA non è corretta: dovrebbe essere lunga esattamente 11 caratteri';
  }
  valid = '0123456789';
  for (i = 0; i < 11; i++) {
    if (valid.indexOf(value.charAt(i)) == -1) {
      return 'La partita IVA contiene un carattere non valido' + value.charAt(i) + '; i caratteri validi sono le cifre';
    }
  }
  var i, s;
  for (i = 0, s = 0; i <= 9; i += 2) {
    s += value.charCodeAt(i) - '0'.charCodeAt(0);
  }
  for (i = 1; i <= 9; i += 2) {
    c = 2 * (value.charCodeAt(i) - '0'.charCodeAt(0));
    if (c > 9) {
      c -= 9;
    }
    s += c;
  }
  if ((10 - s % 10) % 10 != value.charCodeAt(10) - '0'.charCodeAt(0)) {
    return 'La partita IVA non è valida: il codice di controllo non corrisponde';
  }
  return '';
}

function CheckCF(value) {
  var patternCF = /[a-z]{6}\d{2}[abcdehlmprst]\d{2}[a-z]\d{3}[a-z]/i;

  //...
}