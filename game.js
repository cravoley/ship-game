(function () {
	// TODO: implement other kind of weapons
	var WEAPON = {
		single: {
			type: "single",
			speed: 15,
			damage: 1
		},
		missile: {
			type: "missile",
			speed: 25,
			damage: 5
		}
	};

	function Game(canvas) {
		var canvas = canvas;
		var ctx;
		var position = {x: 0, y: 0};
		var ship;
		var shipSize = {x: 0, y: 0};
		var canvasSize = {x: 0, y: 0}
		var shoots = [];
		var shootsTimeout;

		var init = function () {
			//canvas = $("#game");
			// TODO: manage to have more than one game in the same screen?
			//if (canvas.size() != 1) {
			//	console.error("Unable to find a valid canvas to start with");
			//	return;
			//}
			//canvas = canvas[0]; // get first canvas


			// get body size
			var documentSize = {x: $("body").width(), y: $("body").height()};
			// set current canvas to 'full screen'
			var setCanvasSize = function () {
				canvasSize = {x: documentSize.x, y: documentSize.y};
				$(canvas).attr("width", canvasSize.x);
				$(canvas).attr("height", canvasSize.y);
			};
			ctx = canvas.getContext("2d");
			ship = $("img#ship");
			if (ship.size() == 0) {
				console.error("Unable to find a valid ship image to start with");
				return;
			}
			ship = ship[0];
			shipSize = {x: 50, y: 143};
			$(canvas).on('mousemove', moveShip);
			$(canvas).on('contextmenu', fire);
			$(canvas).on('mousedown', fire);
			setCanvasSize();
			// TODO: version 1.1 should allow the ship to move back and forward
			position.y = canvasSize.y - shipSize.y; // this is fixed by now
			// set ship to initial position
			moveShip();
			//setInterval(updateBulletsPosition, 100);
		};

		// utility class to replace old ship placement
		var eraseShip = function () {
			ctx.fillStyle = "#000";
			ctx.fillRect(position.x, position.y, shipSize.x, shipSize.y);
		};

		var moveShip = function (event) {
			// TODO: set max movement distance by ship type. Implement other ships
			eraseShip();
			if (event != null) {
				if (!event.layerX && event.originalEvent) {
					event = event.originalEvent;
				}
				position.x = event.layerX;
				// if(position.x < shipSize.x){
				//   position.x=shipSize.x;
				// }
				if (position.x > canvasSize.x - shipSize.x)
					position.x = canvasSize.x - shipSize.x;
			}
			ctx.drawImage(ship, position.x, position.y);
		};
		var fire = function (event) {
			console.log(event.button);
			if (event.button == 0) {
				shoots.push({x: position.x, y: position.y, weapon: WEAPON.single});
			} else if (event.button == 2) {
				// right click, shoot missile
				event.preventDefault();
				shoots.push({x: position.x, y: position.y, weapon: WEAPON.missile});
			}
			if (!shootsTimeout)
				shootsTimeout = setInterval(updateBulletsPosition, 100);
		};
		var updateBulletsPosition = function () {
			if (shoots && shoots.length > 0) {
				var startIndex = 0;
				var newBullets = [];
				var img = document.getElementById('bullet');
				for (var i = 0; i < shoots.length; i++) {
					var shot = shoots[i];
					var damage = shot.weapon.damage;
					// TODO: leave a trace after shooting
					ctx.clearRect(shot.x, shot.y, img.width, img.height);
					shot.y = shot.y - shot.weapon.speed;
					console.debug(shot.y, canvasSize.y);
					ctx.drawImage(img, shot.x, shot.y);
					if (shot.y > 0 - img.height) newBullets.push(shot);
				}
				shoots = newBullets;
			} else {
				clearInterval(shootsTimeout);
				shootsTimeout = null;
			}
		};
		init();
	}

	$(document).ready(function () {
		$("#game").each(function () {
			new Game(this);
		});

	});
})
();
