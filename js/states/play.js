$.statePlay = {};

$.statePlay.create = function() {
};

$.statePlay.enter = function() {
	// get current level
	this.levelCurrent = $.game.level;
	this.levelData = $.levels[ this.levelCurrent ];
	this.progress = 0;
	this.progressDisplay = 0;

	// setup rows
	this.rowCurrent = 0;
	this.rowState = [];
	this.rowCellCurrent = null;
	this.rowsCompleted = false;
	this.resetRowState();

	// setup blocks
	this.blockTimer = 0;
	this.blocksCreated = 0;
	this.blocksTotal = this.levelData.rows * this.levelData.cols;
	this.blockWidth = ( $.game.width / 2 ) / this.levelData.cols;
	this.blockHeight = $.game.buildHeight / this.levelData.rows;
	this.blocks = new $.pool( $.block, this.blocksTotal * 2 );

	// setup enemies
	this.enemyTimer = 0;
	this.enemiesCreated = 0;
	this.enemies = new $.pool( $.enemy, this.blocksTotal * 2 );

	// setup bullets
	this.bullets = new $.pool( $.bullet, 100 );

	// setup heros
	this.hero1 = new $.hero({
		type: 1,
		levelData: this.levelData
	});
	this.hero2 = new $.hero({
		type: 2,
		levelData: this.levelData
	});

	// setup right color gradient
	this.swapGradient = $.ctx.createRadialGradient(
		$.game.width * 1,
		$.game.height * 0.5,
		0,
		$.game.width * 1,
		$.game.height * 0.5,
		$.game.width * 0.8
	);
	this.swapGradient.addColorStop( 0, 'hsla(' + ( this.levelData.color + 120 ) + ', 100%, 50%, 1)' );
	this.swapGradient.addColorStop( 1, 'hsla(' + ( this.levelData.color + 120 ) + ', 100%, 50%, 0)' );

	// setup left guide gradient
	this.leftGuideGradient = $.ctx.createLinearGradient(
		0,
		0,
		0,
		$.game.height
	);
	this.leftGuideGradient.addColorStop( 0, 'hsla(' + this.levelData.color + ', 60%, 80%, 0)' );
	this.leftGuideGradient.addColorStop( 0.666, 'hsla(' + this.levelData.color + ', 60%, 80%, 1)' );
	this.leftGuideGradient.addColorStop( 1, 'hsla(' + this.levelData.color + ', 60%, 80%, 0)' );

	// setup left guide gradient
	this.rightGuideGradient = $.ctx.createLinearGradient(
		0,
		0,
		0,
		$.game.height
	);
	this.rightGuideGradient.addColorStop( 0, 'hsla(' + this.levelData.color + ', 50%, 55%, 0)' );
	this.rightGuideGradient.addColorStop( 0.666, 'hsla(' + this.levelData.color + ', 50%, 55%, 1)' );
	this.rightGuideGradient.addColorStop( 1, 'hsla(' + this.levelData.color + ', 50%, 55%, 0)' );

	// setup block colors
	this.leftBlockLight = 'hsl(' + this.levelData.color + ', 50%, 70%)';
	this.leftBlockDark = 'hsl(' + this.levelData.color + ', 50%, 60%)';
	this.rightBlockLight = 'hsl(' + ( this.levelData.color ) + ', 50%, 85%)';
	this.rightBlockDark = 'hsl(' + ( this.levelData.color ) + ', 50%, 75%)';

	// setup block gradient
	this.blockGradient = $.ctx.createLinearGradient(
		this.blockWidth,
		0,
		0,
		this.blockHeight
	);
	this.blockGradient.addColorStop( 0, 'hsla(0, 0%, 100%, 0.3)' );
	this.blockGradient.addColorStop( 1, 'hsla(0, 0%, 100%, 0)' );

	// setup particles
	this.particles = new $.pool( $.particle, 200 );

	// setup bubbles
	this.bubbles = new $.pool( $.bubble, 200 );

	// screen shake
	this.shake = {
		translate: 0,
		rotate: 0
	};

	// game status
	this.gamewinFlag = false;
	this.gameoverFlag = false;
	this.gamewinActive = false;
	this.gameoverActive = false;

	this.tick = 0;
	this.endTick = 0;
}

$.statePlay.leave = function() {
	// clean up data
	this.blocks.each( 'destroy' );
	this.enemies.each( 'destroy' );
	this.bullets.each( 'destroy' );
	this.particles.each( 'destroy' );
	this.bubbles.each( 'destroy' );
	this.hero1.destroy();
	this.hero2.destroy();

	this.blocks.empty();
	this.enemies.empty();
	this.bullets.empty();
	this.particles.empty();
	this.bubbles.empty();

	this.blocks = null;
	this.enemies = null;
	this.bullets = null;
	this.particles = null;
	this.bubbles = null;
	this.hero1 = null;
	this.hero2 = null;
	this.swapGradient = null;
	this.rightGuideGradient = null;
	this.rightGuideGradient = null;
	this.blockGradient = null;
};

