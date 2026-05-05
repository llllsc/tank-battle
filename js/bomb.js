class bomb {
    constructor(x, y) {
        this.bomb=document.createElement('div');
        this.bomb.className+='bomb';
        this.bomb.style.left=x+"px";
        this.bomb.style.top=y+"px";
        document.querySelector('.map').appendChild(this.bomb);
    }
}
//"爆炸"类，生成坦克毁灭时的火焰对象。