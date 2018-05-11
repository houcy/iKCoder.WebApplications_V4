var GAME = GAME || {};

//初始化疯狂模式时的背景
GAME.JoyBackground = function()
{
	PIXI.DisplayObjectContainer.call( this );
	this.width = 1000;
	this.scrollPosition = 1500;
	var SCALE =1// 0.5
	this.swoosh = new GAME.BackgroundElement(PIXI.Texture.fromImage("run/img/stretched_hyper_tile.jpg"), 0 , this);
	this.swoosh.speed = 0.7
	this.scale.y = 1.7;
	this.scale.x = 4;
}

// constructor
GAME.JoyBackground.constructor = GAME.LowFiBackground;

GAME.JoyBackground.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

//更新转换位置
GAME.JoyBackground.prototype.updateTransform = function()
{
	this.scrollPosition = GAME.camera.x + 4000// * GAME.time.DELTA_TIME;

	this.swoosh.setPosition(this.scrollPosition);
	PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
}


