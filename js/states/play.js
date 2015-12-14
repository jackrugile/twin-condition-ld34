$.statePlay = {};

$.statePlay.create = function() {
};

$.statePlay.enter = function() {
	// get current level
	this.levelCurrent = $.game.level;
	this.levelData = $.levels[ this.levelCurrent - 1 ];

	// setup rows
	this.rowCurrent = 0;
	this.rowState = [];
	this.rowCellCurrent = null;
	this.rowsCompleted = false;
	this.resetRowState();

	// setup blocks
	this.blockTimer = this.levelData.interval.block;
	this.blocksCreated = 0;
	this.blocksTotal = this.levelData.rows * this.levelData.cols;
	this.blockWidth = ( $.game.width / 2 ) / this.levelData.cols;
	this.blockHeight = $.game.buildHeight / this.levelData.rows;
	this.blocks = new $.pool( $.block, this.blocksTotal * 2 );

	// setup enemies
	this.enemyTimer = this.levelData.interval.enemy;
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

	// game status
	this.gamewinFlag = false;
	this.gameoverFlag = false;
	this.gamewinActive = false;
	this.gameoverActive = false;
}

$.statePlay.leave = function() {
	// clean up data
	this.blocks.each( 'destroy' );
	this.enemies.each( 'destroy' );
	this.bullets.each( 'destroy' );
	this.hero1.destroy();
	this.hero2.destroy();

	this.blocks.empty();
	this.enemies.empty();
	this.bullets.empty();

	this.blocks = null;
	this.enemies = null;
	this.bullets = null;
	this.hero1 = null;
	this.hero2 = null;
	this.swapGradient = null;
	this.rightGuideGradient = null;
	this.rightGuideGradient = null;
	this.blockGradient = null;
};

$.statePlay.step = function() {
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
	this.hero1.step();
	this.hero2.step();
};

$.statePlay.render = function() {
	$.ctx.clear( '#fff' );

	this.renderBackground();
	
	this.blocks.each( 'render' );
	this.enemies.each( 'render' );
	this.bullets.each( 'render' );
	this.hero1.render();
	this.hero2.render();


	$.game.renderOverlay();

	this.renderForeground();
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
	this.gamewinActive = true;
	console.log( 'Level Completed' );
};

$.statePlay.gameover = function() {
	this.gameoverActive = true;
	$.game.setState( $.statePlay );
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