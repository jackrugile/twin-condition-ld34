$.bullet = function( opt ) {};

$.bullet.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.alpha = 0;
	this.alphaTween = $.game.tween( this ).to(
		{
			alpha: 1
		},
		0.25,
		'inOutQuad'
	);
	this.moveTween = $.game.tween( this ).to(
		{
			y: this.yTarget
		},
		this.duration / 1000,
		'outQuad'
	);

	this.polygon = [
		{ x: this.width / 2, y: 0 },
		{ x: this.width, y: this.height * 0.25 },
		{ x: this.width / 2, y: this.height },
		{ x: 0, y: this.height * 0.25 }
	];
};

$.bullet.prototype.step = function() {
	if( this.y + this.height < 0 ) {
		this.destroy();
		$.game.state.bullets.release( this );
		return;
	}

	var i = $.game.state.enemies.length;
	while( i-- ) {
		var enemy = $.game.state.enemies.alive[ i ],
			r0 = {
				x: this.x,
				y: this.y,
				w: this.width,
				h: this.height
			},
			r1 = {
				x: enemy.x,
				y: enemy.y,
				w: enemy.width,
				h: enemy.height
			};
		if( $.colliding( r0, r1 ) ) {
			this.destroy();
			$.game.state.bullets.release( this );
			enemy.explode();
			enemy.destroy();
			$.game.state.enemies.release( enemy );
		}
	}
};

$.bullet.prototype.render = function() {
	$.ctx.a( this.alpha );
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.fillStyle( '#fff' );
	$.polygon( this.polygon );
	$.ctx.fill();
	$.ctx.restore();
	$.ctx.ra();
};

$.bullet.prototype.destroy = function() {
	if( this.moveTween ) {
		this.moveTween.end();
	}

	if( this.alphaTween ) {
		this.alphaTween.end();
	}
}