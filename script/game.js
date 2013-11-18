var delta;
var score = 0;
var life = 2;
var direction = "right";
var pos_y = 0;
var pos_x = 0;
var pause = false;
function init()
{	
	var pole=document.getElementById("pole");
	//var ctx=pole.getContext("2d");
	pole.width=window.innerWidth;
	pole.height=window.innerHeight;
	var pole_width = 80;
	var pole_height = 60;
	
	document.getElementById("right").onmousedown = turn_right;
	document.getElementById("left").onmousedown = turn_left;
	document.getElementById("up").onmousedown = turn_up;
	document.getElementById("down").onmousedown = turn_down;
	
	pole.onmousedown = turnit;
	
	var x = Math.min(pole.width/pole_width,pole.height/pole_height);
	//x = x-x*20%1/20;
	pole.width = pole_width*x;
	pole.height = pole_height*x;
	
	document.getElementById("controllers").style.marginLeft = pole.width+"px";
	
	var a = Math.min((window.innerWidth-pole.width)/3,window.innerHeight/6);
	
	document.getElementById("controllers").style.width = (window.innerWidth-pole.width-2) +"px";
	
	//document.getElementById("controllers").style.width = 3*a+"px";
	document.getElementById('arrows').style.marginTop = a/2+"px";
	document.getElementById('arrows').style.marginBottom = a/2+"px";
	document.getElementById('arrows').style.width = 3*a+"px";
	
	
	document.getElementById('up').style.width = a +"px";
	document.getElementById('up').style.height = a +"px";
	document.getElementById('up').style.marginLeft = a +"px";
	document.getElementById('down').style.width = a +"px";
	document.getElementById('down').style.height = a +"px";
	document.getElementById('down').style.marginLeft = a +"px";
	
	document.getElementById('to_side').style.height = a + "px";
	document.getElementById('to_side').style.width = 3*a + "px";
	
	document.getElementById('splitter').style.height = a + "px";
	document.getElementById('splitter').style.width = a + "px";
	
	document.getElementById('left').style.height = a + "px";
	document.getElementById('left').style.width = a + "px";
	document.getElementById('right').style.height = a + "px";
	document.getElementById('right').style.width = a + "px";
	
	document.getElementById('score').style.height = a + "px";
	document.getElementById('life').style.height = a + "px";
	
	var score_pol = document.getElementById("score").getContext("2d");
	score_pol.fillStyle = "#00F";
    score_pol.font = "24pt Arial";
    score_pol.fillText("Результат: 0", 10, 80);
    score_pol.stroke();
	
	show_lifes();
	
	delta = x;
	var snake = new Snake(pole_width, pole_height);
	var corn = new Corn(pole_width, pole_height);
	var bomb = new Bomb(pole_width, pole_height);
	var vx = 0;
	var vy = 0;
	var snake_draw;
	life = 2;
	var speed = 0;
	var timer = setInterval(function(){
		if(!pause)
		{
			pole.width = pole.width;
			if(direction=='up')
			{
				vy = 1;
				vx = 0;
			}
			else if(direction=='down')
			{
				vy = -1;
				vx = 0;
			}
			else if(direction=='left')
			{
				vx = -1;
				vy = 0;
			}
			else if(direction=='right')
			{
				vx = 1;
				vy = 0;
			}
			snake_draw = snake.draw();
			corn.draw();
			bomb.put();
			if(snake_draw==1)
			{
				life = -1;
				show_lifes();
				clearInterval(timer);
				pole.width=pole.width;
				show_result();
			}
			else if (snake_draw == 2)
			{
				console.log('укусил за жопу.');
				if(life < 1)
				{
					life = -1;
					clearInterval(timer);
					pole.width=pole.width;
					show_result();
				}
				else life--;
			}
			snake.pos_x += vx;
			snake.pos_y -= vy;
			snake.dir.unshift(direction);
			if((bomb.pos_x==snake.pos_x)&&(bomb.pos_y==snake.pos_y))
			{
				bomb.boom();
				snake.length-=2;
				if(life < 1)
				{
					life = -1;
					clearInterval(timer);
					pole.width=pole.width;
					show_result();
				}
				else
				{
					life--;
					if(score>0) score-=1;
					bomb.pos_x = Math.floor((Math.random()*pole_width));
					bomb.pos_y = Math.floor((Math.random()*pole_height));
				}
			}
			if((corn.pos_x === snake.pos_x) && (corn.pos_y === snake.pos_y))
			{
				snake.length++;
				score++;
				corn.pos_x = Math.floor((Math.random()*pole_width));
				corn.pos_y = Math.floor((Math.random()*pole_height));
			}
			show_score();
			show_lifes();
		}
		else
		{
			var ctx=pole.getContext("2d");
			pole.width = pole.width;
			ctx.fillStyle = "#00F";
    			ctx.font = "italic 30pt Arial";
			ctx.fillText("Пауза!", 20, 50);
			ctx.stroke();
		}
	},100);
}
function show_score()
{
	document.getElementById("score").width = document.getElementById("score").width;
	var score_pol = document.getElementById("score").getContext("2d");
	score_pol.fillStyle = "#00F";
    score_pol.font = "24pt Arial";
    score_pol.fillText("Очков:"+score, 10, 80);
    score_pol.stroke();
	
}
function show_lifes()
{
	document.getElementById("life").width = document.getElementById("life").width;
	var life_pol = document.getElementById("life").getContext("2d");
	life_pol.fillStyle = "#F00";
    life_pol.font = "24pt Arial";
    life_pol.fillText("Жизней:"+(life+1), 10, 80);
    life_pol.stroke();
}
function show_result()
{
	var pole=document.getElementById("pole");
	var ctx=pole.getContext("2d");
	pole.width = pole.width;
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic 30pt Arial";
    ctx.fillText("Потрачено!", 20, 50);
   	ctx.font = 'bold 30px sans-serif';
    ctx.strokeText("Достигнутый результат: "+score, 20, 100);
	ctx.stroke();
}
function turnit(evt)
{
	if(direction == "right" || direction == "left")
	{
		if(evt.y>pos_y)
		{
			direction = "down";
		}
		else if(evt.y<pos_y)
		{
			direction = "up";
		}
	}
	else if(direction == "up" || direction == "down")
	{
		if(evt.x<pos_x)
		{
			direction = "left";
		}
		else if(evt.x>pos_x)
		{
			direction = "right";
		}
	}
}
function turn_right()
{
	if(direction!="left") direction = "right";
}
function turn_left()
{
	if(direction!="right") direction = "left";
}
function turn_up()
{
	if(direction!="down") direction = "up";
}
function turn_down()
{
	if(direction!="up") direction = "down";
}
document.onkeydown = function checkKeycode(event)
{
	var keycode;
	if(!event) var event = window.event;
	if (event.keyCode) keycode = event.keyCode; 
	else if(event.which) keycode = event.which; // all browsers
	if((keycode==38 || keycode==87) && direction!="down")
		direction = "up"
	else if((keycode==40 || keycode==83) && direction!="up")
		direction = "down"
	else if((keycode==37 || keycode==65) && direction!="right")
		direction = "left"
	else if((keycode==39 || keycode==68) && direction!="left")
		direction = "right";
	else if(keycode==32) pause = !pause;
}
function Bomb(w,h)
{
	this.pos_x = Math.floor((Math.random()*w)-1);
	this.pos_y = Math.floor((Math.random()*h)-1);
	var pole=document.getElementById("pole");
	var effects = document.getElementById("effects");
	var effect=effects.getContext("2d");
	var ctx=pole.getContext("2d");
	effects.width = w*delta;
	effects.height = h*delta;
	this.put = function()
	{
		ctx.drawImage(document.getElementById('bomb'), this.pos_x*delta, this.pos_y*delta,delta,delta);
		ctx.stroke();
	}
	this.boom = function()
	{
		alert('boom');
		effect.strokeRect(this.pos_x*delta-2*delta,this.pos_y*delta-2*delta,delta*4,delta*4);
	}
}
function Corn(w,h)
{
	this.pos_x = Math.floor((Math.random()*w)-1);
	this.pos_y = Math.floor((Math.random()*h)-1);
	this.draw = function()
	{
		var pole=document.getElementById("pole");
		var ctx=pole.getContext("2d");
		ctx.drawImage(document.getElementById('corn'), this.pos_x*delta, this.pos_y*delta,delta,delta);
		ctx.stroke();
	}
}
function Snake(w,h)
{
	var start = 10;
	var pole=document.getElementById("pole");
	var ctx=pole.getContext("2d");
	this.pos_x = 20;
	this.pos_y = 20;
	this.length = start;
	this.dir = [];
	var a = 0;
	var b = 0;
	var x = this.pos_x*delta;
	var y = this.pos_y*delta;
	this.draw = function()
	{
	x = this.pos_x*delta;
	y = this.pos_y*delta;
	pos_y = y;
	pos_x = x;
		if(this.length > 0)
		{
			var pole=document.getElementById("pole");
			var ctx=pole.getContext("2d");
			if((this.pos_x>=w) || (this.pos_x<0) || (this.pos_y<0) || (this.pos_y>=h))
			{
				return 1;//завершение рисования
			}
				for(var i = 0; i < this.length; i++)
				{
					if(i==0)
					{
						ctx.drawImage(document.getElementById('head'), x, y,delta,delta);
						a = 0;
						b = 0;
					}
					else if(i>0)
					{
						if(this.dir[i-1]=='up')
						{
							b = 1;
							a = 0;
						}
						else if(this.dir[i-1]=='down')
						{
							b = -1;
							a = 0;
						}
						else if(this.dir[i-1]=='left')
						{
							a = -1;
							b = 0;
						}
						else if(this.dir[i-1]=='right')
						{
							a = 1;
							b = 0;
						}
						x -= delta*a;
						y += delta*b;
						start--;
						if((Math.round(x)==Math.round(this.pos_x*delta))&&(Math.round(y)==Math.round(this.pos_y*delta)) && (start<1))
						{
							return 2;
						}
						ctx.drawImage(document.getElementById('tail'), x, y,delta,delta);
					}
				}
		ctx.stroke();
		}		
	}	
}
