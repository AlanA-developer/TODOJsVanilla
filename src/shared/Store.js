import { api } from './api.js';

class TodoStore {
    constructor() {
        this.tasks = [];
        this.listeners = [];
        const now = new Date();
        this.currentFilter = { 
            type: 'day', 
            year: now.getFullYear(), 
            month: now.getMonth() + 1, 
            day: now.getDate() 
        };
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.tasks, this.currentFilter));
    }

    async refresh() {
        this.tasks = await api.getTasks();
        this.notify();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.notify();
    }

    async addTask(title, subject, description, priority, dueDate) {
        const newTask = { title, subject, description, priority, status: 'pending', dueDate };
        await api.addTask(newTask);
        await this.refresh();
    }

    async toggleStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = task.status === 'done' ? 'pending' : 'done';
            await api.updateTask(task);
            this.notify();
        }
    }

    async deleteTask(id) {
        await api.deleteTask(id);
        await this.refresh();
    }
}

export const store = new TodoStore();
