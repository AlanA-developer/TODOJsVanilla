import { store } from '../shared/Store.js'

export const appendTaskList = (container) => {
    const listContainer = document.createElement('div')
    listContainer.classList.add('task-grid')
    listContainer.id = 'task-grid'
    container.appendChild(listContainer)

    store.subscribe((tasks, filter) => {
        const filteredTasks = filterTasks(tasks, filter)
        renderTasks(filteredTasks, listContainer, filter)
    })
}

function filterTasks(tasks, filter) {
    if (!filter || filter.type === 'all') return tasks

    return tasks.filter(task => {
        if (!task.dueDate) return false
        const [y, m, d] = task.dueDate.split('-').map(Number)
        
        switch (filter.type) {
            case 'day':
                return y === filter.year && m === filter.month && d === filter.day
            case 'month':
                return y === filter.year && m === filter.month
            case 'year':
                return y === filter.year
            default:
                return true
        }
    })
}

function renderTasks(tasks, container, filter) {
    // 1. Manage the View Header (only if it doesn't exist or title changed)
    let header = container.querySelector('.view-header')
    const title = getViewTitle(filter)
    if (!header) {
        header = document.createElement('div')
        header.classList.add('view-header')
        header.style.gridColumn = '1 / -1'
        header.style.marginBottom = '1.5rem'
        container.appendChild(header)
    }
    header.innerHTML = `<h2 style="font-size: 1.2rem; opacity: 0.8">${title}</h2>`

    // 2. Identify current containers in DOM
    const existingContainers = Array.from(container.querySelectorAll('.card-container'))
    const taskIds = tasks.map(t => String(t.id))

    // 3. Remove containers that are no longer in the filtered list
    existingContainers.forEach(cardCont => {
        if (!taskIds.includes(cardCont.dataset.id)) {
            cardCont.remove()
        }
    })

    if (tasks.length === 0) {
        let empty = container.querySelector('.empty-state')
        if (!empty) {
            empty = document.createElement('div')
            empty.classList.add('empty-state')
            empty.style.gridColumn = '1 / -1'
            empty.style.textAlign = 'center'
            empty.style.padding = '4rem'
            empty.style.color = 'var(--text-muted)'
            empty.innerHTML = 'No hay misiones programadas para este periodo.'
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
            cardContainer.classList.add('card-container', 'fade-in')
            cardContainer.dataset.id = task.id
            cardContainer.style.animationDelay = `${index * 0.05}s`
            
            cardContainer.innerHTML = `
                <div class="card-flipper">
                    <div class="premium-card card-front"></div>
                    <div class="card-back">
                        <div class="edit-form">
                            <h4 style="margin-bottom: 1.5rem; font-size: 0.9rem; letter-spacing: 1px; color: var(--accent-secondary); font-weight: 800">EDITAR MISIÓN</h4>
                            <input type="text" class="form-input mini title-input" placeholder="Título">
                            <textarea class="form-input mini desc-input" placeholder="Descripción" rows="3"></textarea>
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
            <p class="card-desc">${task.description || 'Sin descripción estratégica para esta misión.'}</p>
            
            <div class="card-footer">
                <div style="display: flex; gap: 0.8rem">
                    <button class="btn-check" style="background: none; border: none; cursor: pointer; color: ${isDone ? 'var(--accent-secondary)' : 'var(--text-muted)'}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"></path></svg>
                    </button>
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
            if (confirm('¿Confirmas la eliminación de esta misión?')) {
                store.deleteTask(task.id)
            }
        }
        front.querySelector('.btn-edit-pro').onclick = () => {
            // Pre-fill back form
            back.querySelector('.title-input').value = task.title
            back.querySelector('.desc-input').value = task.description || ''
            back.querySelector('.priority-input').value = task.priority || 'low'
            back.querySelector('.date-input').value = task.dueDate || ''
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
                dueDate: back.querySelector('.date-input').value
            }
            if (updatedTask.title.trim()) {
                flipper.classList.remove('flipped')
                // Wait for animation or do it fast
                setTimeout(async () => {
                    await api.updateTask(updatedTask)
                    await store.refresh()
                }, 300)
            }
        }
    })
}

function getViewTitle(filter) {
    if (!filter) return 'Todas las Misiones'
    
    const now = new Date()
    const isToday = filter.type === 'day' && 
                    filter.day === now.getDate() && 
                    filter.month === (now.getMonth() + 1) && 
                    filter.year === now.getFullYear()

    if (isToday) return 'Misiones de Hoy'
    if (filter.type === 'all') return 'Todas las Misiones'

    const monthsNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    
    switch (filter.type) {
        case 'day': return `Misiones del ${filter.day} de ${monthsNames[filter.month - 1]} ${filter.year}`
        case 'month': return `Misiones de ${monthsNames[filter.month - 1]} ${filter.year}`
        case 'year': return `Archivo del Año ${filter.year}`
        default: return 'Vista Filtrada'
    }
}
