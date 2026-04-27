import { store } from '../shared/Store.js'
import { showToast } from './toast.js'
import { showConfirmDialog } from './dialog.js'

export const appendTaskList = (container) => {
    const listContainer = document.createElement('div')
    listContainer.classList.add('task-grid')
    listContainer.id = 'task-grid'
    container.appendChild(listContainer)

    store.subscribe((tasks, filter) => {
        const safeTasks = Array.isArray(tasks) ? tasks : [];
        const parentTasks = safeTasks.filter(task => !task.parentId);
        const filteredTasks = filterTasks(parentTasks, filter, safeTasks);
        renderTasks(filteredTasks, listContainer, safeTasks);
    })
}

function filterTasks(tasks, filter, allTasks) {
    if (!filter) return tasks;
    if (!tasks) return [];

    return tasks.filter(task => {
        const hasSubtaskWithQuery = (q) => {
            const subtasks = allTasks.filter(sub => sub.parentId === task.id);
            return subtasks.some(sub => sub.title && sub.title.toLowerCase().includes(q));
        };

        if (filter.query) {
            const q = filter.query.toLowerCase();
            const inTitle = task.title && task.title.toLowerCase().includes(q);
            const inSubject = (task.subject || '').toLowerCase().includes(q);
            const inDesc = (task.description || '').toLowerCase().includes(q);
            if (!inTitle && !inSubject && !inDesc && !hasSubtaskWithQuery(q)) return false;
        }

        if (filter.priority && task.priority !== filter.priority) return false;
        if (filter.subject && task.subject !== filter.subject) return false;

        if (filter.type !== 'all' && task.dueDate) {
            const [y, m, d] = task.dueDate.split('-').map(Number);
            if (filter.type === 'day' && (y !== filter.year || m !== filter.month || d !== filter.day)) return false;
            if (filter.type === 'month' && (y !== filter.year || m !== filter.month)) return false;
            if (filter.type === 'year' && y !== filter.year) return false;
        } else if (filter.type !== 'all' && !task.dueDate) {
            return false;
        }

        return true;
    })
}

