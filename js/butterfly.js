//butterfly.js - javascript to create a butterfly object 
//uses three.js to create the 3d model (http://threejs.org/)
//uses tween.js to perform animations (https://github.com/sole/tween.js/)

//example use:
/*
	bfly1 = new Butterfly("0x00dd55", "0xffff00", "./img/wing.png");	
	bfly1.createButterfly();	
	bfly1.setCastShadows(true);	
	scene.add(bfly1.model);	
*/	


//Set up initial values for the butterfly object
//bColor = body and head color as hex string, wColor = wing color as hex string
//wt = wing texture, bt = body texture, ht = head texture 
function Butterfly(bColor, wColor, wt, bt, ht) {

	this.bodyColor = (bColor === undefined) ? "0x009900" : bColor;	
	this.wingColor = (wColor === undefined) ? "0x880099" : wColor; 
	
	this.headTexture = (ht === undefined)? null : ht;
	this.bodyTexture = (bt === undefined)? null : bt;	
	this.wingTexture = (wt === undefined)? null : wt;
	
	this.model = null;	
	
	this.flapTween = [];			//list of tweens for flapping the wings	
}

//Sets up the geometry and materials.  
//Creates the THREE.Object3D to store in the model property
Butterfly.prototype.createButterfly = function() {	
	
	var rSeg = 16;		//radius segments
	var hSeg = 2;		//height segments
	
	var headGeo = new THREE.SphereGeometry(1);		
	var bodyGeo = new THREE.CylinderGeometry(0.7,0.5,9, rSeg, hSeg, false);
	
	var headMat = new THREE.MeshLambertMaterial();
	var bodyMat = new THREE.MeshLambertMaterial();
	
	headMat.color.setHex(this.bodyColor);
	bodyMat.color.setHex(this.bodyColor);
	
	var head = new THREE.Mesh(headGeo, headMat);
	var body = new THREE.Mesh(bodyGeo, bodyMat);
	
	head.position.y = 4.5;
	body.position.y = -1;
		
	var wingPoints = [];
	
	wingPoints.push(new THREE.Vector2 (0, 0));
	wingPoints.push(new THREE.Vector2 (0, -5));
	wingPoints.push(new THREE.Vector2 (7, -8));
	wingPoints.push(new THREE.Vector2 (8, -8));
	wingPoints.push(new THREE.Vector2 (7, -3));
	wingPoints.push(new THREE.Vector2 (3, 0));
	wingPoints.push(new THREE.Vector2 (8.5, -2));
	wingPoints.push(new THREE.Vector2 (10, 0));
	wingPoints.push(new THREE.Vector2 (11, 10));
	wingPoints.push(new THREE.Vector2 (10, 12));
	wingPoints.push(new THREE.Vector2 (0, 3));
	wingPoints.push(new THREE.Vector2 (0, 0));
	
	var wingShape = new THREE.Shape(wingPoints);
	
		
	/*	
	originally tried to use extrusion example from  
	view-source:http://stemkoski.github.io/Three.js/Extrusion.html
	to create the wings, but felt like have no control over how far the wing shape is extruded
	so going for flat shape
	*/
		
	var wingGeo = new THREE.ShapeGeometry(wingShape);
	var wingMat = new THREE.MeshLambertMaterial({wireFrame: true,side:THREE.DoubleSide});
	wingMat.color.setHex(this.wingColor);
		
	if (this.wingTexture !== null) {		
		var wt = THREE.ImageUtils.loadTexture(this.wingTexture);
		wt.wrapS = wt.wrapT = THREE.RepeatMirroring;
		wt.repeat.set(0.1, 0.1);
		wingMat.map = wt;
	}
		
	var wingA = new THREE.Mesh(wingGeo, wingMat);
	var wingB = new THREE.Mesh(wingGeo, wingMat);	
	
	wingB.rotation.y = Math.PI;
	
	//create parent objects to hold wings since wingB was rotated 180 degrees
	var rWing = new THREE.Object3D();
	rWing.name = "rWing";
	rWing.add(wingA);
	var lWing = new THREE.Object3D();		
	lWing.name = "lWing";
	lWing.add(wingB);
		
	var bfly = new THREE.Object3D();
	bfly.add(head);
	bfly.add(body);
	bfly.add(rWing);
	bfly.add(lWing);
			
		
	this.model = bfly;
	
	return this;	
}


