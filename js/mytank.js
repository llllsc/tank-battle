class Mytank extends Tank{
    constructor(x, y,level){
        super(x,y,level);
        this.speed=5+level*1;
        this.life=6;
        this.wholeLife=6;
        this.f=0;
        this._updateHealthBar();
    }
    ruin() {
        tankArray.splice(tankArray.findIndex((item) => item === this), 1);
        this.canShot = false;
        clearInterval(this.Move);
        clearInterval(this.Fire);
        document.querySelector('.map').removeChild(this.tank);
        document.getElementById('over').play();
        showGameMessage('战败', '你的坦克被摧毁了！', '&#128128;', function () {
            location.reload();
        });
    }
}
//"自身坦克"类，生成和设置自己的坦克对象。