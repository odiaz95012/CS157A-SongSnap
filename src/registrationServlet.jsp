<%@ page import="java.io.FileInputStream,java.io.IOException" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.sql.*" %>


<%
    String name = request.getParameter("name");
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    String email = request.getParameter("email");

    // Perform database operations or any other desired actions
    Connection connection = null;
    PreparedStatement statement = null;
    Properties prop = new Properties();
    FileInputStream input = null;

    try {


        String path = getServletContext().getRealPath("/") + "/db.properties";

        input = new FileInputStream(path);

        prop.load(input);

        String url = prop.getProperty("db.url");
        String dbUsername = prop.getProperty("db.username");
        String dbPassword = prop.getProperty("db.password");


        Class.forName("com.mysql.jdbc.Driver");
        connection = DriverManager.getConnection(url, dbUsername, dbPassword);


        Statement stmt = connection.createStatement();
        String sql = "INSERT INTO Users (name, username, password, email) VALUES (?, ?, ?, ?)";
        statement = connection.prepareStatement(sql);
        statement.setString(1, name);
        statement.setString(2, username);
        statement.setString(3, password);
        statement.setString(4, email);
        statement.executeUpdate();
        stmt.close();
        connection.close();

        // Redirect to login.jsp
        response.sendRedirect("login.jsp");
    } catch (IOException | ClassNotFoundException | SQLException e) {
        e.printStackTrace();
        out.println("<p>Error: " + e.getMessage() + "</p>");
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
%>


