
<!DOCTYPE html>
<%@ page import="java.io.*,java.util.*"%>
<%@ page import="com.connor.*"%>
<%@page import="java.sql.DriverManager"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.Connection"%>
<%@page import="java.sql.PreparedStatement"%>
<%@page import="com.connor.MyConnectionProvider"%>
<%@page import="com.connor.MyProvider"%>
<%@page import="java.sql.Blob"%>
<%
//session.invalidate();

Cookie cook;
Cookie[] cooks;
cooks = request.getCookies();
String username = "";
for (Cookie c : cooks) {
	if (c.getName().equals("username")) {
		cook = c;
		username = cook.getValue();
		break;
	}
}
LoginDAOImpl dataCheck = new LoginDAOImpl();
String redirectURL = "/Drawdle/login.jsp";
dataCheck.inSession(request, response, redirectURL);
%>
<html>
<head>
<title>Dashboard</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
		<div class="container">
			<div class="heading">
				<h3>
					Hello,
					<%=username%></h3>

			</div>
			<div class="subheading">
				<a href="http://localhost:8080/Drawdle/drawing2.jsp"> <img
					src="assets/paintbrush.png" name="Draw">
				</a> <a
					href="http://localhost:8080/Drawdle/login.jsp"><img
					src="assets/betterlogout.jpeg" name="Logout"></a>
			</div>
		</div>
					<%
					int status = 0;
					Connection conn;
					PreparedStatement ps;
					try {
						conn = MyConnectionProvider.getConn();
						
						ps = conn.prepareStatement("SELECT * FROM imageSave WHERE username = '"+username+"'");
						ResultSet rs = ps.executeQuery();
						while (rs.next()) {

							Blob temp = rs.getBlob("image");
							byte byteArray[] = temp.getBytes(1, (int) temp.length());
							String imag = new String(byteArray);

							
								
					%>

						<a href="http://localhost:8080/Drawdle/drawing2.jsp"><img
							src="data:image/png;base64,<%=imag%>" id="drawings" name="drawings"></img></a>
					<%
					
					}

					conn.close();
					} catch (Exception e) {

					System.out.println(e);
					}
					System.out.println(status);
					%>


		
</body>
</html>