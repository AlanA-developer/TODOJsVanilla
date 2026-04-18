import { store } from '../shared/Store.js?v=4.1'

export const appendTaskList = (container) => {
    const listContainer = document.createElement('div')
    listContainer.classList.add('task-grid')
    listContainer.id = 'task-grid'
    container.appendChild(listContainer)

    store.subscribe((tasks, filter, profiles, activeProfileId) => {
        const filteredTasks = filterTasks(tasks, filter)
        renderTasks(filteredTasks, listContainer, filter)
    })
}

function filterTasks(tasks, filter) {
    if (!filter) return tasks

    return tasks.filter(task => {
        // 1. Apply Text Search (query)
        if (filter.query) {
            const q = filter.query.toLowerCase()
            const inTitle = task.title.toLowerCase().includes(q)
            const inSubject = (task.subject || '').toLowerCase().includes(q)
            const inDesc = (task.description || '').toLowerCase().includes(q)
            if (!inTitle && !inSubject && !inDesc) return false
        }

        // 2. Apply Priority and Subject Filters
        if (filter.priority && task.priority !== filter.priority) return false
        if (filter.subject && task.subject !== filter.subject) return false

        // 3. Apply Special Filters (observations, overdue)
        if (filter.special === 'observations') {
            if (!task.notes || task.notes.trim() === '') return false
        }

        if (filter.special === 'overdue') {
            if (task.status === 'done') return false
            if (!task.dueDate) return false
            const today = new Date().toISOString().split('T')[0]
            if (task.dueDate >= today) return false
        }

        // 4. Apply Date Filters
        if (filter.type !== 'all' && task.dueDate) {
            const [y, m, d] = task.dueDate.split('-').map(Number)
            if (filter.type === 'day') {
                if (y !== filter.year || m !== filter.month || d !== filter.day) return false
            } else if (filter.type === 'month') {
                if (y !== filter.year || m !== filter.month) return false
            } else if (filter.type === 'year') {
                if (y !== filter.year) return false
            }
        } else if (filter.type !== 'all' && !task.dueDate) {
            // If filtering by date but task has no date, exclude it
            return false
        }

        return true
    })
}

function renderTasks(tasks, container, filter) {
    // 1. Manage the View Header
    let header = container.querySelector('.view-header')
    const title = getViewTitle(filter)
    if (!header) {
        header = document.createElement('div')
        header.classList.add('view-header')
        header.style.gridColumn = '1 / -1'
        header.style.marginBottom = '1.5rem'
        container.appendChild(header)
    }

    if (header.innerText !== title) {
        header.style.opacity = '0'
        setTimeout(() => {
            header.innerHTML = `<h2 style="font-size: 1.2rem; opacity: 0.8">${title}</h2>`
            header.style.transition = 'opacity 0.3s ease'
            header.style.opacity = '1'
        }, 150)
    }

    // 2. Identify current containers in DOM
    const existingContainers = Array.from(container.querySelectorAll('.card-container'))
    const taskIds = tasks.map(t => String(t.id))

    // 3. Handle "Beautiful Migration" - Exit old tasks first
    const tasksToRemove = existingContainers.filter(c => !taskIds.includes(c.dataset.id))

    if (tasksToRemove.length > 0) {
        tasksToRemove.forEach(cardCont => {
            cardCont.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            cardCont.style.opacity = '0'
            cardCont.style.transform = 'scale(0.95) translateY(10px)'
            cardCont.style.pointerEvents = 'none'
        })

        // Wait for exit before rendering new ones to avoid "ghosting"
        setTimeout(() => {
            tasksToRemove.forEach(c => c.remove())
            renderFilteredTasks(tasks, container, filter, taskIds)
        }, 300)
    } else {
        renderFilteredTasks(tasks, container, filter, taskIds)
    }
}

