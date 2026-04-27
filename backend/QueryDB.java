import java.sql.*;
public class QueryDB {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:sqlite:backend/todo.db");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM tasks");
        while(rs.next()) {
            System.out.println("ID: " + rs.getInt("id") + ", Title: " + rs.getString("title") + ", Parent: " + rs.getObject("parentId"));
        }
    }
}
