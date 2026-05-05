//boss之一
class bossTank extends Tank{
    constructor(x,y,level){
        super(x,y,level);
        this.speed=5+level*2;
        this.life=10+level*2;
        this.wholeLife=10+level*2;
        if(level==7){
            this.life=10;
            this.wholeLife=10;
            this.speed=4;
        }
        if(level==14){
            this.life=23;
            this.wholeLife=23;
            this.speed=4;
        }
        this.tankBody.className+=' boss';
        this._updateHealthBar();
    }
    autoMove() {
        let t;
        if(level<=6){
        this.Move = setInterval(() => {
            clearInterval(t);
            let arr = ['top', 'bottom', 'left', 'right'];
            let rand = Math.floor((Math.random() * 4));
            t = setInterval(() => {
                this.move(arr[rand]);
            }, 50);
        }, 1000)
        this.Fire = setInterval(() => {
            this.fire();
        }, 1000)
    }
    if(level==7){
        this.Move=setInterval(()=>{
                this.move('bottom');
        },250);
        this.Fire = setInterval(() => {
            this.fire();
        }, Math.random()*8000+8000);
    }
    if(level==14){
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
        }, 1500)
    }
    }
}
