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
        server.createContext("/api/profiles", new ProfilesHandler());
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

            // 1. Create Profiles Table
            stmt.execute("CREATE TABLE IF NOT EXISTS profiles (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "name TEXT NOT NULL," +
                    "icon TEXT" +
                    ")");

            // 2. Create Tasks Table (Updated)
            stmt.execute("CREATE TABLE IF NOT EXISTS tasks (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "profileId INTEGER," +
                    "title TEXT NOT NULL," +
                    "subject TEXT," +
                    "description TEXT," +
                    "priority TEXT," +
                    "status TEXT DEFAULT 'pending'," +
                    "dueDate TEXT," +
                    "notes TEXT," +
                    "FOREIGN KEY(profileId) REFERENCES profiles(id)" +
                    ")");

            // 3. Migrations & Seed Data
            try {
                stmt.execute("ALTER TABLE tasks ADD COLUMN profileId INTEGER");
            } catch (SQLException e) {
            }
            try {
                stmt.execute("ALTER TABLE tasks ADD COLUMN dueDate TEXT");
            } catch (SQLException e) {
            }
            try {
                stmt.execute("ALTER TABLE tasks ADD COLUMN notes TEXT");
            } catch (SQLException e) {
            }

            // Seed default profiles removed to allow onboarding flow

            // Assign orphan tasks to the first profile (usually 'DraiceDev')
            stmt.execute(
                    "UPDATE tasks SET profileId = (SELECT id FROM profiles ORDER BY id ASC LIMIT 1) WHERE profileId IS NULL");
            stmt.execute("UPDATE tasks SET dueDate = '2026-04-16' WHERE dueDate IS NULL");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    static class ProfilesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Robust CORS Security
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String method = exchange.getRequestMethod();
            String response = "";
            int statusCode = 200;

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    response = gson.toJson(getAllProfiles());
                } else if ("POST".equalsIgnoreCase(method)) {
                    Profile newProfile = gson.fromJson(getRequestBody(exchange), Profile.class);
                    int newId = addProfile(newProfile);
                    response = "{\"status\":\"success\", \"id\":" + newId + "}";
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    int id = Integer.parseInt(query.split("=")[1]);
                    deleteProfile(id);
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

        private List<Profile> getAllProfiles() throws SQLException {
            List<Profile> profiles = new ArrayList<>();
            try (Connection conn = DriverManager.getConnection(DB_URL);
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT * FROM profiles")) {
                while (rs.next()) {
                    profiles.add(new Profile(rs.getInt("id"), rs.getString("name"), rs.getString("icon")));
                }
            }
            return profiles;
        }

        private int addProfile(Profile profile) throws SQLException {
            String sql = "INSERT INTO profiles(name, icon) VALUES(?,?)";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                    PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setString(1, profile.name);
                pstmt.setString(2, profile.icon);
                pstmt.executeUpdate();
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        return generatedKeys.getInt(1);
                    } else {
                        throw new SQLException("Creating profile failed, no ID obtained.");
                    }
                }
            }
        }

        private void deleteProfile(int id) throws SQLException {
            // Optional: Also delete tasks for this profile or move them?
            // For now, simple delete.
            try (Connection conn = DriverManager.getConnection(DB_URL)) {
                conn.setAutoCommit(false);
                try {
                    // 1. Delete tasks
                    try (PreparedStatement pstmt = conn.prepareStatement("DELETE FROM tasks WHERE profileId = ?")) {
                        pstmt.setInt(1, id);
                        pstmt.executeUpdate();
                    }
                    // 2. Delete profile
                    try (PreparedStatement pstmt = conn.prepareStatement("DELETE FROM profiles WHERE id = ?")) {
                        pstmt.setInt(1, id);
                        pstmt.executeUpdate();
                    }
                    conn.commit();
                } catch (SQLException e) {
                    conn.rollback();
                    throw e;
                }
            }
        }
    }

    static class TasksHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Robust CORS Security
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String method = exchange.getRequestMethod();
            String response = "";
            int statusCode = 200;

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    Integer profileId = null;
                    if (query != null && query.contains("profileId=")) {
                        profileId = Integer.parseInt(query.split("profileId=")[1].split("&")[0]);
                    }
                    response = gson.toJson(getAllTasks(profileId));
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

        private List<Task> getAllTasks(Integer profileId) throws SQLException {
            List<Task> tasks = new ArrayList<>();
            String sql = profileId == null ? "SELECT * FROM tasks" : "SELECT * FROM tasks WHERE profileId = ?";

            try (Connection conn = DriverManager.getConnection(DB_URL);
                    PreparedStatement pstmt = conn.prepareStatement(sql)) {

                if (profileId != null)
                    pstmt.setInt(1, profileId);

                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        tasks.add(new Task(
                                rs.getInt("id"),
                                rs.getInt("profileId"),
                                rs.getString("title"),
                                rs.getString("subject"),
                                rs.getString("description"),
                                rs.getString("priority"),
                                rs.getString("status"),
                                rs.getString("dueDate"),
                                rs.getString("notes")));
                    }
                }
            }
            return tasks;
        }

        private void addTask(Task task) throws SQLException {
            String sql = "INSERT INTO tasks(profileId, title, subject, description, priority, status, dueDate, notes) VALUES(?,?,?,?,?,?,?,?)";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                    PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setObject(1, task.profileId);
                pstmt.setString(2, task.title);
                pstmt.setString(3, task.subject);
                pstmt.setString(4, task.description);
                pstmt.setString(5, task.priority);
                pstmt.setString(6, task.status != null ? task.status : "pending");
                pstmt.setString(7, task.dueDate);
                pstmt.setString(8, task.notes);
                pstmt.executeUpdate();
            }
        }

        private void updateTask(Task task) throws SQLException {
            String sql = "UPDATE tasks SET profileId=?, title=?, subject=?, description=?, priority=?, status=?, dueDate=?, notes=? WHERE id=?";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                    PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setObject(1, task.profileId);
                pstmt.setString(2, task.title);
                pstmt.setString(3, task.subject);
                pstmt.setString(4, task.description);
                pstmt.setString(5, task.priority);
                pstmt.setString(6, task.status);
                pstmt.setString(7, task.dueDate);
                pstmt.setString(8, task.notes);
                pstmt.setInt(9, task.id);
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
        Integer profileId;
        String title;
        String subject;
        String description;
        String priority;
        String status;
        String dueDate;
        String notes;

        public Task(int id, Integer profileId, String title, String subject, String description, String priority,
                String status, String dueDate, String notes) {
            this.id = id;
            this.profileId = profileId;
            this.title = title;
            this.subject = subject;
            this.description = description;
            this.priority = priority;
            this.status = status;
            this.dueDate = dueDate;
            this.notes = notes;
        }
    }

    static class Profile {
        int id;
        String name;
        String icon;

        public Profile(int id, String name, String icon) {
            this.id = id;
            this.name = name;
            this.icon = icon;
        }
    }
}
