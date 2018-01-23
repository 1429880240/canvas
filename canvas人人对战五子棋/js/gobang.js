var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
var btn1 = document.getElementById('btn1');
var btn2 = document.getElementById('btn2');
var btn3 = document.getElementById('btn3');
var flag = false; //判断当前局是否开始
var interval = 50; //画图横线间隔
var clickCount = 0; //点击的次数
var colorW; //白棋
var colorB; //黑棋
var data = []; //每次点击的位置数据
var lineCount = 0; //棋子4个方向连着的个数初始值0
var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5; //鼠标当前点和4个方向的延伸点
var tempX, tempY; //临时变量,承接判断4个方向每个位置的x轴y轴的递增值
var bgColor = 0; //1是白色棋子,0是黑色棋子

//绘制表格
function drwTable() {
	//防止边界的棋子有一半看不到,所以i(x轴和y轴)初始值为25;
	for(var i = 25; i < c.width; i += interval) {
		//纵向横线
		cxt.beginPath();
		cxt.lineWidth = "2";
		cxt.strokeStyle = "black"; // 黑色线条
		cxt.moveTo(i, 25); //起点
		cxt.lineTo(i, c.width - 25); //末点
		cxt.stroke(); // 进行绘制

		//横向横线
		cxt.beginPath();
		cxt.lineWidth = "2";
		cxt.moveTo(25, i); //起点
		cxt.lineTo(c.width - 25, i); //末点
		cxt.stroke(); // 进行绘制
	}
}

function style(m, n) {
	//白棋子样式
	colorW = cxt.createRadialGradient(m, n, interval / 2, m, n, 0);
	colorW.addColorStop(0, "#D1D1D1");
	colorW.addColorStop(1, "#F9F9F9");
	//黑棋子样式
	colorB = cxt.createRadialGradient(m, n, interval / 2, m, n, 0);
	colorB.addColorStop(0, "#0A0A0A");
	colorB.addColorStop(1, "#636766");
}
//游戏的点击事件
function gameClick() {
	var e = event || window.event;
	x1 = e.offsetX;
	y1 = e.offsetY;
	if(flag) {
		//判断点击事件鼠标的x轴,因为边界棋子原因所有检测4个方向分别扩大25px
		for(var i = -25; i < c.width + 25; i += interval) {
			if(x1 >= i && x1 < i + interval / 2) {
				x1 = i;
				break;
			}
			if(x1 >= i + interval / 2 && x1 < i + interval) {
				x1 = i + interval;
				break;
			}
		}
		//判断点击事件鼠标的y轴,因为边界棋子原因所有检测4个方向分别扩大25px
		for(var i = -25; i < c.width + 25; i += interval) {
			if(y1 >= i && y1 < i + interval / 2) {
				y1 = i;
				break;
			}
			if(y1 >= i + interval / 2 && y1 < i + interval) {
				y1 = i + interval;
				break;
			}
		}

		//返回false代表没有棋子,可以下
		if(!judgeData(x1, y1)) {
			cxt.beginPath(); //开启路径
			//判断棋子填充颜色
			style(x1, y1);
			if(clickCount % 2 == 0) {
				cxt.fillStyle = colorW;
				bgColor = 1;
			} else {
				cxt.fillStyle = colorB;
				bgColor = 0;
			}
			cxt.arc(x1, y1, interval / 2 - 2, 0, Math.PI * 2, false); //画圆
			cxt.closePath(); //关闭路径
			cxt.fill(); //填充
			//存放位置数据的数组
			data.push({
				'x': x1,
				'y': y1,
				'bgColor': bgColor
			});
			//点击次数
			clickCount++;
			//判断游戏结束
			if(gameOver(x1, y1, bgColor)) {
				flag = false; //游戏结束
				if(bgColor == 1) {
					winW();
				} else {
					winB();
				}
			}
		}
	}
}
//验证是否存在当前点
function judgeData(x, y) {
	for(var i = 0; i < data.length; i++) {
		if(data[i].x == x && data[i].y == y) {
			//代表该位置已经有棋子
			return true;
		}
	}
	//代表该位置已经无棋子
	return false;
}
//验证是否存在当前点,为了判断点击时横向,纵向,斜行,反斜行的颜色有无连着5个相同的颜色
function judgeDataBgColor(x, y, bgColor) {
	for(var i = 0; i < data.length; i++) {
		if(data[i].x == x && data[i].y == y && data[i].bgColor == bgColor) {
			//代表该位置已经有棋子
			return true;
		}
	}
	//代表该位置已经无棋子
	return false;
}

