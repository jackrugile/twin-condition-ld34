$.bubble = function( opt ) {};

$.bubble.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.life = 1;
	this.radius = this.radiusBase;
	this.alphaBase = $.rand( 0.25, 0.75 );
	this.saturation = 80;
	this.vx = 0;
	this.vy = -1;
};

$.bubble.prototype.step = function() {
	this.vy -= 0.015;
	this.vx += $.rand( -0.05, 0.05 );

	this.x += this.vx;
	this.y += this.vy;


	this.life -= this.decay;

	if( this.life <= 0 ) {
		$.game.state.bubbles.release( this );
	}
};

$.bubble.prototype.render = function() {
	/*$.ctx.fillStyle( 'hsla(' + this.hue + ', ' + this.saturation + '%, 70%, ' + ( this.life * this.alphaBase ) + ')' );
	$.ctx.beginPath();
	$.ctx.arc( this.x - this.radius / 2, this.y - this.radius / 2, this.radius, 0, Math.PI * 2 );
	$.ctx.fill();*/

	$.ctx.strokeStyle( 'hsla(' + this.hue + ', ' + this.saturation + '%, 70%, ' + ( this.life * this.alphaBase ) + ')' );
	$.ctx.beginPath();
	$.ctx.arc( this.x - this.radius / 2, this.y - this.radius / 2, this.radius, 0, Math.PI * 2 );
	$.ctx.stroke();
};

$.bubble.prototype.destroy = function() {

}