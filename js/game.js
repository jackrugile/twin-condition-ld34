/*==============================================================================

Core

==============================================================================*/

$.game = playground({
	width: 960,
	height: 576,
	scale: 1,
	smoothing: false
});

$.game.create = function() {
	$.ctx = this.layer;

	// default time
	this.dt = 0.016;
	this.dtMs = 16;
	this.dtNorm = 1;
	this.time = 0;
	this.timeMs = 0;
	this.timeNorm = 0;

	// default level
	this.level = 1;
	this.buildHeight = this.height / 3;
};

$.game.ready = function() {
	this.setState( $.statePlay );
};

$.game.step = function( dt ) {
	this.manageTime( dt );
};

$.game.mousedown = function( e ) {
	// game wide mousedown
};

$.game.keydown = function( e ) {
	// game wide keydown
};

/*==============================================================================

Custom

==============================================================================*/

$.game.manageTime = function( dt ) {
	this.dt = dt;
	this.dtMs = this.dt * 1000;
	this.dtNorm = this.dt * 60;

	this.time += this.dt;
	this.timeMs += this.dtMs;
	this.timeNorm += this.dtNorm;
}