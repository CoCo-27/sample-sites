function loadImage(x, y, text, cost, src){

  console.log("loadImage.onload called with 'this': " + this);
//  var c = window.document.getElementById("canvas");
  var c = $("#canvas")[0];
  var ctx = c.getContext("2d");
  var backgroundImage = new Image();
  var cardImage = new Image();
  var domImage = $("an-image")[0];

//TODO this is awful.  Currently it repeatedly loads the image to trigger
// the onload function.  Gah.  It should be loaded once and then skip straight
// to drawing the card (assuming that image has been loaded).

  backgroundImage.onload = function(){
    console.log("backgroundImage.onload called with 'this': " + this);
    console.log("loaded");
    console.log(this.height);
    ctx.fillStyle = "dimgrey";
    var fontHeight = 20;
    var margin = 50;

    cardImage.onload = function() {
      drawCard(x, y, text , cost, cardImage, this, fontHeight, ctx);
    }.bind(this);

    cardImage.src = src;
};


  backgroundImage.src = "../../images/deck_builder_card_bg.png";

}


function drawCard(x, y, text, cost, cardImage, backgroundImage, fontHeight, ctx){
  var textX = 50;
  var manaX = 14;
  var h = backgroundImage.height;
  var w = backgroundImage.width;
  //
  ctx.filter = "brightness(40%)";
  ctx.drawImage(backgroundImage, x, y);
  ctx.filter = "none";
  ctx.drawImage(cardImage, 100, 0, 100, 100, x + w -61, y - h + 15, 75, 75);
  // The constants are dirty hacks to push the icons into position.
  ctx.font = fontHeight + "px serif";
  ctx.fillStyle = "white";

  // To center the font, its edges must same distance, d, from the nearest
  // edge of the image.

  var d = (h - fontHeight)/2;
  ctx.textBaseline = "top";
  ctx.fillText(text, x + textX, y + d*0.9, 200); // Irritatingly, this does not
  // look perfect without an arbitrary multiplication.  For some reason the
  // text doesn't seem centered on the y axis (though it should be),
  ctx.fillText(cost, x + manaX, y + d*0.9);
}
