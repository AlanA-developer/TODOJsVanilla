import { api } from './api.js';

class TodoStore {
    constructor() {
        this.tasks = [];
        this.profiles = []; 
        this.activeProfileId = null;
        this.isLoadingProfiles = true; 
        this.isOnline = true;
        this.listeners = [];

        const now = new Date();
        this.initialFilter = {
            query: '',
            type: 'day',
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            priority: null,
            subject: null,
            special: null
        };
        this.currentFilter = { ...this.initialFilter };

        this.loadStateFromLocal();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.tasks, this.currentFilter, this.profiles, this.activeProfileId, this.isOnline, this.isLoadingProfiles));
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
            this.profiles = state.profiles || []; // Load profiles from cache
            this.activeProfileId = state.activeProfileId || null;
        }
    }

    async refresh() {
        this.isLoadingProfiles = true;
        this.notify(); // Notify that loading has started

        try {
            const fetchedProfiles = await api.getProfiles();
            
            if (!fetchedProfiles || fetchedProfiles.length === 0) {
                this.profiles = [];
                this.activeProfileId = null;
            } else {
                this.profiles = fetchedProfiles;
                if (!this.activeProfileId || !this.profiles.find(p => p.id === this.activeProfileId)) {
                    this.activeProfileId = this.profiles[0].id;
                }
            }

            if (this.activeProfileId) {
                const fetchedTasks = await api.getTasks(this.activeProfileId);
                this.tasks = fetchedTasks || [];
            } else {
                this.tasks = [];
            }

            this.isOnline = true;
            this.saveStateToLocal();
        } catch (e) {
            console.warn('API error, using local cache', e);
            this.isOnline = false;
        } finally {
            this.isLoadingProfiles = false;
            this.notify(); // Final notification with all data
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
            type: 'all',
            year: null,
            month: null,
            day: null,
            priority: null,
            subject: null,
            special: null
        };
        this.notify();
    }

    async addTask(taskData) {
        const newTask = {
            profileId: this.activeProfileId,
            status: 'pending',
            ...taskData
        };
        await api.addTask(newTask);
        await this.refresh();
    }

    async updateTask(task) {
        await api.updateTask(task);
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

    async createProfile(name, icon = 'briefcase') {
        await api.addProfile({ name, icon });
        await this.refresh();
    }

    async deleteProfile(id) {
        if (this.profiles.length <= 1) return;
        await api.deleteProfile(id);
        if (this.activeProfileId === id) {
            this.activeProfileId = null;
        }
        await this.refresh();
    }
}

export const store = new TodoStore();