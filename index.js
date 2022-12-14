'use strict'

let discos = [];

//creando una copia del formulario
let copiaDefault = document.getElementById("formcontenedor").innerHTML;

/**
 * muestra el formulario para cargar discos
*/
function cargar(){
    let formContendedor = document.getElementById("formcontenedor");
    formContendedor.style.visibility = "visible";
    formContendedor.style.opacity = "1";
}

/**
 * agrega otra pista
 * @returns {String} id de la pista agregada
 */
function agregarPista(){
    let pistas = document.getElementsByClassName("nombrepista");
    let duracion = document.getElementsByClassName("duracion");
    let formulario = document.getElementById("formulario");
    let inputPista = document.createElement("input");
    let labelPista = document.createElement("label");
    let inputDpista = document.createElement("input");
    let labelDpista = document.createElement("label");
    inputPista.id = "pista" + (pistas.length + 1);
    inputPista.className = "nombrepista";
    inputPista.type = "text";
    inputPista.placeholder = "Otro nombre";
    labelPista.htmlFor = inputPista.id;
    labelPista.innerText = "Pista " + (pistas.length + 1);
    formulario.appendChild(labelPista);
    formulario.appendChild(inputPista);
    inputDpista.id = "duracion" + (duracion.length + 1);
    inputDpista.className = "duracion";
    inputDpista.type = "number";
    inputDpista.min = "0";
    inputDpista.max = "7200";
    inputDpista.value = "0";
    labelDpista.className = "expandidos";
    labelDpista.htmlFor = inputDpista.id;
    labelDpista.innerText = "Duracion pista " + (duracion.length + 1);
    formulario.appendChild(labelDpista);
    formulario.appendChild(inputDpista);
    return inputPista.id;
}

/**
 * valida los datos introducidos y los guarda en el array discos
 * @returns {Object} el disco creado
 */
function guardar(){
    let disco = document.getElementById("disco").value.trim();
    let autor = document.getElementById("autor").value.trim();
    let codigo = parseInt(document.getElementById("codigo").value.trim());
    let ok = true;
    let item = {};
    let pistasItem = [];
    let duracionPistasItem = [];
    //existen discos que incluso no llevan nombre, se evaluar?? que se haya ingresado al menos 1 caracter
    if(disco.length > 0){
        //pueden existir bandas con nombre num??rico. se evaluar?? que el autor tenga 2 caract??res al menos
        if(autor.length > 1){
            if(codigo > 0 && codigo < 1000){
                //evaluando si existe en el array discos
                for(let disco of discos){
                    if(disco.codigo === codigo){
                        ok = false;
                        notificar("El c??digo del disco ya existe");
                        break;
                    }
                }
                if(ok){
                    let pistas = document.getElementsByClassName("nombrepista");
                    let duracion = document.getElementsByClassName("duracion");
                    //para no usar 2 ciclos for se emplea este contador. los arrays de pistas y tiempo tienen la misma longitud
                    let nDuracion = 0;
                    for(let pista of pistas){
                        if(pista.value.trim().length < 1){
                            ok = false;
                            notificar("Hay pistas sin nombre");
                            break;
                        }else{
                            let pistaMinusculas = pista.value.trim().toLowerCase();
                            pistasItem.push(pistaMinusculas);
                            let fixDuracion = parseInt(duracion[nDuracion].value);
                            if(fixDuracion > 0 && fixDuracion < 7201){
                                duracionPistasItem.push(fixDuracion);
                            }else{
                                ok = false;
                                notificar("La duraci??n de alguna pista es inv??lida");
                            }

                        }
                        nDuracion++;
                    }
                    if(ok){
                        item.disco = disco.toLowerCase();
                        item.autor = autor.toLowerCase();
                        item.codigo = codigo;
                        item.pistas = pistasItem;
                        item.duracion = duracionPistasItem;
                        //adentro del disco
                        discos.push(item);
                        notificar("??Listo! Mostrando el disco que acab??s de crear", 3000);
                        resetForm();
                        mostrar([item]);
                        return item;
                    }
                }
            }else{
                notificar("El c??digo es inv??lido");
            }
        }else{
            notificar("El nombre del autor debe contener al menos 2 caracteres");
        }
    }else{
        notificar("El nombre del disco debe contener al menos 1 caracter");
    }
}

/**
 * resetea el formulario
 * @returns {Number} 1
 */
function resetForm(){
    //reset formulario
    let reset = document.getElementById("formcontenedor");
    let formulario = document.getElementById("formulario");
    reset.innerHTML = copiaDefault;
    reset.style.visibility = "hidden";
    reset.style.opacity = "0";
    setTimeout(() => {
        reset.style.visibility = "visible";
        reset.style.opacity = "1";
    },500);
    return 1;
}


/**
 * remueve la ??ltima pista agregada
 * @returns {Number} 1
 */
