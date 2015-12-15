$.block = function( opt ) {};

$.block.prototype.init = function( opt ) {
	$.merge( this, opt );

	if( this.type === 1 ) {
		this.alpha = 1;
		this.moveTween = $.game.tween( this ).to(
			{
				y: this.yTarget
			},
			this.duration / 1000,
			'linear'
		);
		this.moveTween.on( 'finished', this.land.bind( this ) );
	} else {
		this.alpha = 0;
		this.alphaTween = $.game.tween( this ).to(
			{
				alpha: 1
			},
			0.5,
			'linear'
		);
	}

	this.hasLanded = 0;
	this.landTick = 0;
	this.landTickMax = 40;
};

$.block.prototype.step = function() {
	if( $.game.state.gameoverFlag ) {
		if( this.moveTween ) {
			this.moveTween.stop();
		}
		if( !this.moveTween2 ) {
			this.moveTween2 = $.game.tween( this ).to(
				{
					y: -100
				},
				1,
				'inOutExpo'
			);
		}
	}
};

$.block.prototype.render = function() {
	$.ctx.a( this.alpha );

	// render main block
	$.ctx.fillStyle( this.color );
	$.ctx.fillRect( this.x, this.y, this.width, this.height );

	// render highlight
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.fillStyle ( $.game.state.blockGradient );
	$.polygon([
		{ x: 0, y: 0 },
		{ x: this.width, y: 0 },
		{ x: 0, y: this.height }
	]);
	$.ctx.fill();
	$.ctx.restore();

	$.ctx.ra();

	// render land light
	if( this.landTick ) {
		$.ctx.save();
		$.ctx.a( this.landTick / this.landTickMax );
		if( window.chrome ) {
			$.ctx.globalCompositeOperation( 'overlay' );
		}
		$.ctx.fillStyle( '#fff' );
		$.ctx.fillRect( this.x, this.y, this.width, this.height );
		$.ctx.restore();
		this.landTick--;
	}
};

$.block.prototype.destroy = function() {
	if( this.moveTween ) {
		this.moveTween.end();
	}

	if( this.alphaTween ) {
		this.alphaTween.end();
	}
}

$.block.prototype.land = function() {
	if( this.type === 1 && !$.game.state.gameoverFlag && !$.game.state.gamewinFlag ) {
		$.game.state.progress = this.number / $.game.state.blocksTotal;

		var sound = $.game.playSound( 'block1' );
		$.game.sound.setVolume( sound, 0.7 );
		$.game.sound.setPlaybackRate( sound, 0.4 + $.game.state.progress * 0.6 );

		if( this.number % $.game.state.levelData.cols === 0 ) {
			$.game.state.hero1.advanceRow();
			$.game.state.hero2.advanceRow();
		}

		$.game.state.blocks.create({
			type: 2,
			color: this.colorChange,
			x: this.x + $.game.width / 2,
			y: this.y,
			width: this.width,
			height: this.height
		});
		if( this.isFinal && !$.game.state.gameoverFlag ) {
			$.game.state.gamewinFlag = true;
		}

		for( var i = 0; i < 15; i++ ) {
			$.game.state.particles.create({
				x: this.x + $.rand( 0, this.width ),
				y: this.y + $.rand( 0, this.height ),
				vx: $.rand( -1, 1 ),
				vy: $.rand( -2, 2 ),
				radiusBase: $.rand( 3, 7 ),
				growth: $.rand( 0.5, 1 ),
				decay: 0.005,
				hue: $.game.state.levelData.color,
				grow: false
			});
		}

		$.game.state.shake.translate += 3;
		$.game.state.shake.rotate += 0.02;

		this.landTick = this.landTickMax;

		this.hasLanded = 1;
	}
};