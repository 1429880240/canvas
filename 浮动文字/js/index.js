var time = 0;

function Gravity(id) {
	var that = this;
	var element = document.getElementById(id);
	var text = element.textContent;
	var arr = text.split('');

	this.animate = true;
	this.floating = true;
	this.resetTime = 0;

	this.positionType = getComputedStyle(element).position;

	this.lerp = function(e, t, i) {
		return (1 - i) * e + i * t;
	}
	this.checkBound = function() {
		if (element.hasAttribute("data-bound")) {
			return element.dataset.bound === "true";
		}
	}

	this.useBound = this.checkBound();
	this.colors = [
		'#f44336', '#e91e63', '#9c27b0',
		'#673ab7', '#3f51b5', '#2196f3',
		'#03a9f4', '#00bcd4', '#009688',
		'#4caf50', '#8bc34a', '#cddc39',
		'#ffeb3b', '#ffc107', '#ff9800',
		'#ff5722', '#795548', '#9e9e9e',
		'#607d8b'
	];

	this.randomColor = function() {
		var randNum = Math.floor(Math.random() * this.colors.length);
		return this.colors[randNum];
	}

	this.bounds = this.useBound ? {
		min: {
			x: element.offsetLeft,
			y: element.offsetTop
		},
		max: {
			x: element.offsetLeft + element.offsetWidth,
			y: element.offsetTop + element.offsetHeight
		}
	} : {
		min: {
			x: 0,
			y: 0
		},
		max: {
			x: window.innerWidth,
			y: window.innerHeight
		}
	}

	this.pointInCircle = function(point, target, radius) {
		var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y);
		return [distsq <= radius * radius, distsq];
	}

	function createSpan(text, pos) {
		var span = document.createElement('span');
		span.innerHTML = text;
		span.style.position = "relative";
		span.style.display = "inline-block";
		span.style.minWidth = "10px";
		span.style.color = that.randomColor();
		span._own = {
			pos: {
				x: 0,
				y: 0
			},
			/*左移,右移的数值*/
			vel: {
				x: -0.5 + Math.random(),
				y: 0.5 + Math.random()
			},
			//文字移动速度
			speed: {
				x: Math.random() * -8,
				y: Math.random() * 5
			},
			dir: {
				x: 1,
				y: 1
			}
		}
		return span;
	}
	this.textSpans = [];

	element.innerHTML = '';

	arr.forEach(function(t, i) {
		var el = createSpan(t, {
			x: 0,
			y: 0
		});
		element.appendChild(el);
		that.textSpans.push(el);
	});

	this.getDim = function() {

		this.textSpans.forEach(function(t, i) {
			var offset = {
				x: 0,
				y: 0
			}
			if (that.positionType === 'relative' || that.positionType === 'absolute') {
				offset.x = element.offsetLeft
				offset.y = element.offsetTop
			}
			t._own.real = {
					x: offset.x + t.offsetLeft,
					y: offset.y + t.offsetTop
				},
				t._own.size = {
					x: t.offsetWidth,
					y: t.offsetHeight
				}

		});

	};

	this.getDim();

	this.floatText = function() {
		this.textSpans.forEach(function(t, i) {

			if (t._own.pos.x + t._own.real.x < that.bounds.min.x || t._own.pos.x + t._own.real.x + t._own.size.x > that.bounds
				.max.x) {
				t._own.dir.x *= -1;
			}
			if (t._own.pos.y + t._own.real.y < that.bounds.min.y || t._own.pos.y + t._own.real.y + t._own.size.y > that.bounds
				.max.y) {
				t._own.dir.y *= -1;
			}
			t._own.pos.x += (t._own.vel.x * t._own.speed.x) * t._own.dir.x;
			t._own.pos.y += (t._own.vel.y * t._own.speed.y) * t._own.dir.y;
			t.style.transform = 'translateX(' + t._own.pos.x + 'px) translateY(' + t._own.pos.y + 'px)';

		});
	}
	this.update = function() {
		if (this.animate) {
			if (this.floating) {
				this.floatText();
			} else {
				this.floatBackwards();
			}
		}
	}

	this.floatBackwards = function() {
		this.textSpans.forEach(function(t, i) {

			var x = that.lerp(t._own.pos.x, 0, that.resetTime / 10);
			var y = that.lerp(t._own.pos.y, 0, that.resetTime / 10);

			t.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';

		});

		if (this.resetTime === 10) {
			this.animate = false;
			this.resetTime = 0;
		}
		this.resetTime++;
	}
	this.reset = function() {
		this.floating = false;
	}
	this.restart = function() {
		this.textSpans.forEach(function(t, i) {
			t._own.pos.x = 0;
			t._own.pos.y = 0;
		});
		this.floating = true;
		this.animate = true;
	}

	window.onresize = function() {
		that.getDim();
	}

}

var paragraph = new Gravity('text');
var gravity = new Gravity('reset');

var button = document.getElementById('reset');
button.addEventListener('click', function() {
	if (gravity.animate) {
		gravity.reset();
		paragraph.reset();
	} else {
		gravity.restart();
		paragraph.restart();
	}
});

var render = function(time) {
	requestAnimationFrame(render);

	animation(time);
};

//__________ animation

function animation(time) {
	paragraph.update();
	gravity.update();
};

//__________

render(time);