function renderFilteredTasks(tasks, container, filter, taskIds) {
    if (tasks.length === 0) {
        let empty = container.querySelector('.empty-state')
        if (!empty) {
            empty = document.createElement('div')
            empty.classList.add('empty-state')
            empty.style.gridColumn = '1 / -1'
            empty.style.textAlign = 'center'
            empty.style.padding = '4rem'
            empty.style.color = 'var(--text-muted)'
            empty.innerHTML = 'No hay tareas programadas para este periodo.'
            container.appendChild(empty)
        }
        return
    } else {
        const empty = container.querySelector('.empty-state')
        if (empty) empty.remove()
    }

    // 4. Update or Create cards
    tasks.forEach((task, index) => {
        let cardContainer = container.querySelector(`.card-container[data-id="${task.id}"]`)
        const isDone = task.status === 'done'

        if (!cardContainer) {
            cardContainer = document.createElement('div')
            cardContainer.classList.add('card-container')
            cardContainer.style.opacity = '0'
            cardContainer.style.transform = 'translateY(15px) scale(0.98)'
            cardContainer.dataset.id = task.id

            cardContainer.innerHTML = `
                <div class="card-flipper">
                    <div class="premium-card card-front"></div>
                    <div class="card-back">
                        <div class="edit-form">
                            <h4 style="margin-bottom: 1.5rem; font-size: 0.9rem; letter-spacing: 1px; color: var(--accent-secondary); font-weight: 800">EDITAR TAREA</h4>
                            <input type="text" class="form-input mini title-input" placeholder="Título">
                            <textarea class="form-input mini desc-input" placeholder="Descripción" rows="2"></textarea>
                            <textarea class="form-input mini notes-input" placeholder="Bitácora (Notas técnicas...)" rows="3" style="background: rgba(0, 242, 254, 0.05); border-color: rgba(0, 242, 254, 0.1)"></textarea>
                            <div style="display: flex; gap: 0.8rem">
                                <select class="form-input mini priority-input" style="flex: 1">
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                                <input type="date" class="form-input mini date-input" style="flex: 1">
                            </div>
                            <div class="edit-actions">
                                <button class="btn-mini btn-save">GUARDAR</button>
                                <button class="btn-mini btn-cancel">CANCELAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
            container.appendChild(cardContainer)

            // Trigger entry animation with staggered delay
            setTimeout(() => {
                cardContainer.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                cardContainer.style.opacity = '1'
                cardContainer.style.transform = 'translateY(0) scale(1)'
            }, index * 50)
        }

        const flipper = cardContainer.querySelector('.card-flipper')
        const front = cardContainer.querySelector('.card-front')
        const back = cardContainer.querySelector('.card-back')

        // Update Front Content
        const dateObj = new Date(task.dueDate + 'T00:00:00')
        const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

        front.classList.toggle('done', isDone)
        front.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem">
                <div class="card-priority priority-${task.priority || 'low'}">${task.priority || 'baja'}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600">${formattedDate}</div>
            </div>
            <h2 class="card-title">${task.title}</h2>
            <h3 style="font-size: 0.8rem; color: var(--accent-secondary); margin-bottom: 0.5rem">${task.subject || 'Sín categoría'}</h3>
            <p class="card-desc">${task.description || 'Sin descripción para esta tarea.'}</p>
            
            <div class="card-footer">
                <div style="display: flex; gap: 0.8rem; align-items: center">
                    <button class="btn-check" style="background: none; border: none; cursor: pointer; color: ${isDone ? 'var(--accent-secondary)' : 'var(--text-muted)'}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"></path></svg>
                    </button>
                    ${task.notes ? `
                    <button class="btn-bitacora" style="background: none; border: none; cursor: pointer; color: var(--accent-secondary); display: flex; align-items: center; justify-content: center" title="Ver Bitácora">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </button>
                    ` : ''}
                    <button class="btn-edit-pro" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </div>
                <button class="btn-delete-pro" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
            </div>
        `

        // Front Listeners
        front.querySelector('.btn-check').onclick = () => store.toggleStatus(task.id)
        front.querySelector('.btn-delete-pro').onclick = () => {
            if (confirm('¿Confirmas la eliminación de esta tarea?')) {
                store.deleteTask(task.id)
            }
        }

        // JARVIS HUD Trigger
        const btnBitacora = front.querySelector('.btn-bitacora')
        if (btnBitacora) {
            btnBitacora.onclick = () => showJarvisHUD(task)
        }

        front.querySelector('.btn-edit-pro').onclick = () => {
            // Pre-fill back form
            back.querySelector('.title-input').value = task.title
            back.querySelector('.desc-input').value = task.description || ''
            back.querySelector('.priority-input').value = task.priority || 'low'
            back.querySelector('.date-input').value = task.dueDate || ''
            back.querySelector('.notes-input').value = task.notes || ''
            flipper.classList.add('flipped')
        }

        // Back Listeners
        back.querySelector('.btn-cancel').onclick = () => flipper.classList.remove('flipped')
        back.querySelector('.btn-save').onclick = async () => {
            const updatedTask = {
                ...task,
                title: back.querySelector('.title-input').value,
                description: back.querySelector('.desc-input').value,
                priority: back.querySelector('.priority-input').value,
                dueDate: back.querySelector('.date-input').value,
                notes: back.querySelector('.notes-input').value
            }
            if (updatedTask.title.trim()) {
                flipper.classList.remove('flipped')
                // Wait for animation or do it fast
                setTimeout(async () => {
                    const { api } = await import('../shared/api.js?v=4.1')
                    await api.updateTask(updatedTask)
                    await store.refresh()
                }, 300)
            }
        }
    })
}

async function showJarvisHUD(task) {
    // Import GSAP from node_modules for offline support
    const { gsap } = await import('../../node_modules/gsap/index.js');
    let overlay = document.getElementById('jarvis-hud')
    if (!overlay) {
        overlay = document.createElement('div')
        overlay.id = 'jarvis-hud'
        overlay.classList.add('jarvis-hud')
        // Append to body to keep it in the same context as everything else
        document.body.appendChild(overlay)
    }
    overlay.innerHTML = '' // Clear previous content
    overlay.classList.add('active')
    document.body.classList.add('hud-active')

    // 1. Setup SVG Container
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute('class', 'tree-svg-container')
    overlay.appendChild(svg)

    // 2. Generate Virtual Card (Fresh from data, no DOM baggage)
    const virtualCard = document.createElement('div')
    virtualCard.className = 'tree-main-card-cloned premium-card'
    virtualCard.innerHTML = `
        <div class="card-inner">
            <div class="card-priority priority-${task.priority.toLowerCase()}">${task.priority}</div>
            <div class="card-date" style="position: absolute; top: 2rem; right: 2rem; color: var(--text-muted); font-size: 0.8rem;">
                ${task.dueDate || 'Sin fecha'}
            </div>
            <h2 class="card-title" style="margin-top: 1rem;">${task.title}</h2>
            <p class="card-status" style="color: var(--accent-secondary); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;">${task.status === 'done' ? 'Tarea Completada' : 'En Progreso'}</p>
            <p class="card-desc">${task.description || 'Sin descripción para esta tarea.'}</p>
        </div>
    `

    // Use ABSOLUTE because it will be inside a FIXED overlay
    virtualCard.style.position = 'absolute'
    virtualCard.style.width = '350px'
    virtualCard.style.top = '50%'
    virtualCard.style.left = '25%'
    virtualCard.style.transform = 'translate(-50%, -50%) scale(1)'
    virtualCard.style.opacity = '1'
    virtualCard.style.margin = '0'
    virtualCard.style.zIndex = '1000'

    overlay.appendChild(virtualCard)

    // Add OBSERVACIONES title
    const obsTitle = document.createElement('div')
    obsTitle.className = 'tree-observaciones-title'
    obsTitle.innerHTML = 'OBSERVACIONES DE LA TAREA'
    overlay.appendChild(obsTitle)

    // Appearance animation for title
    setTimeout(() => obsTitle.classList.add('visible'), 500)

    // 4. Parse Notes and Spawn Nodes
    const notesLines = (task.notes || 'No hay registros técnicos.').split('\n')
    const activeConnectors = []

    const syncAllNotes = async () => {
        const newNotes = activeConnectors.map(c => {
            const status = c.node.dataset.done === 'true' ? '[x]' : '[ ]'
            const text = c.node.querySelector('.tree-node-content').innerText.trim()
            return `${status} ${text}`
        }).join('\n')
        await store.updateTaskNotes(task.id, newNotes)
    }

    notesLines.filter(line => line.trim() !== '').forEach((line, index) => {
        const isDone = line.trim().startsWith('[x]') || line.trim().startsWith('[X]')
        const cleanText = line.replace(/^\[[xX ]\]/, '').trim()

        const spacing = 160
        const offset = (notesLines.filter(l => l.trim() !== '').length - 1) * spacing / 2

        const node = document.createElement('div')
        node.className = `tree-node ${isDone ? 'is-done' : ''}`
        node.dataset.done = isDone
        node.innerHTML = `
            <div class="tree-node-index">${index + 1}</div>
            <div class="node-checker ${isDone ? 'checked' : ''}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="tree-node-content" contenteditable="true" spellcheck="false" title="Haz clic para editar" style="flex: 1; outline: none; color: var(--text-main); font-size: 0.95rem; line-height: 1.4;">${cleanText}</div>
            <div class="node-drag-handle" title="Arrastrar nodo" style="margin-left: 10px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2">
                    <circle cx="9" cy="5" r="1.5"></circle><circle cx="9" cy="12" r="1.5"></circle><circle cx="9" cy="19" r="1.5"></circle>
                    <circle cx="15" cy="5" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="15" cy="19" r="1.5"></circle>
                </svg>
            </div>
        `

        // Initial logical positions
        node.style.left = '65%'
        node.style.top = '50%'
        node.style.marginTop = `${(index * spacing) - offset}px`
        // Use a fixed transform that won't be overwritten by GSAP or other classes
        node.style.transform = 'translateY(-50%)'

        overlay.appendChild(node)

        // Interactivity
        const checker = node.querySelector('.node-checker')
        const content = node.querySelector('.tree-node-content')

        // STOP PROPAGATION on pointerdown to prevent DAG from hijacking the click
        checker.onpointerdown = (e) => e.stopPropagation()
        content.onpointerdown = (e) => e.stopPropagation()

        checker.onclick = (e) => {
            e.stopPropagation()
            const newStatus = node.dataset.done !== 'true'
            node.dataset.done = newStatus
            node.classList.toggle('is-done', newStatus)
            checker.classList.toggle('checked', newStatus)
            syncAllNotes()
        }

        content.onfocus = () => node.classList.add('is-focused')
        content.onblur = () => {
            node.classList.remove('is-focused')
            syncAllNotes()
        }
        content.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                content.blur()
            }
        }

        // 5. Build Initial Connectors
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute('class', 'tree-connector')
        svg.appendChild(path)

        const connector = { node, path }
        activeConnectors.push(connector)

        let isAnimating = true;
        const updateThisLine = () => {
            const cardRect = virtualCard.getBoundingClientRect()
            const nodeRect = node.getBoundingClientRect()
            const svgRect = svg.getBoundingClientRect()

            const startX = cardRect.right - svgRect.left
            const startY = cardRect.top + (cardRect.height / 2) - svgRect.top
            const endX = nodeRect.left - svgRect.left
            const endY = nodeRect.top + (nodeRect.height / 2) - svgRect.top

            const cp1x = startX + (endX - startX) / 2
            const cp2x = endX - (endX - startX) / 2
            const d = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`
            path.setAttribute('d', d)

            // Only force dashoffset to 0 if we are NOT in the middle of the initial animation
            if (!isAnimating) {
                const newLength = path.getTotalLength()
                path.style.strokeDasharray = `${newLength}`
                path.style.strokeDashoffset = "0"
            }
        }

        updateThisLine()

        // GSAP Animation for the "Thread" effect
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 })
        gsap.set(node, { opacity: 0 })

        const tl = gsap.timeline({ delay: 0.6 + (index * 0.2) })

        tl.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                // Update dasharray during animation to handle any simultaneous movement
                const currentLength = path.getTotalLength()
                path.style.strokeDasharray = `${currentLength}`
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
            })

        // Enable node dragging via specific handle
        setupDraggable(node, updateThisLine, '.node-drag-handle')

        // Use ResizeObserver to update line when node content expands
        const resizeObserver = new ResizeObserver(() => {
            updateThisLine()
        })
        resizeObserver.observe(node)
    });

    // Enable main card dragging (updates ALL lines)
    setupDraggable(virtualCard, () => {
        activeConnectors.forEach(c => {
            const cardRect = virtualCard.getBoundingClientRect()
            const nodeRect = c.node.getBoundingClientRect()
            const svgRect = svg.getBoundingClientRect()

            const startX = cardRect.right - svgRect.left
            const startY = cardRect.top + (cardRect.height / 2) - svgRect.top
            const endX = nodeRect.left - svgRect.left
            const endY = nodeRect.top + (nodeRect.height / 2) - svgRect.top

            const cp1x = startX + (endX - startX) / 2
            const cp2x = endX - (endX - startX) / 2
            const d = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`
            c.path.setAttribute('d', d)

            // CRITICAL: Update stroke-dasharray to match the new length so it stretches
            const newLength = c.path.getTotalLength()
            c.path.style.strokeDasharray = `${newLength}`
            c.path.style.strokeDashoffset = "0"
        })
    })

    const closeBtn = document.createElement('button')
    closeBtn.className = 'close-hud-btn'
    closeBtn.innerHTML = 'DESACTIVAR EXPLORADOR'
    overlay.appendChild(closeBtn)

    const closeHandler = () => {
        // Staggered animated exit
        const nodes = overlay.querySelectorAll('.tree-node')
        nodes.forEach(node => node.classList.remove('visible'))

        const title = overlay.querySelector('.tree-observaciones-title')
        if (title) title.classList.remove('visible')

        if (virtualCard) {
            virtualCard.style.transition = 'all 0.4s ease'
            virtualCard.style.opacity = '0'
            virtualCard.style.transform = 'translate(-50%, -50%) scale(0.95)'
        }

        const svgContainer = overlay.querySelector('.tree-svg-container')
        if (svgContainer) svgContainer.style.opacity = '0'

        // Wait for items to fade before dropping the frosted glass
        setTimeout(() => {
            overlay.classList.remove('active')
            document.body.classList.remove('hud-active')
            // Full DOM cleanup after glass fades
            setTimeout(() => overlay.innerHTML = '', 500)
        }, 400)
    }

    closeBtn.addEventListener('click', closeHandler)

}

