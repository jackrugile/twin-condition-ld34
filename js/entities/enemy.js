$.enemy = function( opt ) {};

$.enemy.prototype.init = function( opt ) {
	$.merge( this, opt );

	this.moveTween = $.game.tween( this ).to(
		{
			y: this.yTarget
		},
		this.duration / 1000,
		'linear'
	);

	this.polygon = [
		{ x: this.width / 2, y: 0 },
		{ x: this.width, y: this.height * 0.75 },
		{ x: this.width / 2, y: this.height },
		{ x: 0, y: this.height * 0.75 }
	];
};

$.enemy.prototype.step = function() {
	if( this.y + this.height >= $.game.height ) {
		$.game.state.gameoverFlag = true;
		return;
	}

	if( $.game.state.gameoverFlag || $.game.state.gamewinFlag ) {
		this.destroy();
		$.game.state.enemies.release( this );
		return
	}

	var i = $.game.state.blocks.length;
	while( i-- ) {
		var block = $.game.state.blocks.alive[ i ];
		if( !block.hasLanded ) {
			var r0 = {
					x: this.x,
					y: this.y,
					w: this.width,
					h: this.height
				},
				r1 = {
					x: block.x,
					y: block.y,
					w: block.width,
					h: block.height
				};
			if( $.colliding( r0, r1 ) ) {
				$.game.state.gameoverFlag = true;
				return;
			}
		}
	}
};

$.enemy.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.fillStyle( '#fff' );
	$.polygon( this.polygon );
	$.ctx.fill();
	$.ctx.restore();
};

$.enemy.prototype.destroy = function() {
	if( this.moveTween ) {
		this.moveTween.end();
	}
}