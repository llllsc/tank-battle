//此游戏最强boss坦克。
class boss10 extends Tank {
    constructor(x, y, level) {
        super(x, y, level);
        this.tankBody.className += ' boss10';
        this.life = 203;
        this.wholeLife = 203;
        this.flag2 = 3;
        this.interval = 1000;
        if(level==14){
            this.life = 303;
            this.wholeLife = 303;
        }
        this._updateHealthBar();
    }
    //开火函数，四方发射子弹。
    fire() {
        if(level==14)
        new Bullet('top', this.tank.offsetLeft , this.tank.offsetTop, this);
        else   new Bullet('top', this.tank.offsetLeft+17 , this.tank.offsetTop, this);
        new Bullet('bottom', this.tank.offsetLeft + 17, this.tank.offsetTop, this);
        new Bullet('left', this.tank.offsetLeft + 17, this.tank.offsetTop + 17, this);
        new Bullet('right', this.tank.offsetLeft, this.tank.offsetTop + 17, this);
        document.getElementById('shot').play();
    }
    //自由移动函数
    autoMove() {
        if(level!=14){
        let t;
        this.Move = setInterval(() => {
            clearInterval(t);
            let arr = ['top', 'bottom', 'left', 'right'];
            let rand = Math.floor((Math.random() * 4));
            t = setInterval(() => {
                this.move(arr[rand]);
            }, 50);
        }, 2000);
        this.Fire = setInterval(() => {
            this.fire();
        }, 1000);
        setInterval(() => {
            this.interval = 1000;
        }, 10000);
        setInterval(() => {
            this.interval = 200;
        },30000);
        setInterval(() => {
            if (this.interval == 200) {
                var f2= setInterval(()=>{
                    this.fire();
                    },200);
                setTimeout(() => {
                   clearInterval(f2);
                }, 10000);
            }

        }, 10000);
    }
  else if(level==14){
        var k1 = 0;
        var A1 = ["bottom", "right", "top", "left"];
        var self = this;
       this.Move=setInterval(() => {
            var lnum = self.tank.offsetLeft;
            var tnum = self.tank.offsetTop;
            var spd = self.speed;
            var blocked = false;
            switch (A1[k1]) {
                case 'left':  blocked = lnum <= spd || map.hasBlock(lnum - spd, tnum, 'tank'); break;
                case 'right': blocked = lnum >= 600 || map.hasBlock(lnum + spd, tnum, 'tank'); break;
                case 'top':   blocked = tnum <= spd || map.hasBlock(lnum, tnum - spd, 'tank'); break;
                case 'bottom':blocked = tnum >= 605 || map.hasBlock(lnum, tnum + spd, 'tank'); break;
            }
            if (blocked) {
                for (var tries = 0; tries < 4; tries++) {
                    k1++; if (k1 >= 4) k1 = 0;
                    var nextBlocked = false;
                    switch (A1[k1]) {
                        case 'left':  nextBlocked = lnum <= spd || map.hasBlock(lnum - spd, tnum, 'tank'); break;
                        case 'right': nextBlocked = lnum >= 600 || map.hasBlock(lnum + spd, tnum, 'tank'); break;
                        case 'top':   nextBlocked = tnum <= spd || map.hasBlock(lnum, tnum - spd, 'tank'); break;
                        case 'bottom':nextBlocked = tnum >= 605 || map.hasBlock(lnum, tnum + spd, 'tank'); break;
                    }
                    if (!nextBlocked) break;
                }
            }
            self.move(A1[k1]);
        }, 50);
    this.Fire = setInterval(() => {
        this.fire();
    }, 1000);
    setInterval(() => {
        this.interval = 1000;
    }, 10000);
    setInterval(() => {
        this.interval = 200;
    },30000);
    setInterval(() => {
        if (this.interval == 200) {
            var f2= setInterval(()=>{
                this.fire();
                },200);
            setTimeout(() => {
               clearInterval(f2);
            }, 10000);
        }

    }, 10000);
    }

}
}
