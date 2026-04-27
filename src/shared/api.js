const API_URL = 'http://localhost:8080';

export const api = {
    // ---- PROFILES ----
    async getProfiles() {
        const response = await fetch(`${API_URL}/profiles`);
        if (!response.ok) throw new Error('Failed to fetch profiles');
        return response.json();
    },

    async addProfile(profile) {
        const response = await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });
        if (!response.ok) throw new Error('Failed to add profile');
        return response.json();
    },

    async deleteProfile(id) {
        const response = await fetch(`${API_URL}/profiles/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete profile');
    },

    // ---- TASKS ----
    async getTasks(profileId) {
        const url = profileId ? `${API_URL}/tasks?profileId=${profileId}` : `${API_URL}/tasks`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    async addTask(task) {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to add task');
        return response.json();
    },

    async updateTask(task) {
        const response = await fetch(`${API_URL}/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    async deleteTask(id) {
        const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete task');
    },

    // ---- TEMPLATES ----
    async getTemplates() {
        const response = await fetch(`${API_URL}/templates`);
        if (!response.ok) throw new Error('Failed to fetch templates');
        return response.json();
    },

    async createTemplate(template) {
        const response = await fetch(`${API_URL}/templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(template)
        });
        if (!response.ok) throw new Error('Failed to create template');
        return response.json();
    },

    async applyTemplate(templateId, profileId) {
        const response = await fetch(`${API_URL}/templates/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId, profileId })
        });
        if (!response.ok) throw new Error('Failed to apply template');
        return response.json();
    },

    async deleteTemplate(id) {
        const response = await fetch(`${API_URL}/templates/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete template');
        return response.json();
    }
};