//set if mesh should cast shadow or not
Butterfly.prototype.setCastShadows = function (castShadow) {
	if (this.model === null) {
		console.error("this.model is null: call setCastShadow() after createButterfly");
	}

	if (castShadow === undefined) {
		castShadow = true;
	}
	
	this.model.traverse(function(obj) {
		if (obj instanceof THREE.Mesh) {
			obj.castShadow = castShadow;
		}
	});	
	
}


//loop animation to flap butterfly wings
Butterfly.prototype.flapWings = function() {
	var bfly = this.model;
	var rWing = this.model.getObjectByName("rWing", true);
	var lWing = this.model.getObjectByName("lWing", true);
	
	//rWing.rotation.y = 30 * Math.PI / 180;
	//TWEEN.removeAll();
	var inMs = 500;			//time in ms for wings to flap together
	var outMs = 500;		//time in ms for wings to flap apart
	var angleOut = -5;		//set in degrees
	var angleIn = 80;		//set in degrees 	
	
	var currPos = new THREE.Vector3();
	currPos.copy(this.model.position);
	
	var flapUpdate = function() {
		rWing.rotation.y = curr.yAngle;
		lWing.rotation.y = -curr.yAngle;
		bfly.position.y = curr.offsetY;

	}
	
	var moveY = 10;			//distance to move up or down
	var origY = bfly.position.y;
	
	//when wings flap in want the butterfly to move down and vice versa when wings flap apart
	var curr = {yAngle: angleOut * Math.PI / 180, offsetY: 0};
	var end1 = {yAngle: angleIn * Math.PI / 180, offsetY: origY - moveY};
	var end2 = {yAngle: angleOut * Math.PI / 180, offsetY: origY}
	
	tween0 = new TWEEN.Tween(curr).to(end1, inMs);
	tween0.easing(TWEEN.Easing.Cubic.In);
	tween0.onUpdate(flapUpdate);
	
	//var start2 = {yAngle: 80, offsetY: -moveY};	
	tween1 = new TWEEN.Tween(curr).to(end2, outMs);
	tween1.easing(TWEEN.Easing.Linear.None);
	tween1.onUpdate(flapUpdate);
	
	//loop the animation 
	tween0.chain(tween1);
	tween1.chain(tween0);
		
	//keep track of tween so can stop it
	this.flapTween.push(tween0);			
	this.flapTween.push(tween1);
	
	tween0.start();	
}

Butterfly.prototype.restWings = function() {
	//TWEEN.removeAll();	//too powerful
	
	for (var i = this.flapTween.length - 1; i > 0; i--) {	
		TWEEN.remove(this.flapTween[i]);
	}		
}



//fly to a new location
//todo:  somehow orient the butterfly to turn or lean in direction heading

Butterfly.prototype.flyTo = function (newx, newy, newz, ms) {

	var bfly = this.model;

	var currPos = new THREE.Vector3();
	currPos.copy(this.model.position);

	var curr = {x: currPos.x, y: currPos.y ,z: currPos.z};	
	var endPos = {x: newx, y:newy, z:newz};
	
	var update = function() {
		bfly.position.x = curr.x;
		bfly.position.y = curr.y;
		bfly.position.z = curr.z;
	}
	
	var tween0 = new TWEEN.Tween(curr).to(endPos, ms);
		tween0.easing(TWEEN.Easing.Cubic.In);
		tween0.onUpdate(update);
	
	tween0.start();
}




