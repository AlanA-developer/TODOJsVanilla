import { store } from '../shared/Store.js';
import { api } from '../shared/api.js';
import { showToast } from './toast.js';
import { showConfirmDialog } from './dialog.js';

let templates = [];

export const appendProtocolsModal = (container) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'protocols-modal';
    
    container.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    window.addEventListener('open-protocols-modal', async () => {
        await fetchTemplates();
        render(modalOverlay);
        modalOverlay.classList.add('active');
    });
};

const fetchTemplates = async () => {
    try {
        templates = await api.getTemplates();
    } catch (e) {
        console.error("Failed to fetch templates", e);
        templates = [];
    }
};

const render = (container) => {
    container.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2 class="modal-title">Plantillas de Tareas (Rutinas)</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.4;">
                Las plantillas te permiten crear un conjunto de tareas predefinidas y generarlas todas al mismo tiempo con un solo clic. Ideal para rutinas diarias, listas de chequeo y flujos de trabajo repetitivos.
            </p>
            <div id="protocols-list">
                ${templates.map(t => renderTemplate(t)).join('')}
            </div>
            <div id="create-protocol-form">
                <h3 style="font-size: 1.2rem; margin-top: 2rem;">Crear Nueva Plantilla</h3>
                <input type="text" id="new-protocol-name" class="form-input" placeholder="Nombre de la plantilla (ej. Rutina Matutina)...">
                <div id="new-protocol-items"></div>
                <button id="add-item-btn" class="btn-mini btn-add-item" style="margin-top: 1rem;">+ Añadir Tarea a la Plantilla</button>
                <hr style="border-color: var(--glass-border); margin: 2rem 0;">
                <button id="save-protocol-btn" class="btn-submit">Guardar Plantilla</button>
            </div>
            <button style="margin-top: 0.5rem; width: 100%; border: none; background: none; color: var(--text-muted); cursor: pointer; padding: 0.5rem" onclick="document.getElementById('protocols-modal').classList.remove('active')">Cerrar</button>
        </div>
    `;

    container.querySelector('#add-item-btn').addEventListener('click', () => {
        const itemsContainer = container.querySelector('#new-protocol-items');
        itemsContainer.appendChild(createTemplateItemElement());
    });

    container.querySelector('#save-protocol-btn').addEventListener('click', async () => {
        const name = container.querySelector('#new-protocol-name').value.trim();
        if (!name) {
            showToast('El nombre del protocolo es obligatorio', 'error');
            return;
        }

        const items = Array.from(container.querySelectorAll('.template-item-new')).map(itemEl => ({
            title: itemEl.querySelector('.item-title').value,
            subject: itemEl.querySelector('.item-subject').value,
            priority: itemEl.querySelector('.item-priority').value,
        })).filter(item => item.title);

        if (items.length === 0) {
            showToast('Añade al menos una tarea al protocolo', 'error');
            return;
        }

        try {
            await api.createTemplate({ name, items });
            showToast('Protocolo guardado con éxito');
            await fetchTemplates();
            render(container); // Re-render with the new template
        } catch (e) {
            showToast('Error al guardar el protocolo', 'error');
        }
    });
};

const renderTemplate = (template) => {
    return `
        <div class="protocol-item" style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem; margin-bottom: 0.5rem; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--glass-border);">
            <h4 style="margin: 0; font-size: 0.95rem; font-weight: 500; flex: 1;">${template.name}</h4>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-mini btn-apply-protocol" data-id="${template.id}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Aplicar</button>
                <button class="btn-mini btn-delete-protocol" data-id="${template.id}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; background: rgba(255,46,99,0.1); color: #ff2e63; border: 1px solid rgba(255,46,99,0.3);">Borrar</button>
            </div>
        </div>
    `;
};

const createTemplateItemElement = () => {
    const div = document.createElement('div');
    div.className = 'template-item-new';
    div.innerHTML = `
        <input type="text" class="form-input mini item-title" placeholder="Título de la tarea">
        <input type="text" class="form-input mini item-subject" placeholder="Categoría">
        <select class="form-input mini item-priority">
            <option value="low">Baja</option>
            <option value="medium" selected>Media</option>
            <option value="high">Alta</option>
        </select>
        <button class="btn-mini btn-remove-item">Quitar</button>
    `;
    div.querySelector('.btn-remove-item').onclick = () => div.remove();
    return div;
};

document.addEventListener('click', async (e) => {
    if (e.target && e.target.classList.contains('btn-apply-protocol')) {
        const templateId = e.target.dataset.id;
        try {
            await api.applyTemplate(templateId, store.activeProfileId);
            await store.refresh();
            showToast('Plantilla aplicada, tareas creadas!');
            closeModal();
        } catch (error) {
            showToast('Error al aplicar la plantilla', 'error');
        }
    } else if (e.target && e.target.classList.contains('btn-delete-protocol')) {
        const templateId = e.target.dataset.id;
        showConfirmDialog('Eliminar Plantilla', '¿Estás seguro de eliminar esta plantilla? Las tareas generadas previamente no se verán afectadas.', async () => {
            try {
                await api.deleteTemplate(templateId);
                showToast('Plantilla eliminada');
                await fetchTemplates();
                const container = document.getElementById('protocols-modal');
                if (container) {
                    const listContainer = container.querySelector('#protocols-list');
                    if (listContainer) listContainer.innerHTML = templates.map(t => renderTemplate(t)).join('');
                }
            } catch (error) {
                showToast('Error al eliminar la plantilla', 'error');
            }
        });
    }
});

const closeModal = () => {
    const modal = document.getElementById('protocols-modal');
    if (modal) modal.classList.remove('active');
};