//判断游戏结束
function gameOver(x1, y1, bgColor) {
	x2 = x1; //当前鼠标位置棋子的x轴
	x2 = x1 - 4 * interval; //当前鼠标位置向前搜索4个
	y2 = y1; //当前鼠标位置棋子的y轴
	//1️⃣判断当前点的横向*************************
	//检索当前位置前,后分别4个,所有0--8,共9次循环
	for(var i = 0; i < 9; i++) {
		tempX = x2 + interval * i;
		//当前鼠标位置向前搜索4个和后四个是当前颜色棋子且相连一个加1
		if(judgeDataBgColor(tempX, y2, bgColor)) {
			lineCount++;
			console.log(lineCount);
			if(lineCount == 5) {
				break;
			}
		}
		//当前鼠标位置向前搜索4个和后四个不是当前颜色棋子lineCount归0
		else {
			lineCount = 0;
		}
	}
	if(lineCount == 5) {
		return true;
	}
	//2️⃣判断当前点的纵向*************************
	x3 = x1; //当前鼠标位置棋子的x轴
	y3 = y1; //当前鼠标位置棋子的y轴
	y3 = y1 - 4 * interval; //当前鼠标位置向前搜索4个
	//检索当前位置前,后分别4个,所有0--8,共9次循环
	for(var i = 0; i < 9; i++) {
		tempY = y3 + interval * i;
		//当前鼠标位置向前搜索4个和后四个是当前颜色棋子且相连一个加1
		if(judgeDataBgColor(x3, tempY, bgColor)) {
			lineCount++;
			console.log(lineCount);
			if(lineCount == 5) {
				break;
			}
		}
		//当前鼠标位置向前搜索4个和后四个不是当前颜色棋子lineCount归0
		else {
			lineCount = 0;
		}
	}
	if(lineCount == 5) {
		return true;
	}
	//3️⃣判断当前点的斜向*************************
	x4 = x1 - 4 * interval; //当前鼠标位置左搜索4个
	y4 = y1 - 4 * interval; //当前鼠标位置上搜索4个
	//检索当前位置前,后分别4个,所有0--8,共9次循环
	for(var i = 0; i < 9; i++) {
		tempX = x4 + interval * i;
		tempY = y4 + interval * i;
		//当前鼠标位置向前搜索4个和后四个是当前颜色棋子且相连一个加1
		if(judgeDataBgColor(tempX, tempY, bgColor)) {
			lineCount++;
			console.log(lineCount);
			if(lineCount == 5) {
				break;
			}
		}
		//当前鼠标位置向前搜索4个和后四个不是当前颜色棋子lineCount归0
		else {
			lineCount = 0;
		}
	}
	if(lineCount == 5) {
		return true;
	}
	//4️⃣判断当前点的反斜向*************************
	x5 = x1 + 4 * interval; //当前鼠标位置左搜索4个
	y5 = y1 - 4 * interval; //当前鼠标位置上搜索4个
	//检索当前位置前,后分别4个,所有0--8,共9次循环
	for(var i = 0; i < 9; i++) {
		tempX = x5 - interval * i;
		tempY = y5 + interval * i;
		//当前鼠标位置向前搜索4个和后四个是当前颜色棋子且相连一个加1
		if(judgeDataBgColor(tempX, tempY, bgColor)) {
			lineCount++;
			if(lineCount == 5) {
				break;
			}
		}
		//当前鼠标位置向前搜索4个和后四个不是当前颜色棋子lineCount归0
		else {
			lineCount = 0;
		}
	}
	if(lineCount == 5) {
		return true;
	}
	//结束***************************
}
//白棋子赢
function winW() {
	cxt.beginPath();
	cxt.fillStyle = 'rgba(46,125,255,0.9)';
	cxt.fillRect(200, 200, 350, 200);
	cxt.fill();
	cxt.beginPath();
	cxt.font = '55px Arial';
	cxt.fillStyle = 'black';
	cxt.textAlign = 'center';
	cxt.textBaseline = 'top';
	cxt.fillText('恭喜,白棋赢!', 375, 270);
	cxt.fill();
}
//黑棋子赢
function winB() {
	cxt.beginPath();
	cxt.fillStyle = 'rgba(46,125,255,0.9)';
	cxt.fillRect(200, 200, 350, 200);
	cxt.fill();
	cxt.beginPath();
	cxt.font = '55px Arial';
	cxt.fillStyle = 'black';
	cxt.textAlign = 'center'; //文字居中
	cxt.textBaseline = 'top'; //文本基线头部对其
	cxt.fillText('恭喜,黑棋赢!', 375, 270);
	cxt.fill();
}
//初始页面
start();

function start() {
	cxt.beginPath();
	cxt.font = '55px Arial';
	cxt.fillStyle = 'black';
	cxt.textAlign = 'center'; //文字居中
	cxt.textBaseline = 'top'; //文本基线头部对其
	//文字阴影
	cxt.shadowBlur = 10;
	cxt.shadowOffsetX = 5;
	cxt.shadowOffsetY = -5;
	cxt.shadowColor = "black";
	cxt.fillText('五子棋之人人对战!', 375, 270);
	cxt.closePath();
	cxt.fill();
}

//开始游戏
function gameStart() {
	flag = true;
	cxt.clearRect(0, 0, c.width, c.width);
	cxt.shadowBlur = 0;
	cxt.shadowOffsetX = 0;
	cxt.shadowOffsetY = 0;
	//绘制表格
	drwTable();
	btn1.onclick = null;
}

//重新开始
function reStart() {
	cxt.clearRect(0, 0, c.width, c.width); //清除画布
	cxt.shadowBlur = 0;
	cxt.shadowOffsetX = 0;
	cxt.shadowOffsetY = 0;
	drwTable(); //绘制表格
	flag = true; //游戏开始
	lineCount = 0; //有0个相连的棋子
	data = []; //清空数据数组
	clickCount = 0; //点击的次数
}
//悔棋
function back() {
	clickCount--; //次数减1
	data.pop(); //尾部删除一个
	cxt.clearRect(0, 0, c.width, c.width); //清除画布,重新绘制
	drwTable(); //绘制表格
	for(var i = 0; i < data.length; i++) {
		cxt.beginPath();
		style(data[i].x, data[i].y);
		if(i % 2 == 0) {
			cxt.fillStyle = colorW;
		} else {
			cxt.fillStyle = colorB;;
		}
		cxt.arc(data[i].x, data[i].y, interval / 2 - 2, 0, Math.PI * 2, false); //画圆
		cxt.closePath(); //关闭路径
		cxt.fill();
	}
}

//开始游戏
btn1.onclick = function() {
	gameStart();
}

//重新开始
btn2.onclick = function() {
	reStart();
}

//悔棋
btn3.onclick = function() {
	if(flag == true) {
		back();
	}
}

//下棋的点击事件
c.onclick = function() {
	gameClick();
}