$.stateMenu = {};

$.stateMenu.create = function() {
};

$.stateMenu.enter = function() {
	$.ctx.textBaseline( 'middle' );
	$.ctx.textAlign( 'left' );

	this.titleColor = '#555';
	this.textColor = '#777';

	this.levelSelected = 0;
	this.levelButtons = new $.group();
	this.createLevelButtons();
}

$.stateMenu.leave = function() {
};

$.stateMenu.step = function() {
	this.levelButtons.each( 'step' );
};

$.stateMenu.render = function() {
	$.ctx.clear( '#fff' );

	this.renderLeft();
	this.renderRight();

	this.levelButtons.each( 'render' );

	$.game.renderOverlay();
};

$.stateMenu.mousedown = function( e ) {
	if( e.button === 'left' ) {
		this.cycleLevel();
	} else if( e.button = 'right' ) {
		this.selectLevel();
	}
};

$.stateMenu.keydown = function( e ) {
	if( e.key == 'a' || e.key == 'left' ) {
		this.cycleLevel();
	} else if( e.key == 'd' || e.key == 'right' ) {
		this.selectLevel();
	}
};

$.stateMenu.createLevelButtons = function() {
	var size = 48,
		gap = 130,
		xOffset = $.game.width / 2 + 110,
		yOffset = 158,
		cols = 3,
		rows = 3,
		idx = 0;

	for( var yi =0; yi < rows; yi++ ) {
		for( var xi =0; xi < cols; xi++ ) {
			var x = xOffset + xi * gap,
				y = yOffset + yi * gap,
				width = size,
				height = size,
				color = $.levels[ idx ].color,
				selected = ( idx === this.levelSelected ),
				available = idx < 6,
				completed = idx < 3;

			this.levelButtons.push( new $.levelButton({
				idx: idx,
				x: x,
				y: y,
				width: width,
				height: height,
				color: color,
				selected: selected,
				available: available,
				completed: completed
			}));
			idx++;
		}
	}
}

$.stateMenu.cycleLevel = function() {
	var sound = $.game.playSound( 'select1' );
	$.game.sound.setVolume( sound, 1 );
	$.game.sound.setPlaybackRate( sound, 1 );
	this.levelButtons.getAt( this.levelSelected ).selected = false;
	if( this.levelSelected === 8 ) {
		this.levelSelected = 0;
	} else {
		this.levelSelected++;
	}
	this.levelButtons.getAt( this.levelSelected ).selected = true;
};

$.stateMenu.selectLevel = function() {
};

$.stateMenu.renderLeft = function() {
	// controls bg
	$.ctx.fillStyle( 'hsl(0, 0%, 96%)' );
	$.ctx.fillRect( 0, $.game.unit * 4, $.game.width, $.game.unit * 8 );

	// objectives bg
	$.ctx.fillStyle( 'hsl(0, 0%, 92%)' );
	$.ctx.fillRect( 0, $.game.unit * 12, $.game.width, $.game.unit * 6 );

	// credits bg
	$.ctx.fillStyle( 'hsl(0, 0%, 88%)' );
	$.ctx.fillRect( 0, $.game.unit * 18, $.game.width, $.game.unit * 6 );

	// title text
	$.ctx.font( 'bold 46px nexawf' );
	$.ctx.fillStyle( this.titleColor );
	$.ctx.fillText( 'TWIN', 40, 51 );
	$.ctx.font( 'normal 46px nexawf' );
	$.ctx.fillText( 'CONDITION', 175, 51 );

	// controls text
	$.ctx.font( 'bold 22px nexawf' );
	$.ctx.fillStyle( this.titleColor );
	$.ctx.fillText( 'CONTROLS', 40, $.game.unit * 4 + 40, 1000, 25 );
	$.ctx.font( 'normal 16px nexawf' );
	$.ctx.fillStyle( this.textColor );
	$.ctx.wrappedText( '        A / LEFT ARROW / LEFT CLICK \n                 CYCLE LEVEL \n                 LEFT MOVEMENT \n         D / RIGHT ARROW / RIGHT CLICK \n                 SELECT LEVEL \n                 RIGHT MOVEMENT', 40, $.game.unit * 4 + 64, 1000, 19 );

	// objectives text
	$.ctx.font( 'bold 22px nexawf' );
	$.ctx.fillStyle( this.titleColor );
	$.ctx.fillText( 'OBJECTIVES', 40, $.game.unit * 12 + 44, 1000, 25 );
	$.ctx.font( 'normal 16px nexawf' );
	$.ctx.fillStyle( this.textColor );
	$.ctx.wrappedText( '        AVOID BLOCKS ON THE LEFT \n         SHOOT ENEMIES ON THE RIGHT \n         SURVIVE UNTIL ALL BLOCKS ARE PLACED', 40, $.game.unit * 12 + 68, 1000, 19 );

	// credits text
	$.ctx.font( 'bold 22px nexawf' );
	$.ctx.fillStyle( this.titleColor );
	$.ctx.fillText( 'CREDITS', 40, $.game.unit * 18 + 44, 1000, 25 );
	$.ctx.font( 'normal 16px nexawf' );
	$.ctx.fillStyle( this.textColor );
	$.ctx.wrappedText( '        BUILT FOR LUDUM DARE 34 \n         GROWING / TWO BUTTON CONTROLS \n         MADE BY JACK RUGILE', 40, $.game.unit * 18 + 68, 1000, 19 );
};

$.stateMenu.renderRight = function() {
	// background
	$.ctx.fillStyle( '#333' );
	$.ctx.fillRect( $.game.width / 2, 0, $.game.width / 2, $.game.height );

	// levels
};