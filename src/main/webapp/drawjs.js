const canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = "white";
context.fillRect(0,0,canvas.width,canvas.height);

let draw_color = "black";
let draw_width = "10";
let is_drawing = false;

let restore_array = [];
let index = -1;


function change_color(element){
	draw_color = element.style.background;
}


canvas.addEventListener("touchstart", start, true);
canvas.addEventListener("touchmove", draw, true);
canvas.addEventListener("mousedown", start, true);
canvas.addEventListener("mousemove", draw, true);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function start(event){
console.log("start")
console.log(draw_color,draw_width,is_drawing)
	is_drawing = true;
	context.beginPath();
	context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
	event.preventDefault();
}

function draw(event){
console.log("draw")
console.log(draw_color,draw_width,is_drawing)
	if (is_drawing){
		context.lineTo(event.clientX - canvas.offsetLeft,
					   event.clientY - canvas.offsetTop);
		context.strokeStyle = draw_color;
		context.lineWidth = draw_width;
		context.lineCap = "round";
		context.lineJoin = "round";
		context.stroke();	
	}
	event.preventDefault();
}

function stop(event){
console.log("stop")
	if (is_drawing){
		context.stroke();
		context.closePath();
		is_drawing = false;
	}
	event.preventDefault();
	if(event.type != "mouseout"){
		restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
		index+=1;
	}
}

function clear_canvas(){
console.log("clear")
	context.fillStyle = start_background_color;
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillRect(0,0,canvas.width,canvas.height);
	
	restore_array = [];
	index = -1;
}

function undo_last(){
console.log("undo")
console.log(index)
console.log(restore_array)
	if(index <=0){
		clear_canvas();
	} else{
		index -=1;
		restore_array.pop();
		context.putImageData(restore_array[index],0,0,0,0,canvas.width,canvas.height);
		//might need to move up 2	
	}

}
function down(){
  console.log("Here");
  var link = document.createElement('a');
  link.download = 'download.png';
  link.href = document.getElementById('canvas').toDataURL();
  console.log(document.getElementById('canvas').toDataURL());
  link.click();
}

function leave(){
	window.location.replace("http://localhost:8080/Drawdle/dashboard.jsp");
}

