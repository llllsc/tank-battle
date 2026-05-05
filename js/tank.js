//"坦克"类，用于生成和设置坦克对象。为其它所有坦克的父类。
class Tank {
    //构造函数。x表示离地图左边缘距离，y表示离地图右边缘距离，level表示关卡。
    constructor(x, y, level) {
        if (!map.hasBlock(x, y, 'tank')) {
            this.dirc = 'top';
            // 外层容器：定位用，不旋转
            this.tank = document.createElement('div');
            this.tank.className = 'tank';
            this.tank.style.left = x + 'px';
            this.tank.style.top = y + 'px';
            // 内层：旋转+贴图
            this.tankBody = document.createElement('div');
            this.tankBody.className = 'tank-body';
            this.tank.appendChild(this.tankBody);
            // 血条：在容器内、tankBody 外，始终在视觉上方
            this.healthBar = document.createElement('div');
            this.healthBar.className = 'tank-health-bar';
            this.healthFill = document.createElement('div');
            this.healthFill.className = 'tank-health-fill';
            this.healthBar.appendChild(this.healthFill);
            this.tank.appendChild(this.healthBar);
            this.speed = level * 1.3 + 1;
            this.Move;
            this.Fire;
            this.life = level;
            this.wholeLife = level;
            this.flag = 1;
            this.canShot = true;
            document.querySelector('.map').appendChild(this.tank);
            return true;
        }
        return false;
    }
    //开火函数，发射子弹。
    fire() {
        if (!this.canShot) return;
        new Bullet(this.dirc, this.tank.offsetLeft, this.tank.offsetTop, this);
        if (this.flag == 0) {
            playShotSound();
        }
        this.canShot = false;
    }
    //移动函数。容器定位，tankBody 旋转，血条自动在上方
    move(dirc) {
        let lnum = this.tank.offsetLeft;
        let tnum = this.tank.offsetTop;
        this.dirc = dirc;
        var spd = this.speed;
        if(level!=14){
        switch (dirc) {
            case 'left':
                this.tankBody.style.webkitTransform = "rotate(-90deg)";
                if (lnum <= spd) return;
                if (map.hasBlock(lnum - spd, tnum, 'tank') || map.hasTank(lnum - spd, tnum, this)) return;
                this.tank.style.left = (lnum - spd) + "px";
                break
            case 'right':
                this.tankBody.style.webkitTransform = "rotate(90deg)";
                if (lnum >= 600) return;
                if (map.hasBlock(lnum + spd, tnum, 'tank') || map.hasTank(lnum + spd, tnum, this)) return;
                this.tank.style.left = (lnum + spd) + "px";
                break
            case 'top':
                this.tankBody.style.webkitTransform = "rotate(0deg)";
                if (tnum <= spd) return;
                if (map.hasBlock(lnum, tnum - spd, 'tank') || map.hasTank(lnum, tnum - spd, this)) return;
                this.tank.style.top = (tnum - spd) + "px";
                break
            case 'bottom':
                this.tankBody.style.webkitTransform = "rotate(180deg)";
                if (tnum >= 605) return;
                if (map.hasBlock(lnum, tnum + spd, 'tank') || map.hasTank(lnum, tnum + spd, this)) return;
                this.tank.style.top = (tnum + spd) + "px";
                break;
        }
    }
    else {
        switch (dirc) {
            case 'left':
                this.tankBody.style.webkitTransform = "rotate(-90deg)";
                if (lnum <= spd) return;
                if (map.hasBlock(lnum - spd, tnum, 'tank')) return;
                this.tank.style.left = (lnum - spd) + "px";
                break
            case 'right':
                this.tankBody.style.webkitTransform = "rotate(90deg)";
                if (lnum >= 600) return;
                if (map.hasBlock(lnum + spd, tnum, 'tank')) return;
                this.tank.style.left = (lnum + spd) + "px";
                break
            case 'top':
                this.tankBody.style.webkitTransform = "rotate(0deg)";
                if (tnum <= spd) return;
                if (map.hasBlock(lnum, tnum - spd, 'tank')) return;
                this.tank.style.top = (tnum - spd) + "px";
                break
            case 'bottom':
                this.tankBody.style.webkitTransform = "rotate(180deg)";
                if (tnum >= 605) return;
                if (map.hasBlock(lnum, tnum + spd, 'tank')) return;
                this.tank.style.top = (tnum + spd) + "px";
                break;
        }
    }
    }
    _updateHealthBar() {
        if (!this.healthFill || !this.tank) return;
        var damaged = this.life < this.wholeLife;
        this.healthBar.style.display = damaged ? "block" : "none";
        if (!damaged) return;
        var ratio = this.life / this.wholeLife;
        this.healthFill.style.width = (ratio * 100) + "%";
        this.healthFill.classList.remove("danger", "warning");
        if (ratio <= 0.25) {
            this.healthFill.classList.add("danger");
        } else if (ratio <= 0.5) {
            this.healthFill.classList.add("warning");
        }
    }
    //被击中函数
    beFired() {
        this.life--;
        this._updateHealthBar();
        if (this.life == 3) {
            this.ruin();
        }
        let rate = this.life / this.wholeLife;
        this.tankBody.style.opacity = rate;
    }
    //自动移动和开火函数
    autoMove() {
        let t;
        if (level!=7&&level!=14) {
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
            }, 1500)
        }
        if (level == 7) {
            this.Move = setInterval(() => {
                this.move('bottom');
            }, 250);
            this.Fire = setInterval(() => {
                this.fire();
            }, Math.random()*5000+6000);
        }
        //第15关，敌方坦克沿墙巡逻
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
    //毁灭函数
    ruin() {
        if (this.flag !== 0) {
            var mapEl = document.querySelector('.map');
            mapEl.classList.add('shake');
            setTimeout(function () { mapEl.classList.remove('shake'); }, 450);
        }
        let b = new bomb(this.tank.offsetLeft, this.tank.offsetTop);
        setTimeout(() => {
            b.bomb.style.display = "none";
        }, 250);
        document.getElementById('zha').play();
        tankArray.splice(tankArray.findIndex((item) => item === this), 1);
        this.canShot = false;
        clearInterval(this.Move);
        clearInterval(this.Fire);
        clearInterval(this.dirInterval);
        document.querySelector('.map').removeChild(this.tank);
    }
}

// 用 Web Audio API 生成悦耳的合成射击音效
function playShotSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
}
