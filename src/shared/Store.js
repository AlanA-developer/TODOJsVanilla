import { api } from './api.js';

class TodoStore {
    constructor() {
        this.tasks = [];
        this.profiles = [];
        this.activeProfileId = null;
        this.isOnline = true;
        this.listeners = [];

        const now = new Date();
        this.initialFilter = {
            query: '',
            type: 'day',
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            priority: null, // 'high', 'medium', 'low'
            subject: null,
            special: null
        };
        this.currentFilter = { ...this.initialFilter };

        // Initialize state from local storage for fast feedback
        this.loadStateFromLocal();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.tasks, this.currentFilter, this.profiles, this.activeProfileId, this.isOnline));
    }

    saveStateToLocal() {
        const state = {
            tasks: this.tasks,
            profiles: this.profiles,
            activeProfileId: this.activeProfileId
        };
        localStorage.setItem('sirius_state', JSON.stringify(state));
    }

    loadStateFromLocal() {
        const local = localStorage.getItem('sirius_state');
        if (local) {
            const state = JSON.parse(local);
            this.tasks = state.tasks || [];
            this.profiles = state.profiles || [];
            this.activeProfileId = state.activeProfileId || null;
        }
    }

    async refresh() {
        try {
            // 1. Fetch Profiles
            const fetchedProfiles = await api.getProfiles();

            // If no profiles exist, we need to trigger onboarding
            if (!fetchedProfiles || fetchedProfiles.length === 0) {
                this.profiles = [];
                this.activeProfileId = null;
                this.notify();
                return;
            }

            this.profiles = fetchedProfiles;

            // 2. Set default active profile if none
            if (!this.activeProfileId && this.profiles.length > 0) {
                this.activeProfileId = this.profiles[0].id;
            }

            // 3. Fetch Tasks for the active profile
            if (this.activeProfileId) {
                const fetchedTasks = await api.getTasks(this.activeProfileId);
                if (fetchedTasks) {
                    this.tasks = fetchedTasks;
                }
            }

            this.isOnline = true;
            this.saveStateToLocal();
        } catch (e) {
            console.warn('API error, using local cache', e);
            this.isOnline = false;
            this.loadStateFromLocal();
        } finally {
            this.notify();
        }
    }

    async setActiveProfile(profileId) {
        this.activeProfileId = profileId;
        await this.refresh();
    }

    setFilter(filter) {
        this.currentFilter = { ...this.currentFilter, ...filter };
        this.notify();
    }

    resetFilters() {
        this.currentFilter = {
            query: '',
            type: 'all', // Changed from 'day' to 'all' to truly clear
            year: null,
            month: null,
            day: null,
            priority: null,
            subject: null,
            special: null
        };
        this.notify();
    }

    async addTask(title, subject, description, priority, dueDate, notes = '') {
        const newTask = {
            profileId: this.activeProfileId,
            title,
            subject,
            description,
            priority,
            status: 'pending',
            dueDate,
            notes
        };
        await api.addTask(newTask);
        await this.refresh();
    }

    async toggleStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = task.status === 'done' ? 'pending' : 'done';
            await api.updateTask(task);
            this.saveStateToLocal();
            this.notify();
        }
    }

    async updateTaskNotes(id, notes) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.notes = notes;
            await api.updateTask(task);
            this.saveStateToLocal();
            this.notify();
        }
    }

    async deleteTask(id) {
        await api.deleteTask(id);
        await this.refresh();
    }

    // Profile Management
    async createProfile(name, icon = 'briefcase') {
        await api.addProfile({ name, icon });
        await this.refresh();
    }

    async deleteProfile(id) {
        if (this.profiles.length <= 1) return; // Keep at least one
        await api.deleteProfile(id);
        if (this.activeProfileId === id) {
            this.activeProfileId = null; // refresh will pick a new one
        }
        await this.refresh();
    }
}

export const store = new TodoStore();
