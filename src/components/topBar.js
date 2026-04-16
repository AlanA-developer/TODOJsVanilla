export const appendTopBar = (container) => {
    const topBar = document.createElement('div')
    topBar.classList.add('top-bar')
    
    const now = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const dateString = now.toLocaleDateString('es-ES', options)

    topBar.innerHTML = `
        <div class="welcome-text">
            <h1>Hola, Visionario</h1>
            <p>${dateString}</p>
        </div>
        <div style="display: flex; gap: 1rem;">
            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 50%; border: 1px solid var(--glass-border)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(var(--accent-primary), var(--accent-secondary));"></div>
        </div>
    `
    container.appendChild(topBar)
}
