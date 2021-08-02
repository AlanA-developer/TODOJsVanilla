const valorTareaInput = document.getElementById('input_tareas')
const valorEliminarInput = document.getElementById('input_eliminar_tareas')
const valorSubmit = document.getElementById('submit_boton')
const valorDelete = document.getElementById('delete_boton')
const padre = document.getElementById('lista_tareas')

let contador = 0;

valorSubmit.addEventListener('click', () => {
    let contenidoInput = valorTareaInput.value
    if (contenidoInput === '') {
        alert('No puedes agregar una tarea vacía')
    } else {
        contador++
        addElemento(contador + ' - ' + contenidoInput)
    }
    console.log(contenidoInput)
	valorTareaInput.value = ""
})

valorDelete.addEventListener('click', () => {
    let valorAEliminar = document.getElementById('input_eliminar_tareas').value
    let hijo = document.getElementById(valorAEliminar)
    if (valorAEliminar > contador) {
        alert('Esa tarea no existe')
		document.getElementById('input_eliminar_tareas').value = '';
    }
    if (valorAEliminar <= 0) {
        alert('Debes ingresar una tarea o sólo poner números positivos')
    } else {
        hijo.className = 'eliminado'
    }
	document.getElementById('input_eliminar_tareas').value = '';
})

function addElemento(tarea) {
    let tareas = document.getElementById("lista_tareas");
    let h2 = document.createElement("h2");
    h2.setAttribute('id', contador)
    h2.innerHTML = tarea;
    tareas.appendChild(h2);
}