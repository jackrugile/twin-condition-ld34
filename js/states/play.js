/*==============================================================================

Core

==============================================================================*/

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
	this.rowHeight =- 
	this.resetRowState();

	// setup blocks
	this.blockTimer = this.levelData.interval;
	this.blocksCreated = 0;
	this.blocksTotal = this.levelData.rows * this.levelData.cols;
	this.blockHeight = $.game.buildHeight / this.levelData.rows;
	this.blocks = new $.pool( $.block, this.blocksTotal * 2 );

	// setup enemies
	this.enemyTimer = 0;
	this.enemies = new $.pool( $.block, 30 );

	// setup heros
	this.hero1 = new $.hero({
		type: 1,
		levelData: this.levelData
	});
	this.hero2 = new $.hero({
		type: 2,
		levelData: this.levelData
	});

	this.dead = false;
}

$.statePlay.leave = function() {
	// clean up data
	this.blocks.each( 'destroy' );
	this.hero1.destroy();
	this.hero2.destroy();

	this.blocks.empty();
	this.enemies.empty();

	this.blocks = null;
	this.enemies = null;
	this.hero1 = null;
	this.hero2 = null;
};

$.statePlay.step = function() {
	this.manageRows();
	this.manageBlocks();
	this.manageEnemies();

	this.blocks.each( 'step' );
	this.hero1.step();
	this.hero2.step();
};

$.statePlay.render = function() {
	$.ctx.clear( '#fff' );
	
	this.blocks.each( 'render' );
	this.hero1.render();
	this.hero2.render();
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

/*==============================================================================

Custom

==============================================================================*/

$.statePlay.manageRows = function() {
	if( 0 ) {

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
	if( this.blockTimer >= this.levelData.interval && !this.rowsCompleted ) {
		// choose row cell
		var cell = this.getRowCell();

		// create block
		this.blocksCreated++;
		var type = 1,
			width = ( $.game.width / 2 ) / this.levelData.cols,
			height = this.blockHeight,
			x = cell * width,
			y = -height,
			xTarget = x,
			yTarget = $.game.height - ( this.rowCurrent ) * height,
			duration = this.levelData.duration,
			durationDec = this.levelData.durationDec,
			number = this.blocksCreated,
			isFinal = ( this.blocksCreated === this.blocksTotal )

		this.blocks.create({
			type: type,
			x: x,
			y: y,
			xTarget: xTarget,
			yTarget: yTarget,
			width: width,
			height: height,
			duration: duration,
			durationDec: durationDec,
			number: number,
			isFinal: isFinal
		});

		// the row is empty, reset it
		if( this.rowState.length === 0 ) {
			this.resetRowState();
		}

		// set timer to overflow time
		this.blockTimer = this.blockTimer - this.levelData.interval;
	}
};

$.statePlay.manageEnemies = function() {
	this.enemyTimer += $.game.dtMs;
	if( this.enemyTimer >= this.levelData.interval ) {
		// create enemy

		// set timer to overflow time
		this.enemyTimer = this.enemyTimer - this.levelData.interval;
	}
};