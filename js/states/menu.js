$.stateMenu = {};

$.stateMenu.create = function() {
};

$.stateMenu.enter = function() {
	$.ctx.textBaseline( 'top' );
	$.ctx.textAlign( 'left' );
}

$.stateMenu.leave = function() {
};

$.stateMenu.step = function() {
};

$.stateMenu.render = function() {
	$.ctx.clear( '#fff' );

	this.renderText();
	this.renderLevels();

	$.game.renderOverlay();
};

$.stateMenu.mousedown = function( e ) {
	if( e.button === 'left' ) {
		this.advanceLevel();
	} else if( e.button = 'right' ) {
		this.selectLevel();
	}
};

$.stateMenu.keydown = function( e ) {
	if( e.key == 'a' || e.key == 'left' ) {
		this.advanceLevel();
	} else if( e.key == 'd' || e.key == 'right' ) {
		this.selectLevel();
	}
};

$.stateMenu.advanceLevel = function() {
	var sound = $.game.playSound( 'select1' );
	$.game.sound.setVolume( sound, 1 );
	$.game.sound.setPlaybackRate( sound, 1 );
	//$.game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.2 ) );
};

$.stateMenu.selectLevel = function() {
};

$.stateMenu.renderText = function() {
	// title
	$.ctx.font( '32px uni0553wf' );

	// controls

};

$.stateMenu.renderLevels = function() {
	// background
	$.ctx.fillStyle( '#333' );
	$.ctx.fillRect( $.game.width / 2, 0, $.game.width / 2, $.game.height );

	// levels
};