import { store } from '../shared/Store.js'

export const appendSidebar = (container) => {
    const sidebar = document.createElement('aside')
    sidebar.classList.add('sidebar')
    container.appendChild(sidebar)

    const render = (tasks, currentFilter) => {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1 // 1-indexed

        // Group tasks for navigation
        const groups = tasks.reduce((acc, task) => {
            if (!task.dueDate) return acc
            const [y, m, d] = task.dueDate.split('-').map(Number)
            
            if (!acc[y]) acc[y] = {}
            if (!acc[y][m]) acc[y][m] = new Set()
            acc[y][m].add(d)
            return acc
        }, {})

        const years = Object.keys(groups).sort((a, b) => b - a)

        const todayFilter = `{type: 'day', year: ${currentYear}, month: ${currentMonth}, day: ${now.getDate()}}`

        sidebar.innerHTML = `
            <div class="logo-area">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span>SIRIUS-TODO</span>
            </div>

            <nav class="nav-container">
                <div class="nav-section">
                    <div class="nav-item ${currentFilter.type === 'day' && currentFilter.day === now.getDate() ? 'active' : ''}" 
                         onclick="window.setFilter(${todayFilter})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        <span>Dashboard (Hoy)</span>
                    </div>
                </div>

                <div class="nav-section">
                    <div class="section-label">TAREAS POR DÍA</div>
                    <div class="nav-group-items">
                        ${renderCurrentMonthDays(groups, currentYear, currentMonth, currentFilter)}
                    </div>
                </div>

                <div class="nav-section">
                    <div class="section-label">HISTÓRICO (POR AÑO)</div>
                    <div class="nav-group-items">
                        ${renderYearsWithMonths(groups, currentFilter)}
                    </div>
                </div>
            </nav>

            <div class="stats-container" id="stats-widget"></div>
        `
        updateStats(tasks)
    }

    // Expose filter setter to window for onclick (simple way for vanilla JS)
    window.setFilter = (filter) => store.setFilter(filter)

    store.subscribe((tasks, filter) => {
        render(tasks, filter)
    })
}

function renderCurrentMonthDays(groups, year, month, currentFilter) {
    const days = groups[year]?.[month]
    if (!days) return '<div class="nav-item empty">Sin tareas hoy</div>'
    
    return Array.from(days).sort((a, b) => a - b).map(day => `
        <div class="nav-item sub-item ${currentFilter.type === 'day' && currentFilter.day === day ? 'active' : ''}" 
             onclick="window.setFilter({type: 'day', year: ${year}, month: ${month}, day: ${day}})">
            <div class="dot"></div>
            <span>Día ${day}</span>
        </div>
    `).join('')
}

function renderYearsWithMonths(groups, currentFilter) {
    const years = Object.keys(groups).sort((a, b) => b - a)
    const monthsNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    
    return years.map(year => {
        const months = Object.keys(groups[year]).sort((a, b) => b - a)
        return `
            <div class="nav-nested-group">
                <div class="nav-item group-header ${currentFilter.type === 'year' && currentFilter.year === Number(year) ? 'active' : ''}" 
                     onclick="window.setFilter({type: 'year', year: ${Number(year)}})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Archivo ${year}</span>
                </div>
                <div class="nested-items">
                    ${months.map(month => `
                        <div class="nav-item sub-item ${currentFilter.type === 'month' && currentFilter.month === Number(month) && currentFilter.year === Number(year) ? 'active' : ''}" 
                             onclick="window.setFilter({type: 'month', year: ${Number(year)}, month: ${Number(month)}})">
                            <div class="dot small"></div>
                            <span>${monthsNames[month-1]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    }).join('')
}

function updateStats(tasks) {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'done').length
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

    const statsWidget = document.getElementById('stats-widget')
    if (statsWidget) {
        statsWidget.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">
                    <span>Progreso Total</span>
                    <span>${percent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `
    }
}
