
import javax.servlet.http.*;
import javax.servlet.*;
import java.sql.*;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class updateTableRow extends HttpServlet {
    PrintWriter pw = null;

    public void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        pw = res.getWriter();
       // String db = req.getParameter("dbname");
       String db = "postgres";
        String table = req.getParameter("tableName");
        String inputQuery = req.getParameter("query");
        String newQuery = req.getParameter("newquery");
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
            // insert into ron values ('raja','24','dev','mrng','tenkasi');
            // update ron set name ='mani' where name ='raja';
            //update test1 set name = 'pooja1',role='analyst' where name = 'sakthi' 


            String query = "update " + table + " set " + inputQuery+" where "+newQuery;
          //  pw.println(query);
            Statement statement = null;
            statement = conn.createStatement();
            statement.executeUpdate(query);
            pw.println("Table Updated sucessfully");
        } catch (SQLException e1) {
            pw.println("Invalid Query");
        } catch (Exception e) {
            pw.println(e.getMessage());
        }

    }
}
