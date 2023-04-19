const key = "zeT6NX6INweJAatKiuNXHqfe0ddPilR4";
const api = "https://api.apilayer.com/currency_data/list";
const monedas = document.getElementById('monedas');
var myHeaders = new Headers();
myHeaders.append("apikey", key);
var requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

const obtenerMonedas = async() => {
  const opciones = await fetch(api, requestOptions)
  const opcionesJson = await opciones.json()
  return opcionesJson;
}
const listarMonedas = async() => {
  const opciones = await obtenerMonedas();
  for (const moneda in opciones.currencies) {
    console.log(moneda);
  }
  console.log(opciones.currencies);
  // opciones.forEach(e => {
  //   monedas.innerHTML += 
  //     `<option value="${}"></option>`
  //   ;
  // });
}

console.log(listarMonedas());