/**
 * Universal Drag & Drop Helper
 */
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

        // Avoid transition while dragging
        el.style.transition = 'none'
        document.body.classList.add('is-dragging')
    }

    el.onpointermove = (e) => {
        if (!isDragging) return

        // Prevent default browser drag/selection behaviors
        e.preventDefault()

        const dx = e.clientX - startX
        const dy = e.clientY - startY

        // Reset translate and use top/left for simple math
        el.style.transform = 'none'
        el.style.left = (initialLeft + dx) + 'px'
        el.style.top = (initialTop + dy) + 'px'
        el.style.marginTop = '0'

        if (onMove) onMove()
    }

    el.onpointerup = (e) => {
        isDragging = false
        el.releasePointerCapture(e.pointerId)
        el.style.transition = '' // Restore transitions
        document.body.classList.remove('is-dragging')
    }
}

function getViewTitle(filter) {
    if (!filter) return 'Todas las Tareas'

    let titleParts = []

    if (filter.query) {
        titleParts.push(`Búsqueda: "${filter.query}"`)
    }

    if (filter.special === 'observations') {
        titleParts.push('Con Observaciones')
    } else if (filter.special === 'overdue') {
        titleParts.push('Pendientes Vencidas')
    }

    if (filter.priority) {
        titleParts.push(`Prioridad: ${filter.priority.toUpperCase()}`)
    }

    if (filter.subject) {
        titleParts.push(`Categoría: ${filter.subject}`)
    }

    const now = new Date()
    const isToday = filter.type === 'day' &&
        filter.day === now.getDate() &&
        filter.month === (now.getMonth() + 1) &&
        filter.year === now.getFullYear()

    if (isToday && titleParts.length === 0) return 'Tareas de Hoy'
    if (filter.type === 'all' && titleParts.length === 0) return 'Todas las Tareas'

    if (filter.type !== 'all') {
        const monthsNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        if (filter.type === 'day') titleParts.push(`Día ${filter.day} de ${monthsNames[filter.month - 1]} ${filter.year}`)
        if (filter.type === 'month') titleParts.push(`${monthsNames[filter.month - 1]} ${filter.year}`)
        if (filter.type === 'year') titleParts.push(`Año ${filter.year}`)
    }

    return titleParts.length > 0 ? titleParts.join(' | ') : 'Todas las Tareas'
}
