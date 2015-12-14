$.levelButton = function( opt ) { 
	$.merge( this, opt );
	this.yBase = this.y;
	this.oscOffset = this.idx * 1;
	this.scale = 1;
	this.scaleBase = 1;
	this.scaleTarget = 1.3;
};

$.levelButton.prototype.step = function() {
	this.y = this.yBase + Math.sin( $.game.time * 2.5 + this.oscOffset ) * 3;

	if( this.selected ) {
		this.scale += ( this.scaleTarget - this.scale ) * 0.3;
	} else {
		this.scale += ( this.scaleBase - this.scale ) * 0.3;
	}
};

$.levelButton.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.scale( this.scale, this.scale );
	$.ctx.rotate( Math.cos( $.game.time * 2.5 + this.oscOffset ) * 0.1 + Math.PI / 4 );

	if( this.selected ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.2)' );
		$.ctx.fillRect( -this.width / 2 - 8, -this.height / 2 - 8, this.width + 16, this.height + 16 );
	}

	if( this.available ) {
		$.ctx.a(1);
	} else {
		$.ctx.a( 0.1 );
	}

	$.ctx.font( 'bold 22px nexawf' );
	$.ctx.textAlign( 'center' );
	if( this.completed ) {
		$.ctx.fillStyle( '#fff' );
		$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
		$.ctx.save();
		$.ctx.rotate( -Math.PI / 4 );
		$.ctx.fillStyle( '#444' );
		$.ctx.fillText( this.idx + 1, 0, 2 );
		$.ctx.restore();
	} else {
		$.ctx.lineWidth( 4 );
		$.ctx.strokeStyle( '#fff' );
		$.ctx.strokeRect( -this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4 );
		$.ctx.save();
		$.ctx.rotate( -Math.PI / 4 );
		$.ctx.fillStyle( '#fff' );
		$.ctx.fillText( this.idx + 1, 0, 2 );
		$.ctx.restore();
	}

	$.ctx.ra();

	$.ctx.restore();
};

$.levelButton.prototype.destroy = function() {

};