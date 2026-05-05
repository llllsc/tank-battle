//此函数功能为获取URL中所传递的变量的值。
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
//此函数与上述函数类似，功能为获取URL中所传递的数组变量。
function getQueryVariable2(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            var pair2=pair[1].split(",");
            return pair2;
        }
    }
    return (false);
}
//随机数函数，在此游戏地图范围内获得随机数。
function randNum() {
    return Math.floor(Math.random() * (560 - 50 + 1) + 40);
}
//用于快速生成游戏"基地"旁的保护性砖块
function creatBlock(x, y) {
    return [
        new softWall(x, y), new softWall(x + 30, y), new softWall(x, y + 30), new softWall(x + 30, y + 30)
    ];
}
let pass=0;//表示已通过的关卡的数量。
let level = getQueryVariable("level");//level表明当前是第几关，其值为真正关卡数减一，用于跳转和设置不同关卡。此语句用于获取level。
if (!level) level = 0;//初始化

var Level=getQueryVariable2("Level");//Level为数组变量，其包含的16个元素分别表示16关的过关情况，此数组在URL中传递，随着各个关卡的过关情况而改变。
if(!Level) Level=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//初始化
//此for循环用于统计已过关卡数量和改变通过关卡的显示颜色。
for(let i=0;i<=15;i++){
    if(Level[i]==1)
   {
   document.getElementById(""+i).style.backgroundColor="#00FFFF";
    pass++;
   }
}
document.getElementById("max").innerHTML = "已通过：" + pass + "关";//更新pass。


