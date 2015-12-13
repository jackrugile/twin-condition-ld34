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

	// images
	this.loadImages(
		'overlay1.jpg',
		'overlay2.jpg',
		'overlay3.jpg',
		'overlay4.jpg',
		'overlay5.jpg',
		'overlay6.jpg',
		'specks1.png'
	);

	// sounds
	this.loadSounds(
		'move1'
	);

	this.overlayTimer = {
		current: 0,
		target: 1,
		index: 0,
		max: 5
	};

	this.vignetteGradient = $.ctx.createRadialGradient(
		this.width / 2,
		this.height / 2,
		0,
		this.width / 2,
		this.height / 2,
		this.height
	);
	this.vignetteGradient.addColorStop( 0, 'hsla(0, 0%, 100%, 1)' );
	this.vignetteGradient.addColorStop( 1, 'hsla(0, 0%, 0%, 1)' );
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

$.game.renderOverlay = function() {
	if( this.overlayTimer.current >= this.overlayTimer.target ) {
		if( this.overlayTimer.index === this.overlayTimer.max ) {
			this.overlayTimer.index = 0;
		} else {
			this.overlayTimer.index++;
		}
		this.overlayTimer.current = 0;
	} else {
		this.overlayTimer.current++;
	}

	$.ctx.a( 0.075 );
	$.ctx.drawImage( this.images[ 'overlay' + ( this.overlayTimer.index + 1 ) ], 0, 0 );
	$.ctx.ra();

	$.ctx.save();
	$.ctx.a( 0.75 );
	$.ctx.globalCompositeOperation( 'overlay' );
	$.ctx.drawImage( this.images[ 'specks1' ], 0, 0 );
	$.ctx.restore();

	$.ctx.save();
	$.ctx.globalCompositeOperation( 'overlay' );
	$.ctx.fillStyle( this.vignetteGradient );
	$.ctx.fillRect( 0, 0, this.width, this.height );
	$.ctx.restore();
};