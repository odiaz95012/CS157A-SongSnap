<%@ page import="java.io.FileInputStream,java.io.IOException,java.sql.Connection" %>
<%@ page import="java.sql.DriverManager,java.sql.SQLException,java.util.Properties" %>
<%@ page import="java.sql.Statement, java.sql.ResultSet" %>

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

        out.println("Initial entry in table \"User\": <br/>");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM User");
        while (rs.next()) {
            out.println("<p>" + "Id: " + rs.getInt(1) + "</br>Name: " + rs.getString(2) + "</br>Email: " + rs.getString(3) + "</br>Username: "
                    + rs.getString(4) + "</br>Password: " + rs.getString(5) + "</p><br/>");
        }
        rs.close();
        stmt.close();
        conn.close();

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
