import { store } from '../shared/Store.js'
import { showToast } from './toast.js'

let parentId = null; // Module-level variable to hold parentId
let editTaskId = null; // Hold ID of task being edited

export const appendModal = (container) => {
    const modalOverlay = document.createElement('div')
    modalOverlay.classList.add('modal-overlay')
    modalOverlay.id = 'modal-task'

    const today = new Date().toISOString().split('T')[0]

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <h2 class="modal-title">Nueva Tarea</h2>
            <div class="form-group">
                <label class="form-label">Título</label>
                <input type="text" id="modal_title" class="form-input" placeholder="ej. Rediseñar interfaz">
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <input type="text" id="modal_subject" class="form-input" placeholder="ej. Diseño / Backend">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
                <div class="form-group">
                    <label class="form-label">Prioridad</label>
                    <select id="modal_priority" class="form-input">
                        <option value="low">Baja</option>
                        <option value="medium" selected>Media</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Fecha de Vencimiento</label>
                    <input type="date" id="modal_date" class="form-input" value="${today}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea id="modal_desc" class="form-input" rows="3" placeholder="Detalles estratégicos..."></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Bitácora Inicial (Notas)</label>
                <textarea id="modal_notes" class="form-input" rows="2" placeholder="Anotaciones técnicas..."></textarea>
            </div>
            <button class="btn-submit" id="btn-save-task">CREAR TAREA</button>
            <button style="margin-top: 0.5rem; width: 100%; border: none; background: none; color: var(--text-muted); cursor: pointer; padding: 0.5rem" id="btn-cancel-task">CANCELAR</button>
        </div>
    `
    container.appendChild(modalOverlay)

    const titleEl = document.getElementById('modal_title');
    const subjectEl = document.getElementById('modal_subject');
    const descEl = document.getElementById('modal_desc');
    const priorityEl = document.getElementById('modal_priority');
    const dateEl = document.getElementById('modal_date');
    const notesEl = document.getElementById('modal_notes');
    const modalTitle = modalOverlay.querySelector('.modal-title');

    const resetForm = () => {
        modalTitle.textContent = 'Nueva Tarea';
        titleEl.value = '';
        subjectEl.value = '';
        descEl.value = '';
        notesEl.value = '';
        dateEl.value = today;
        priorityEl.value = 'medium';
        parentId = null; // Reset parentId
        editTaskId = null; // Reset edit mode
        const saveBtn = document.getElementById('btn-save-task');
        if (saveBtn) saveBtn.textContent = 'CREAR TAREA';
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    })

    document.getElementById('btn-cancel-task').addEventListener('click', closeModal)

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    })

    const saveBtn = document.getElementById('btn-save-task');
    saveBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const title = titleEl.value.trim();
        if (title) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'GUARDANDO...';

            // Timeout de seguridad para no quedarse bloqueado si el fetch falla silenciosamente
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 5000)
            );

            try {
                if (editTaskId) {
                    await Promise.race([
                        store.updateTask({
                            id: editTaskId,
                            title: title,
                            subject: subjectEl.value,
                            description: descEl.value,
                            priority: priorityEl.value,
                            dueDate: dateEl.value,
                            notes: notesEl.value,
                            parentId: parentId
                        }),
                        timeoutPromise
                    ]);
                    showToast('Tarea actualizada');
                } else {
                    await Promise.race([
                        store.addTask({
                            title: title,
                            subject: subjectEl.value,
                            description: descEl.value,
                            priority: priorityEl.value,
                            dueDate: dateEl.value,
                            notes: notesEl.value,
                            parentId: parentId
                        }),
                        timeoutPromise
                    ]);
                    showToast(parentId ? 'Sub-tarea creada' : 'Tarea creada');
                }

                closeModal();
            } catch (error) {
                console.error("Error al añadir tarea:", error);
                showToast('Error de conexión o tiempo de espera agotado', 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'CREAR TAREA';
            }
        } else {
            titleEl.style.borderColor = '#ff2e63';
            titleEl.focus();
            setTimeout(() => titleEl.style.borderColor = 'var(--glass-border)', 2000);
        }
    }

    // Listen for custom event to open modal for sub-task
    window.addEventListener('open-modal-for-subtask', (e) => {
        const parentTask = e.detail.parentTask;
        modalTitle.textContent = `Sub-tarea para: ${parentTask.title}`;
        openModal(parentTask.id);
    });

    // Listen for custom event to open modal for editing
    window.addEventListener('open-modal-for-edit', (e) => {
        const task = e.detail.task;
        editTaskId = task.id;
        parentId = task.parentId;
        modalTitle.textContent = `Editar: ${task.title}`;
        titleEl.value = task.title || '';
        subjectEl.value = task.subject || '';
        descEl.value = task.description || '';
        priorityEl.value = task.priority || 'medium';
        dateEl.value = task.dueDate || today;
        notesEl.value = task.notes || '';
        
        const saveBtn = document.getElementById('btn-save-task');
        if (saveBtn) saveBtn.textContent = 'GUARDAR CAMBIOS';
        
        document.getElementById('modal-task').classList.add('active');
        setTimeout(() => document.getElementById('modal_title').focus(), 300);
    });

    // Reset form when modal is closed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class' && !modalOverlay.classList.contains('active')) {
                resetForm();
            }
        });
    });
    observer.observe(modalOverlay, { attributes: true });
}

export const openModal = (pId = null) => {
    parentId = pId; // Set parentId if provided directly
    document.getElementById('modal-task').classList.add('active');
    setTimeout(() => document.getElementById('modal_title').focus(), 300);
}

export const closeModal = () => {
    document.getElementById('modal-task').classList.remove('active');
}