function renderTasks(tasks, container, allTasks) {
    if (!container) return;

    let header = container.querySelector('.view-header');
    if (!header) {
        header = document.createElement('div');
        header.className = 'view-header';
        header.style.gridColumn = '1 / -1';
        container.prepend(header);
    }
    header.innerHTML = `<h2 style="font-size: 1.2rem; opacity: 0.8; margin-bottom: 1.5rem;">Control de Misiones</h2>`;

    const existingIds = Array.from(container.querySelectorAll('.card-container')).map(c => c.dataset.id);
    const taskIds = tasks.map(t => String(t.id));

    const tasksToRemove = existingIds.filter(id => !taskIds.includes(id));
    tasksToRemove.forEach(id => {
        const card = container.querySelector(`.card-container[data-id="${id}"]`);
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => card.remove(), 300);
        }
    });

    if (tasks.length === 0) {
        let empty = container.querySelector('.empty-state');
        if (!empty) {
            empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.style.gridColumn = '1 / -1';
            empty.innerHTML = `<h3>No se encontraron misiones</h3><p>Crea una nueva misión o ajusta los filtros.</p>`;
            container.appendChild(empty);
        }
    } else {
        container.querySelector('.empty-state')?.remove();
    }

    tasks.forEach((task, index) => {
        const subtasks = allTasks.filter(sub => sub.parentId === task.id);
        const completedSubtasks = subtasks.filter(sub => sub.status === 'done').length;

        let cardContainer = container.querySelector(`.card-container[data-id="${task.id}"]`);
        let cardFront;

        if (!cardContainer) {
            cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            cardContainer.dataset.id = task.id;

            cardFront = document.createElement('div');
            cardFront.className = 'premium-card card-front';
            cardContainer.appendChild(cardFront);

            cardContainer.style.opacity = '0';
            setTimeout(() => {
                cardContainer.style.transition = 'opacity 0.5s, transform 0.5s';
                cardContainer.style.opacity = '1';
            }, index * 100);
            container.appendChild(cardContainer);
        } else {
            cardFront = cardContainer.querySelector('.card-front');
        }

        const isDone = task.status === 'done';

        cardFront.className = `premium-card card-front ${isDone ? 'done' : ''}`;
        cardFront.innerHTML = `
            <div class="card-priority priority-${task.priority || 'low'}">${(task.priority || 'baja').toUpperCase()}</div>
            <h2 class="card-title">${task.title}</h2>
            <p class="card-desc">${task.description || 'Sin descripción para esta misión.'}</p>
            
            <div class="form-group" style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--glass-border);">
                <label class="form-label" style="font-size: 0.7rem;">Recordatorio</label>
                <select class="form-input mini reminder-select">
                    <option value="none" ${!task.reminder || task.reminder === 'none' ? 'selected' : ''}>Ninguno</option>
                    <option value="on_due_date" ${task.reminder === 'on_due_date' ? 'selected' : ''}>En la fecha de vencimiento</option>
                    <option value="1_hour_before" ${task.reminder === '1_hour_before' ? 'selected' : ''}>1 hora antes</option>
                    <option value="1_day_before" ${task.reminder === '1_day_before' ? 'selected' : ''}>1 día antes</option>
                </select>
            </div>

            ${subtasks.length > 0 ? `
            <div class="subtask-progress">
                <div class="progress-label">
                    <span>Sub-misiones</span>
                    <span>${completedSubtasks} / ${subtasks.length}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(completedSubtasks / subtasks.length) * 100}%"></div>
                </div>
            </div>
            ` : ''}

            <div class="card-footer">
                <div class="card-actions">
                    <button class="btn-check" title="Cambiar Estado" style="color: ${isDone ? 'var(--accent-secondary)' : 'var(--text-white)'}; background: none; border: none; cursor: pointer;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"></path></svg>
                    </button>
                    <button class="btn-hud" title="Misión Control" style="color: var(--accent-secondary); background: none; border: none; cursor: pointer;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h18M3 6h18M3 14h18M3 18h18"></path></svg>
                    </button>
                    <button class="btn-add-subtask" title="Añadir Sub-tarea" style="color: var(--text-white); background: none; border: none; cursor: pointer;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m-7-7h14"></path></svg>
                    </button>
                </div>
                <button class="btn-delete" title="Eliminar Misión" style="color: var(--text-white); background: none; border: none; cursor: pointer;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
            </div>
        `;

        cardContainer.querySelector('.reminder-select').onchange = (e) => {
            const newReminder = e.target.value;
            store.updateTask({ ...task, reminder: newReminder });
            showToast('Recordatorio actualizado');
        };

        cardContainer.querySelector('.btn-check').onclick = async (e) => {
            e.stopPropagation();
            const currentStatus = task.status;
            await store.toggleStatus(task.id);
            showToast(currentStatus === 'pending' ? '¡Misión Cumplida!' : 'Misión Reanudada');
        };

        cardContainer.querySelector('.btn-add-subtask').onclick = (e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('open-modal-for-subtask', {
                detail: { parentTask: task }
            }));
        };

        cardContainer.querySelector('.btn-delete').onclick = (e) => {
            e.stopPropagation();
            showConfirmDialog('Eliminar Misión', '¿Estás seguro? Esto también eliminará todas las sub-tareas.', async () => {
                await store.deleteTask(task.id);
                showToast('Misión Eliminada', 'error');
            });
        };

        cardContainer.querySelector('.btn-hud').onclick = (e) => {
            e.stopPropagation();
            showMissionControlHUD(task, allTasks);
        };
    });
}


