$.block = function( opt ) {};

$.block.prototype.init = function( opt ) {
	$.merge( this, opt );

	if( this.type === 1 ) {
		this.alpha = 1;
		this.moveTween = $.game.tween( this ).to(
			{
				x: this.xTarget,
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
			1,
			'linear'
		);
	}
};

$.block.prototype.step = function() {
};

$.block.prototype.render = function() {
	$.ctx.a( this.alpha );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillRect( this.x, this.y, this.width, this.height );
	$.ctx.fillStyle( '#000' );
	$.ctx.fillRect( this.x + 1, this.y + 1, this.width - 2, this.height - 2 );
	$.ctx.ra();
};

$.block.prototype.land = function() {
	if( this.type === 1 ) {

		if( this.number % $.game.state.levelData.cols === 0 ) {
			$.game.state.hero1.advanceRow();
			$.game.state.hero2.advanceRow();
		}

		$.game.state.blocks.create({
			type: 2,
			x: this.x + $.game.width / 2,
			y: this.y,
			width: this.width,
			height: this.height
		});
		if( this.isFinal ) {
			console.log( 'Level Completed' );
		}
	}
};