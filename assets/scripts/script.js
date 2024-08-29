function ready(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

//Menasajes para el usuario
const inputPropinaVacio = "Ingresar Propina";

//Se Inicializa variables a usar.
let ingredientesSeleccionados = [];
let ingredientesExtras = [];
let precioBase = 15000;
let defaultPropina = 1000; //o 0 ?
let propina = 0;
const precioPorIngredienteExtra = 800;
let precioIngredientesExtras = 0; //o ingredientesExtra.length * precioPorIngredienteExtra?
let total = precioBase + propina + precioIngredientesExtras;


//Borra todos los hijos de un elemento del dom
function eliminarTodosLosHijosDe(padre){
  let hijo = padre.lastChild;
  while (hijo) {
    padre.removeChild(hijo);
    hijo = padre.lastChild;
  }
}

//Agrega los elementos del array "lista" en el elemento padre del dom, el cual para mantener coherencia y semántica HTML debe ser ol o ul
function agregarItemsLiEnPadreUl(ul, lista){
  for (elemento of lista){
    const li = document.createElement("li")
    const texto = document.createTextNode(elemento)
    li.appendChild(texto)
    ul.appendChild(li);
  }
}

//Agrega los elementos del array "lista" en el elemento padre del dom, el cual para mantener coherencia y semántica HTML debe ser ol o ul
function agregarItemLiEnPadreOloUl(ul, texto){
  const li = document.createElement("li").appendChild(document.createTextNode(texto))
  ul.appendChild(li);
}

ready(function(){
  //captura los elementos del dom que se necesitan
  const form = document.querySelector("form");
  const inputsCheckboxIngredientes = document.querySelectorAll("input[type='checkbox']");
  const ulIngredientesSeleccionados = document.getElementById("ingredientesSeleccionados");
  agregarItemLiEnPadreOloUl(ulIngredientesSeleccionados, "No hay ingredientes seleccionados");

  const ulIngredientesExtra = document.getElementById("ingredientesExtra");
  agregarItemLiEnPadreOloUl(ulIngredientesExtra, "No hay ingredientes extras");

  const inputPropina = document.getElementById("inputPropina");
  const inputMostrarPropina = document.getElementById("valorPropina");
  const inputMostrarExtra = document.getElementById("valorExtra");
  const botonEnviar = document.getElementById("btnEnviarPedido");
  const spanMostrarTotal = document.getElementById("total");
  spanMostrarTotal.appendChild(document.createTextNode(total));

  //Actualiza el valor total y lo muestra en el span del total
  function actualizarTotal(){
    total = Number(precioBase) + Number(propina) + Number(precioIngredientesExtras);
    eliminarTodosLosHijosDe(spanMostrarTotal)
    spanMostrarTotal.appendChild(document.createTextNode(total));
  }

  //Agrega un "listener" a cada input checkbox
  for( inputCheckboxIngrediente of inputsCheckboxIngredientes){
    inputCheckboxIngrediente.addEventListener("change", actualizarListaDeIngredientes);
  }

  //Actualiza los arrays de ingredientes, y muestra la lista de ingredientes. También actualiza el valor en el precio en el formulario
  function actualizarListaDeIngredientes(event){ // event.target == this ???
    const ingredienteEsSeleccionado = this.checked;
    const ingrediente = this.value;
    if (ingredienteEsSeleccionado){ //ingrediente es agregado a la lista
      ingredientesSeleccionados.push(ingrediente);
    }
    else{ //ingrediente es borrado de la lista
      const index = ingredientesSeleccionados.indexOf(this.value);
      ingredientesSeleccionados.splice(index,1);
    }

    //Se fija los ingredientes extra: todos los ingredientes agregados menos los primeros 3
    ingredientesExtras = ingredientesSeleccionados.length > 3 ? ingredientesSeleccionados.slice(3) : [];
    
    //se borran todos los hijos de los ul -hacer una funcion esto-!
    eliminarTodosLosHijosDe(ulIngredientesSeleccionados);
    eliminarTodosLosHijosDe(ulIngredientesExtra);

    if(ingredientesSeleccionados.length === 0) agregarItemLiEnPadreOloUl(ulIngredientesSeleccionados, "No hay ingredientes seleccionados");
    else agregarItemsLiEnPadreUl(ulIngredientesSeleccionados, ingredientesSeleccionados);
    //Se incorporan los ingredientes seleccionados y los extra -hacer una función esto!-
    if(ingredientesExtras.length === 0) agregarItemLiEnPadreOloUl(ulIngredientesExtra, "No hay ingredientes extras");
    else agregarItemsLiEnPadreUl(ulIngredientesExtra, ingredientesExtras);

    //Se actualiza el valor por ing. extras y lo muestra
    precioIngredientesExtras = ingredientesExtras.length * precioPorIngredienteExtra;
    inputMostrarExtra.setAttribute('value', precioIngredientesExtras);

    //Se actualiza el valor total y lo muestra
    actualizarTotal();
  }

  //Al estar "focus" en Ingresar Propina inmediatamente se incorpora 1.000 de propina (tanto en atributo value de HTML com del objeto DOM -javascript-)
  inputPropina.addEventListener("focus", (event) => { //arrow functions no tiene el this
    const valor = event.target.getAttribute("value");
    if (!(valor)){
      propina = defaultPropina;
      event.target.setAttribute("value", propina);
      event.target.value = propina;
      inputMostrarPropina.setAttribute("value", propina);
      inputMostrarPropina.value = propina;

      actualizarTotal();
    }
  });

  //Escucha cuando se levanta una tecla, captura el nuevo valor y lo fija en el mismo (en el atributo) y en el input para mostrar (en el atributo HTML y el atributo JS)
  inputPropina.addEventListener("keyup", (event) => { //arrow functions no tiene el this
    const valor = event.target.value;
    event.target.setAttribute("value", valor);
    inputMostrarPropina.setAttribute("value", valor);
    inputMostrarPropina.value = valor;
    propina = valor

    actualizarTotal();

  });

  botonEnviar.addEventListener("click", (event) => {
    event.preventDefault();
    if (propina === 0) alert("Aún no se ha definido una propina.");
    else alert(`Su propina de ${propina} ha sido enviada.`);
  })

});
