const API_URL = 'http://localhost:8080/api/tasks';

export const api = {
    async getTasks() {
        try {
            const response = await fetch(API_URL);
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    },

    async addTask(task) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    },

    async updateTask(task) {
        try {
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    },

    async deleteTask(id) {
        try {
            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
};
