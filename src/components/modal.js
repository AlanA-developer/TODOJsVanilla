import { store } from '../shared/Store.js?v=4.1'

export const appendModal = (container) => {
    const modalOverlay = document.createElement('div')
    modalOverlay.classList.add('modal-overlay')
    modalOverlay.id = 'modal-task'

    // Get today's date for default value in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <h2 class="modal-title">Nueva Tarea</h2>
            <div class="form-group">
                <label class="form-label">Título de la tarea</label>
                <input type="text" id="modal_title" class="form-input" placeholder="Ej: Rediseñar interfaz">
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <input type="text" id="modal_subject" class="form-input" placeholder="Ej: Diseño / Backend">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
                <div class="form-group">
                    <label class="form-label">Prioridad</label>
                    <select id="modal_priority" class="form-input">
                        <option value="low">Insignificante</option>
                        <option value="medium" selected>Importante</option>
                        <option value="high">Crítica</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Fecha de Despliegue</label>
                    <input type="date" id="modal_date" class="form-input" value="${today}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea id="modal_desc" class="form-input" rows="3" placeholder="Detalles estratégicos..."></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Bitácora Inicial (Notas)</label>
                <textarea id="modal_notes" class="form-input" rows="2" placeholder="Anotaciones técnicas o razones de la tarea..."></textarea>
            </div>
            <button class="btn-submit" id="btn-save-task">CREAR TAREA</button>
            <button style="margin-top: 0.5rem; width: 100%; border: none; background: none; color: var(--text-muted); cursor: pointer; padding: 0.5rem" id="btn-cancel-task">CANCELAR</button>
        </div>
    `
    container.appendChild(modalOverlay)

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal()
    })

    document.getElementById('btn-cancel-task').addEventListener('click', closeModal)

    document.getElementById('btn-save-task').addEventListener('click', async () => {
        const title = document.getElementById('modal_title').value
        const subject = document.getElementById('modal_subject').value
        const desc = document.getElementById('modal_desc').value
        const priority = document.getElementById('modal_priority').value
        const date = document.getElementById('modal_date').value
        const notes = document.getElementById('modal_notes').value

        if (title.trim()) {
            await store.addTask(title, subject, desc, priority, date, notes)
            closeModal()
            // Reset fields
            document.getElementById('modal_title').value = ''
            document.getElementById('modal_subject').value = ''
            document.getElementById('modal_desc').value = ''
            document.getElementById('modal_notes').value = ''
            document.getElementById('modal_date').value = today
        }
    })
}

export const openModal = () => {
    document.getElementById('modal-task').classList.add('active')
}

export const closeModal = () => {
    document.getElementById('modal-task').classList.remove('active')
}
