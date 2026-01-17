<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<link rel="stylesheet" href="MyStyle.css">
<title>Register</title>
</head>
<body bgcolor="white">

		<h1 align="center">
		<img src="assets/Drawing.png" alt="Title" width="750" height="400">
	</h1>

	<form action="loginRegister" method="post">
		<table style="margin-left: auto; margin-right: auto; margin-top: -150px;">

			<tr>
				<td><h1>Username</h1></td>
			</tr>
			<tr>
				<td><input type="text" name="username" id="ip1"></td>
			</tr>
			<tr>
				<td><h1>${userReq1}</h1></td>
			</tr>
			<tr>
				<td><h1>Password</h1></td>
			</tr>
			<tr>
				<td><input type="password" name="password1" id="ip1"></td>
			</tr>
			<tr>
				<td><h1>${passwordReq}</h1></td>
			</tr>
			<tr>
				<td><h1>Re-Type Password</h1></td>
			</tr>
			<tr>
				<td><input type="password" name="password2" id="ip1"></td>
			</tr>
			<tr>
				<td><h1>${retypeProb}</h1></td>
			</tr>
			<tr>

				<td><input type="submit" name="submit" value="Register"
					id="ip2"></td>
				<td><input type="submit" name="submit" value="Back" id="ip2"></td>
			</tr>
		</table>
	</form>

</body>
</html>