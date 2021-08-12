const valorSubmit = document.getElementById("submit_boton");
const valorDelete = document.getElementById("delete_boton");

let contador = 0;

valorSubmit.addEventListener("click", () => {
    const valorTareaInput = document.getElementById("input_tareas");
    let contenidoInput = valorTareaInput.value;
    if (contenidoInput === "") {
        alert("No puedes agregar una tarea vacía");
    } else {
        contador++;
        addElemento(contador + " - " + contenidoInput);
    }
    valorTareaInput.value = "";
    document.getElementById("input_materia").value = "";
    document.getElementById("input_descripcion").value = "";
});

valorDelete.addEventListener("click", () => {
    let valorAEliminar = document.getElementById("input_eliminar_tareas").value;
    let hijo = document.getElementById(valorAEliminar);
    if (valorAEliminar > contador) {
        alert("Esa tarea no existe");
        document.getElementById("input_eliminar_tareas").value = "";
    } else if (valorAEliminar <= 0) {
        alert("Debes ingresar una tarea o sólo poner números positivos");
    } else {
        hijo.className = "eliminado";
        hijo.append(", terminada: " + moment().format("LTS"));
    }
    document.getElementById("input_eliminar_tareas").value = "";
});

function addElemento(tarea) {
    const tareas = document.getElementById("lista_tareas");
    let tareasMateria = document.getElementById("input_materia").value;
    let tareasDescripcion = document.getElementById("input_descripcion").value;
    const templateTarea = `
        <div class = "tarjeta">
            <h2 id = ${contador}>${tarea}</h2>
            <hr>
            <h3>${tareasMateria}</h3>
            <hr>
            <h3>${tareasDescripcion}</h3>
        </div>
`;
    tareas.insertAdjacentHTML("beforeend", templateTarea);
}