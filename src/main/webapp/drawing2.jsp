<!doctype html>
<%@ page import="java.io.*,java.util.*"%>
<%@ page import="com.connor.*"%>

<%
Cookie cook = null;
Cookie[] cooks = null;
cooks = request.getCookies();
String username = "";
for (Cookie c : cooks) {
	if (c.getName().equals("username")) {
		cook = c;
		username = cook.getValue();
		break;
	}
}
out.print(username);
LoginDAOImpl dataCheck = new LoginDAOImpl();
String redirectURL = "/Drawdle/login.jsp";
dataCheck.inSession(request, response, redirectURL);
%>

<html>

<head>
<title>Drawing Time</title>
<script src="https://code.jquery.com/jquery-1.10.2.js"
	type="text/javascript"></script>
<meta charset="UTF-8">
<link rel="stylesheet" href="drawingstyle.css">
<script>
	function save() {
		var popup = document.getElementById("myPopup");
		popup.classList.toggle("show");
		console.log("In save() on drawing2.jsp");
		let xhr = new XMLHttpRequest();
		var c = document.getElementById("canvas");

		const canvasHold = document.getElementById("canvas").toDataURL();
		let json = JSON.stringify({
			name : String(canvasHold)
		});

		xhr.open("POST", '/Drawdle/SaveImage')
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

		xhr.send(json);

	}

</script>
</head>
<body>
	<h1 align="center">
		<img src="assets/Drawing.png" alt="Title" width="250" height="134">

	</h1>
	<div class="field">
		<canvas id="canvas" name="canvas"></canvas>
		<div class="tools">
			<button onClick="undo_last()" type="button" class="button">Undo</button>
			<button onClick="clear_canvas()" type="button" class="button">Clear</button>
			<button onClick="down()" type="button" class="button">Download</button>
			<button onClick="save()" type="button" class="popup">
				Save<span class="popuptext" id="myPopup">Saved!</span>
			</button>
		

			<div onClick="change_color(this)" class="color-field"
				style="background: black;"></div>
			<div onClick="change_color(this)" class="color-field"
				style="background: red;"></div>
			<div onClick="change_color(this)" class="color-field"
				style="background: orange;"></div>
			<div onClick="change_color(this)" class="color-field"
				style="background: yellow;"></div>
			<div onClick="change_color(this)" class="color-field"
				style="background: green;"></div>
			<div onClick="change_color(this)" class="color-field"
				style="background: blue;"></div>
			<div onClick="change_color(this)" class="color-field"
				style="background: purple;"></div>
			<input onInput="draw_color = this.value" type="color"
				class="color-picker"> <input type="range" min="1" max="100"
				class="pen-range" onInput="draw_width = this.value">

			<button onClick="leave()" type="button" class="button">Leave</button>
		</div>
	</div>
</body>
<script src="https://code.jquery.com/jquery-1.10.2.js"
	type="text/javascript"></script>
<script src="drawjs.js"></script>

</html>