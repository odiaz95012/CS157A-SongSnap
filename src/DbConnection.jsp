<%@ page import="java.io.FileInputStream,java.io.IOException,java.util.Properties" %>
<%@ page import="java.sql.Connection,java.sql.DriverManager,java.sql.SQLException" %>
<%@ page import="java.nio.file.Path" %>

<%
    Properties prop = new Properties();
    FileInputStream input = null;
    Connection conn = null;

    try {
        String path = getServletContext().getRealPath("/SongSnap") + "/db.properties";

        input = new FileInputStream(path);

        prop.load(input);

        String url = prop.getProperty("db.url");
        String username = prop.getProperty("db.username");
        String password = prop.getProperty("db.password");

        Class.forName("com.mysql.jdbc.Driver");
        conn = DriverManager.getConnection(url, username, password);
        out.println("<h1>SongSnapDB connection successful!</h1>");

        // Now you can use 'conn' for database operations
    } catch (IOException | ClassNotFoundException | SQLException e) {
        e.printStackTrace();
        out.println("<p>Error: " + e.getMessage() + "</p>");

        // Handle exceptions
    } finally {
        if (input != null) {
            try {
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
%>
