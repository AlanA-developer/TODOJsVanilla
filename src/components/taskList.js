import { store } from '../shared/Store.js'

export const appendTaskList = (container) => {
    const listContainer = document.createElement('div')
    listContainer.classList.add('task-grid')
    listContainer.id = 'task-grid'
    container.appendChild(listContainer)

    store.subscribe((tasks) => {
        renderTasks(tasks, listContainer)
    })
}

function renderTasks(tasks, container) {
    container.innerHTML = ''
    
    tasks.forEach((task, index) => {
        const card = document.createElement('div')
        card.classList.add('premium-card', 'fade-in')
        card.style.animationDelay = `${index * 0.1}s`
        if (task.status === 'done') card.classList.add('done')
        
        card.innerHTML = `
            <div class="card-priority priority-${task.priority || 'low'}">${task.priority || 'baja'}</div>
            <h2 class="card-title">${task.title}</h2>
            <h3 style="font-size: 0.8rem; color: var(--accent-secondary); margin-bottom: 0.5rem">${task.subject || 'Sín categoría'}</h3>
            <p class="card-desc">${task.description || 'Sin descripción estratégica para esta misión.'}</p>
            
            <div class="card-footer">
                <button class="btn-check" data-id="${task.id}" style="background: none; border: none; cursor: pointer; color: ${task.status === 'done' ? 'var(--accent-secondary)' : 'var(--text-muted)'}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"></path></svg>
                </button>
                <div style="display: flex; gap: 1rem">
                    <button class="btn-delete-pro" data-id="${task.id}" style="background: none; border: none; cursor: pointer; color: var(--text-muted)">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `

        card.querySelector('.btn-check').addEventListener('click', () => {
            store.toggleStatus(task.id)
        })

        card.querySelector('.btn-delete-pro').addEventListener('click', () => {
            if (confirm('¿Confirmas la eliminación de esta misión?')) {
                store.deleteTask(task.id)
            }
        })

        container.appendChild(card)
    })
}
