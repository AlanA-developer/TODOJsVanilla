const BASE_URL = 'http://localhost:8080/api';
const TASKS_URL = `${BASE_URL}/tasks`;
const PROFILES_URL = `${BASE_URL}/profiles`;

export const api = {
    // --- TASKS ---
    async getTasks(profileId = null) {
        try {
            const url = profileId ? `${TASKS_URL}?profileId=${profileId}` : TASKS_URL;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    async addTask(task) {
        try {
            const response = await fetch(TASKS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    },

    async updateTask(task) {
        try {
            const response = await fetch(TASKS_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    async deleteTask(id) {
        try {
            const response = await fetch(`${TASKS_URL}?id=${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    // --- PROFILES ---
    async getProfiles() {
        try {
            const response = await fetch(PROFILES_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching profiles:', error);
            throw error;
        }
    },

    async addProfile(profile) {
        try {
            const response = await fetch(PROFILES_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error adding profile:', error);
            throw error;
        }
    },

    async deleteProfile(id) {
        try {
            const response = await fetch(`${PROFILES_URL}?id=${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    }
};
