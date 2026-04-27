import { appendSidebar } from './components/sidebar.js'
import { appendTopBar } from './components/topBar.js'
import { appendTaskList } from './components/taskList.js'
import { appendModal, openModal } from './components/modal.js'
import { appendOnboarding } from './components/onboarding.js'
import { appendProtocolsModal } from './components/protocols.js' // Import the new modal
import { store } from './shared/Store.js'
import { requestNotificationPermission, startReminderCheck } from './shared/notifications.js'

const app = document.getElementById('app')

// Initialize App
const initApp = async () => {
    // 1. Inject Components
    appendSidebar(app)
    const mainContainer = document.createElement('main')
    mainContainer.classList.add('main-content')
    app.appendChild(mainContainer)
    appendTopBar(mainContainer)
    appendTaskList(mainContainer)
    appendModal(app)
    appendOnboarding(app)
    appendProtocolsModal(app) // Append the new modal to the app

    const fab = document.createElement('div')
    fab.classList.add('fab')
    fab.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
    fab.addEventListener('click', () => openModal())
    app.appendChild(fab)

    // 2. Load initial data
    await store.refresh()

    // 3. Initialize notification system
    requestNotificationPermission()
    startReminderCheck()
}

initApp()
