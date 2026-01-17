package com.connor;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.time.LocalDateTime;  
import java.time.format.DateTimeFormatter;  
/*
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
*/

@WebServlet("/SaveImage")
public class SaveImage extends HttpServlet{
	Connection conn;
	PreparedStatement ps;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("\nIn saveImage");
	
		

		Cookie cook;
		Cookie[] cooks;
		
		cooks = request.getCookies();
		System.out.println(cooks);
		String username = "";
		for (Cookie c : cooks) {
			if (c.getName().equals("username")) {
				cook = c;
				username = cook.getValue();
				break;
			}
		}
		System.out.println("THIS IS THE USERNAME: "+username);
		System.out.println("In Save Servlet\n");
		
		 String data = "";   
		    StringBuilder builder = new StringBuilder();
		    BufferedReader reader = request.getReader();
		    String line;
		    while ((line = reader.readLine()) != null) {
		        builder.append(line);
		    }
		    data = builder.toString();
		    System.out.println("final result "+ data);
		  //  DOMXMLObject object = new DOMXMLObject(data); 
		
		 //if(userName == null || "".equals(userName)){ userName = "Guest"; }
		int start = data.indexOf(",");
		int end = data.indexOf("}");
		String hold = data.substring(start+1, end-1);
		System.out.println(hold);
		LocalDateTime myDateObj = LocalDateTime.now();
	    DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

	    String formattedDate = myDateObj.format(myFormatObj);
		int status = 0;

		try {

			conn = MyConnectionProvider.getConn();
			ps = conn.prepareStatement("insert into imageSave (username,image,createTime,updateTime) values(?,?,?,?)");
			ps.setString(1, username);
			ps.setString(2, hold);
			ps.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
			ps.setTimestamp(4, new Timestamp(System.currentTimeMillis()));
			status = ps.executeUpdate();
			conn.close();
		} catch (Exception e) {

			System.out.println("9");
			System.out.println(e);
		}
		System.out.println(status);
		response.sendRedirect("/Test2/TestTheSequel.jsp");
		
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		System.out.println("I am here here");
		String userName = request.getParameter("itemId").trim();
		if(userName == null || "".equals(userName)){
			userName = "Guest";
		}
		
		String greetings = "Hello " + userName;
		
		System.out.println("my itemid is  sljflskdjfl    "+greetings);
		response.sendRedirect("/Test2/TestTheSequel.jsp");
	}
}
