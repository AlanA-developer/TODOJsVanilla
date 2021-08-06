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
	valorTareaInput.value = ""
    document.getElementById('input_materia').value = ""
    document.getElementById('input_descripcion').value = ""
})

valorDelete.addEventListener('click', () => {
    let valorAEliminar = document.getElementById('input_eliminar_tareas').value;
    let hijo = document.getElementById(valorAEliminar);
    if (valorAEliminar > contador) {
        alert('Esa tarea no existe')
		document.getElementById('input_eliminar_tareas').value = '';
    }
    else if(valorAEliminar <= 0) {
        alert('Debes ingresar una tarea o sólo poner números positivos')
    } else {
        hijo.className = 'eliminado';
        hijo.append(', terminada: ' + moment().format('LTS'))
    }
	document.getElementById('input_eliminar_tareas').value = '';
})

function addElemento(tarea) {
    let tareasMateria = document.createElement('h3')
    let tareasDescripcion = document.createElement('h3')
    const tareas = document.getElementById("lista_tareas");
    const lineaDivision = document.createElement('hr')
    const divTarjeta = document.createElement("div");
    const h2 = document.createElement("h2");
    tareasMateria = document.getElementById('input_materia').value
    tareasDescripcion = document.getElementById('input_descripcion').value
    divTarjeta.setAttribute('class', 'tarjeta')
    h2.setAttribute('id', contador);
    h2.innerHTML = tarea;
    divTarjeta.append(h2, tareasMateria, lineaDivision, tareasDescripcion)
    tareas.before(divTarjeta);
}