async function showMissionControlHUD(task, allTasks) {
    const gsap = window.gsap;
    if (!gsap) {
        console.warn("GSAP is not loaded. Animations will be disabled.");
        return;
    }

    let overlay = document.getElementById('jarvis-hud')
    if (!overlay) {
        overlay = document.createElement('div')
        overlay.id = 'jarvis-hud'
        overlay.classList.add('jarvis-hud')
        document.body.appendChild(overlay)
    }
    overlay.innerHTML = ''
    overlay.classList.add('active')
    document.body.classList.add('hud-active')

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute('class', 'tree-svg-container')
    overlay.appendChild(svg)

    const virtualCard = document.createElement('div')
    virtualCard.className = 'tree-main-card-cloned premium-card'
    virtualCard.innerHTML = `
        <div class="card-inner">
            <div class="card-priority priority-${task.priority || 'low'}">${(task.priority || 'low').toUpperCase()}</div>
            <h2 class="card-title" style="margin-top: 1rem;">${task.title}</h2>
            <p class="card-status" style="color: var(--accent-secondary); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;">${task.status === 'done' ? 'Misión Cumplida' : 'En Progreso'}</p>
            <p class="card-desc">${task.description || 'Sin descripción.'}</p>
        </div>
    `
    virtualCard.style.position = 'absolute'
    virtualCard.style.width = '350px'
    virtualCard.style.top = '50%'
    virtualCard.style.left = '25%'
    virtualCard.style.transform = 'translate(-50%, -50%)'
    virtualCard.style.zIndex = '1000'
    overlay.appendChild(virtualCard)

    const subtasks = allTasks.filter(sub => sub.parentId === task.id);
    const activeConnectors = [];

    subtasks.forEach((sub, index) => {
        const isDone = sub.status === 'done';
        const cleanText = sub.title;

        const spacing = 160;
        const offset = (subtasks.length - 1) * spacing / 2;

        const node = document.createElement('div');
        node.className = `tree-node ${isDone ? 'is-done' : ''}`;
        node.innerHTML = `
            <div class="tree-node-index">${index + 1}</div>
            <div class="node-checker ${isDone ? 'checked' : ''}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="tree-node-content" contenteditable="true" spellcheck="false" title="Haz clic para editar" style="flex: 1; outline: none; color: var(--text-main); font-size: 0.95rem; line-height: 1.4;">${cleanText}</div>
            <div class="node-edit-details" title="Ver detalles / Editar" style="cursor: pointer; margin-left: 10px; color: var(--text-muted); display: flex; align-items: center; padding: 4px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </div>
            <div class="node-drag-handle" title="Arrastrar nodo" style="margin-left: 5px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2">
                    <circle cx="9" cy="5" r="1.5"></circle><circle cx="9" cy="12" r="1.5"></circle><circle cx="9" cy="19" r="1.5"></circle>
                    <circle cx="15" cy="5" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="15" cy="19" r="1.5"></circle>
                </svg>
            </div>
        `;

        node.style.position = 'absolute';
        node.style.left = '65%';
        node.style.top = '50%';
        node.style.marginTop = `${(index * spacing) - offset}px`;
        node.style.transform = 'translateY(-50%)';

        overlay.appendChild(node);

        const checker = node.querySelector('.node-checker');
        const content = node.querySelector('.tree-node-content');
        const editDetailsBtn = node.querySelector('.node-edit-details');

        checker.onpointerdown = (e) => e.stopPropagation();
        content.onpointerdown = (e) => e.stopPropagation();
        editDetailsBtn.onpointerdown = (e) => e.stopPropagation();

        editDetailsBtn.onclick = (e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('open-modal-for-edit', {
                detail: { task: sub }
            }));
        };

        checker.onclick = (e) => {
            e.stopPropagation();
            const newStatus = !node.classList.contains('is-done');
            node.classList.toggle('is-done', newStatus);
            checker.classList.toggle('checked', newStatus);
            store.toggleStatus(sub.id);
        };

        content.onfocus = () => node.classList.add('is-focused');
        content.onblur = () => {
            node.classList.remove('is-focused');
            const newTitle = content.innerText.trim();
            if (newTitle !== sub.title && newTitle.length > 0) {
                store.updateTask({ ...sub, title: newTitle });
            }
        };
        content.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                content.blur();
            }
        };

        // Connectors
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('class', 'tree-connector');
        svg.appendChild(path);

        const connector = { node, path };
        activeConnectors.push(connector);
        
        let isAnimating = true;
        const updateThisLine = () => {
            const cardRect = virtualCard.getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();

            const startX = cardRect.right - svgRect.left;
            const startY = cardRect.top + (cardRect.height / 2) - svgRect.top;
            const endX = nodeRect.left - svgRect.left;
            const endY = nodeRect.top + (nodeRect.height / 2) - svgRect.top;

            const cp1x = startX + (endX - startX) / 2;
            const cp2x = endX - (endX - startX) / 2;
            const d = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
            path.setAttribute('d', d);

            if (!isAnimating) {
                const newLength = path.getTotalLength();
                path.style.strokeDasharray = `${newLength}`;
                path.style.strokeDashoffset = "0";
            }
        };

        updateThisLine();

        if (gsap) {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
            gsap.set(node, { opacity: 0 });

            const tl = gsap.timeline({ delay: 0.6 + (index * 0.2) });

            tl.to(path, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    const currentLength = path.getTotalLength();
                    path.style.strokeDasharray = `${currentLength}`;
                },
                onComplete: () => {
                    isAnimating = false;
                    updateThisLine();
                }
            })
            .to(node, {
                opacity: 1,
                duration: 0.4,
                ease: "none"
            }, "-=0.1")
            .to(node, {
                borderColor: "#00f2fe",
                boxShadow: "0 0 40px rgba(0, 242, 254, 0.6), inset 0 0 20px rgba(0, 242, 254, 0.4)",
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        } else {
            isAnimating = false;
            node.style.opacity = '1';
        }

        setupDraggable(node, updateThisLine, '.node-drag-handle');
        
        // Simple ResizeObserver fallback if it doesn't exist
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => updateThisLine());
            resizeObserver.observe(node);
        }
    });

    setupDraggable(virtualCard, () => {
        activeConnectors.forEach(c => {
            const cardRect = virtualCard.getBoundingClientRect();
            const nodeRect = c.node.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();

            const startX = cardRect.right - svgRect.left;
            const startY = cardRect.top + (cardRect.height / 2) - svgRect.top;
            const endX = nodeRect.left - svgRect.left;
            const endY = nodeRect.top + (nodeRect.height / 2) - svgRect.top;

            const cp1x = startX + (endX - startX) / 2;
            const cp2x = endX - (endX - startX) / 2;
            const d = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
            c.path.setAttribute('d', d);

            const newLength = c.path.getTotalLength();
            c.path.style.strokeDasharray = `${newLength}`;
            c.path.style.strokeDashoffset = "0";
        });
    });

    const closeBtn = document.createElement('button')
    closeBtn.className = 'close-hud-btn'
    closeBtn.innerHTML = 'DESACTIVAR EXPLORADOR'
    overlay.appendChild(closeBtn)

    const closeHandler = () => {
        const nodes = overlay.querySelectorAll('.tree-node')
        nodes.forEach(node => node.style.opacity = '0')
        if (virtualCard) {
            virtualCard.style.transition = 'all 0.4s ease'
            virtualCard.style.opacity = '0'
            virtualCard.style.transform = 'translate(-50%, -50%) scale(0.95)'
        }
        const svgContainer = overlay.querySelector('.tree-svg-container')
        if (svgContainer) svgContainer.style.opacity = '0'

        setTimeout(() => {
            overlay.classList.remove('active')
            document.body.classList.remove('hud-active')
            setTimeout(() => overlay.innerHTML = '', 500)
        }, 400)
    }
    closeBtn.onclick = closeHandler
}

function setupDraggable(el, onMove, handleSelector = null) {
    let isDragging = false
    let startX, startY, initialLeft, initialTop

    el.onpointerdown = (e) => {
        if (handleSelector && !e.target.closest(handleSelector)) return;
        isDragging = true
        el.setPointerCapture(e.pointerId)
        startX = e.clientX
        startY = e.clientY
        const rect = el.getBoundingClientRect()
        initialLeft = rect.left
        initialTop = rect.top
        el.style.transition = 'none'
        document.body.classList.add('is-dragging')
    }

    el.onpointermove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        el.style.transform = 'none'
        el.style.left = (initialLeft + dx) + 'px'
        el.style.top = (initialTop + dy) + 'px'
        el.style.marginTop = '0'
        if (onMove) onMove()
    }

    el.onpointerup = (e) => {
        isDragging = false
        el.releasePointerCapture(e.pointerId)
        el.style.transition = '' 
        document.body.classList.remove('is-dragging')
    }
}

function getViewTitle(filter) {
    // Implementation assumed to exist
    return "Missions";
}