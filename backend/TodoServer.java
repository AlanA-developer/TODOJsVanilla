package backend;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TodoServer {
    private static final String DB_URL = "jdbc:sqlite:backend/todo.db";
    private static final Gson gson = new Gson();

    public static void main(String[] args) throws IOException {
        initDatabase();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/tasks", new TasksHandler());
        server.setExecutor(null);
        System.out.println("Servidor iniciado en http://localhost:8080");
        server.start();
    }

    private static void initDatabase() {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement()) {
            String sql = "CREATE TABLE IF NOT EXISTS tasks (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "title TEXT NOT NULL," +
                    "subject TEXT," +
                    "description TEXT," +
                    "priority TEXT," +
                    "status TEXT DEFAULT 'pending'," +
                    "dueDate TEXT" +
                    ")";
            stmt.execute(sql);

            // Migration: Add column if it doesn't exist (safety for existing DBs)
            try {
                stmt.execute("ALTER TABLE tasks ADD COLUMN dueDate TEXT");
            } catch (SQLException e) {
                // Column probably already exists
            }

            // Set default date for existing tasks if they have NULL dueDate
            stmt.execute("UPDATE tasks SET dueDate = '2026-04-16' WHERE dueDate IS NULL");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    static class TasksHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // CORS Headers
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String method = exchange.getRequestMethod();
            String response = "";
            int statusCode = 200;

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    response = gson.toJson(getAllTasks());
                } else if ("POST".equalsIgnoreCase(method)) {
                    Task newTask = gson.fromJson(getRequestBody(exchange), Task.class);
                    addTask(newTask);
                    response = "{\"status\":\"success\"}";
                } else if ("PUT".equalsIgnoreCase(method)) {
                    Task taskToUpdate = gson.fromJson(getRequestBody(exchange), Task.class);
                    updateTask(taskToUpdate);
                    response = "{\"status\":\"success\"}";
                } else if ("DELETE".equalsIgnoreCase(method)) {
                     String query = exchange.getRequestURI().getQuery();
                     int id = Integer.parseInt(query.split("=")[1]);
                     deleteTask(id);
                     response = "{\"status\":\"success\"}";
                }
            } catch (Exception e) {
                e.printStackTrace();
                statusCode = 500;
                response = "{\"error\":\"" + e.getMessage() + "\"}";
            }

            byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(statusCode, responseBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(responseBytes);
            os.close();
        }

        private String getRequestBody(HttpExchange exchange) throws IOException {
            InputStream is = exchange.getRequestBody();
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }

        private List<Task> getAllTasks() throws SQLException {
            List<Task> tasks = new ArrayList<>();
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT * FROM tasks")) {
                while (rs.next()) {
                    tasks.add(new Task(
                            rs.getInt("id"),
                            rs.getString("title"),
                            rs.getString("subject"),
                            rs.getString("description"),
                            rs.getString("priority"),
                            rs.getString("status"),
                            rs.getString("dueDate")
                    ));
                }
            }
            return tasks;
        }

        private void addTask(Task task) throws SQLException {
            String sql = "INSERT INTO tasks(title, subject, description, priority, status, dueDate) VALUES(?,?,?,?,?,?)";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, task.title);
                pstmt.setString(2, task.subject);
                pstmt.setString(3, task.description);
                pstmt.setString(4, task.priority);
                pstmt.setString(5, task.status != null ? task.status : "pending");
                pstmt.setString(6, task.dueDate);
                pstmt.executeUpdate();
            }
        }

        private void updateTask(Task task) throws SQLException {
            String sql = "UPDATE tasks SET title=?, subject=?, description=?, priority=?, status=?, dueDate=? WHERE id=?";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, task.title);
                pstmt.setString(2, task.subject);
                pstmt.setString(3, task.description);
                pstmt.setString(4, task.priority);
                pstmt.setString(5, task.status);
                pstmt.setString(6, task.dueDate);
                pstmt.setInt(7, task.id);
                pstmt.executeUpdate();
            }
        }

        private void deleteTask(int id) throws SQLException {
            String sql = "DELETE FROM tasks WHERE id = ?";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setInt(1, id);
                pstmt.executeUpdate();
            }
        }
    }

    static class Task {
        int id;
        String title;
        String subject;
        String description;
        String priority;
        String status;
        String dueDate;

        public Task(int id, String title, String subject, String description, String priority, String status, String dueDate) {
            this.id = id;
            this.title = title;
            this.subject = subject;
            this.description = description;
            this.priority = priority;
            this.status = status;
            this.dueDate = dueDate;
        }
    }
}
