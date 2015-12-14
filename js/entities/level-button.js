$.levelButton = function( opt ) { 
	$.merge( this, opt );
	//this.yBase = this.y;
	//this.yTarget = this.y - 10;
	this.scale = 1;
	this.scaleBase = 1;
	this.scaleTarget = 1.3;
};

$.levelButton.prototype.step = function() {
	if( this.selected ) {
		//this.y += ( this.yTarget - this.y ) * 0.3;
		this.scale += ( this.scaleTarget - this.scale ) * 0.3;
	} else {
		//this.y += ( this.yBase - this.y ) * 0.3;
		this.scale += ( this.scaleBase - this.scale ) * 0.3;
	}
};

$.levelButton.prototype.render = function() {
	$.ctx.save();
	$.ctx.translate( this.x, this.y );
	$.ctx.scale( this.scale, this.scale );
	$.ctx.rotate( Math.PI / 4 );

	if( this.selected ) {
		$.ctx.fillStyle( 'hsla(0, 0%, 100%, 0.2)' );
		$.ctx.fillRect( -this.width / 2 - 8, -this.height / 2 - 8, this.width + 16, this.height + 16 );
	}

	if( this.available ) {
		$.ctx.fillStyle( '#fff' );
		$.ctx.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
	} else {
		$.ctx.lineWidth( 4 );
		$.ctx.strokeStyle( '#fff' );
		$.ctx.strokeRect( -this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4 );
	}

	$.ctx.restore();
};

$.levelButton.prototype.destroy = function() {

};