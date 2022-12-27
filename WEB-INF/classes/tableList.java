import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet; // extended class 
import javax.servlet.http.HttpServletRequest; // doget and dopost method parameter
import javax.servlet.http.HttpServletResponse;

public class tableList extends HttpServlet {
    // public final String DBURL = "jdbc:postgresql://localhost:5432/postgres";
    public final String user = "postgres";
    public final String pass = "postgres";
    Connection con = null;
    public PrintWriter out = null;


    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
        out = res.getWriter();
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            out.println(e.getMessage());
        }
        try {
            // String a = req.getParameter("db");
            // out.println(a);

            // allConnect obj=new allConnect();
            // String a=obj.prinnt();
            //    out.println(a);

            String dbName = req.getParameter("db");


          

            String DBURL = "jdbc:postgresql://localhost:5432/" + dbName;
            while (con == null) {
                con = DriverManager.getConnection(DBURL, user, pass);
            }
            ArrayList<String> list = new ArrayList<>();
            list = tableList(con);
            for (int i = 0; i < list.size(); i++) {
                out.println(list.get(i));
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            out.println(e);
        }
    }

    public ArrayList<String> tableList(Connection conn) throws SQLException {
        ArrayList<String> db = new ArrayList<>();
        Statement stmt = null;
        ResultSet rs = null;
        try {
            stmt = conn.createStatement();
            String query = "select table_name from information_schema.tables where table_schema ='public' order by table_name;";
            rs = stmt.executeQuery(query);
            while (rs.next()) {
                String databaseName = rs.getString(1);
                db.add(databaseName);
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (stmt != null) {
                stmt.close();
            }
            if (rs != null) {
                rs.close();
            }
        }
        return db;
    }

}
