// 范小羊工具归位小游戏
(function () {
    const hero = document.getElementById('hero');
    const btnStart = document.getElementById('btnStart');
    const btnHow = document.getElementById('btnHow');
    const howModal = document.getElementById('howModal');
    const btnHowClose = document.getElementById('btnHowClose');

    const hud = document.getElementById('hud');
    const levelNoEl = document.getElementById('levelNo');
    const difficultyNameEl = document.getElementById('difficultyName');
    const timerBar = document.getElementById('timerBar');
    const timerText = document.getElementById('timerText');
    const btnRestart = document.getElementById('btnRestart');
    const btnBack = document.getElementById('btnBack');
    const btnLevelSelect = document.getElementById('btnLevelSelect');

    const panelDiff = document.getElementById('difficulty');
    const panelLevel = document.getElementById('levelPanel');
    const diffCards = document.querySelectorAll('.difficulty-card');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const btnBackFromLevelPanel = document.getElementById('btnBackFromLevelPanel');

    const gameRoot = document.getElementById('game');
    const slotsEl = document.getElementById('slots');
    const trayEl = document.getElementById('toolsTray');
    const stickersEl = document.getElementById('sheepStickers');

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const btnNext = document.getElementById('btnNext');
    const btnRetry = document.getElementById('btnRetry');
    const btnHome = document.getElementById('btnHome');

    const TOOLS = [
        { id: 'wrench', name: '扳手', emoji: '🔧' },
        { id: 'hammer', name: '锤子', emoji: '🔨' },
        { id: 'screwdriver', name: '螺丝刀', emoji: '🪛' },
        { id: 'saw', name: '锯子', emoji: '🪚' },
        { id: 'pliers', name: '钳子', emoji: '🗜️' },
        { id: 'tape', name: '卷尺', emoji: '📏' },
        { id: 'gear', name: '齿轮', emoji: '⚙️' },
        { id: 'bolt', name: '螺栓', emoji: '🔩' },
        { id: 'paint', name: '油漆', emoji: '🖌️' },
        { id: 'helmet', name: '安全帽', emoji: '⛑️' }
    ];

    const DIFFS = {
        easy:   { name: '新手', time: 30, toolsBase: 4, addPerLevel: 1, shake: 'none', distractors: 1 },
        normal: { name: '进阶', time: 30, toolsBase: 5, addPerLevel: 1, shake: 'mild', distractors: 2 },
        hard:   { name: '高手', time: 30, toolsBase: 6, addPerLevel: 2, shake: 'moderate', distractors: 3 },
        insane: { name: '地狱', time: 30, toolsBase: 7, addPerLevel: 2, shake: 'extreme', distractors: 5 }
    };

    const FAKE_TOOLS = [
        { id: 'fake-magnet', name: '磁铁', emoji: '🧲' },
        { id: 'fake-link', name: '链环', emoji: '🔗' },
        { id: 'fake-toolbox', name: '工具箱', emoji: '🧰' },
        { id: 'fake-ext', name: '灭火器', emoji: '🧯' },
        { id: 'fake-axe', name: '斧头', emoji: '🪓' },
        { id: 'fake-hook', name: '吊钩', emoji: '🪝' }
    ];

    let currentDiffKey = 'easy';
    let currentLevel = 1;
    let levelTools = [];
    let placedCount = 0;
    let countdownId = null;
    let timeLeft = 0;
    let totalTime = 0;
    let bonusTime = 0; // 累计的奖励时间
    let levelStars = 0; // 当前关卡星级

    // 关卡进度数据（从用户系统获取）
    let levelProgress = {};
    
    // 加载用户进度
    function loadUserProgress() {
        // Use sessionStorage directly as DB is removed
        levelProgress = JSON.parse(sessionStorage.getItem('sheepToolGameProgressTemp') || '{}');
    }
    
    // 初始化时加载进度
    loadUserProgress();

    // 扩展为100关，全部解锁
    const MAX_LEVEL = 100;

    // 英雄页与教程
    btnStart.addEventListener('click', () => {
        hero.style.display = 'none';
        panelDiff.setAttribute('aria-hidden', 'false');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    btnHow.addEventListener('click', () => openModal(howModal));
    btnHowClose.addEventListener('click', () => closeModal(howModal));

    // 关卡选择按钮
    if (btnLevelSelect) {
        btnLevelSelect.addEventListener('click', () => {
            showLevelPanel();
        });
    }

    // 从关卡面板返回
    if (btnBackFromLevelPanel) {
        btnBackFromLevelPanel.addEventListener('click', () => {
            panelLevel.setAttribute('aria-hidden', 'true');
            panelDiff.setAttribute('aria-hidden', 'false');
        });
    }

    
    // 主题切换
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });
    function setTheme(theme){
        gameRoot.classList.remove('theme-pasture','theme-kids','theme-garage');
        if (theme === 'pasture') gameRoot.classList.add('theme-pasture');
        if (theme === 'kids') gameRoot.classList.add('theme-kids');
        if (theme === 'garage') gameRoot.classList.add('theme-garage');
    }

    // 难度选择
    diffCards.forEach((card) => {
        card.addEventListener('click', () => {
            currentDiffKey = card.getAttribute('data-diff');
            currentLevel = 1;
            startLevel();
        });
    });

    // HUD 控件
    btnRestart.addEventListener('click', () => startLevel());
    btnBack.addEventListener('click', () => {
        stopTimer();
        resetStage();
        gameRoot.setAttribute('aria-hidden', 'true');

        // 隐藏游戏容器
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.setAttribute('aria-hidden', 'true');
        }

        panelDiff.setAttribute('aria-hidden', 'true');
        panelLevel.setAttribute('aria-hidden', 'true');
        hero.style.display = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 结果弹窗
    btnNext.addEventListener('click', () => {
        closeModal(modal);
        currentLevel += 1;
        startLevel();
    });
    btnRetry.addEventListener('click', () => {
        closeModal(modal);
        startLevel();
    });
    btnHome.addEventListener('click', () => {
        closeModal(modal);
        btnBack.click();
    });

    function startLevel() {
        panelDiff.setAttribute('aria-hidden', 'true');
        panelLevel.setAttribute('aria-hidden', 'true');
        gameRoot.setAttribute('aria-hidden', 'false');

        // 显示游戏容器，隐藏所有子元素先
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.setAttribute('aria-hidden', 'false');
        }

        // 初始化主题按钮状态
        updateThemeButtons();

        resetStage();

        const diff = DIFFS[currentDiffKey];
        difficultyNameEl.textContent = diff.name;
        levelNoEl.textContent = String(currentLevel);

        const toolCount = Math.min(TOOLS.length, diff.toolsBase + (currentLevel - 1) * diff.addPerLevel);
        levelTools = pickRandom(TOOLS, toolCount);

        buildSlots(levelTools);
        const distractorCount = diff.distractors || 0;
        const distractors = pickRandom(FAKE_TOOLS, distractorCount);
        buildTools(levelTools, { shake: diff.shake, distractors });
        placeSheepStickers();
        // 不立即开始倒计时，显示游戏开始界面，由玩家点击开始按钮后启动
        const preparedSeconds = diff.time - Math.max(0, currentLevel - 1) * 1; // 预设秒数
        prepareTimer(preparedSeconds);
        showGameStartScreen();
    }

    function resetStage() {
        placedCount = 0;
        levelTools = [];
        slotsEl.innerHTML = '';
        trayEl.innerHTML = '';
        if (stickersEl) stickersEl.innerHTML = '';
        stopTimer();
    }

    function buildSlots(items) {
        const shuffled = shuffle([...items]);
        shuffled.forEach((tool) => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.accept = tool.id;

            const ghost = document.createElement('div');
            ghost.className = 'silhouette';
            // 工具图案的“镂空阴影”（使用emoji形状作为暗色阴影提示）
            ghost.textContent = tool.emoji;
            const rot = (Math.random()*10 - 5);
            ghost.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
            slot.appendChild(ghost);

            slotsEl.appendChild(slot);
        });
        // 柜体拉手（若不存在则添加一次）
        if (!document.querySelector('.slots .handle')) {
            const h = document.createElement('div');
            h.className = 'handle';
            slotsEl.appendChild(h);
        }
    }

    function buildTools(items, { shake, distractors=[] }) {
        const source = shuffle([...items]);
        // 先清空，确保容器尺寸已知
        source.forEach((tool) => {
            const el = document.createElement('div');
            el.className = 'tool';
            el.draggable = false;
            el.dataset.id = tool.id;

            const icon = document.createElement('div');
            icon.className = 'emoji';
            icon.textContent = tool.emoji;
            el.appendChild(icon);

            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = tool.name;
            el.appendChild(name);

            if (shake) randomShake(el);
            enableDrag(el);
            trayEl.appendChild(el);
        });
        // 放入干扰项（没有对应凹槽）
        distractors.forEach((tool) => {
            const el = document.createElement('div');
            el.className = 'tool';
            el.draggable = false;
            el.dataset.id = tool.id; // 与任何 slot.dataset.accept 不匹配

            const icon = document.createElement('div');
            icon.className = 'emoji';
            icon.textContent = tool.emoji;
            el.appendChild(icon);

            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = tool.name;
            el.appendChild(name);

            if (shake) randomShake(el);
            enableDrag(el);
            trayEl.appendChild(el);
        });
        // 使用不重叠分布算法放置工具（在准备界面或开始时触发）
        requestAnimationFrame(() => {
            distributeToolsNoOverlap(trayEl, 8, 300);
        });
    }

    function enableDrag(el) {
        let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false;

        const onDown = (e) => {
            // 仅响应主键指针，避免右键等导致异常
            if (e.button !== undefined && e.button !== 0) return;
            // 阻止滚动/文本选中/点击冒泡造成的误触
            e.preventDefault();
            e.stopPropagation();
            const p = getPoint(e);
            dragging = true;
            el.classList.add('dragging');
            const rect = el.getBoundingClientRect();
            originX = rect.left + window.scrollX;
            originY = rect.top + window.scrollY;
            startX = p.x - originX;
            startY = p.y - originY;
            el.style.position = 'absolute';
            el.style.left = originX + 'px';
            el.style.top = originY + 'px';
            el.style.pointerEvents = 'none';
            document.body.appendChild(el);
            // 捕获指针，确保移出窗口或越界也能收到事件
            try { if (e.pointerId != null && el.setPointerCapture) el.setPointerCapture(e.pointerId); } catch(_){}
            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', onUp, { once: true });
            window.addEventListener('pointercancel', onUp, { once: true });
        };
        const onMove = (e) => {
            if (!dragging) return;
            // 阻止页面滚动
            if (e.cancelable) e.preventDefault();
            const p = getPoint(e);
            el.style.left = (p.x - startX) + 'px';
            el.style.top = (p.y - startY) + 'px';
        };
        const onUp = (e) => {
            dragging = false;
            el.classList.remove('dragging');
            el.style.pointerEvents = '';
            window.removeEventListener('pointermove', onMove);
            // 释放捕获
            try { if (e && e.pointerId != null && el.releasePointerCapture) el.releasePointerCapture(e.pointerId); } catch(_){}

            const dropOk = tryDrop(el);
            if (!dropOk) {
                // 落在托盘中当前位置，不再跳回网格
                // 计算相对托盘的位置
                const trayRect = trayEl.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                const relLeft = elRect.left - trayRect.left + trayEl.scrollLeft;
                const relTop = elRect.top - trayRect.top + trayEl.scrollTop;
                trayEl.appendChild(el);
                el.style.position = 'absolute';
                el.style.left = Math.max(0, Math.min(relLeft, trayEl.scrollWidth - elRect.width)) + 'px';
                el.style.top = Math.max(0, Math.min(relTop, trayEl.scrollHeight - elRect.height)) + 'px';
                toggleCabinetOpen(false);
            }
        };
        el.addEventListener('pointerdown', onDown);
    }

    // 拖拽靠近柜体时“开合”动画
    function toggleCabinetOpen(on){
        const container = slotsEl.closest('.slots');
        if (!container) return;
        if (on) container.classList.add('open'); else container.classList.remove('open');
    }

    function tryDrop(toolEl) {
        const toolId = toolEl.dataset.id;
        const toolRect = toolEl.getBoundingClientRect();
        const slots = Array.from(slotsEl.querySelectorAll('.slot'));
        for (const slot of slots) {
            const rect = slot.getBoundingClientRect();
            const overlap = rect.left < toolRect.right &&
                            rect.right > toolRect.left &&
                            rect.top < toolRect.bottom &&
                            rect.bottom > toolRect.top;
            if (overlap) {
                if (slot.dataset.accept === toolId && !slot.classList.contains('success')) {
                    // 归位
                    slot.classList.add('success');
                    slot.innerHTML = ''; // 清掉剪影文本
                    const ok = document.createElement('div');
                    ok.className = 'emoji';
                    ok.textContent = TOOLS.find(t=>t.id===toolId)?.emoji || '✅';
                    slot.appendChild(ok);
                    toolEl.remove();
                    placedCount += 1;
                    toast('匹配成功！', 'success', rect.left + rect.width/2, rect.top);
                    checkWin();
                    return true;
                } else {
                    flash(slot, 'error');
                    toast('不对哦，再试试', 'error', rect.left + rect.width/2, rect.top);
                    return false;
                }
            }
        }
        toggleCabinetOpen(false);
        return false;
    }

    function checkWin() {
        if (placedCount >= levelTools.length) {
            stopTimer();

            // 计算星级和时间奖励
            const timeUsed = totalTime - timeLeft;
            const timeRemaining = timeLeft;
            levelStars = calculateStars(timeRemaining, totalTime);

            // 计算时间奖励
            const timeBonusSeconds = Math.floor(timeRemaining * 0.5); // 剩余时间的50%
            const starBonusSeconds = levelStars * 5; // 每颗星奖励5秒
            const totalBonus = timeBonusSeconds + starBonusSeconds;

            // 更新总奖励时间
            bonusTime += totalBonus;

            // 保存进度
            saveLevelProgress(currentLevel, levelStars);

            // 显示结果
            showLevelComplete(timeUsed, timeBonusSeconds, starBonusSeconds, totalBonus);
        }
    }

    function startTimer(seconds) {
        stopTimer();
        // 固定30秒基础时间加上累计的奖励时间
        const baseTime = 30;
        const timeBonus = Math.floor(bonusTime * 0.4); // 使用40%的奖励时间
        totalTime = baseTime + timeBonus;
        // 如果传入的 seconds（难度时间）小于 totalTime，则以 seconds 为准（更严格）
        if (typeof seconds === 'number' && seconds > 0 && seconds < totalTime) {
            totalTime = seconds + timeBonus; // 使用难度给定时间作为基准
        }
        timeLeft = totalTime;
        updateTimerUI();

        // 显示时间加成提示
        if (timeBonus > 0) {
            showToast(`+${timeBonus}秒 奖励时间！`, 'success');
        }

        countdownId = setInterval(() => {
            timeLeft -= 1;
            updateTimerUI();
            if (timeLeft <= 0) {
                stopTimer();
                showGameOver();
            }
        }, 1000);
    }
    // 将倒计时参数保存，等待玩家点击开始
    let _preparedSeconds = null;
    function prepareTimer(seconds){
        _preparedSeconds = seconds || 30;
        // 在 UI 上展示预设时间（不启动倒计时）
        const baseTime = 30;
        const timeBonus = Math.floor(bonusTime * 0.4);
        totalTime = Math.max(baseTime, _preparedSeconds) + timeBonus;
        timeLeft = totalTime;
        updateTimerUI();
    }

    // 显示/隐藏开始屏并绑定内置开始按钮
    const startScreen = document.getElementById('gameStartScreen');
    const playScreen = document.getElementById('gamePlayScreen');
    const btnStartGame = document.getElementById('btnStartGame');

    function showGameStartScreen(){
        if (startScreen) startScreen.style.display = '';
        if (playScreen) playScreen.setAttribute('aria-hidden', 'true');
    }
    function hideGameStartScreen(){
        if (startScreen) startScreen.style.display = 'none';
        if (playScreen) playScreen.setAttribute('aria-hidden', 'false');
    }

    if (btnStartGame) {
        btnStartGame.addEventListener('click', () => {
            // 隐藏准备界面，显示游戏界面
            hideGameStartScreen();

            // 在开始前确保工具分布不重叠
            // 如果工具仍在托盘中，则重新分布一次
            requestAnimationFrame(() => {
                distributeToolsNoOverlap(trayEl, 8, 300);
                // 然后启动计时
                startTimer(_preparedSeconds);
            });
        });
    }

    // 在容器内将工具随机放置，尽量避免重叠
    // container: DOM 元素（工具托盘）
    // padding: 边距(px)
    // maxAttempts: 单个工具尝试放置次数上限
    function distributeToolsNoOverlap(container, padding = 8, maxAttempts = 200) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const tools = Array.from(container.querySelectorAll('.tool'));
        // 记录已占用矩形
        const placed = [];

        tools.forEach((t) => {
            // 重置样式，确保能测量
            t.style.position = 'absolute';
            t.style.left = '0px';
            t.style.top = '0px';
        });

        tools.forEach((t) => {
            const w = t.offsetWidth;
            const h = t.offsetHeight;
            let attempt = 0;
            let placedOk = false;
            while (attempt < maxAttempts && !placedOk) {
                const left = padding + Math.random() * Math.max(0, rect.width - w - padding * 2);
                const top = padding + Math.random() * Math.max(0, rect.height - h - padding * 2);
                const r = {left, top, right: left + w, bottom: top + h};

                // 检查与已放置项是否重叠（加入一点间隙）
                const gap = 6; // 像素间隙
                const overlap = placed.some(p => !(r.right + gap < p.left || r.left - gap > p.right || r.bottom + gap < p.top || r.top - gap > p.bottom));
                if (!overlap) {
                    placed.push(r);
                    t.style.left = left + 'px';
                    t.style.top = top + 'px';
                    placedOk = true;
                }
                attempt++;
            }
            // 如果多次尝试仍未放置，则随即放置（允许部分重叠）
            if (!placedOk) {
                const left = padding + Math.random() * Math.max(0, rect.width - w - padding * 2);
                const top = padding + Math.random() * Math.max(0, rect.height - h - padding * 2);
                t.style.left = left + 'px';
                t.style.top = top + 'px';
                placed.push({left, top, right: left + w, bottom: top + h});
            }
        });
    }
    function stopTimer() {
        if (countdownId) clearInterval(countdownId);
        countdownId = null;
    }
    function updateTimerUI() {
        const pct = Math.max(0, (timeLeft / totalTime) * 100);
        timerBar.style.width = pct + '%';
        timerText.textContent = formatTime(timeLeft);

        // 时间警告动画 - 新的样式
        if (timeLeft <= 10 && timeLeft > 0) {
            timerBar.classList.add('warning');
        } else {
            timerBar.classList.remove('warning');
        }

        // 更新计时器颜色
        if (timeLeft <= 5) {
            timerBar.style.background = 'linear-gradient(90deg,#ff4444,#ff6666,#ff8888)';
        } else if (timeLeft <= 10) {
            timerBar.style.background = 'linear-gradient(90deg,#ff8800,#ffaa00,#ffcc00)';
        } else {
            timerBar.style.background = 'linear-gradient(90deg,#2ecc71,#4ade80,#22c55e)';
        }
    }

    function openModal(m) { m.setAttribute('aria-hidden','false'); }
    function closeModal(m) {
        m.setAttribute('aria-hidden','true');
        // 清理跳跃小羊
        const j = m.querySelector('.jump-sheep');
        if (j) j.remove();
    }

    function randomShake(el) {
        const amp = 3 + Math.random()*3;
        const period = 1200 + Math.random()*800;
        let t = 0;
        const tick = () => {
            t += 16;
            const dx = Math.sin(t/period*2*Math.PI)*amp;
            const dy = Math.cos(t/period*2*Math.PI)*amp*0.4;
            el.style.transform = `translate(${dx}px,${dy}px)`;
            el._shakeId = requestAnimationFrame(tick);
        };
        el._shakeId = requestAnimationFrame(tick);
        el.addEventListener('pointerdown', () => {
            if (el._shakeId) cancelAnimationFrame(el._shakeId);
            el.style.transform = '';
        }, { once: true });
    }

    // 贴纸互动：点击眨眼或轻微弹跳
    function placeSheepStickers(){
        if (!stickersEl) return;
        const count = 4 + Math.min(6, currentLevel);
        for (let i=0;i<count;i++){
            const s = document.createElement('div');
            s.className = 'sticker';
            s.style.left = (Math.random()*80 + 5) + '%';
            s.style.top = (Math.random()*30 + 8) + '%';
            s.style.animationDelay = (Math.random()*2).toFixed(2)+'s';
            s.style.transform += ` rotate(${(Math.random()*10-5).toFixed(1)}deg)`;
            const sheep = document.createElement('div'); sheep.className = 'w';
            const head = document.createElement('div'); head.className = 'h';
            const eye = document.createElement('div'); eye.className = 'eye';
            const tail = document.createElement('div'); tail.className = 'tail';
            stickersEl.appendChild(s);
            s.appendChild(sheep); s.appendChild(head); head.appendChild(eye); s.appendChild(tail);
            if (Math.random()<0.35){ s.classList.add('stencil'); }
            s.addEventListener('click', () => {
                eye.style.animation = 'blink .22s ease-in 1';
                s.style.animation = 'bob .6s ease-in-out 1';
                setTimeout(()=>{ eye.style.animation=''; s.style.animation=''; }, 300);
            });
        }
    }

    // 在拖拽移动时，如果靠近柜体则微开
    window.addEventListener('pointermove', (e) => {
        const dragging = document.querySelector('.tool.dragging');
        if (!dragging) return;
        const toolRect = dragging.getBoundingClientRect();
        const containerRect = slotsEl.getBoundingClientRect();
        const overlap = !(toolRect.right < containerRect.left || toolRect.left > containerRect.right || toolRect.bottom < containerRect.top || toolRect.top > containerRect.bottom);
        toggleCabinetOpen(overlap);
    }, { passive: true });

    // 工具函数
    function formatTime(sec){
        const s = Math.max(0, sec|0);
        const mm = String((s/60)|0).padStart(2,'0');
        const ss = String(s%60).padStart(2,'0');
        return `${mm}:${ss}`;
    }
    function pickRandom(arr, n){
        const a = [...arr]; const out=[];
        while(a.length && out.length<n){ out.push(a.splice((Math.random()*a.length)|0,1)[0]); }
        return out;
    }
    function shuffle(arr){
        for(let i=arr.length-1;i>0;i--){
            const j=(Math.random()*(i+1))|0; [arr[i],arr[j]]=[arr[j],arr[i]];
        }
        return arr;
    }
    function getPoint(e){
        return { x: e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0,
                 y: e.clientY ?? (e.touches && e.touches[0].clientY) ?? 0 };
    }
    function flash(node, type){
        if(type==='error'){
            const old = node.style.boxShadow;
            node.style.boxShadow = '0 0 0 3px rgba(255,82,82,.25) inset';
            setTimeout(()=> node.style.boxShadow = old, 250);
        }
    }

    // 轻提示
    function toast(text, kind, x, y){
        const t = document.createElement('div');
        t.className = `toast ${kind==='success'?'toast-success':'toast-error'}`;
        t.textContent = text;
        document.body.appendChild(t);
        const tx = Math.max(12, x - t.offsetWidth/2);
        const ty = Math.max(12, y - 40);
        t.style.left = tx + 'px';
        t.style.top = ty + 'px';
        requestAnimationFrame(()=>{
            t.classList.add('show');
        });
        setTimeout(()=>{
            t.classList.remove('show');
            setTimeout(()=> t.remove(), 200);
        }, 900);
    }

    // 随机路过小羊（成群）
    setInterval(() => {
        const flock = 2 + (Math.random()*3|0);
        for (let i=0;i<flock;i++){
            const s = document.createElement('div');
            s.className = 'passing-sheep';
            const vh = 8 + Math.random()*50;
            s.style.bottom = `${vh}vh`;
            const scale = 0.7 + Math.random()*1.0;
            s.style.transform = `scale(${scale})`;
            s.style.animationDelay = (i*0.5 + Math.random()*0.3)+'s';
            document.body.appendChild(s);
            s.addEventListener('animationend', () => s.remove());
        }
    }, 9000 + Math.random()*5000);

    // ===== 新增功能函数 =====

    // 计算星级
    function calculateStars(timeRemaining, totalTime) {
        const percentage = timeRemaining / totalTime;
        if (percentage >= 0.6) return 3; // 剩余60%以上时间 = 3星
        if (percentage >= 0.3) return 2; // 剩余30%以上时间 = 2星
        if (percentage >= 0.1) return 1; // 剩余10%以上时间 = 1星
        return 0; // 剩余时间不足10% = 0星
    }

    // 显示关卡完成界面
    function showLevelComplete(timeUsed, timeBonus, starBonus, totalBonus) {
        const starsContainer = document.getElementById('starsContainer');
        const timeBonusEl = document.getElementById('timeBonus');
        const starBonusEl = document.getElementById('starBonus');
        const totalBonusEl = document.getElementById('totalBonus');
        const resultStats = document.getElementById('resultStats');

        // 确保结果统计区域显示
        if (resultStats) resultStats.style.display = 'grid';

        // 生成星级动画
        starsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.textContent = i < levelStars ? '⭐' : '☆';
            starsContainer.appendChild(star);
        }

        // 更新统计数据
        timeBonusEl.textContent = `+${timeBonus}秒`;
        timeBonusEl.className = 'stat-value time';
        starBonusEl.textContent = `+${starBonus}秒`;
        starBonusEl.className = 'stat-value bonus';
        totalBonusEl.textContent = `+${totalBonus}秒`;
        totalBonusEl.className = 'stat-value';

        // 设置标题
        const titles = ['时间紧张！', '做得不错！', '完美通关！', '传奇表现！'];
        modalTitle.textContent = titles[levelStars] || '完成关卡！';
        modalDesc.textContent = `你在 ${formatTime(timeUsed)} 内完成了归位！获得 ${levelStars} 星评价`;

        // 增加通关小羊跳跃
        const jumper = document.createElement('div');
        jumper.className = 'jump-sheep';
        modal.querySelector('.modal-content').appendChild(jumper);

        // 添加庆祝彩纸效果（仅当获得2星以上时）
        if (levelStars >= 2) {
            createConfetti();
        }

        openModal(modal);
    }

    // 显示游戏结束
    function showGameOver() {
        modalTitle.textContent = '时间到！';
        modalDesc.textContent = '再试一次吧，小羊相信你～';
        const starsContainer = document.getElementById('starsContainer');
        const resultStats = document.getElementById('resultStats');
        if (starsContainer) starsContainer.innerHTML = '';
        if (resultStats) resultStats.style.display = 'none';
        openModal(modal);
    }

    // 显示关卡选择面板
    function showLevelPanel() {
        generateLevelGrid();
        panelDiff.setAttribute('aria-hidden', 'true');
        panelLevel.setAttribute('aria-hidden', 'false');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 生成关卡网格
    function generateLevelGrid() {
        const levelGrid = document.getElementById('levelGrid');
        if (!levelGrid) return;

        // 重新加载进度（可能在登录后进度已更新）
        loadUserProgress();

        levelGrid.innerHTML = '';

        for (let i = 1; i <= MAX_LEVEL; i++) {
            const levelCard = document.createElement('div');
            levelCard.className = 'level-card';

            // 所有关卡都解锁
            const progress = levelProgress[`${currentDiffKey}_${i}`];
            const stars = progress ? progress.stars : 0;

            if (stars > 0) {
                levelCard.classList.add('completed');
            } else {
                levelCard.classList.add('unlocked');
            }

            // 关卡号
            const levelNumber = document.createElement('div');
            levelNumber.className = 'level-number';
            levelNumber.textContent = i;
            levelCard.appendChild(levelNumber);

            // 星级显示
            const levelStars = document.createElement('div');
            levelStars.className = 'level-stars';
            if (stars > 0) {
                levelStars.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
            } else {
                levelStars.textContent = '☆☆☆';
            }
            levelCard.appendChild(levelStars);

            // 难度显示
            const levelDiff = document.createElement('div');
            levelDiff.className = 'level-difficulty';
            levelDiff.textContent = DIFFS[currentDiffKey].name;
            levelCard.appendChild(levelDiff);

            // 所有关卡都可以点击
            levelCard.addEventListener('click', () => {
                currentLevel = i;
                panelLevel.setAttribute('aria-hidden', 'true');
                startLevel();
            });

            levelGrid.appendChild(levelCard);
        }
    }

    // 保存关卡进度
    function saveLevelProgress(level, stars) {
        const key = `${currentDiffKey}_${level}`;
        const existing = levelProgress[key] || { stars: 0, bestTime: Infinity };

        // 只保存最好的成绩
        if (stars > existing.stars) {
            existing.stars = stars;
        }

        levelProgress[key] = existing;
        
        // 临时保存到sessionStorage
        sessionStorage.setItem('sheepToolGameProgressTemp', JSON.stringify(levelProgress));
    }

    // 简化初始化（所有关卡已解锁）
    function initializeGame() {
        // 所有关卡已解锁，无需特殊初始化
        console.log('游戏已初始化，所有100个关卡解锁！');
    }

    // 显示轻量提示
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // 样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: type === 'success' ? 'linear-gradient(135deg, #2ecc71, #27ae60)' :
                        type === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' :
                        'linear-gradient(135deg, var(--brand), var(--brand-2))',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: '10000',
            animation: 'toastSlideIn 0.4s ease-out'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.4s ease-out';
            setTimeout(() => toast.remove(), 400);
        }, 2000);
    }

    // 创建庆祝彩纸效果
    function createConfetti() {
        const colors = ['#7c5cff', '#ff7cc8', '#ffd700', '#2ecc71', '#ff6b6b'];
        const pieceCount = levelStars === 3 ? 50 : 30; // 3星更多彩纸

        for (let i = 0; i < pieceCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
                document.body.appendChild(confetti);

                confetti.addEventListener('animationend', () => confetti.remove());
            }, i * 30);
        }
    }

    // 重置游戏进度（开发调试用）
    function resetProgress() {
        if (confirm('确定要重置所有游戏进度吗？这将清除你的关卡记录和奖励时间！')) {
            localStorage.removeItem('sheepToolGameProgress');
            bonusTime = 0;
            location.reload();
        }
    }

    // 更新主题按钮状态
    function updateThemeButtons() {
        const currentTheme = gameRoot.getAttribute('data-theme') || 'pasture';
        themeBtns.forEach(btn => {
            const theme = btn.getAttribute('data-theme');
            if (theme === currentTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 页面加载时初始化
    initializeGame();

    // 开发调试：长按标题重置进度
    document.addEventListener('DOMContentLoaded', () => {
        const title = document.querySelector('.game-title');
        if (title) {
            let pressTimer;
            title.addEventListener('mousedown', () => {
                pressTimer = setTimeout(() => {
                    resetProgress();
                }, 3000);
            });
            title.addEventListener('mouseup', () => clearTimeout(pressTimer));
            title.addEventListener('mouseleave', () => clearTimeout(pressTimer));
        }
    });

})();
