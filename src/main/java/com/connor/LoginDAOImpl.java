package com.connor;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginDAOImpl implements LoginDAO {

	static Connection conn;
	static PreparedStatement ps;

	@Override
	public int insertLogin(Login c) {
		System.out.println("\nIn insertLogin method in LoginDAOImpl");

		int status = 0;

		try {
			conn = MyConnectionProvider.getConn();
			ps = conn.prepareStatement("insert into logindb values(?,?)");
			ps.setString(1, c.getUsername());
			ps.setString(2, c.getPassword());
			status = ps.executeUpdate();
			conn.close();
		} catch (Exception e) {
			System.out.println(e);
		}
		System.out.println("Status: "+status);
		return status;
	}
	
	public boolean isLogin(String user) {
		try {
			System.out.println("\nIn isLogin method in LoginDAOImpl");
			conn = MyConnectionProvider.getConn();
			ps = conn.prepareStatement("SELECT count(*) FROM logindb WHERE username = \'"+user+"\'");
			ResultSet rs = ps.executeQuery();
			rs.next();
			if(rs.getString(1).equals("0")) {
				return true;
			}
			
		
			conn.close();
		} catch (Exception e) {
			System.out.println("isLogin bad: "+e);
		}

		return false;
	}
	

	@Override
	public Login getLogin(String userid, String pass) {
		System.out.println("\nIn getLogin method in LoginDAOImpl");

		Login c = new Login();

		try {

			conn = MyConnectionProvider.getConn();
			ps = conn.prepareStatement("select * from logindb where username=? and password=?");

			ps.setString(1, userid);
			ps.setString(2, pass);

			ResultSet rs = ps.executeQuery();
			//while (rs.next()) {
			rs.next();
			c.setUsername(rs.getString(1));
			c.setPassword(rs.getString(2));

			//}
			conn.close();

		} catch (Exception e) {
			System.out.println(e);
		}

		return c;
	}
	public void inSession(HttpServletRequest request, HttpServletResponse response, String redir) throws ServletException, IOException {
		System.out.println("\nIn inSession method in LoginDAOImpl");
		HttpSession session = request.getSession();
		String user = (String)session.getAttribute("username");
		
		if (session.getAttribute("usernames")!=null || isLogin(user)==false ) {
		    response.sendRedirect(redir);
		}
	}
	
}