$.statePlay.step = function() {
	this.handleScreenShake();

	if( this.gamewinFlag && !this.gamewinActive ) {
		this.gamewin();
	}

	if( this.gameoverFlag && !this.gameoverActive ) {
		this.gameover();
	}

	this.manageBlocks();
	this.manageEnemies();

	this.blocks.each( 'step' );
	this.enemies.each( 'step' );
	this.bullets.each( 'step' );
	this.particles.each( 'step' );
	this.bubbles.each( 'step' );
	this.hero1.step();
	this.hero2.step();

	if( this.gameoverFlag || this.gamewinFlag ) {
		this.endTick++;
	}

	this.progressDisplay += ( this.progress - this.progressDisplay ) * 0.1;

	this.tick++;
};

$.statePlay.render = function() {
	this.renderBackground();

	$.ctx.save();
		if( !this.paused && ( this.shake.translate || this.shake.rotate ) ) {
			$.ctx.translate( $.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ), $.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ) );
			$.ctx.rotate( $.rand( -this.shake.rotate, this.shake.rotate ) );
			$.ctx.translate( -$.game.width / 2 + $.rand( -this.shake.translate, this.shake.translate ) , -$.game.height / 2 + $.rand( -this.shake.translate, this.shake.translate ));
		}

		this.blocks.each( 'render' );
		this.enemies.each( 'render' );
		this.bullets.each( 'render' );
		this.particles.each( 'render' );
		this.bubbles.each( 'render' );
		this.hero1.render();
		this.hero2.render();
	$.ctx.restore();

	this.renderProgress();

	$.game.renderOverlay();
	if( window.chrome ) {
		this.renderForeground();
	}

	this.renderEnd();
};

$.statePlay.mousedown = function( e ) {
	if( e.button === 'left' ) {
		this.hero1.move();
	} else if( e.button = 'right' ) {
		this.hero2.move();
	}
};

$.statePlay.keydown = function( e ) {
	if( e.key == 'a' || e.key == 'left' ) {
		this.hero1.move();
	} else if( e.key == 'd' || e.key == 'right' ) {
		this.hero2.move();
	}
};


$.statePlay.handleScreenShake = function() {
	if( this.shake.translate > 0 ) {
		this.shake.translate *= 0.92;
	}

	if( this.shake.rotate > 0 ) {
		this.shake.rotate *= 0.92;
	}
};

$.statePlay.getRowCell = function() {
	var cell = this.rowState.splice( $.randInt( 0, this.rowState.length - 1 ), 1 );
	return cell[ 0 ];
}

$.statePlay.resetRowState = function() {
	if( this.rowCurrent < this.levelData.rows ) {
		this.rowCurrent++;
		this.rowState.length = 0;
		for( var i = 0; i < this.levelData.cols; i++ ) {
			this.rowState.push( i );
		}
	} else {
		this.rowsCompleted = true;
	}
};

$.statePlay.manageBlocks = function() {
	this.blockTimer += $.game.dtMs;
	if( this.blockTimer >= this.levelData.interval.block && !this.rowsCompleted ) {
		// choose row cell
		var cell = this.getRowCell();

		// create block
		this.blocksCreated++;
		var type = 1,
			width = this.blockWidth,
			height = this.blockHeight,
			x = cell * width,
			y = -height,
			yTarget = $.game.height - ( this.rowCurrent ) * height,
			duration = this.levelData.duration.block,
			number = this.blocksCreated,
			isFinal = ( this.blocksCreated === this.blocksTotal );

		var color,
			colorChange;

		if( this.rowCurrent % 2 === 0 ) {
			if( cell % 2 === 0) {
				color = this.leftBlockLight;
				colorChange = this.rightBlockLight;
			} else {
				color = this.leftBlockDark;
				colorChange = this.rightBlockDark;
			}
		} else {
			if( cell % 2 !== 0) {
				color = this.leftBlockLight;
				colorChange = this.rightBlockLight;
			} else {
				color = this.leftBlockDark;
				colorChange = this.rightBlockDark;
			}
		}

		this.blocks.create({
			type: type,
			color: color,
			colorChange: colorChange,
			x: x,
			y: y,
			yTarget: yTarget,
			width: width,
			height: height,
			duration: duration,
			number: number,
			isFinal: isFinal
		});

		// the row is empty, reset it
		if( this.rowState.length === 0 ) {
			this.resetRowState();
		}

		// set timer to overflow time
		this.blockTimer = this.blockTimer - this.levelData.interval.block;
	}
};

$.statePlay.manageEnemies = function() {
	this.enemyTimer += $.game.dtMs;
	if( this.enemyTimer >= this.levelData.interval.enemy && !this.gameoverFlag && !this.gamewinFlag ) {
		// choose random row cell
		var cell = $.randInt( 0, this.levelData.cols - 1 )

		// create enemy
		this.enemiesCreated++;
		var width = this.blockWidth / 5,
			height = width * 2.5,
			x = ( $.game.width / 2 ) + cell * this.blockWidth + this.blockWidth / 2 - width / 2,
			y = -height,
			yTarget = $.game.height,
			duration = this.levelData.duration.enemy;

		this.enemies.create({
			x: x,
			y: y,
			yTarget: yTarget,
			width: width,
			height: height,
			duration: duration
		});

		// set timer to overflow time
		this.enemyTimer = this.enemyTimer - this.levelData.interval.enemy;
	}
};

