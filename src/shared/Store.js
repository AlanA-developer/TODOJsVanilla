import { api } from './api.js';

class TodoStore {
    constructor() {
        this.tasks = [];
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.tasks));
    }

    async refresh() {
        this.tasks = await api.getTasks();
        this.notify();
    }

    async addTask(title, subject, description, priority) {
        const newTask = { title, subject, description, priority, status: 'pending' };
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
