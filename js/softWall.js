class softWall {
    constructor(x, y) {
        this.softWall = document.createElement('div');
        this.softWall.className += `softWall`;
        this.softWall.style.left = `${x}px`;
        this.softWall.style.top = `${y}px`;
        this.flag=0;
        document.querySelector('.map').appendChild(this.softWall);
    }
    //销毁函数，砖墙对象在被子弹打中时会销毁
    ruin() {
        if(this.flag==1)return;
        this.flag=1;
        arr.splice(arr.findIndex((item) => item === this), 1);
        document.querySelector('.map').removeChild(this.softWall);
    }
}
//"砖墙"类，生成和设置砖墙对象。