//前6关玩法：自方坦克生命值固定为3，在有着障碍物的地图上，保卫"老巢"，并消灭所有出现的坦克。
//前6个关共用同一个代码，地图上的障碍物和坦克位置随机生成，但随着level变量值的增加而生成速度和生命值递增的敌方坦克，
if (level < 6) {
    let tankNum = 6;
    var arr = []; 
    var bulletArray = [];
    var tankArray = [];
    var Home = new home(315, 620);

    arr.push(new softWall(270, 620), new softWall(270, 590), new softWall(360, 620), new softWall(360, 590), new softWall(300, 590), new softWall(330, 590),);
    var map = new Map(arr);

    var tank0 = new Mytank(500, 610, level);
    tank0.flag = 0;

    document.querySelector('.tank-body').className += " tank0";
    for (let i = 0; i < 10;) {
        let x = randNum();
        let y = randNum();
        if (!map.hasBlock(x, y, 'tank')) {
            arr.push(...creatBlock(x, y));
            i++;
        }
    }
    for (let i = 0; i < 6;) {
        let x = randNum();
        let y = randNum();
        if (!map.hasBlock(x, y, 'tank')) {
            arr.push(new hardWall(x, y),);
            i++;
        }
    }
    for (let i = 0; i < 6;) {
        let x = randNum();
        let y = randNum();
        if (!map.hasBlock(x, y, 'tank')) {
            new tree(x, y);
            i++;
        }
    }
    for (let i = 0; i < 6;) {
        let x = randNum();
        let y = randNum();
        if (y > 300) continue;
        let t
        if (!map.hasTank(x, y, null)) {
            t = new Tank(x, y, parseInt(level) + 4);
            if (t.dirc != undefined) {
                tankArray.push(t);

                i++;
            }
        }
    }
    tankArray.forEach(item => {
        item.autoMove();
    })
    tankArray.push(tank0);

    setInterval(() => {
        if (tankArray.length < 7 && tankNum <= 10) {
            for (let i = 0; i < 1;) {
                let x = randNum();
                let y = randNum();
                if (y > 300) continue;
                let t;
                if (!map.hasTank(x, y, null)) {
                    t = new Tank(x, y, parseInt(level) + 4);
                    if (t.dirc != undefined) {
                        tankArray.push(t);
                        t.autoMove();
                        tankNum++;
                        i++;
                    }
                }
            }
        }
        if (tankArray.length < 4 && tankNum <= 11) {
            for (let i = 0; i < 1;) {
                let x = randNum();
                let y = randNum();
                if (y > 400) continue;
                let t;
                if (!map.hasTank(x, y, null)) {
                    t = new bossTank(x, y, parseInt(level));
                    if (t.dirc != undefined) {
                        tankArray.push(t);
                        t.autoMove();
                        tankNum++;
                        i++;
                    }
                }
            }
        }
        if (tankArray.length < 3 && tankNum <= 12 && level == 5) {
            for (let i = 0; i < 1;) {
                let x = randNum();
                let y = randNum();
                if (y > 400) continue;
                let t;
                if (!map.hasTank(x, y, null)) {
                    t = new boss(x, y, parseInt(level));
                    if (t.dirc != undefined) {
                        tankArray.push(t);
                        t.autoMove();
                        tankNum++;
                        i++;
                    }
                }
            }
        }

    }, 0);
}
//第7关，隐形大战，敌方所有坦克为隐身状态，保卫"老巢"，并消灭所有敌方坦克赢得胜利。
else if (level == 6) {
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var Home = new home(315, 620);
    arr.push(new softWall(270, 620), new softWall(270, 590), new softWall(360, 620), new softWall(360, 590), new softWall(300, 590), new softWall(330, 590),);
    var map = new Map(arr);
    var tank0 = new Mytank(500, 600, 2);
    tank0.flag = 0;

    document.querySelector('.tank-body').className += " tank0";
    for (let i = 0; i < 10;) {
        let x = randNum();
        let y = randNum();
        if (y > 300) continue;
        let t
        if (!map.hasTank(x, y, null)) {
            t = new Tank(x, y, 1);
            t.life = 4;
            t.wholeLife = 1;
            t.speed = 4;
            if (t.dirc != undefined) {
                tankArray.push(t);

                i++;
            }
        }
    }
    // 隐形关卡：隐藏敌方坦克贴图和血量条
    for (let i = 0; i < tankArray.length; i++) {
        if (tankArray[i].flag !== 0) {
            tankArray[i].tankBody.style.background = "none";
            if (tankArray[i].healthBar) {
                tankArray[i].healthBar.style.display = "none";
            }
        }
    }
    tankArray.forEach(item => {
        item.autoMove();
    })
    tankArray.push(tank0);
}
//第8关，类似"雷霆战机"，地图底部有一排"老巢"，并带有障碍防护，敌方坦克只能向下移动，并且会发射子弹，随游戏进行会产生更强大的敌方坦克。
else if (level == 7) {
    var tankNum = 6;
    var bossTankNum = 1;
    var bossNum = 0;
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var map = new Map(arr);
    var Home = [];
    for (let i = 0; i < 21; i++) {
        Home[i] = new home(0 + i * 30, 620);
    }
    var tank0 = new Mytank(315, 450, 2);
    tank0.flag = 0;
    document.querySelector('.tank-body').className += " tank0";
    tankArray.push(tank0);
    for (let i = 0; i < 21;) {
        let x = i * 30 + 1;
        let y = 590;
        arr.push(new softWall(x, y));
        arr.push(new softWall(x, y - 30));
        arr.push(new softWall(x, y - 60));
        i++;
    }
    for (let i = 0; i < 6;) {
        let x = randNum();
        let y = randNum();
        if (y > 50) continue;
        let t;
        if (!map.hasTank(x, y, null)) {
            t = new Tank(x, y, parseInt(level));
            if (t.dirc != undefined) {
                tankArray.push(t);
                t.life=4;
                t.wholeLife=4;
                t.speed=5;
                t.autoMove();
                i++;
            }
        }
    }
    setInterval(() => {
        if (tankArray.length < 8 && tankNum <= 30) {
            for (let i = 0; i < 1;) {
                let x = randNum();
                let y = randNum();
                if (y > 100) continue;
                let t;
                if (!map.hasTank(x, y, null)) {
                    t = new Tank(x, y, parseInt(level));
                    if (t.dirc != undefined) {
                        tankArray.push(t);
                        t.life=4;
                        t.wholeLife=4;
                        t.speed=5;
                        t.autoMove();
                        tankNum++;
                        i++;
                    }
                }
            }
        }
        if (tankArray.length < 8 && bossTankNum <= 6 && tankNum >= 10) {
            for (let i = 0; i < 1;) {
                let x = randNum();
                let y = randNum();
                if (y > 200) continue;
                let t;
                if (!map.hasTank(x, y, null)) {
                    t = new bossTank(x, y, parseInt(level));
                    if (t.dirc != undefined) {
                        tankArray.push(t);
                        t.autoMove();
                        bossTankNum++;
                        i++;
                    }
                }
            }
        }
        if (tankArray.length < 8 && bossNum < 3 && tankNum >= 15) {
            for (let i = 0; i < 1;) {
                let x = randNum();
                let y = randNum();
                if (y > 300) continue;
                let t;
                if (!map.hasTank(x, y, null)) {
                    t = new boss(x, y, parseInt(level));

                    if (t.dirc != undefined) {
                        tankArray.push(t);
                        t.autoMove();
                        bossNum++;
                        i++;
                    }
                }
            }
        }
    }, 0);
}
//第9关  在一个狭小空间内单挑boss坦克，boss坦克每隔30秒施放"大招"。
else if (level == 8) {
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var map = new Map(arr);
    for (let i = 0; i < 13; i++) {
        let x = i * 50;
        let y = 0;
        arr.push(new hardWall(x, y));
        arr.push(new hardWall(x, y + 600));
        arr.push(new hardWall(y, x));
        arr.push(new hardWall(y + 600, x));
    }
    for (let i = 5; i >= 1; i--)
        for (let j = 1; j <= 6 - i; j++) {
            let x = j * 50;
            let y = i * 50;
            arr.push(new hardWall(x, y));
        }
    for (let i = 7; i <= 11; i++)
        for (let j = 0; j < i - 5; j++) {
            let x = j * 50;
            let y = i * 50;
            arr.push(new hardWall(x, y));
        }
    for (let i = 7; i <= 11; i++)
        for (let j = 0; j < i - 5; j++) {
            let x = i * 50;
            let y = j * 50;
            arr.push(new hardWall(x, y));
        }
    for (let i = 11; i >= 7; i--)
        for (let j = 18 - i; j <= 11; j++) {
            let x = j * 50;
            let y = i * 50;
            arr.push(new hardWall(x, y));
        }

    var tank0 = new Mytank(315, 450, 2);
    tank0.flag = 0;
    document.querySelector('.tank-body').className += " tank0";
    tankArray.push(tank0);
    var b = new boss10(290, 290, 1);
    tankArray.push(b);
    b.autoMove();





}
//第10关 在特定地图内消灭所有敌方坦克。boss战。
else if (level == 9) {
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var map = new Map(arr);
    for (let i = 0; i < 13; i++) {
        let x = i * 50;
        let y = 0;
        arr.push(new hardWall(x, y));
        arr.push(new hardWall(x, y + 600));
        arr.push(new hardWall(y, x));
        arr.push(new hardWall(y + 600, x));
    }
    for (let i = 2; i < 11; i++) {
        let x = i * 50;
        let y = 100;
        if (x == 300 && y == 100) continue;
        arr.push(new hardWall(x, y));
        arr.push(new hardWall(x, y + 400));
        arr.push(new hardWall(y, x));
        arr.push(new hardWall(y + 400, x));


    }
    var tank0 = new Mytank(315, 450, 2);
    tank0.flag = 0;
    document.querySelector('.tank-body').className += " tank0";
    tankArray.push(tank0);
    var b = new boss10(290, 290, 1);
    tankArray.push(b);
    b.autoMove();
    var c = new boss9(150, 150, 1);
    tankArray.push(c);
    c.autoFire();
    var d = new boss9(450, 150, 1);
    tankArray.push(d);
    d.autoFire();
    var e = new boss9(150, 450, 1);
    tankArray.push(e);
    e.autoFire();
    var g = new boss9(450, 450, 1);
    tankArray.push(g);
    g.autoFire();




}
//第11关 保卫"老巢"，并用抛物线轨迹的子弹消灭所有敌方坦克。
else if (level == 10) {
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var Home = new home(315, 620);
    arr.push(new softWall(270, 620), new softWall(270, 590), new softWall(360, 620), new softWall(360, 590), new softWall(300, 590), new softWall(330, 590),);
    var map = new Map(arr);
    var tank0 = new Mytank(0, 0, 2);
    tank0.flag = 0;
    tank0.speed = 5;
    for (let i = 0; i < 13; i++) {
        let x = i * 50;
        let y = 50;
        arr.push(new hardWall(y, x));
    }
    document.querySelector('.tank-body').className += " tank0";
    for (let i = 0; i < 10;) {
        let x = randNum();
        let y = randNum();

        let t
        if (!map.hasTank(x, y, null)) {
            t = new Tank(x, y, 1);
            t.life = 4;
            t.wholeLife = 1;
            t.speed = 4;
            if (t.dirc != undefined) {
                tankArray.push(t);

                i++;
            }
        }
    }
    tankArray.forEach(item => {
        item.autoMove();
    })
    tankArray.push(tank0);








}
//第12关  接子弹。
else if (level == 11) {

    var bulletNum = 3;
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var map = new Map(arr);
    var Home = [];
    for (let i = 0; i < 21; i++) {
        Home[i] = new home(0 + i * 30, 620);
    }
    var tank0 = new Mytank(315, 450, 2);
    tank0.flag = 0;
    document.querySelector('.tank-body').className += " tank0";
    tank0.life = 1000;
    tank0.wholeLife = 1000;
    tank0.speed = 15;
    tankArray.push(tank0);

    var a = new Tank(0, 0, 4);
    tankArray.push(a);
    for (let i = 0; i < 3;) {
        var t = new Bullet('bottom', randNum(), 10, a);
        t.speed = 1;
        i++;
    }
    setInterval(() => {
        if (bulletArray.length < 3 && bulletNum < 30) {
            for (let i = 0; i < 1;) {
                var t = new Bullet('bottom', randNum(), 10, a);
                if (bulletNum > 20)
                    t.speed = 2;
                else t.speed = 1;
                bulletNum++;
                i++;
            }
        }

    }, 0);
}
//第13关 走出有子弹障碍的迷宫，消灭敌方坦克。
else if (level == 12) {
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var map = new Map(arr);
    var tank0 = new Mytank(600, 600, 2);
    tank0.life = 4;
    tank0.wholeLife = 4;
    tank0.flag = 0;
    tank0.speed = 10; 
    document.querySelector('.tank-body').className += " tank0";
    tankArray.push(tank0);
    var a = new Tank(600, 0, 4);
    tankArray.push(a);
    var b = new hardWall(600, 50);
    arr.push(b);
    for (let i = 1; i <= 11; i++) {
        let x = i * 50;
        let y = 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 3; i <= 12; i++) {
        let x = 550;
        let y = i * 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 2; i <= 11; i++) {
        let x = 50;
        let y = i * 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 3; i <= 7; i++) {
        let x = 150;
        let y = i * 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 2; i <= 5; i++) {
        let x = 250;
        let y = i * 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 7; i <= 12; i++) {
        let x = 350;
        let y = i * 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 5; i <= 11; i++) {
        let x = 450;
        let y = i * 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 3; i <= 6; i++) {
        let x = i * 50;
        let y = 550;
        arr.push(new hardWall(x, y));
    }
    for (let i = 2; i <= 5; i++) {
        let x = i * 50;
        let y = 450;
        arr.push(new hardWall(x, y));
    }
    for (let i = 4; i <= 6; i++) {
        let x = i * 50;
        let y = 350;
        arr.push(new hardWall(x, y));
    }
    for (let i = 6; i <= 9; i++) {
        let x = i * 50;
        let y = 250;
        arr.push(new hardWall(x, y));
    }
    for (let i = 7; i <= 10; i++) {
        let x = i * 50;
        let y = 150;
        arr.push(new hardWall(x, y));
    }


    var b1 = new Bullet("top", 0, 650, a);
    b1.speed = 2;
    var k1 = 1;
    var A1 = ["top", "right", "bottom", "left"];
    setInterval(() => {
        if (k1 == 4) k1 = 0;
        b1.dirc = A1[k1++];
    }, 4500);

    var b2 = new Bullet("right", 280, 100, a);
    b2.speed = 2;
    var k2 = 2;
    var A2 = ["top", "right", "bottom", "left"];
    setInterval(() => {
        if (k2 == 4) k2 = 0;
        b2.dirc = A2[k2++];
    }, 1500);

    var b3 = new Bullet("right", 80, 400, a);
    b3.speed = 2;
    var k3 = 2;
    var A3 = ["top", "right", "bottom", "left"];
    setInterval(() => {
        if (k3 == 4) k3 = 0;
        b3.dirc = A3[k3++];
    }, 1500);

    var b4 = new Bullet("bottom", 300, 380, a);
    b4.speed = 2;
    var k4 = 1;
    var A4 = ["bottom", "right", "top", "left"];
    setInterval(() => {
        if (k4 == 4) k4 = 0;
        b4.dirc = A4[k4++];
    }, 1500);

    var b5 = new Bullet("bottom", 100, 80, a);
    b5.speed = 2;
    var k5 = 1;
    var A5 = ["bottom", "right", "top", "left"];
    setInterval(() => {
        if (k5 == 4) k5 = 0;
        b5.dirc = A5[k5++];
    }, 800);

    setInterval(() => {
        if (tank0.tank.offsetLeft <= 50) {
            arr.push(new hardWall(0, 50));
            b.ruin();
            A5 = ["top", "right", "bottom", "left"];
        }
    }, 0);

}
//第14关 控制子弹，走出迷宫。
else if (level == 13) {
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var map = new Map(arr);
    var Home = [];
    var tank0 = new Mytank(600, 600, 2);
    tank0.flag = 0;
    document.querySelector('.tank-body').className += " tank0";
    tankArray.push(tank0);
    var b = new home(600, 50);
    Home.push(b);
    var t = new Tank(600, 0, 4)
    tankArray.push(t);
    for (let i = 1; i <= 21; i++) {
        let x = 20+i * 30;
        let y = 50;
        Home.push(new home(x, y));
    }
    for (let i = 5; i <= 21; i++) {
        let x = 550;
        let y = i * 30;
        Home.push(new home(x, y));
    }
    for (let i = 2; i <= 18; i++) {
        let x = 50;
        let y = 10+i * 30;
        Home.push(new home(x, y));
    }
    for (let i = 5; i <= 11; i++) {
        let x = 150;
        let y = i * 30;
        Home.push(new home(x, y));
    }
    for (let i = 2; i <= 8; i++) {
        let x = 250;
        let y = 10+i * 30;
        Home.push(new home(x, y));
    }
    for (let i = 11; i <= 20; i++) {
        let x = 350;
        let y = 20+i * 30;
        Home.push(new home(x, y));
    }
    for (let i = 9; i <= 18; i++) {
        let x = 450;
        let y = 10+i * 30;
        Home.push(new home(x, y));
    }
    for (let i = 5; i <= 11; i++) {
        let x = i * 30;
        let y = 550;
        Home.push(new home(x, y));
    }
    for (let i = 2; i <= 8; i++) {
        let x = 10+i * 30;
        let y = 450;
        Home.push(new home(x, y));
    }
    for (let i = 5; i <= 11; i++) {
        let x = i * 30;
        let y = 350;
        Home.push(new home(x, y));
    }
    for (let i = 9; i <= 15; i++) {
        let x = i * 30;
        let y = 250;
        Home.push(new home(x, y));
    }
    for (let i = 11; i <= 17; i++) {
        let x = 10+i * 30;
        let y = 150;
        Home.push(new home(x, y));
    }
    var c = new Bullet("top", 600, 600, tank0);
    c.speed = 5;
    setInterval(() => {
        c.dirc = tank0.dirc;
        if (c.flag == 1 && c.flag2 == 0 && t.life == 4) {
            document.getElementById('over').play();
            showGameMessage('战败', '你的子弹击中了错误的目标！', '&#128128;', function () {
                location.reload();
            }, 'defeat');
        }
    }, 0);

}
//第15关 保卫"老巢"。
else if (level == 14) {
    var allNum = 1;
    let tankNum = 1;
    let bossTankNum = 0;
    let bossNum = 0;
    let boss9Num = 0;
    let boss10Num = 0;
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var Home = new home(500, 110);
    var map = new Map(arr);
    var tank0 = new Mytank(315, 315, level);
    tank0.flag = 0;
    document.querySelector('.tank-body').className += " tank0";
    tankArray.push(tank0);

    for (let i = 0; i <= 10; i++) {
        let x = 70;
        let y = i * 50;
        arr.push(new hardWall(x, y));
    }
    for (let i = 1; i <= 10; i++) {
        let x = 20 + i * 50;
        let y = 540;
        arr.push(new hardWall(x, y));
    }
    for (let i = 2; i <= 18; i++) {
        let x = 530;
        let y = i * 30;
        arr.push(new hardWall(x, y));
    }
    for (let i = 3; i <= 9; i++) {
        let x = 30 + i * 50;
        let y = 60;
        arr.push(new hardWall(x, y));
    }
    for (let i = 3; i <= 14; i++) {
        let x = 180;
        let y = i * 30;
        arr.push(new hardWall(x, y));
    }
    for (let i = 6; i <= 14; i++) {
        let x = i * 30;
        let y = 420;
        arr.push(new hardWall(x, y));
    }
    for (let i = 4; i <= 14; i++) {
        let x = 420;
        let y = i * 30 - 10;
        arr.push(new hardWall(x, y));
    }
    for (let i = 5; i <= 14; i++) {
        let x = 500;
        let y = i * 30 - 10;
        arr.push(new softWall(x, y));
    }

    var a1 = new Tank(0, 0, 4);
    a1.speed = 3;
    tankArray.push(a1);
    a1.autoMove();
    let x1 = setInterval(() => {
        for (let i = 0; i < 1;) {
            let t;

            t = new Tank(0, 0, 4);
            if (t.dirc != undefined) {
                tankArray.push(t);
                t.speed = 3;
                t.autoMove();
                tankNum++;
                allNum++;
                i++;
            }

        }
    }, 5000);
    let x2 = setInterval(() => {
        for (let i = 0; i < 1;) {
            let t;
            t = new bossTank(0, 0, 4);
            if (t.dirc != undefined) {
                tankArray.push(t);
                t.speed = 3;
              
                t.autoMove();
                bossTankNum++;
                allNum++;
                i++;
            }
        }
    }, 11000);
    let x3 = setInterval(() => {
        for (let i = 0; i < 1;) {
            let t;

            t = new boss(0, 0, 4);
            if (t.dirc != undefined) {
                tankArray.push(t);
                t.speed = 2;
              
                t.autoMove();
                bossNum++;
                allNum++;
                i++;
            }
        }
    }, 22000);
    let x4 = setInterval(() => {
        for (let i = 0; i < 1;) {
            let t;

            t = new boss9(0, 0, 4);
            if (t.dirc != undefined) {
                tankArray.push(t);
                t.speed = 3;
        
                t.autoMove();
                boss9Num++;
                allNum++;
                i++;
            }
        }
    }, 12000);
    setTimeout(() => {
        for (let i = 0; i < 1;) {
            let t;
            t = new boss10(0, 0, 4);
            if (t.dirc != undefined) {
                tankArray.push(t);
                t.speed = 1;
               
                t.autoMove();
                boss10Num++;
                allNum++;
                i++;
            }
        }
    }, 90000);
    setInterval(() => {
        if (tankNum >= 20) {
            clearInterval(x1);
        }
        if (bossTankNum >= 6)
            clearInterval(x2);
        if (bossNum >= 4)
            clearInterval(x3);
        if (boss9Num >= 5)
            clearInterval(x4);
    }, 0);
}
//第16关 消灭"疫情"。
else if (level == 15) {
    var arr = [];
    var bulletArray = [];
    var tankArray = [];
    var map = new Map(arr);
    var tank0 = new Mytank(300, 600, 2);
    tank0.flag = 0;
    document.querySelector('.tank-body').className += " tank0";
    tankArray.push(tank0);
    for (let i = 7; i <= 15; i++) {
        let x = 90;
        let y = i * 30;
        arr.push(new softWall(x, y));

    }
    for (let i = 4; i <= 8; i++) {
        let x = i * 30;
        let y = 210;
        arr.push(new softWall(x, y));
    }
    for (let i = 5; i <= 18; i++) {
        let x = 360;
        let y = i * 30;
        arr.push(new softWall(x, y));
    }
    for (let i = 14; i <= 20; i++) {
        let x = i * 30;
        let y = 210;
        arr.push(new softWall(x, y));
    }
    for (let i = 15; i <= 19; i++) {
        let x = i * 30;
        let y = 270;
        arr.push(new softWall(x, y));
    }
    for (let i = 15; i <= 20; i++) {
        let x = i * 30;
        let y = 330;
        arr.push(new softWall(x, y));
    }
    for (let i = 4; i <= 8; i++) {
        let x = i * 30;
        let y = 360;
        arr.push(new softWall(x, y));
    }
    for (let i = 16; i <= 19; i++) {
        let x = i * 30;
        let y1 = 390;
        let y2 = 450;
        let y3 = 510;
        arr.push(new softWall(x, y1));
        arr.push(new softWall(x, y2));
        arr.push(new softWall(x, y3));
    }
    for (let i = 13; i <= 18; i++) {
        let x = 15 * 30;
        let y = i * 30;
        arr.push(new softWall(x, y));

    }
    arr.push(new softWall(14 * 30, 12 * 30));
    arr.push(new softWall(11 * 30, 10 * 30));
    arr.push(new softWall(10 * 30, 11 * 30));
    arr.push(new softWall(17 * 30, 5 * 30));
    arr.push(new softWall(17 * 30, 6 * 30));
    arr.push(new softWall(14 * 30, 12 * 30));
    arr.push(new softWall(14 * 30, 12 * 30));
    arr.push(new softWall(17 * 30, 8 * 30));
    arr.push(new softWall(17 * 30, 10 * 30));
    arr.push(new softWall(17 * 30, 10 * 30));
    arr.push(new softWall(19 * 30, 14 * 30));
    arr.push(new softWall(19 * 30, 16 * 30));
    arr.push(new softWall(19 * 30, 18 * 30));
    arr.push(new softWall(13 * 30, 11 * 30));
    arr.push(new softWall(5 * 30, 5 * 30));
    arr.push(new softWall(6 * 30, 6 * 30));
    arr.push(new softWall(1 * 30, 9 * 30));
    arr.push(new softWall(2 * 30, 10 * 30));
    arr.push(new softWall(2 * 30, 11 * 30));
    arr.push(new softWall(1 * 30, 12 * 30));
    arr.push(new softWall(2 * 30, 16 * 30));
    arr.push(new softWall(4 * 30, 10 * 30));
    arr.push(new softWall(5 * 30, 10 * 30));
    arr.push(new softWall(7 * 30, 10 * 30));
    arr.push(new softWall(8 * 30, 10 * 30));
    arr.push(new softWall(5 * 30, 9 * 30));
    arr.push(new softWall(6 * 30, 9 * 30));
    arr.push(new softWall(7 * 30, 9 * 30));
    arr.push(new softWall(5 * 30, 13 * 30));
    arr.push(new softWall(7 * 30, 13 * 30));
    arr.push(new softWall(5 * 30, 15 * 30));
    arr.push(new softWall(7 * 30, 15 * 30));
    arr.push(new softWall(6 * 30, 14 * 30));
    arr.push(new softWall(4 * 30, 16 * 30));
    arr.push(new softWall(8 * 30, 16 * 30));
}
//用于获胜并跳转下一关
var _victoryShown = false;
setInterval(() => {
    if (_victoryShown) return;
    //一般关卡的判胜条件
    if (level != 11 && level != 14 && level != 15 && tankArray.length == 1 && tankArray[0].flag == 0) {
        _victoryShown = true;
        Level[level] = 1;
        var nextLevel = parseInt(level) + 1;
        showGameMessage('胜利！', '第 ' + (nextLevel) + ' 关', '&#11088;', function () {
            window.location.href = window.location.pathname + '?level=' + nextLevel + '&Level=' + Level.join(',');
        }, 'victory');
    }
    //第12关判胜：接住所有子弹
    else if (level == 11 && bulletArray.length == 0) {
        _victoryShown = true;
        Level[level] = 1;
        var nextLevel = parseInt(level) + 1;
        showGameMessage('胜利！', '第 ' + (nextLevel) + ' 关', '&#11088;', function () {
            window.location.href = window.location.pathname + '?level=' + nextLevel + '&Level=' + Level.join(',');
        }, 'victory');
    }
    //第15关判胜：消灭所有敌人
    else if (level == 14 && allNum == 36 && tankArray.length == 1) {
        _victoryShown = true;
        Level[level] = 1;
        var nextLevel = parseInt(level) + 1;
        showGameMessage('胜利！', '第 ' + (nextLevel) + ' 关', '&#11088;', function () {
            window.location.href = window.location.pathname + '?level=' + nextLevel + '&Level=' + Level.join(',');
        }, 'victory');
    }
    //第16关（最后一关）判胜：清除所有障碍
    else if (level == 15 && arr.length == 0 && tank0.f == 0) {
        _victoryShown = true;
        tank0.f = 1;
        showGameMessage('恭喜通关！', '你已经通过了全部 16 关！\n你是真正的坦克指挥官！', '&#127942;', function () {
            window.location.href = window.location.pathname + '?level=0&Level=' + Level.join(',');
        });
    }
}, 0);
var direction = {
    left: false,
    top: false,
    right: false,
    bottom: false,
    fire: false
};
//以下代码用于设置己方坦克移动，键盘上下左右键控制坦克的上下左右，空格键发射子弹。
setInterval(function () {
    if (direction.left) {
        tank0.move('left');
    } else if (direction.top) {
        tank0.move('top');
    } else if (direction.right) {
        tank0.move('right');
    } else if (direction.bottom) {
        tank0.move('bottom');
    } else if (direction.fire) {
        tank0.fire();
    }
}, 50);

document.onkeydown = function (event) {
    direction = {
        left: false,
        top: false,
        right: false,
        bottom: false,
        fire: false,
    };
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 40) {
        direction.bottom = true;
    }
    if (e && e.keyCode == 37) {
        direction.left = true;
    }
    if (e && e.keyCode == 39) {
        direction.right = true;
    }
    if (e && e.keyCode == 38) {
        direction.top = true;
    }
    if (e && e.keyCode == 32) {
        direction.fire = true;
    }
};
document.onkeyup = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 40) {
        direction.bottom = false;
    }
    if (e && e.keyCode == 37) {
        direction.left = false;
    }
    if (e && e.keyCode == 39) {
        direction.right = false;
    }
    if (e && e.keyCode == 38) {
        direction.top = false;
    }
    if (e && e.keyCode == 32) {
        direction.fire = false;
    }
}