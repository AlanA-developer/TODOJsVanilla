export function showConfirmDialog(title, message, onConfirm) {
    const dialogOverlay = document.createElement('div')
    dialogOverlay.className = 'modal-overlay active'

    dialogOverlay.innerHTML = `
        <div class="modal-content" style="max-width: 400px; padding: 2rem;">
            <div style="color: #ff2e63; margin-bottom: 1rem;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h3 style="font-family: 'Manrope', sans-serif; font-size: 1.4rem; margin-bottom: 0.5rem">${title}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem">${message}</p>
            <div style="display: flex; gap: 1rem">
                <button id="dialog-cancel" style="flex: 1; padding: 0.8rem; border-radius: 12px; background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--glass-border); cursor: pointer; font-weight: 600; transition: all 0.2s">Cancelar</button>
                <button id="dialog-confirm" style="flex: 1; padding: 0.8rem; border-radius: 12px; background: rgba(255, 46, 99, 0.2); color: #ff2e63; border: 1px solid rgba(255, 46, 99, 0.4); cursor: pointer; font-weight: 600; transition: all 0.2s">Eliminar</button>
            </div>
        </div>
    `

    document.body.appendChild(dialogOverlay)

    const cleanup = () => {
        dialogOverlay.classList.remove('active')
        setTimeout(() => dialogOverlay.remove(), 300)
    }

    dialogOverlay.querySelector('#dialog-cancel').onclick = cleanup
    dialogOverlay.querySelector('#dialog-confirm').onclick = async () => {
        await onConfirm()
        cleanup()
    }
    dialogOverlay.onclick = (e) => {
        if (e.target === dialogOverlay) cleanup()
    }
}
