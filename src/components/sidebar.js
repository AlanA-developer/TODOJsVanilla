import { store } from '../shared/Store.js'

export const appendSidebar = (container) => {
    const sidebar = document.createElement('aside')
    sidebar.classList.add('sidebar')

    sidebar.innerHTML = `
        <div class="logo-area">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span>TODO-LIST</span>
        </div>

        <nav class="nav-group">
            <div class="nav-item active">
                <div class="item-active-pill"></div>
                <span>Dashboard</span>
            </div>
            <div class="nav-item">
                <span>Mis Misiones</span>
            </div>
            <div class="nav-item">
                <span>Archivadas</span>
            </div>
        </nav>

        <div class="stats-container" id="stats-widget">
            <!-- Stats will be injected here -->
        </div>
    `
    container.appendChild(sidebar)

    store.subscribe((tasks) => {
        updateStats(tasks)
    })
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
            <div class="stat-item" style="margin-top: 1.5rem">
                <div style="font-size: 0.8rem; color: var(--text-muted)">
                    ${completed} de ${total} misiones completadas
                </div>
            </div>
        `
    }
}
