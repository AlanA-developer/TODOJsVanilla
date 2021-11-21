import { appendHeader } from "./components/header.js";
import { appendTodoInputsSection } from "./components/todoSection.js";
import { appendTaskList } from "./components/taskList.js";
import { agregarTareas } from "./exports/exportsAgregarTareasFuncion.js";


appendHeader();
appendTodoInputsSection();
appendTaskList();
agregarTareas();