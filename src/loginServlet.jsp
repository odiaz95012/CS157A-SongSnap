<%@ page import="java.io.FileInputStream,java.io.IOException" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.sql.*" %>

<%
    String username = request.getParameter("username");
    String password = request.getParameter("password");

    // Perform database operations or any other desired actions
    Connection connection = null;
    PreparedStatement statement = null;
    ResultSet resultSet = null;
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

        String sql = "SELECT * FROM Users WHERE username = ? AND password = ?";
        statement = connection.prepareStatement(sql);
        statement.setString(1, username);
        statement.setString(2, password);
        resultSet = statement.executeQuery();

        if (resultSet.next()) {
            // Successful login
            response.sendRedirect("home.jsp");
        } else {
            // Invalid credentials
            out.println("<p>Invalid username or password</p>");
        }
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
        if (resultSet != null) {
            resultSet.close();
        }
        if (statement != null) {
            statement.close();
        }
        if (connection != null) {
            connection.close();
        }
    }
%>
