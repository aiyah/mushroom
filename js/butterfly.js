
//using example from : view-source:http://stemkoski.github.io/Three.js/Extrusion.html

//references three.js and tween.js

function Butterfly(bColor, wColor, wt, bt, ht) {

	this.bodyColor = (bColor === undefined) ? "0x009900" : bColor;	
	this.wingColor = (wColor === undefined) ? "0x880099" : wColor; 
	
	this.headTexture = (ht === undefined)? null : ht;
	this.bodyTexture = (bt === undefined)? null : bt;	
	this.wingTexture = (wt === undefined)? null : wt;
		
	this.model = null;
	
	this.flapTween = [];			//list of tweens for flapping the wings
}


Butterfly.prototype.createButterfly = function() {	
	
	var rSeg = 16;
	var hSeg = 2;
	
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
	
		
	var wingGeo = new THREE.ShapeGeometry(wingShape);
	var wingMat = new THREE.MeshLambertMaterial({wireFrame: true,side:THREE.DoubleSide});
	wingMat.color.setHex(this.wingColor);
	
	if (this.wingTexture !== null) {
		//console.log("wt: " + this.wingTexture);
		var wt = THREE.ImageUtils.loadTexture(this.wingTexture);
		wt.wrapS = wt.wrapT = THREE.RepeatMirroring;
		wt.repeat.set(0.1, 0.1);
		wingMat.map = wt;
	}
	
	
	var wingA = new THREE.Mesh(wingGeo, wingMat);
	var wingB = new THREE.Mesh(wingGeo, wingMat);	
	
	wingB.rotation.y = Math.PI;
	
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
		
	bfly.traverse(function(obj) {
		if (obj instanceof THREE.Mesh) {
			obj.castShadow = true;
		}
	});	
		
	this.model = bfly;
	
	return this;	
}

Butterfly.prototype.flapWings = function() {
	var bfly = this.model;
	var rWing = this.model.getObjectByName("rWing", true);
	var lWing = this.model.getObjectByName("lWing", true);
	
	//rWing.rotation.y = 30 * Math.PI / 180;
	//TWEEN.removeAll();
	
	var currPos = new THREE.Vector3();
	currPos.copy(this.model.position);
	

	var flapUpdate = function() {
		rWing.rotation.y = curr.yAngle;
		lWing.rotation.y = -curr.yAngle;
		bfly.position.y = curr.offsetY;

	}
	var moveY = 10;
	var origY = bfly.position.y;
	
	var curr = {yAngle: 0, offsetY: 0};
	var end1 = {yAngle: 80 * Math.PI / 180, offsetY: origY - moveY};
	tween0 = new TWEEN.Tween(curr).to(end1, 500);
	tween0.easing(TWEEN.Easing.Cubic.In);
	tween0.onUpdate(flapUpdate);
	
	//var start2 = {yAngle: 80, offsetY: -moveY};
	var end2 = {yAngle: 0, offsetY: origY}
	tween1 = new TWEEN.Tween(curr).to(end2, 500);
	tween1.easing(TWEEN.Easing.Linear.None);
	tween1.onUpdate(flapUpdate);
	
	tween0.chain(tween1);
	tween1.chain(tween0);
	
	
	this.flapTween.push(tween0);
	this.flapTween.push(tween1);
	
	tween0.start();
	
}

Butterfly.prototype.restWings = function() {
	//TWEEN.removeAll();	
	for (var i = this.flapTween.length - 1; i > 0; i--) {
	
		TWEEN.remove(this.flapTween[i]);
	}		
}



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


Butterfly.prototype.hover = function (ms) {
	var bfly = this.model;
	
	if (ms === undefined) {
		ms = 1000;
	}
	
	var currPos = new THREE.Vector3();
	currPos.copy(this.model.position);
	var yAmount = 20;
	
	var origY = currPos.y;
	var curr = {y: origY};	
	var endPos = {y: origY + yAmount};
	var endPos2 = {y: origY};
	
	var update = function() {
		bfly.position.y = curr.y;
	}
	
	var tween0 = new TWEEN.Tween(curr).to(endPos, ms);
		tween0.easing(TWEEN.Easing.Linear.None);
		tween0.onUpdate(update);
	
	var tween1 = new TWEEN.Tween(curr).to(endPos2, ms);
		tween1.easing(TWEEN.Easing.Linear.None);
		tween1.onUpdate(update);
		
	tween0.chain(tween1);
	tween1.chain(tween0);
	
	tween0.start();
}




