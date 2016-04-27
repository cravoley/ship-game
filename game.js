(function () {
	// TODO: implement other kind of weapons
	var WEAPONS;
	var ALIENS;


	function Game(canvas) {
		var canvas = canvas;
		var ctx;
		var position = {x: 0, y: 0};
		var ship;
		var shipSize = {x: 0, y: 0};
		var canvasSize = {x: 0, y: 0}
		var shoots = [];
		var shootsTimeout;

		var game = this;
		this.init = function () {
			var prepareGameData = function () {
				loadJson("data/weapons.json", function (data) {
					WEAPONS = data;
				});
				loadJson("data/enemies.json", function (data) {
					ALIENS = data;
				});
			};
			prepareGameData();

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
			$(canvas).on('mousemove', game.moveShip);
			$(canvas).on('contextmenu', game.fire);
			$(canvas).on('mousedown', game.fire);
			setCanvasSize();
			// TODO: version 1.1 should allow the ship to move back and forward
			position.y = canvasSize.y - shipSize.y; // this is fixed by now
			// set ship to initial position
			game.moveShip();
			//setInterval(updateBulletsPosition, 100);
		};

		// utility class to replace old ship placement
		this.eraseShip = function () {
			ctx.fillStyle = "#000";
			ctx.fillRect(position.x, position.y, shipSize.x, shipSize.y);
		};

		this.moveShip = function (event) {
			// TODO: set max movement distance by ship type. Implement other ships
			if (event != null) {
				game.eraseShip();
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
		this.fire = function (event) {
			if (event.button == 0) {
				shoots.push({x: position.x, y: position.y, weapon: WEAPONS.single});
			} else if (event.button == 2) {
				// right click, shoot missile
				event.preventDefault();
				shoots.push({x: position.x, y: position.y, weapon: WEAPONS.missile});
			}

		};
		this.updateBulletsPosition = function () {
			if (shoots && shoots.length > 0) {
				var newBullets = [];
				var img = document.getElementById('bullet');
				for (var i = 0; i < shoots.length; i++) {
					var shot = shoots[i];
					var damage = shot.weapon.damage;
					// TODO: leave a trace after shooting
					ctx.clearRect(shot.x, shot.y, img.width, img.height);
					shot.y = shot.y - shot.weapon.speed;
					ctx.drawImage(img, shot.x, shot.y);
					if (shot.y > 0 - img.height) newBullets.push(shot);
				}
				shoots = newBullets;
			}
		};
		var loadJson = function (path, callback) {
			$.ajax({
				dataType: "json",
				url: path,
				success: callback
			});
		};
	}

	$(document).ready(function () {
		$("#game").each(function () {
			var game = new Game(this);
			game.init();
			setInterval(game.updateBulletsPosition, 100);
		});

	});
})
();
