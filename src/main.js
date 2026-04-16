import { appendSidebar } from './components/sidebar.js'
import { appendTopBar } from './components/topBar.js'
import { appendTaskList } from './components/taskList.js'
import { appendModal, openModal } from './components/modal.js'
import { store } from './shared/Store.js'

const app = document.getElementById('app')

// 1. Inyectar Sidebar
appendSidebar(app)

// 2. Crear Contenedor Principal
const mainContainer = document.createElement('main')
mainContainer.classList.add('main-content')
app.appendChild(mainContainer)

// 3. Inyectar TopBar y TaskGrid en el contenedor principal
appendTopBar(mainContainer)
appendTaskList(mainContainer)

// 4. Inyectar Modal y FAB
appendModal(app)

const fab = document.createElement('div')
fab.classList.add('fab')
fab.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
fab.addEventListener('click', openModal)
app.appendChild(fab)

// 5. Cargar datos iniciales
store.refresh()