function quitarPista(){
    let pistas = document.getElementsByClassName("nombrepista");
    let duracion = document.getElementsByClassName("duracion");
    let label = document.getElementsByTagName("label");
    if(pistas.length < 2){
        notificar("Denegado: no se puede quitar todas las pistas", 2000);
        return 0;
    }
    pistas[pistas.length - 1].remove();
    duracion[duracion.length - 1].remove();
    label[label.length - 1].remove();
    label[label.length - 1].remove();
    return 1;
}

//PERMITIR USAR EL BUSCADOR SIN UN BOT??N EXTRA (TECLA ENTER)
var buscador = document.getElementById("buscador");
buscador.addEventListener("keypress", (event) => {
    if(event.key === "Enter") {
    event.preventDefault();
    document.getElementById("oculto").click();
    }
});

/**
 * busca por identificador ??nico o por nombre del ??lbum
 * @returns {null|Object|Array} null si no encuentra. el objeto si lo encuentra por identificador. un array de objetos si encuentra por nombres de disco 
 */
function buscarAlbum(){
    if(discos.length < 1){
        notificar("No hay discos guardados", 2000);
        return null;
    }
    let buscador = document.getElementById("buscador");
    if(buscador.value === ""){
        notificar("Al menos deb??s ingresar un valor");
        return null;
    }else{
        let numero = parseInt(buscador.value);
        if(numero > 0 && numero < 1000){
            for(let disco of discos){
                if(disco.codigo === numero){
                    mostrar([disco])
                    return disco;
                }
            }
        }
        let fixValor = buscador.value.trim();
        let coincidencias = [];
        for(let disco of discos){
            if(disco.disco.includes(fixValor)){
                coincidencias.push(disco);
            }
        }
        if(coincidencias.length){
            mostrar(coincidencias);
            return coincidencias;
        }
        notificar(`Ning??n resultado para tu b??squeda "${buscador.value.slice(0, 20)}"... Prob?? con otro c??digo o t??tulo de disco`, 3000);
    }
}

/**
 * muestra los discos filtrados
 * @param {Array} array un array de objetos con todas las coincidencias o directamente el array discos
 * @returns {Number} cantidad de discos mostrados
 */
function mostrar(array){
    if(array.length < 1){
        notificar("No hay discos para mostrar", 2000);
        return 0;
    }
    let items = document.getElementById("items");
    items.innerHTML = "";
    items.innerHTML += `<h1 id='ndiscos'>Mostrando ${array.length}/${discos.length} discos <button onclick="ocultarDiscos()">Ocultar discos</button></h1>`;
    items.style.left = "0";
    let discoMayorDuracion = -1;
    let discoMayorDuracionId;
    for(let disco of array){
        let cantidadPistas = disco.pistas.length;
        let fPistasYduracion = "";
        let duracionDisco = 0;
        let pistaMayorContador = -1;
        let pistaMayorNombre = "";
        for(let indice in disco.pistas){
            let claseDestacar = "normal";
            if(disco.duracion[indice] > 180){
                claseDestacar = "destacar";
            }
            if(disco.duracion[indice] > pistaMayorContador){
                pistaMayorContador = disco.duracion[indice];
                pistaMayorNombre = disco.pistas[indice];
            }
            fPistasYduracion += `<p>Track ${+indice + 1}: ${disco.pistas[indice]} <span class="${claseDestacar}">???? ${disco.duracion[indice]}s</span></p>`;
            duracionDisco += disco.duracion[indice];
        }
        items.innerHTML += `
        <div id="${disco.codigo}" class="item">
            <p>Disco: ${disco.disco}</p>
            <p>Autor: ${disco.autor}</p>
            <p>C??digo: ${disco.codigo}</p>
            ${fPistasYduracion}
            <p>Cant. pistas: ${cantidadPistas}</p>
            <p>Duraci??n Total: ${duracionDisco}s</p>
            <p>Prom. dur. pista: ${parseInt(duracionDisco / cantidadPistas)}s</p>
            <p>May. dur. pista: ${pistaMayorNombre}</p>
        </div>
        `;
        //comparando discos de mayor duraci??n
        if(duracionDisco > discoMayorDuracion){
            discoMayorDuracion = duracionDisco;
            discoMayorDuracionId = disco.codigo;
        }
    }
    //marcando el disco de mayor duraci??n
    let discoRecord = document.getElementById(discoMayorDuracionId);
    discoRecord.innerHTML += "<p class='destacar2'>Disco de mayor duraci??n (presentados)</p>";
    return array.length;
}


/**
 * oculta los discos
 * @returns {String} "-100vw"
 */
function ocultarDiscos(){
    let items = document.getElementById("items");
    items.style.left = "-100vw";
    return items.style.left;
}

/**
 * notifica sobre cualquier evento
 * @param {String} mensaje mensaje para mostrar
 * @param {Number} tiempo duraci??n de la notificaci??n
 * @returns {String} el mensaje que se le ha pasado como argumento
 */
function notificar(mensaje, tiempo=5000){
    let notificacion = document.createElement("div");
    notificacion.id = "notificacion";
    notificacion.innerText = mensaje;
    document.body.appendChild(notificacion);
    setTimeout(() => {
        notificacion.remove();
    },tiempo);
   return mensaje;
}
