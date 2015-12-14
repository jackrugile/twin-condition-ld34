$.stateMenu = {};

$.stateMenu.create = function() {
};

$.stateMenu.enter = function() {
	$.ctx.textBaseline( 'middle' );

	this.titleColor = '#555';
	this.textColor = '#777';

	/*if( $.game.cameFromLevel !== null && $.game.cameFromLevel > -1 ) {
		if( $.game.cameFromLevelWin ) {
			if( $.game.cameFromLevel < 8 ) {
				this.levelSelected = $.game.cameFromLevel + 1;
			} else {
				this.levelSelected = $.game.cameFromLevel;
			}
		} else {
			this.levelSelected = $.game.cameFromLevel;
		}
	} else {
		this.levelSelected = 0;
	}*/

	this.level = Math.min( $.levels.length - 1, $.storage.get( 'level' ) + 1 );
	this.levelSelected = this.level

	$.game.level = this.levelSelected;
	this.levelButtons = new $.group();
	this.createLevelButtons();

	// setup bubbles
	this.bubbles = new $.pool( $.bubble, 200 );
}

$.stateMenu.leave = function() {
	this.bubbles.each( 'destroy' );
	this.bubbles.empty();
	this.bubbles = null;
};

$.stateMenu.step = function() {
	this.levelButtons.each( 'step' );
	this.bubbles.each( 'step' );
};

$.stateMenu.render = function() {
	$.ctx.clear( '#fff' );

	this.renderLeft();
	this.renderRight();

	this.levelButtons.each( 'render' );
	this.bubbles.each( 'render' );

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
		xOffset = $.game.width / 2 + 95,
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
				available = idx <= $.storage.get( 'level' ) + 1,
				completed = idx <= $.storage.get( 'level' );

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
	$.game.sound.setVolume( sound, 0.5 );
	$.game.sound.setPlaybackRate( sound, 1 );
	this.levelButtons.getAt( this.levelSelected ).selected = false;
	if( this.levelSelected === 8 ) {
		this.levelSelected = 0;
	} else {
		this.levelSelected++;
	}

	var levelButtonRef = this.levelButtons.getAt( this.levelSelected );
	levelButtonRef.selected = true;

	for( var i = 0; i < 10; i++ ) {
		$.game.state.bubbles.create({
			x: levelButtonRef.x + $.rand( -36, 36 ),
			y: levelButtonRef.y + $.rand( -36, 36 ),
			radiusBase: $.rand( 1, 4 ),
			growth: $.rand( 0.5, 1 ),
			decay: 0.015,
			hue: $.levels[ this.levelSelected ].color
		});
	}
};

$.stateMenu.selectLevel = function() {
	if( this.levelSelected <= $.storage.get( 'level' ) + 1 ) {
		$.game.level = this.levelSelected;
		$.game.setState( $.statePlay );
	}
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

	$.ctx.textAlign( 'left' );

	// title text
	$.ctx.font( 'bold 43px nexawf' );
	$.ctx.fillStyle( this.titleColor );
	$.ctx.fillText( 'TWIN', 40, 50 );
	$.ctx.font( 'normal 43px nexawf' );
	$.ctx.fillText( 'CONDITION', 170, 50 );

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