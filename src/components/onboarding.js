import { store } from '../shared/Store.js';

export const appendOnboarding = (container) => {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.className = 'onboarding-overlay';

    const render = (profiles, isLoading) => {
        // This component should only make a decision when loading is fully complete.
        if (isLoading) {
            overlay.classList.remove('visible'); // Hide if it was visible
            return;
        }

        // If loading is complete and there are still no profiles, show onboarding.
        if (!profiles || profiles.length === 0) {
            overlay.innerHTML = `
                <div class="onboarding-card fade-in">
                    <div class="onboarding-header">
                        <div class="onboarding-logo">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" stroke-width="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                        </div>
                        <h2>Bienvenido a SIRIUS</h2>
                        <p>Para comenzar a organizar tus tareas, crea tu primer perfil.</p>
                    </div>
                    
                    <div class="onboarding-form">
                        <div class="form-group">
                            <label class="form-label">Tu Nombre</label>
                            <input type="text" id="onboarding-name" class="form-input" placeholder="Ej: Alan" autocomplete="off">
                        </div>
                        
                        <div class="icon-selector">
                            <label class="form-label">Elige un Icono</label>
                            <div class="icon-grid">
                                <div class="icon-option active" data-icon="user">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div class="icon-option" data-icon="briefcase">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path></svg>
                                </div>
                                <div class="icon-option" data-icon="code">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                </div>
                                <div class="icon-option" data-icon="zap">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                </div>
                            </div>
                        </div>

                        <button class="btn-submit" id="btn-start-onboarding">INICIALIZAR SISTEMA</button>
                    </div>
                </div>
            `;

            const btn = overlay.querySelector('#btn-start-onboarding');
            const nameInput = overlay.querySelector('#onboarding-name');
            const iconOptions = overlay.querySelectorAll('.icon-option');
            let selectedIcon = 'user';

            iconOptions.forEach(opt => {
                opt.onclick = () => {
                    iconOptions.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    selectedIcon = opt.dataset.icon;
                };
            });

            btn.onclick = async () => {
                const name = nameInput.value.trim();
                if (!name) {
                    nameInput.style.borderColor = 'var(--accent-primary)';
                    return;
                }

                btn.disabled = true;
                btn.innerText = 'INICIALIZANDO...';

                try {
                    await store.createProfile(name, selectedIcon);
                } catch (error) {
                    console.error('Error during onboarding:', error);
                    btn.disabled = false;
                    btn.innerText = 'REINTENTAR';
                }
            };

            if (!overlay.classList.contains('visible')) {
                setTimeout(() => overlay.classList.add('visible'), 100);
            }
        } else {
            // If loading is complete and there ARE profiles, ensure it's hidden.
            overlay.classList.remove('visible');
        }
    };

    container.appendChild(overlay);

    store.subscribe((tasks, filter, profiles, activeId, isOnline, isLoading) => {
        render(profiles, isLoading);
    });
};