// ============================================
// UI 辅助模块 - 自定义弹窗、血量条、敌人计数、音效控制
// ============================================

// 覆盖原生 alert，使用自定义游戏弹窗
window._overlayCallback = null;

function showGameMessage(title, message, icon, callback, type) {
    var overlay = document.getElementById('game-overlay');
    var card = overlay.querySelector('.overlay-card');
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-message').textContent = message;
    document.getElementById('overlay-icon').innerHTML = icon || '&#9888;';
    card.classList.remove('victory', 'defeat');
    if (type === 'victory') card.classList.add('victory');
    if (type === 'defeat') card.classList.add('defeat');
    overlay.style.display = 'flex';
    window._overlayCallback = function () {
        overlay.style.display = 'none';
        if (callback) callback();
    };
}

// 更新血量显示（红心）
// 坦克在 life==3 时死亡，因此有效生命 = life - 3
function updateHealthBar() {
    if (typeof tank0 === 'undefined' || !tank0 || !tank0.tank) return;
    var el = document.getElementById('hearts-display');
    if (!el) return;
    var effLife = tank0.life - 3;       // 剩余可承受击中次数
    var effMax = tank0.wholeLife - 3;    // 最大可承受击中次数
    if (effLife < 0) effLife = 0;
    if (effMax <= 0) effMax = 1;
    var html = '';
    // 超过 10 点生命值时用紧凑模式
    if (effMax > 10) {
        html = '<span class="heart-full">❤️</span> <span class="heart-num">x' + effLife + '</span>';
    } else {
        for (var i = 0; i < effMax; i++) {
            if (i < effLife) {
                html += '<span class="heart-full">❤️</span>';
            } else {
                html += '<span class="heart-lost">🖤</span>';
            }
        }
    }
    el.innerHTML = html;
}

// 更新敌人数量
function updateEnemyCount() {
    if (typeof tankArray === 'undefined') return;
    var el = document.getElementById('enemy-count');
    if (!el) return;
    var count = 0;
    for (var i = 0; i < tankArray.length; i++) {
        if (tankArray[i].flag === 1 || tankArray[i].flag2 === 3) count++;
    }
    el.textContent = count;
}

// 更新关卡描述
function updateLevelDescription() {
    var desc = document.getElementById('level-desc');
    if (!desc) return;
    var lv = parseInt(getQueryVariable('level')) || 0;
    var descriptions = [
        '标准战斗 - 消灭所有敌方坦克',
        '标准战斗 - 敌方增强',
        '标准战斗 - 敌方更强',
        '标准战斗 - 持续增援',
        '标准战斗 - Boss登场',
        '标准战斗 - 最终Boss',
        '隐形大战 - 敌方隐身！',
        '雷霆战机 - 保卫底线',
        '狭路相逢 - 单挑Boss',
        'Boss围攻 - 四面楚歌',
        '抛物线弹道 - 特殊射击',
        '接子弹 - 闪避挑战',
        '迷宫逃脱 - 躲避子弹',
        '子弹迷宫 - 控制子弹',
        '终极防御 - 保卫老巢',
        '消灭疫情 - 清除障碍'
    ];
    desc.textContent = descriptions[lv] || '未知关卡';
}

// 设置关卡按钮状态（当前关卡高亮，已完成关卡标记）
function updateLevelButtons() {
    var lv = parseInt(getQueryVariable('level')) || 0;
    for (var i = 0; i < 16; i++) {
        var btn = document.getElementById('' + i);
        if (!btn) continue;
        btn.classList.remove('current', 'completed');
        if (i === lv) {
            btn.classList.add('current');
        }
        if (typeof Level !== 'undefined' && Level[i] == 1) {
            btn.classList.add('completed');
        }
    }
}

// 音效开关
(function () {
    var muted = false;
    var audioElements = [];
    var btn = document.getElementById('sound-toggle');
    if (btn) {
        btn.addEventListener('click', function () {
            muted = !muted;
            if (!audioElements.length) {
                audioElements = [
                    document.getElementById('zha'),
                    document.getElementById('over'),
                    document.getElementById('shot')
                ];
            }
            for (var i = 0; i < audioElements.length; i++) {
                if (audioElements[i]) audioElements[i].muted = muted;
            }
            btn.classList.toggle('muted', muted);
            btn.innerHTML = muted ? '&#128264;' : '&#128266;';
        });
    }
})();

// 刷新所有坦克的血量条
function updateAllTankHealthBars() {
    if (typeof tankArray === 'undefined') return;
    for (var i = 0; i < tankArray.length; i++) {
        if (tankArray[i] && tankArray[i]._updateHealthBar) {
            tankArray[i]._updateHealthBar();
        }
    }
}

// 定时刷新 UI
setInterval(function () {
    updateHealthBar();
    updateEnemyCount();
    updateAllTankHealthBars();
}, 200);

// 页面加载完成后初始化按钮状态和血量显示
window.addEventListener('load', function () {
    setTimeout(function () {
        updateLevelButtons();
        updateHealthBar();
        updateEnemyCount();
        updateAllTankHealthBars();
    }, 300);
});
