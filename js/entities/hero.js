$.hero = function( opt ) { 
	$.merge( this, opt );
	this.rowTween = null;
	this.yRender = this.y;

	this.collisionRect
};

$.hero.prototype.step = function() {
	if( this.type === 1 ) {
		this.yRender = this.y + Math.sin( $.game.time * 4 ) * 8;
	} else {
		this.yRender = this.y + Math.cos( $.game.time * 4 ) * 8;
	}
};

$.hero.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.yRender );
	$.ctx.fillStyle( 'red' );
	$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
	$.ctx.restore();

	// render collision box
	$.ctx.save();
	$.ctx.translate( this.x, this.yRender );
	$.ctx.fillStyle( 'red' );
	$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
	$.ctx.restore();
};

$.hero.prototype.move = function() {

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