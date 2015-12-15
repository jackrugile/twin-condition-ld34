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

	
	this.shootInterval = 300;
	this.shootTimer = this.shootInterval;

	this.collisionRect = {
		x: 10,
		y: 10,
		w: this.width - 20,
		h: this.height - 20
	};
};

$.hero.prototype.step = function() {
	if( $.game.state.tick % 20 === 0 ) {
		$.game.state.bubbles.create({
			x: this.x + $.rand( -24, 24 ),
			y: this.y + $.rand( -24, 24 ),
			radiusBase: $.rand( 2, 5 ),
			growth: $.rand( 0.5, 1 ),
			decay: 0.005,
			hue: this.levelData.color
		});
	}

	if( this.type === 1 ) {
		this.yRender = this.y + Math.sin( $.game.time * 3.5 ) * 6;
	} else {
		this.yRender = this.y + Math.sin( $.game.time * 3.5 ) * 6;
		this.manageBullets();
	}

	if( !$.game.state.gamewinFlag && !$.game.state.gameoverFlag ) {
		this.xLerp();

		this.collisionRect.x = this.x - this.width / 2 + 10;
		this.collisionRect.y = this.yRender - this.height / 2 + 10;

		this.checkCollisions();
	}

	if( $.game.state.gamewinFlag ) {
		if( this.rowTween ) {
			this.rowTween.stop();
		}

		if( $.game.state.tick % 10 === 0 ) {
			$.game.state.particles.create({
				x: this.x,
				y: this.y,
				vx: $.rand( -3, 3 ),
				vy: $.rand( -3, 3 ),
				radiusBase: $.rand( 3, 7 ),
				growth: $.rand( 0.5, 1 ),
				decay: 0.005,
				hue: $.game.state.levelData.color,
				grow: false
			});
		}

		if( !this.gamewinTween ) {
			this.gamewinTween = $.game.tween( this ).to(
				{
					x: $.game.width / 2,
					y: $.game.height / 3
				},
				0.75,
				'inOutExpo'
			);
		}
	}

	if( $.game.state.gameoverFlag ) {
		if( this.rowTween ) {
			this.rowTween.stop();
		}

		if( !this.gameoverTween ) {
			this.gameoverTween = $.game.tween( this ).to(
				{
					y: $.game.height + 100
				},
				1,
				'inBack'
			);
		}
	}
};

$.hero.prototype.render = function() {
	$.ctx.save();
		$.ctx.translate( this.x, this.yRender );
		$.ctx.rotate( Math.cos( $.game.time * 3.5 ) * 0.15 + Math.PI / 4 );
		if( this.type === 1 ) {
			$.ctx.fillStyle( 'hsl(' + this.levelData.color + ', 50%, 55%)' );
		} else {
			$.ctx.fillStyle( '#fff' );
		}

		// draw body
		$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );

		// draw eyes
		if( this.type === 1 ) {
			$.ctx.fillStyle( '#fff' );
		} else {
			$.ctx.fillStyle( 'hsl(' + this.levelData.color + ', 50%, 55%)' );
		}
		$.ctx.fillRect( -8 - 3, 8 - 3, 6, 6 );
		$.ctx.fillRect( 8 - 3, -8 - 3, 6, 6 );

		// draw tentacles
		if( this.type === 1 ) {
			$.ctx.fillStyle( 'hsl(' + this.levelData.color + ', 50%, 55%)' );
		} else {
			$.ctx.fillStyle( '#fff' );
		}

		// center
		$.ctx.save();
			$.ctx.translate( this.width / 2, this.height / 2 );
			$.ctx.rotate( Math.sin( $.game.time * 3.5 ) * 0.25 );
			$.polygon([
				{ x: -5, y: -10 },
				{ x: 6, y: 6 },
				{ x: -10, y: -5 }
			]);
			$.ctx.fill();
		$.ctx.restore();

		// left
		$.ctx.save();
			$.ctx.translate( this.width / 2 - 28, this.height / 2 );
			$.ctx.rotate( Math.sin( $.game.time * 3.5 ) * 0.25 );
			$.polygon([
				{ x: -5, y: -10 },
				{ x: 10, y: 10 },
				{ x: -10, y: -5 }
			]);
			$.ctx.fill();
		$.ctx.restore();

		// right
		$.ctx.save();
			$.ctx.translate( this.width / 2, this.height / 2 - 28 );
			$.ctx.rotate( Math.sin( $.game.time * 3.5 ) * 0.25 );
			$.polygon([
				{ x: -5, y: -10 },
				{ x: 10, y: 10 },
				{ x: -10, y: -5 }
			]);
			$.ctx.fill();
		$.ctx.restore();

	$.ctx.restore();

	//$.ctx.fillStyle( 'hsla(120, 100%, 50%, 0.25)' );
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
	if( !$.game.state.gameoverFlag && !$.game.state.gamewinFlag ) {
		var sound = $.game.playSound( 'move1' );
		$.game.sound.setVolume( sound, 1.3 );
		$.game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.2 ) );
	}

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
	this.x += ( this.xTarget - this.x ) * 0.3;
	// tweak this number to get fair "still" collisions
	// higher number is harder
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
				var r0 = this.collisionRect,
					r1 = {
						x: block.x,
						y: block.y,
						w: block.width,
						h: block.height
					};
				if( $.colliding( r0, r1 ) && !$.game.state.gamewinFlag ) {
					$.game.state.gameoverFlag = true;
					return;
				}
			}
		}
	} else {
		var i = $.game.state.enemies.length;
		while( i-- ) {
			var enemy = $.game.state.enemies.alive[ i ],
				r0 = this.collisionRect,
				r1 = {
					x: enemy.x,
					y: enemy.y,
					w: enemy.width,
					h: enemy.height
				};
			if( $.colliding( r0, r1 ) && !$.game.state.gamewinFlag ) {
				$.game.state.gameoverFlag = true;
				return;
			}
		}
	}
};

$.hero.prototype.manageBullets = function() {
	if( !$.game.state.gamewinFlag && !$.game.state.gameoverFlag ) {
		this.shootTimer += $.game.dtMs;
		if( this.shootTimer >= this.shootInterval ) {
			var sound = $.game.playSound( 'shoot1' );
			$.game.sound.setVolume( sound, 0.4 );
			$.game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.2 ) );
			$.game.state.bullets.create({
				x: this.x - 4,
				y: this.y,
				yTarget: this.y - $.game.height,
				width: 8,
				height: 8 * 2.5,
				duration: 1800
			});

			// set timer to overflow time
			this.shootTimer = this.shootTimer - this.shootInterval;
		}
	}
};