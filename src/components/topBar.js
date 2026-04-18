import { store } from '../shared/Store.js?v=4.1'

export const appendTopBar = (container) => {
    const topBar = document.createElement('div')
    topBar.classList.add('top-bar')
    container.appendChild(topBar)

    let dropdownOpen = false;
    let searchExpanded = false;
    let filtersOpen = false;

    window.toggleProfileDropdown = (e) => {
        if (e) e.stopPropagation();
        dropdownOpen = !dropdownOpen;
        if (dropdownOpen) {
            filtersOpen = false;
            // Add click outside listener for profile dropdown
            setTimeout(() => {
                const closeProfile = (event) => {
                    const dropdown = document.querySelector('.profile-dropdown-menu');
                    const trigger = document.querySelector('.profile-avatar-wrapper');
                    if (dropdown && !dropdown.contains(event.target) && !trigger.contains(event.target)) {
                        dropdownOpen = false;
                        store.notify();
                        document.removeEventListener('click', closeProfile);
                    }
                };
                document.addEventListener('click', closeProfile);
            }, 0);
        }
        store.notify();
    }

    window.toggleSearch = () => {
        searchExpanded = !searchExpanded;
        if (!searchExpanded) {
            filtersOpen = false;
        }
        store.notify();
    }

    // Keyboard Shortcuts
    const handleKeyDown = (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (!searchExpanded) {
                window.toggleSearch();
            } else {
                const input = document.getElementById('top-search-input');
                if (input) input.focus();
            }
        }
        if (e.key === 'Escape') {
            if (filtersOpen) {
                window.toggleFilters();
            } else if (searchExpanded) {
                window.toggleSearch();
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    window.toggleFilters = (e) => {
        if (e) e.stopPropagation();
        filtersOpen = !filtersOpen;
        if (filtersOpen) {
            dropdownOpen = false; // Close profile when opening filters
            // Add click outside listener when opening
            setTimeout(() => {
                const closeFilters = (event) => {
                    const dropdown = document.querySelector('.filter-dropdown-menu');
                    const trigger = document.querySelector('.filter-trigger');
                    if (dropdown && !dropdown.contains(event.target) && !trigger.contains(event.target)) {
                        filtersOpen = false;
                        store.notify();
                        document.removeEventListener('click', closeFilters);
                    }
                };
                document.addEventListener('click', closeFilters);
            }, 0);
        }
        store.notify();
    }

    window.setSearchQuery = (query) => {
        store.setFilter({ query });
    }

    window.applyFilter = (filter) => {
        store.setFilter(filter);
    }

    window.resetAllFilters = () => {
        store.resetFilters();
        store.notify();
    }

    window.switchProfile = (id) => {
        dropdownOpen = false;
        store.setActiveProfile(id);
    }

    const render = (profiles, activeProfileId, isOnline, filter, tasks = []) => {
        const now = new Date()
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        const dateString = now.toLocaleDateString('es-ES', options)

        const hour = now.getHours()
        let greeting = 'Buenas'
        if (hour >= 6 && hour < 12) {
            greeting = 'Buenos días'
        } else if (hour >= 12 && hour < 19) {
            greeting = 'Buenas tardes'
        } else {
            greeting = 'Buenas noches'
        }

        const activeProfile = (profiles || []).find(p => Number(p.id) === Number(activeProfileId)) || { name: 'Usuario', icon: 'user' }
        const statusClass = isOnline ? 'online' : 'offline'

        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i)

        const safeTasks = Array.isArray(tasks) ? tasks : [];
        const subjects = [...new Set(safeTasks.map(t => t.subject).filter(Boolean).map(s => String(s).trim()))].sort();

        const activeEl = document.activeElement;
        const selectionStart = activeEl ? activeEl.selectionStart : null;
        const activeId = activeEl ? activeEl.id : null;

        const query = (filter.query || '').toLowerCase().trim();
        const filteredCount = query ? safeTasks.filter(t =>
            t.title.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
        ).length : 0;

        topBar.innerHTML = `
            <div class="welcome-text">
                <h1>${greeting}, ${activeProfile.name}</h1>
                <p>${dateString}</p>
            </div>
            <div class="top-bar-actions" style="display: flex; gap: 1rem; align-items: center; position: relative;">
                
                <!-- Search Container -->
                <div class="search-container ${searchExpanded ? 'expanded' : ''} ${query ? 'has-query' : ''}">
                    <div class="search-trigger" onclick="window.toggleSearch()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    
                    ${!searchExpanded ? `<span class="search-shortcut-hint">/</span>` : ''}

                    ${searchExpanded ? `
                        <input type="text" id="top-search-input" class="search-input" placeholder="Buscar tareas..."
                            value="${filter.query || ''}"
                            oninput="window.setSearchQuery(this.value)"
                            onkeydown="if(event.key==='Enter') window.toggleSearch()"
                            autocomplete="off">
                        
                        ${query ? `<div class="search-results-badge">${filteredCount}</div>` : ''}

                        <div class="filter-trigger ${filtersOpen ? 'active' : ''}" onclick="window.toggleFilters(event)">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"></path></svg>
                        </div>
                    ` : ''}

                    <!-- Filters Dropdown -->
                    <div class="filter-dropdown-menu ${filtersOpen ? 'visible' : ''}" onclick="event.stopPropagation()">
                        <div class="dropdown-section-title">FILTROS AVANZADOS</div>
                        
                        <div class="filter-scroll-container" style="max-height: 480px; overflow-y: auto; padding-right: 5px; margin-bottom: 1rem;">
                            <div class="filter-group">
                                <label>AÑO</label>
                                <div class="filter-options-scroll">
                                    ${years.map(y => `
                                        <div class="filter-chip ${filter.year === y ? 'active' : ''}" 
                                             onclick="window.applyFilter({ year: ${y}, type: 'year' })">${y}</div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="filter-group">
                                <label>MES</label>
                                <div class="filter-grid-months">
                                    ${months.map((m, i) => `
                                        <div class="filter-chip month ${filter.month === i + 1 ? 'active' : ''}" 
                                             onclick="window.applyFilter({ month: ${i + 1}, type: 'month' })">${m.substring(0, 3)}</div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="filter-group">
                                <label>PRIORIDAD</label>
                                <div class="filter-options-scroll">
                                    ${['high', 'medium', 'low'].map(p => `
                                        <div class="filter-chip priority-${p} ${filter.priority === p ? 'active' : ''}" 
                                             onclick="window.applyFilter({ priority: '${filter.priority === p ? null : p}' })">
                                            ${p === 'high' ? 'ALTA' : p === 'medium' ? 'MEDIA' : 'BAJA'}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            ${subjects.length > 0 ? `
                            <div class="filter-group">
                                <label>CATEGORÍA</label>
                                <div class="filter-options-scroll">
                                    ${subjects.map(s => `
                                        <div class="filter-chip ${filter.subject === s ? 'active' : ''}" 
                                             onclick="window.applyFilter({ subject: '${filter.subject === s ? null : s}' })">${s}</div>
                                    `).join('')}
                                </div>
                            </div>
                            ` : ''}

                            <div class="filter-group">
                                <label>ESTADOS ESPECIALES</label>
                                <div class="filter-quick-toggles">
                                    <div class="filter-toggle-btn ${filter.special === 'observations' ? 'active' : ''}" 
                                         onclick="window.applyFilter({ special: '${filter.special === 'observations' ? null : 'observations'}' })">
                                        CON BITÁCORA
                                    </div>
                                    <div class="filter-toggle-btn ${filter.special === 'overdue' ? 'active' : ''}" 
                                         onclick="window.applyFilter({ special: '${filter.special === 'overdue' ? null : 'overdue'}' })">
                                        VENCIDAS
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="btn-clear-filters" onclick="window.resetAllFilters()">LIMPIAR TODO</button>
                    </div>
                </div>
                
                <!-- Profile Avatar -->
                <div class="profile-avatar-wrapper" onclick="window.toggleProfileDropdown(event)">
                    <div class="profile-avatar-circle ${statusClass}">
                        ${activeProfile.name.charAt(0).toUpperCase()}
                    </div>
                    
                    ${dropdownOpen ? `
                    <div class="profile-dropdown-menu">
                        <div class="dropdown-section-title">PERFILES / CONTEXTO</div>
                        ${profiles.map(p => `
                            <div class="profile-option ${Number(activeProfileId) === Number(p.id) ? 'active' : ''}" 
                                 onclick="event.stopPropagation(); window.switchProfile(${p.id});">
                                 <div class="profile-icon">
                                    ${p.icon === 'briefcase' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>' :
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'}
                                 </div>
                                 <span>${p.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `

        if (activeId) {
            const restoredEl = document.getElementById(activeId);
            if (restoredEl) {
                restoredEl.focus();
                if (selectionStart !== null && restoredEl.setSelectionRange) {
                    restoredEl.setSelectionRange(selectionStart, selectionStart);
                }
            }
        } else if (searchExpanded && !filtersOpen) {
            const input = topBar.querySelector('.search-input');
            if (input) input.focus();
        }
    }

    store.subscribe((tasks, filter, profiles, activeProfileId, isOnline) => {
        render(profiles, activeProfileId, isOnline, filter, tasks)
    })
}
