<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<%@ page import = "java.io.*,java.util.*" %>
<%
//session.invalidate();
if (session.getAttribute("usernames")!=null ) {
	String redirectURL = "/Drawdle/drawingscreen.jsp";
    response.sendRedirect(redirectURL);
}


%>
<html>
<head>
<meta charset="ISO-8859-1">
<link rel="stylesheet" href="MyStyle.css">
<title>Login</title>

</head>
<body bgcolor="white" class="my">

	<h1 align="center">
		<img src="assets/Drawing.png" alt="Title" width="750" height="400">
	</h1>

	<form action="loginRegister" method="post">
		<table
			style="margin-left: auto; margin-right: auto; margin-top: -150px;">

			<tr>
				<td><h1>Username</h1></td>
			</tr>
			<tr>
				<td><input type="text" name="username" id="ip1"></td>
			</tr>
			<tr>
				<td><h1>${userReq}</h1></td>
			</tr>
			<tr>
				<td><h1>Password</h1></td>
			</tr>
			<tr>
				<td><input type="password" name="password1" id="ip1"></td>
			</tr>
			<tr>
				<td><h1>${totalerror}</h1></td>
			</tr>
			<tr>
				<td><input type="submit" name="submit" value="Login" id="ip2"></td>
				<td><input type="submit" name="submit" value="Register Here"
					id="ip2"></td>
			</tr>
		</table>
	</form>

</body>
</html>