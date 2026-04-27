package backend;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TodoServer {
    private static final String DB_URL = "jdbc:sqlite:backend/todo.db";
    private static final Gson gson = new Gson();

    public static void main(String[] args) throws IOException {
        initDatabase();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/profiles", new ProfilesHandler());
        server.createContext("/tasks", new TasksHandler());
        server.createContext("/templates", new TemplatesHandler());
        server.setExecutor(null);
        System.out.println("Servidor iniciado en http://localhost:8080");
        server.start();
    }

    private static void initDatabase() {
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement()) {

            stmt.execute("PRAGMA foreign_keys = ON;");

            stmt.execute("CREATE TABLE IF NOT EXISTS profiles (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "name TEXT NOT NULL," +
                    "icon TEXT" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS tasks (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "profileId INTEGER," +
                    "parentId INTEGER," +
                    "title TEXT NOT NULL," +
                    "subject TEXT," +
                    "description TEXT," +
                    "priority TEXT," +
                    "status TEXT DEFAULT 'pending'," +
                    "dueDate TEXT," +
                    "reminder TEXT," +
                    "notes TEXT," +
                    "FOREIGN KEY(profileId) REFERENCES profiles(id) ON DELETE CASCADE," +
                    "FOREIGN KEY(parentId) REFERENCES tasks(id) ON DELETE CASCADE" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS templates (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "name TEXT NOT NULL UNIQUE" +
                    ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS template_items (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "templateId INTEGER," +
                    "title TEXT NOT NULL," +
                    "subject TEXT," +
                    "priority TEXT," +
                    "FOREIGN KEY(templateId) REFERENCES templates(id) ON DELETE CASCADE" +
                    ")");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // --- Handlers ---
    static abstract class CorsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            doHandle(exchange);
        }
        protected abstract void doHandle(HttpExchange exchange) throws IOException;
        protected String getRequestBody(HttpExchange exchange) throws IOException {
            try (InputStream is = exchange.getRequestBody()) { return new String(is.readAllBytes(), StandardCharsets.UTF_8); }
        }
        protected void sendResponse(HttpExchange exchange, int code, String body) throws IOException {
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(code, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) { os.write(bytes); }
        }
    }

    static class ProfilesHandler extends CorsHandler {
        @Override
        public void doHandle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String response = "";
            int statusCode = 200;

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    response = gson.toJson(getAllProfiles());
                } else if ("POST".equalsIgnoreCase(method)) {
                    Profile p = gson.fromJson(getRequestBody(exchange), Profile.class);
                    addProfile(p);
                    response = "{\"status\":\"success\"}";
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String path = exchange.getRequestURI().getPath();
                    int id = Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
                    deleteProfile(id);
                    response = "{\"status\":\"success\"}";
                }
            } catch (Exception e) {
                e.printStackTrace();
                statusCode = 500;
                response = "{\"error\":\"" + e.getMessage() + "\"}";
            }
            sendResponse(exchange, statusCode, response);
        }

        private List<Profile> getAllProfiles() throws SQLException {
            List<Profile> profiles = new ArrayList<>();
            String sql = "SELECT * FROM profiles";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                while (rs.next()) {
                    profiles.add(new Profile(rs.getInt("id"), rs.getString("name"), rs.getString("icon")));
                }
            }
            return profiles;
        }

        private void addProfile(Profile p) throws SQLException {
            String sql = "INSERT INTO profiles(name, icon) VALUES(?,?)";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, p.name);
                pstmt.setString(2, p.icon);
                pstmt.executeUpdate();
            }
        }

        private void deleteProfile(int id) throws SQLException {
            try (Connection conn = DriverManager.getConnection(DB_URL)) {
                conn.setAutoCommit(false);
                try {
                    try (PreparedStatement pstmt = conn.prepareStatement("DELETE FROM tasks WHERE profileId = ?")) {
                        pstmt.setInt(1, id);
                        pstmt.executeUpdate();
                    }
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

    static class TasksHandler extends CorsHandler {
        @Override
        public void doHandle(HttpExchange exchange) throws IOException {
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
                    statusCode = 201;
                } else if ("PUT".equalsIgnoreCase(method)) {
                    Task taskToUpdate = gson.fromJson(getRequestBody(exchange), Task.class);
                    updateTask(taskToUpdate);
                    response = "{\"status\":\"success\"}";
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String path = exchange.getRequestURI().getPath();
                    int id = Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
                    deleteTask(id);
                    response = "{\"status\":\"success\"}";
                }
            } catch (Exception e) {
                e.printStackTrace();
                statusCode = 500;
                response = "{\"error\":\"" + e.getMessage() + "\"}";
            }
            sendResponse(exchange, statusCode, response);
        }

        private List<Task> getAllTasks(Integer profileId) throws SQLException {
            List<Task> tasks = new ArrayList<>();
            String sql = profileId == null ? "SELECT * FROM tasks" : "SELECT * FROM tasks WHERE profileId = ?";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                if (profileId != null) pstmt.setInt(1, profileId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        tasks.add(new Task(
                                rs.getInt("id"),
                                rs.getObject("profileId") != null ? rs.getInt("profileId") : null,
                                rs.getObject("parentId") != null ? rs.getInt("parentId") : null,
                                rs.getString("title"),
                                rs.getString("subject"),
                                rs.getString("description"),
                                rs.getString("priority"),
                                rs.getString("status"),
                                rs.getString("dueDate"),
                                rs.getString("reminder"),
                                rs.getString("notes")
                        ));
                    }
                }
            }
            return tasks;
        }

        private void addTask(Task task) throws SQLException {
            String sql = "INSERT INTO tasks(profileId, parentId, title, subject, description, priority, status, dueDate, reminder, notes) VALUES(?,?,?,?,?,?,?,?,?,?)";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setObject(1, task.profileId);
                pstmt.setObject(2, task.parentId);
                pstmt.setString(3, task.title);
                pstmt.setString(4, task.subject);
                pstmt.setString(5, task.description);
                pstmt.setString(6, task.priority);
                pstmt.setString(7, task.status != null ? task.status : "pending");
                pstmt.setString(8, task.dueDate);
                pstmt.setString(9, task.reminder);
                pstmt.setString(10, task.notes);
                pstmt.executeUpdate();
            }
        }

        private void updateTask(Task task) throws SQLException {
            String sql = "UPDATE tasks SET profileId=?, parentId=?, title=?, subject=?, description=?, priority=?, status=?, dueDate=?, reminder=?, notes=? WHERE id=?";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setObject(1, task.profileId);
                pstmt.setObject(2, task.parentId);
                pstmt.setString(3, task.title);
                pstmt.setString(4, task.subject);
                pstmt.setString(5, task.description);
                pstmt.setString(6, task.priority);
                pstmt.setString(7, task.status);
                pstmt.setString(8, task.dueDate);
                pstmt.setString(9, task.reminder);
                pstmt.setString(10, task.notes);
                pstmt.setInt(11, task.id);
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

    static class TemplatesHandler extends CorsHandler {
        @Override
        public void doHandle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            String response = "";
            int statusCode = 200;

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    response = gson.toJson(getAllTemplates());
                } else if ("POST".equalsIgnoreCase(method)) {
                    if (path.endsWith("/apply")) {
                        Map body = gson.fromJson(getRequestBody(exchange), Map.class);
                        int templateId = Double.valueOf(body.get("templateId").toString()).intValue();
                        int profileId = Double.valueOf(body.get("profileId").toString()).intValue();
                        applyTemplate(templateId, profileId);
                        response = "{\"status\":\"success\"}";
                    } else {
                        Template newTemplate = gson.fromJson(getRequestBody(exchange), Template.class);
                        Template createdTemplate = createTemplate(newTemplate);
                        response = gson.toJson(createdTemplate);
                        statusCode = 201;
                    }
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    int id = Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
                    deleteTemplate(id);
                    response = "{\"status\":\"success\"}";
                } else {
                    statusCode = 404;
                    response = "{\"error\":\"Endpoint not found\"}";
                }
            } catch (Exception e) {
                e.printStackTrace();
                statusCode = 500;
                response = "{\"error\":\"" + e.getMessage() + "\"}";
            }
            sendResponse(exchange, statusCode, response);
        }

        private void deleteTemplate(int id) throws SQLException {
            try (Connection conn = DriverManager.getConnection(DB_URL)) {
                conn.setAutoCommit(false);
                try {
                    try (PreparedStatement pstmt = conn.prepareStatement("DELETE FROM template_items WHERE templateId = ?")) {
                        pstmt.setInt(1, id);
                        pstmt.executeUpdate();
                    }
                    try (PreparedStatement pstmt = conn.prepareStatement("DELETE FROM templates WHERE id = ?")) {
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

        private List<Template> getAllTemplates() throws SQLException {
            List<Template> templates = new ArrayList<>();
            String sql = "SELECT * FROM templates";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                while (rs.next()) {
                    int templateId = rs.getInt("id");
                    Template t = new Template(templateId, rs.getString("name"));
                    t.items = getTemplateItems(templateId);
                    templates.add(t);
                }
            }
            return templates;
        }

        private List<TemplateItem> getTemplateItems(int templateId) throws SQLException {
            List<TemplateItem> items = new ArrayList<>();
            String sql = "SELECT * FROM template_items WHERE templateId = ?";
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setInt(1, templateId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        items.add(new TemplateItem(rs.getInt("id"), templateId, rs.getString("title"), rs.getString("subject"), rs.getString("priority")));
                    }
                }
            }
            return items;
        }

        private Template createTemplate(Template template) throws SQLException {
            String sql = "INSERT INTO templates(name) VALUES(?)";
            try (Connection conn = DriverManager.getConnection(DB_URL)) {
                conn.setAutoCommit(false);
                try (PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                    pstmt.setString(1, template.name);
                    pstmt.executeUpdate();
                    try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            template.id = generatedKeys.getInt(1);
                        } else {
                            throw new SQLException("Creating template failed.");
                        }
                    }
                }

                String itemSql = "INSERT INTO template_items(templateId, title, subject, priority) VALUES(?,?,?,?)";
                for (TemplateItem item : template.items) {
                    try (PreparedStatement pstmt = conn.prepareStatement(itemSql)) {
                        pstmt.setInt(1, template.id);
                        pstmt.setString(2, item.title);
                        pstmt.setString(3, item.subject);
                        pstmt.setString(4, item.priority);
                        pstmt.executeUpdate();
                    }
                }
                conn.commit();
                return template;
            } catch (SQLException e) {
                // conn.rollback(); // Handled by try-with-resources
                throw e;
            }
        }

        private void applyTemplate(int templateId, int profileId) throws SQLException {
            List<TemplateItem> items = getTemplateItems(templateId);
            String sql = "INSERT INTO tasks(profileId, title, subject, priority, status, dueDate) VALUES(?,?,?,?,?,?)";
            try (Connection conn = DriverManager.getConnection(DB_URL)) {
                conn.setAutoCommit(false);
                for (TemplateItem item : items) {
                    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                        pstmt.setInt(1, profileId);
                        pstmt.setString(2, item.title);
                        pstmt.setString(3, item.subject);
                        pstmt.setString(4, item.priority);
                        pstmt.setString(5, "pending");
                        pstmt.setString(6, new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
                        pstmt.executeUpdate();
                    }
                }
                conn.commit();
            }
        }
    }

    // --- Data Classes ---
    static class Task {
        int id;
        Integer profileId, parentId;
        String title, subject, description, priority, status, dueDate, reminder, notes;
        public Task(int id, Integer pId, Integer parentId, String t, String s, String d, String pri, String st, String due, String rem, String n) {
            this.id = id; this.profileId = pId; this.parentId = parentId; this.title = t; this.subject = s; this.description = d;
            this.priority = pri; this.status = st; this.dueDate = due; this.reminder = rem; this.notes = n;
        }
    }

    static class Profile {
        int id;
        String name, icon;
        public Profile(int id, String name, String icon) {
            this.id = id; this.name = name; this.icon = icon;
        }
    }

    static class Template {
        int id;
        String name;
        List<TemplateItem> items;
        public Template(int id, String name) { this.id = id; this.name = name; }
    }

    static class TemplateItem {
        int id, templateId;
        String title, subject, priority;
        public TemplateItem(int id, int tId, String t, String s, String p) {
            this.id = id; this.templateId = tId; this.title = t; this.subject = s; this.priority = p;
        }
    }
}