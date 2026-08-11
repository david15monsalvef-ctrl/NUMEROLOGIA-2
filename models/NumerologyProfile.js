function reducirNumero(num, preservarMaestros = true) {
  while (num > 9) {
    if (preservarMaestros && (num === 11 || num === 22 || num === 33)) break;
    num = num.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
  }
  return num;
}

const tablaPitagorica = {
  a:1, j:1, s:1,  b:2, k:2, t:2,  c:3, l:3, u:3,
  d:4, m:4, v:4,  e:5, n:5, w:5,  f:6, o:6, x:6,
  g:7, p:7, y:7,  h:8, q:8, z:8,  i:9, r:9
};

function calcularCaminoDeVida(fecha) {
  const d = new Date(fecha);
  const str = `${d.getUTCDate()}${d.getUTCMonth() + 1}${d.getUTCFullYear()}`;
  const sumaInicial = str.split('').reduce((a, b) => a + parseInt(b), 0);
  return reducirNumero(sumaInicial);
}

function calcularExpresion(nombreCompleto) {
  const limpio = nombreCompleto.toLowerCase().replace(/[^a-z]/g, '');
  let suma = 0;
  for (let char of limpio) {
    if (tablaPitagorica[char]) suma += tablaPitagorica[char];
  }
  return reducirNumero(suma);
}

function calcularAlma(nombreCompleto) {
  const vocales = 'aeiou';
  const limpio = nombreCompleto.toLowerCase().replace(/[^a-z]/g, '');
  let suma = 0;
  for (let char of limpio) {
    if (vocales.includes(char) && tablaPitagorica[char]) {
      suma += tablaPitagorica[char];
    }
  }
  return reducirNumero(suma);
}

module.exports = { calcularCaminoDeVida, calcularExpresion, calcularAlma };