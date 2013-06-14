
mushroom
=========
Mushroom.html is used to pratice trying out different things in threejs : texture, particles, animation (tween.js)
and submission to te Udacity contest #2.

To run Mushroom.html you will also need to get files: 
  -three.min.js  (https://github.com/mrdoob/three.js/)
  -tween.min.js  (https://github.com/sole/tween.js)
  -Udacity cs291 lib files: (https://github.com/udacity/cs291)


mushroom.js example use:

  <script src="./js/mushroom.js"></script>

  var shroom = Mushroom (capSize, stalkHeight, stalkTop, stalkBottom, capScaleY, capOffsetY) 
  //shroom.setColors("0xffffff", "0xdddd", "0xfffff");
	//shroom.setTextures("./img/cap1.png", "./img/ucap1.png", "./img/stalk1.png");
	shroom.growIt();    
  scene.add(shroom.model);



butterfly.js example use:

  <script src="./js/butterfly.js"></script>

  var bfly = new Butterfly(bColor, wColor, wingTexture, bodyTexture, headTexture);  
	bfly.createButterfly();	
	
  scene.add(bfly.model);
  

