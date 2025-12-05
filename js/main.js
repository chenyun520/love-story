// 范小羊工具归位/水果派对小游戏 (Integrated Version)
(function () {
    const hero = document.getElementById('hero'); // Might be missing in magazine mode, check existence
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
    const stickersEl = document.getElementById('sheepStickers'); // Might not exist in game.html simplified

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const btnNext = document.getElementById('btnNext');
    const btnRetry = document.getElementById('btnRetry');
    const btnHome = document.getElementById('btnHome');

    // --- Data Pools ---
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

    const FAKE_TOOLS = [
        { id: 'fake-magnet', name: '磁铁', emoji: '🧲' },
        { id: 'fake-link', name: '链环', emoji: '🔗' },
        { id: 'fake-toolbox', name: '工具箱', emoji: '🧰' },
        { id: 'fake-ext', name: '灭火器', emoji: '🧯' },
        { id: 'fake-axe', name: '斧头', emoji: '🪓' },
        { id: 'fake-hook', name: '吊钩', emoji: '🪝' }
    ];

    const FRUITS = [
        { id: 'apple', name: '苹果', emoji: '🍎' },
        { id: 'banana', name: '香蕉', emoji: '🍌' },
        { id: 'grapes', name: '葡萄', emoji: '🍇' },
        { id: 'watermelon', name: '西瓜', emoji: '🍉' },
        { id: 'lemon', name: '柠檬', emoji: '🍋' },
        { id: 'peach', name: '桃子', emoji: '🍑' },
        { id: 'cherry', name: '樱桃', emoji: '🍒' },
        { id: 'strawberry', name: '草莓', emoji: '🍓' },
        { id: 'kiwi', name: '猕猴桃', emoji: '🥝' },
        { id: 'pineapple', name: '菠萝', emoji: '🍍' }
    ];

    const FAKE_FRUITS = [
        { id: 'fake-tomato', name: '番茄', emoji: '🍅' },
        { id: 'fake-eggplant', name: '茄子', emoji: '🍆' },
        { id: 'fake-corn', name: '玉米', emoji: '🌽' },
        { id: 'fake-carrot', name: '胡萝卜', emoji: '🥕' },
        { id: 'fake-pepper', name: '辣椒', emoji: '🌶️' }
    ];

    const DIFFS = {
        easy:   { name: '新手', time: 30, toolsBase: 4, addPerLevel: 1, shake: 'none', distractors: 1 },
        normal: { name: '进阶', time: 30, toolsBase: 5, addPerLevel: 1, shake: 'mild', distractors: 2 },
        hard:   { name: '高手', time: 30, toolsBase: 6, addPerLevel: 2, shake: 'moderate', distractors: 3 },
        insane: { name: '地狱', time: 30, toolsBase: 7, addPerLevel: 2, shake: 'extreme', distractors: 5 }
    };

    // --- State ---
    let currentMode = 'tools'; // Default
    let currentDiffKey = 'easy';
    let currentLevel = 1;
    let levelItems = [];
    let placedCount = 0;
    let countdownId = null;
    let timeLeft = 0;
    let totalTime = 0;
    let bonusTime = 0;
    let levelStars = 0;
    let levelProgress = {};
    const MAX_LEVEL = 100;

    // --- Initialization ---

    // Expose init for game.html
    window.initGame = function() {
        if (window.GAME_MODE) currentMode = window.GAME_MODE;
        loadUserProgress();
        // Skip hero logic if in embedded mode
        if(window.GAME_MODE) {
            currentDiffKey = 'easy'; // Default start
            startLevel();
        }
    };

    function loadUserProgress() {
        // Simplified for static
        levelProgress = JSON.parse(sessionStorage.getItem('sheepToolGameProgressTemp') || '{}');
    }

    // --- Event Listeners ---

    // Conditional Listeners (some elements might be missing in simplified view)
    if(btnStart) btnStart.addEventListener('click', () => {
        if(hero) hero.style.display = 'none';
        if(panelDiff) panelDiff.setAttribute('aria-hidden', 'false');
    });

    if(btnHow) btnHow.addEventListener('click', () => openModal(howModal));
    if(btnHowClose) btnHowClose.addEventListener('click', () => closeModal(howModal));

    if (btnLevelSelect) {
        btnLevelSelect.addEventListener('click', () => showLevelPanel());
    }

    if (btnBackFromLevelPanel) {
        btnBackFromLevelPanel.addEventListener('click', () => {
            panelLevel.setAttribute('aria-hidden', 'true');
            if(panelDiff) panelDiff.setAttribute('aria-hidden', 'false');
        });
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    function setTheme(theme){
        if(!gameRoot) return;
        gameRoot.classList.remove('theme-pasture','theme-kids','theme-garage');
        if (theme === 'pasture') gameRoot.classList.add('theme-pasture');
        if (theme === 'kids') gameRoot.classList.add('theme-kids');
        if (theme === 'garage') gameRoot.classList.add('theme-garage');
    }

    diffCards.forEach((card) => {
        card.addEventListener('click', () => {
            currentDiffKey = card.getAttribute('data-diff');
            currentLevel = 1;
            startLevel();
        });
    });

    if(btnRestart) btnRestart.addEventListener('click', () => startLevel());

    // Back button in Game UI usually goes to Difficulty Select
    if(btnBack) btnBack.addEventListener('click', () => {
        stopTimer();
        resetStage();
        if(gameRoot) gameRoot.setAttribute('aria-hidden', 'true');
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) gameContainer.setAttribute('aria-hidden', 'true'); // Or display none

        // In embedded mode, maybe go back to Mode Selection?
        // But for now, let's just go back to Diff Panel
        if(panelDiff) panelDiff.setAttribute('aria-hidden', 'false');
    });

    // Modal Actions
    if(btnNext) btnNext.addEventListener('click', () => {
        closeModal(modal);
        currentLevel += 1;
        startLevel();
    });
    if(btnRetry) btnRetry.addEventListener('click', () => {
        closeModal(modal);
        startLevel();
    });
    if(btnHome) btnHome.addEventListener('click', () => {
        closeModal(modal);
        // Reload page to reset to mode selection
        window.location.reload();
    });

    // --- Core Logic ---

    function startLevel() {
        if(panelDiff) panelDiff.setAttribute('aria-hidden', 'true');
        if(panelLevel) panelLevel.setAttribute('aria-hidden', 'true');
        if(gameRoot) gameRoot.setAttribute('aria-hidden', 'false');

        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.display = 'grid'; // Ensure grid
            gameContainer.setAttribute('aria-hidden', 'false');
        }

        updateThemeButtons();
        resetStage();

        const diff = DIFFS[currentDiffKey];
        if(difficultyNameEl) difficultyNameEl.textContent = diff.name;
        if(levelNoEl) levelNoEl.textContent = String(currentLevel);

        // Select Pool based on Mode
        const pool = currentMode === 'fruit' ? FRUITS : TOOLS;
        const fakePool = currentMode === 'fruit' ? FAKE_FRUITS : FAKE_TOOLS;

        const count = Math.min(pool.length, diff.toolsBase + (currentLevel - 1) * diff.addPerLevel);
        levelItems = pickRandom(pool, count);

        buildSlots(levelItems);

        const distractorCount = diff.distractors || 0;
        const distractors = pickRandom(fakePool, distractorCount);

        buildItems(levelItems, { shake: diff.shake, distractors });

        // Only place stickers in Tools mode or if element exists
        if(stickersEl && currentMode === 'tools') placeSheepStickers();

        const preparedSeconds = diff.time - Math.max(0, currentLevel - 1) * 1;
        prepareTimer(preparedSeconds);
        showGameStartScreen();
    }

    function resetStage() {
        placedCount = 0;
        levelItems = [];
        if(slotsEl) slotsEl.innerHTML = '';
        if(trayEl) trayEl.innerHTML = '';
        if (stickersEl) stickersEl.innerHTML = '';
        stopTimer();
    }

    function buildSlots(items) {
        if(!slotsEl) return;
        const shuffled = shuffle([...items]);
        shuffled.forEach((item) => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.accept = item.id;

            const ghost = document.createElement('div');
            ghost.className = 'silhouette';
            ghost.textContent = item.emoji;
            const rot = (Math.random()*10 - 5);
            ghost.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
            slot.appendChild(ghost);

            slotsEl.appendChild(slot);
        });

        // Handle
        if (!document.querySelector('.slots .handle')) {
            const h = document.createElement('div');
            h.className = 'handle';
            slotsEl.appendChild(h);
        }
    }

    function buildItems(items, { shake, distractors=[] }) {
        if(!trayEl) return;
        const source = shuffle([...items, ...distractors]);

        source.forEach((item) => {
            const el = document.createElement('div');
            el.className = 'tool';
            el.draggable = false;
            el.dataset.id = item.id;

            const icon = document.createElement('div');
            icon.className = 'emoji';
            if(currentMode === 'fruit') icon.classList.add('fruit-icon'); // Helper for bigger size
            icon.textContent = item.emoji;
            el.appendChild(icon);

            // Name
            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = item.name;
            el.appendChild(name);

            if (shake) randomShake(el);
            enableDrag(el);
            trayEl.appendChild(el);
        });

        requestAnimationFrame(() => {
            distributeToolsNoOverlap(trayEl, 8, 300);
        });
    }

    function enableDrag(el) {
        let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false;

        const onDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            e.preventDefault(); e.stopPropagation();
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
            el.style.pointerEvents = 'none'; // Passthrough

            document.body.appendChild(el);

            try { if (e.pointerId != null && el.setPointerCapture) el.setPointerCapture(e.pointerId); } catch(_){}
            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', onUp, { once: true });
            window.addEventListener('pointercancel', onUp, { once: true });
        };

        const onMove = (e) => {
            if (!dragging) return;
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
            try { if (e && e.pointerId != null && el.releasePointerCapture) el.releasePointerCapture(e.pointerId); } catch(_){}

            const dropOk = tryDrop(el);
            if (!dropOk) {
                // Return to tray logic
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

    function toggleCabinetOpen(on){
        if(!slotsEl) return;
        const container = slotsEl.closest('.slots');
        if (!container) return;
        if (on) container.classList.add('open'); else container.classList.remove('open');
    }

    function tryDrop(toolEl) {
        const itemId = toolEl.dataset.id;
        const toolRect = toolEl.getBoundingClientRect();
        const slots = Array.from(slotsEl.querySelectorAll('.slot'));

        for (const slot of slots) {
            const rect = slot.getBoundingClientRect();
            const overlap = rect.left < toolRect.right && rect.right > toolRect.left && rect.top < toolRect.bottom && rect.bottom > toolRect.top;

            if (overlap) {
                if (slot.dataset.accept === itemId && !slot.classList.contains('success')) {
                    // Match
                    slot.classList.add('success');
                    slot.innerHTML = '';
                    const ok = document.createElement('div');
                    ok.className = 'emoji';
                    if(currentMode === 'fruit') ok.classList.add('fruit-icon');

                    const pool = currentMode === 'fruit' ? FRUITS : TOOLS;
                    ok.textContent = pool.find(t=>t.id===itemId)?.emoji || '✅';
                    slot.appendChild(ok);

                    toolEl.remove();
                    placedCount += 1;

                    toast('匹配成功！', 'success', rect.left + rect.width/2, rect.top);
                    checkWin();
                    return true;
                } else {
                    flash(slot, 'error');
                    toast('不对哦', 'error', rect.left + rect.width/2, rect.top);
                    return false;
                }
            }
        }
        toggleCabinetOpen(false);
        return false;
    }

    function checkWin() {
        if (placedCount >= levelItems.length) {
            stopTimer();
            const timeUsed = totalTime - timeLeft;
            levelStars = calculateStars(timeLeft, totalTime);
            const timeBonusSeconds = Math.floor(timeLeft * 0.5);
            const starBonusSeconds = levelStars * 5;
            const totalBonus = timeBonusSeconds + starBonusSeconds;
            bonusTime += totalBonus;

            saveLevelProgress(currentLevel, levelStars);
            showLevelComplete(timeUsed, timeBonusSeconds, starBonusSeconds, totalBonus);
        }
    }

    // ... (Timer, Helpers, Distribute - mostly same as before) ...

    function startTimer(seconds) {
        stopTimer();
        const baseTime = 30;
        const timeBonus = Math.floor(bonusTime * 0.4);
        totalTime = baseTime + timeBonus;
        if (typeof seconds === 'number' && seconds > 0 && seconds < totalTime) {
            totalTime = seconds + timeBonus;
        }
        timeLeft = totalTime;
        updateTimerUI();
        if (timeBonus > 0) showToast(`+${timeBonus}秒 奖励时间！`, 'success');

        countdownId = setInterval(() => {
            timeLeft -= 1;
            updateTimerUI();
            if (timeLeft <= 0) {
                stopTimer();
                showGameOver();
            }
        }, 1000);
    }

    let _preparedSeconds = null;
    function prepareTimer(seconds){
        _preparedSeconds = seconds || 30;
        const baseTime = 30;
        const timeBonus = Math.floor(bonusTime * 0.4);
        totalTime = Math.max(baseTime, _preparedSeconds) + timeBonus;
        timeLeft = totalTime;
        updateTimerUI();
    }

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
            hideGameStartScreen();
            requestAnimationFrame(() => {
                distributeToolsNoOverlap(trayEl, 8, 300);
                startTimer(_preparedSeconds);
            });
        });
    }

    function distributeToolsNoOverlap(container, padding = 8, maxAttempts = 200) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const tools = Array.from(container.querySelectorAll('.tool'));
        const placed = [];
        tools.forEach((t) => { t.style.position = 'absolute'; t.style.left = '0px'; t.style.top = '0px'; });
        tools.forEach((t) => {
            const w = t.offsetWidth; const h = t.offsetHeight;
            let attempt = 0; let placedOk = false;
            while (attempt < maxAttempts && !placedOk) {
                const left = padding + Math.random() * Math.max(0, rect.width - w - padding * 2);
                const top = padding + Math.random() * Math.max(0, rect.height - h - padding * 2);
                const r = {left, top, right: left + w, bottom: top + h};
                const gap = 6;
                const overlap = placed.some(p => !(r.right + gap < p.left || r.left - gap > p.right || r.bottom + gap < p.top || r.top - gap > p.bottom));
                if (!overlap) { placed.push(r); t.style.left = left + 'px'; t.style.top = top + 'px'; placedOk = true; }
                attempt++;
            }
            if (!placedOk) {
                t.style.left = (padding + Math.random() * (rect.width - w)) + 'px';
                t.style.top = (padding + Math.random() * (rect.height - h)) + 'px';
            }
        });
    }

    function stopTimer() { if (countdownId) clearInterval(countdownId); countdownId = null; }
    function updateTimerUI() {
        if(!timerBar || !timerText) return;
        const pct = Math.max(0, (timeLeft / totalTime) * 100);
        timerBar.style.width = pct + '%';
        timerText.textContent = formatTime(timeLeft);
        if (timeLeft <= 10 && timeLeft > 0) timerBar.classList.add('warning'); else timerBar.classList.remove('warning');
    }

    function openModal(m) { m.setAttribute('aria-hidden','false'); }
    function closeModal(m) { m.setAttribute('aria-hidden','true'); m.querySelector('.jump-sheep')?.remove(); }

    function randomShake(el) { /* ... same ... */
        const amp = 3 + Math.random()*3;
        const period = 1200 + Math.random()*800;
        let t = 0;
        const tick = () => { t += 16; const dx = Math.sin(t/period*2*Math.PI)*amp; const dy = Math.cos(t/period*2*Math.PI)*amp*0.4; el.style.transform = `translate(${dx}px,${dy}px)`; el._shakeId = requestAnimationFrame(tick); };
        el._shakeId = requestAnimationFrame(tick);
        el.addEventListener('pointerdown', () => { if (el._shakeId) cancelAnimationFrame(el._shakeId); el.style.transform = ''; }, { once: true });
    }

    function placeSheepStickers(){
        if (!stickersEl) return;
        stickersEl.innerHTML = '';
        const count = 4 + Math.min(6, currentLevel);
        for (let i=0;i<count;i++){
            const s = document.createElement('div'); s.className = 'sticker';
            s.style.left = (Math.random()*80 + 5) + '%'; s.style.top = (Math.random()*30 + 8) + '%';
            s.style.animationDelay = (Math.random()*2).toFixed(2)+'s';
            s.style.transform += ` rotate(${(Math.random()*10-5).toFixed(1)}deg)`;
            s.innerHTML = '<div class="w"></div><div class="h"><div class="eye"></div></div><div class="tail"></div>';
            stickersEl.appendChild(s);
        }
    }

    // Helpers
    function formatTime(sec){ const s = Math.max(0, sec|0); return `${String((s/60)|0).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
    function pickRandom(arr, n){ const a = [...arr]; const out=[]; while(a.length && out.length<n){ out.push(a.splice((Math.random()*a.length)|0,1)[0]); } return out; }
    function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
    function getPoint(e){ return { x: e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0, y: e.clientY ?? (e.touches && e.touches[0].clientY) ?? 0 }; }
    function flash(node, type){ if(type==='error'){ const old = node.style.boxShadow; node.style.boxShadow = '0 0 0 3px rgba(255,82,82,.25) inset'; setTimeout(()=> node.style.boxShadow = old, 250); } }

    function toast(text, kind, x, y){
        const t = document.createElement('div');
        t.className = `toast ${kind==='success'?'toast-success':'toast-error'}`;
        t.textContent = text;
        document.body.appendChild(t);
        // Default position center if x,y missing
        if(!x) { x = window.innerWidth/2; y = window.innerHeight/2; }
        const tx = Math.max(12, x - t.offsetWidth/2);
        const ty = Math.max(12, y - 40);
        t.style.left = tx + 'px'; t.style.top = ty + 'px';
        requestAnimationFrame(()=>{ t.classList.add('show'); });
        setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> t.remove(), 200); }, 900);
    }

    function showLevelComplete(timeUsed, timeBonus, starBonus, totalBonus) { /* ... same ... */
        if(modal) {
            modalTitle.textContent = '完成！';
            modalDesc.textContent = `用时: ${formatTime(timeUsed)} 奖励: +${totalBonus}s`;
            // Simplified for now
            if (levelStars >= 2) createConfetti();
            openModal(modal);
        }
    }

    function showGameOver() {
        modalTitle.textContent = '时间到！';
        openModal(modal);
    }

    function createConfetti() {
        const colors = ['#7c5cff', '#ff7cc8', '#ffd700', '#2ecc71'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const c = document.createElement('div'); c.className = 'confetti';
                c.style.left = Math.random() * 100 + '%';
                c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                document.body.appendChild(c);
            }, i * 30);
        }
    }

    function saveLevelProgress(level, stars) {
        // ... simple implementation ...
    }

    function updateThemeButtons() {
        const currentTheme = gameRoot.getAttribute('data-theme') || 'pasture';
        themeBtns.forEach(btn => {
            if (btn.getAttribute('data-theme') === currentTheme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    // Auto Init if embedded
    if(window.GAME_MODE) {
        // window.initGame(); // already exposed
    }

})();
