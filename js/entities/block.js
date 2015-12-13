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
};

$.block.prototype.step = function() {
};

$.block.prototype.render = function() {
	$.ctx.a( this.alpha );

	// render main block
	$.ctx.fillStyle ( this.color );
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
	if( this.type === 1 && !$.game.state.gameoverFlag ) {
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
		if( this.isFinal ) {
			$.game.state.gamewinFlag = true;
		}

		this.hasLanded = 1;
	}
};