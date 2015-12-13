$.hero = function( opt ) { 
	$.merge( this, opt );

	this.stateBlockHeight = $.game.buildHeight / this.levelData.rows;
	this.stateBlockWidth= ( $.game.width / 2 ) / this.levelData.cols;

	this.width = 48;
	this.height = 48;
	this.y = $.game.height - this.height - this.stateBlockHeight;

	if( this.type === 1 ) {
		if( this.levelData.cols % 2 === 0 ) {
			this.position = this.levelData.cols / 2 - 1;
		} else {
			this.position = Math.floor( this.levelData.cols / 2 );
		}
	} else {
		if( this.levelData.cols % 2 === 0 ) {
			this.position = this.levelData.cols / 2;
		} else {
			this.position = Math.floor( this.levelData.cols / 2 );
		}
	}
	this.setXTarget( true );

	this.rowTween = null;
	this.moving = false;
	this.yRender = this.y;

	this.collisionRect = {
		x: 0,
		y: 0,
		w: this.width,
		h: this.height
	};
};

$.hero.prototype.step = function() {
	if( this.type === 1 ) {
		this.yRender = this.y + Math.sin( $.game.time * 3 ) * 6;
	} else {
		this.yRender = this.y + Math.cos( $.game.time * 3 ) * 6;
	}

	this.xLerp();

	this.collisionRect.x = this.x - this.width / 2;
	this.collisionRect.y = this.yRender - this.height / 2;

	this.checkCollisions();
};

$.hero.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.yRender );
	$.ctx.fillStyle( 'red' );
	$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
	$.ctx.restore();

	// render collision box
	//$.ctx.fillStyle( 'hsla(120, 100%, 50%, 1)' );
	//$.ctx.fillRect( this.collisionRect.x, this.collisionRect.y, this.collisionRect.w, this.collisionRect.h );
};

$.hero.prototype.destroy = function() {
	this.collisionRect = null;
	if( this.rowTween ) {
		this.rowTween.end();
	}
};

$.hero.prototype.setXTarget = function( xForce ) {
	if( this.type === 1 ) {
		this.xTarget = this.position * this.stateBlockWidth + this.stateBlockWidth / 2;
	} else {
		this.xTarget = $.game.width / 2 + this.position * this.stateBlockWidth + this.stateBlockWidth / 2;
	}

	if( xForce ) {
		this.x = this.xTarget;
	}
};

$.hero.prototype.move = function() {
	if( this.type === 1 ) {
		if( this.position === 0 ) {
			this.position = this.levelData.cols - 1;
		} else {
			this.position--;
		}
	} else {
		if( this.position === this.levelData.cols - 1 ) {
			this.position = 0;
		} else {
			this.position++;
		}
	}
	this.setXTarget();
};

$.hero.prototype.xLerp = function() {
	// tweak this number to get fair "still" collisions
	// higher number is harder
	this.x += ( this.xTarget - this.x ) * 0.3;
	if( Math.abs( this.xTarget - this.x ) > 1 ) {
		this.moving = true;
	} else {
		this.moving = false;
	}
};

$.hero.prototype.advanceRow = function() {
	if( this.rowTween ) {
		this.rowTween.end();
	}
	this.rowTween = $.game.tween( this ).to(
		{
			y: this.y - $.game.state.blockHeight
		},
		1,
		'outExpo'
	);
};

$.hero.prototype.checkCollisions = function() {
	if( this.moving ) {
		return;
	}
	if( this.type === 1 ) {
		var i = $.game.state.blocks.length;
		while( i-- ) {
			var block = $.game.state.blocks.alive[ i ];
			if( !block.hasLanded ) {
				var r0 = this.collisionRect;
				var r1 = {
					x: block.x,
					y: block.y,
					w: block.width,
					h: block.height
				};
				if( $.colliding( r0, r1 ) ) {
					$.game.state.dead = true;
					$.game.setState( $.statePlay );
					return;
				}
			}
		}
	}
};