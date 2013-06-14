mushroom
=========
mushroom.js example use:
<pre>
 
  var shroom = Mushroom (capSize, stalkHeight, stalkTop, stalkBottom, capScaleY, capOffsetY) 
  shroom.setColors("0xffffff", "0xdddddd", "0xfffff");
  shroom.setTextures("./img/cap1.png", "./img/ucap1.png", "./img/stalk1.png");
  shroom.growIt();    
  
  scene.add(shroom.model);
</pre>


butterfly.js example use:
<pre>
  <script src="./js/butterfly.js"></script>

  var bfly = new Butterfly(bColor, wColor, wingTexture, bodyTexture, headTexture);  
  bfly.createButterfly();	
	
  scene.add(bfly.model);
</pre>



To run Mushroom.html you will also need: 
<ul>
<li>web browser that supports WebGL (http://get.webgl.org/)</li>
<li>three.js  (get from https://github.com/mrdoob/three.js or http://threejs.org/) </li>
<li>tween.js  (get from https://github.com/sole/tween.js) 
<li>Coordinates.js (get from Udacity cs291 course: https://github.com/udacity/cs291 --see the lib dir) </li>
<li>OrbitAndPanControls.new.js (get from Udacity cs291 course: https://github.com/udacity/cs291 --see the lib dir)</li>
<li>dat.gui.min.js (get from Udacity cs291 course: https://github.com/udacity/cs291 --see the lib dir)</li>
</ul>



