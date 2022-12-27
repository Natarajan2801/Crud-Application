import javax.servlet.http.*;
import javax.servlet.*;
import java.sql.*;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class CrudOperation extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        PrintWriter pw = res.getWriter();
        String q = req.getParameter("query");
        String query = "select * from " + q;
        // String db = req.getParameter("db");
        String db = "postgres"; // postgres
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
            try {
                // query = query.trim();
                String select = query.substring(0, 6);
                select = select.toLowerCase();
                String[] crud = query.split(" ");
                Statement statement = null;
                if (select.startsWith("select")) { // select
                    statement = conn.createStatement();
                    ResultSet resultSet = statement.executeQuery(query);
                    ResultSetMetaData rsmd = resultSet.getMetaData();
                    int columnsNumber = rsmd.getColumnCount();
                    System.out.println(columnsNumber);
                    String header[] = new String[columnsNumber + 1];
                    for (int i = 1; i <= columnsNumber; i++) {
                        header[i] = rsmd.getColumnName(i);
                        System.out.print(header[i]);
                        pw.print(header[i]);
                        if (i != columnsNumber) {
                            pw.print(",");
                        }
                    }
                    pw.println("");
                    while (resultSet.next()) {
                        for (int i = 1; i <= columnsNumber; i++) {
                            pw.print(resultSet.getString(i));
                            if (i != columnsNumber) {
                                pw.print(",");
                            }
                        }
                        pw.println("");
                    }
                    res.setStatus(200);
                } else {
                    statement = conn.createStatement();
                    statement.executeUpdate(query);
                    pw.println("Query affected successfully");

                }
            } catch (SQLException e) {
                // PrintWriter out = res.getWriter();
                pw.print("Enter the valid query....");
                System.out.println(e);
                System.out.println("Enter the valid query");
            }
        } catch (SQLException e) {
            PrintWriter out = res.getWriter();
            out.print(e);
            // System.out.println(e);
        }
    }
}
