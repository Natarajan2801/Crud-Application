import javax.servlet.http.*;
import javax.servlet.*;
import java.sql.*;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class insertTableRow extends HttpServlet {
    PrintWriter pw = null;

    public void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        pw = res.getWriter();
     //   String db = req.getParameter("dbname");
     String db ="postgres";
        String table = req.getParameter("tableName");
        String inputQuery = req.getParameter("query");
        String URL = "jdbc:postgresql://localhost:5432/" + db;
        Connection conn = null;
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e1) {
            e1.printStackTrace();
        }
        try {
            while (conn == null)
                conn = DriverManager.getConnection(URL, "postgres", "postgres");
      
          //  insert into fi values ('raja','24','dev','mrng','tenkasi');
      

            String query = "insert into " + table + " values (" + inputQuery + ");";
            pw.println(query);
            Statement statement = null;
            statement = conn.createStatement();
            statement.executeUpdate(query);
            pw.println("Table inserted sucessfully");
        } catch (SQLException e1) {
            pw.println("Invalid Query" + e1.getMessage());
        } catch (Exception e) {
            pw.println(e.getMessage());
        }

    }
}
