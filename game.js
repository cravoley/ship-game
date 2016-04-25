(function(){

  function game(){
    var canvas ;
    var ctx;
    var position = {x:0,y:0};
    var ship;
    var shipSize = {x:0,y:0};
    var canvasSize = {x:0,y:0}

    var init = function(){
      canvas = $("#game");
      if(canvas.size() != 1) {
        console.error("Unable to find a valid canvas to start with");
        return;
      }
      canvas = canvas[0]; // get first canvas


      // get body size
      var documentSize = {x:$("body").width(), y:$("body").height()};
      // set current canvas to 'full screen'
      var setCanvasSize = function(){
        canvasSize = {x:documentSize.x, y:documentSize.y};
        $(canvas).attr("width",canvasSize.x);
        $(canvas).attr("height",canvasSize.y);
      };
      ctx = canvas.getContext("2d");
      ship = $("img#ship");
      if(ship.size() == 0){
        console.error("Unable to find a valid ship image to start with");
        return;
      }
      ship = ship[0];
      shipSize = {x:50, y:143};
      $(canvas).on('mousemove',moveShip);      
      setCanvasSize();
      // TODO: version 1.1 should allow the ship to move back and forward
      position.y = canvasSize.y-shipSize.y; // this is fixed by now
      // set ship to initial position
      moveShip();
    };

    // utility class to replace old ship placement
    var eraseShip = function(){
      ctx.fillStyle="#000";
      ctx.fillRect(position.x,position.y,shipSize.x,shipSize.y);
    };

    var moveShip = function(event){
      eraseShip();
      if(event != null){
        if(!event.layerX && event.originalEvent){
          event = event.originalEvent;
        }
        position.x = event.layerX;
        // if(position.x < shipSize.x){
        //   position.x=shipSize.x;
        // }
        if(position.x > canvasSize.x - shipSize.x)
          position.x = canvasSize.x - shipSize.x;
      }
      ctx.drawImage(ship,position.x,position.y);
    };
    init();
  }
  $(document).ready(function(){

    console.log("LOAD");
    game();
  });
})();