$.statePlay.gamewin = function() {
	var sound = $.game.playSound( 'gamewin1' );
	$.game.sound.setVolume( sound, 0.8 );
	$.game.sound.setPlaybackRate( sound, 1 );
	this.gamewinActive = true;
	$.game.cameFromLevel = this.levelCurrent;
	$.game.cameFromLevelWin = true;
	if( this.levelCurrent > $.storage.get( 'level' ) ) {
		$.storage.set( 'level', this.levelCurrent );
	}
	setTimeout( function() {
		$.game.setState( $.stateMenu );
	}, 2000 );
};

$.statePlay.gameover = function() {
	var sound = $.game.playSound( 'gameover1' );
	$.game.sound.setVolume( sound, 0.8 );
	$.game.sound.setPlaybackRate( sound, 1 );
	this.gameoverActive = true;
	$.game.cameFromLevel = this.levelCurrent;
	$.game.cameFromLevelWin = false;
	$.game.state.shake.translate += 3;
	$.game.state.shake.rotate += 0.02;
	setTimeout( function() {
		$.game.setState( $.stateMenu );
	}, 2000 );
};

$.statePlay.renderBackground = function() {
	// render left column panels
	var leftLight = 'hsl(0, 0%, 100%)',
		leftDark ='hsl(' +  this.levelData.color + ', 50%, 95%)';
	for( var i = 0; i < this.levelData.cols; i++ ) {
		if( this.levelData.cols % 2 === 0 ) {
			if( i % 2 === 0 ) {
				$.ctx.fillStyle( leftLight );
			} else {
				$.ctx.fillStyle( leftDark );
			}
		} else {
			if( i % 2 === 0 ) {
				$.ctx.fillStyle( leftDark );
			} else {
				$.ctx.fillStyle( leftLight );
			}
		}
		$.ctx.fillRect( this.blockWidth * i, 0, this.blockWidth, $.game.height );
	}

	// render right column panels
	for( var i = 0; i < this.levelData.cols; i++ ) {
		if( i % 2 === 0 ) {
			$.ctx.fillStyle( 'hsl(' +  this.levelData.color + ', 50%, 45%)' );
		} else {
			$.ctx.fillStyle( 'hsl(' +  this.levelData.color + ', 50%, 50%)' );
		}
		$.ctx.fillRect( $.game.width / 2 + this.blockWidth * i, 0, this.blockWidth, $.game.height );
	}

	// render left build line
	$.ctx.fillStyle( 'hsla(' + this.levelData.color + ', 60%, 80%, 1)' );
	$.ctx.fillRect( 0, $.game.height - $.game.buildHeight, $.game.width / 2, 2 );

	// render right build line
	$.ctx.fillStyle( 'hsla(' + this.levelData.color + ', 50%, 55%, 1)' );
	$.ctx.fillRect( $.game.width / 2, $.game.height - $.game.buildHeight, $.game.width / 2, 2 );

	// render left guide lines
	$.ctx.fillStyle( this.leftGuideGradient );
	for( var i = 0; i < this.levelData.cols; i++ ) {
		$.ctx.save();
		$.ctx.translate( i * this.blockWidth + this.blockWidth / 2, 0 );
		$.ctx.fillRect( -1, 0, 2, $.game.height );
		$.ctx.restore();
	}

	// render right guide lines
	$.ctx.fillStyle( this.rightGuideGradient );
	for( var i = 0; i < this.levelData.cols; i++ ) {
		$.ctx.save();
		$.ctx.translate( $.game.width / 2 + i * this.blockWidth + this.blockWidth / 2, 0 );
		$.ctx.fillRect( -1, 0, 2, $.game.height );
		$.ctx.restore();
	}
};

$.statePlay.renderForeground = function() {
	// right color gradient
	$.ctx.save();
	$.ctx.globalCompositeOperation( 'color' );
	$.ctx.fillStyle( this.swapGradient );
	$.ctx.fillRect( 0, 0, $.game.width, $.game.height );
	$.ctx.restore();
};

$.statePlay.renderEnd = function() {
	if( this.gameoverFlag || this.gamewinFlag ) {
		if( this.gameoverFlag ) {
			$.ctx.fillStyle( '#f00' );
		} else if( this.gamewinFlag ) {
			$.ctx.fillStyle( '#fff' );
		}
		$.ctx.save();
		$.ctx.a( Math.min( 1, this.endTick / 100 ) );
		$.ctx.globalCompositeOperation( 'color' );
		$.ctx.fillRect( 0, 0, $.game.width, $.game.height );
		$.ctx.restore();
	}
};

$.statePlay.renderProgress = function() {
	$.ctx.font( 'bold 14px nexawf' );
	$.ctx.textAlign( 'right' );
	$.ctx.textBaseline( 'middle' );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillText( Math.ceil( this.progressDisplay * 100 ) + '%', $.game.width - 19, 25 );
};
