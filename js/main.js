// 范小羊工具归位/水果派对小游戏
(function () {
    // --- Globals ---
    // Note: Many IDs might not exist in the new simplified game.html
    // We must check for existence before using.

    const slotsEl = document.getElementById('slots');
    const trayEl = document.getElementById('toolsTray');
    const timerText = document.getElementById('timerDisplay'); // New ID in game.html
    const modal = document.getElementById('modal');
    const btnNext = document.getElementById('btnNext');
    const btnStartGame = document.getElementById('btnStartGame');
    const startScreen = document.getElementById('gameStartScreen');
    const playScreen = document.getElementById('gamePlayScreen');

    // --- Data: Tools Mode ---
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

    // --- Data: Fruit Mode ---
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

    // Simplified Difficulty for Magazine Version
    const DIFF = { name: '标准', time: 45, itemsBase: 5, addPerLevel: 1, shake: 'mild', distractors: 2 };

    // --- State ---
    let currentMode = 'tools'; // 'tools' or 'fruit'
    let currentLevel = 1;
    let levelItems = [];
    let placedCount = 0;
    let countdownId = null;
    let timeLeft = 0;
    let totalTime = 0;

    // --- Public API ---

    window.initGame = function() {
        if (window.GAME_MODE) {
            currentMode = window.GAME_MODE;
        }
        currentLevel = 1;
        showStartScreen();
    };
    
    // Explicit reset called when switching modes
    window.resetGameLevel = function() {
        if (window.GAME_MODE) {
            currentMode = window.GAME_MODE;
        }
        // Force stop any running game
        stopTimer();
        currentLevel = 1;
        document.getElementById('levelNo').textContent = currentLevel;
        showStartScreen();
    }

    // --- Core Logic ---

    function startLevel() {
        resetStage();

        // Setup Level Data
        const pool = currentMode === 'fruit' ? FRUITS : TOOLS;
        const fakePool = currentMode === 'fruit' ? FAKE_FRUITS : FAKE_TOOLS;

        // Calculate item count based on level
        const count = Math.min(pool.length, DIFF.itemsBase + (currentLevel - 1));

        // Pick items
        levelItems = pickRandom(pool, count);
        buildSlots(levelItems);

        // Add distractors
        const distractorCount = Math.min(3, 1 + Math.floor(currentLevel/3));
        const distractors = pickRandom(fakePool, distractorCount);

        buildItems(levelItems, { distractors });

        // Update UI
        document.getElementById('levelNo').textContent = currentLevel;

        // Timer
        const timeAllowance = DIFF.time - (currentLevel * 2);
        const actualTime = Math.max(15, timeAllowance); // Minimum 15s

        prepareTimer(actualTime);
    }

    function resetStage() {
        placedCount = 0;
        levelItems = [];
        slotsEl.innerHTML = '';
        trayEl.innerHTML = '';
        stopTimer();
    }

    function showStartScreen() {
        if(startScreen) startScreen.style.display = 'flex';
        // if(playScreen) playScreen.style.visibility = 'hidden';
        // Actually visibility hidden retains layout, let's just cover it with absolute pos startScreen
    }

    function hideStartScreen() {
        if(startScreen) startScreen.style.display = 'none';
        if(playScreen) playScreen.style.visibility = 'visible';
    }

    if(btnStartGame) {
        btnStartGame.addEventListener('click', () => {
            hideStartScreen();
            startLevel();
            startTimer();
        });
    }

    if(btnNext) {
        btnNext.addEventListener('click', () => {
            closeModal();
            currentLevel++;
            startLevel();
            startTimer();
        });
    }

    // --- Builders ---

    function buildSlots(items) {
        const shuffled = shuffle([...items]);
        shuffled.forEach((item) => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.accept = item.id;

            const ghost = document.createElement('div');
            ghost.className = 'silhouette';
            ghost.textContent = item.emoji;
            // Slight rotation for fun
            const rot = (Math.random()*10 - 5);
            ghost.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;

            slot.appendChild(ghost);
            slotsEl.appendChild(slot);
        });
    }

    function buildItems(items, { distractors=[] }) {
        const source = shuffle([...items, ...distractors]);

        source.forEach((item) => {
            const el = document.createElement('div');
            el.className = 'tool';
            el.draggable = false;
            el.dataset.id = item.id;

            const icon = document.createElement('div');
            icon.className = 'emoji';
            icon.textContent = item.emoji;
            el.appendChild(icon);

            // Name (only for tools to help ID)
            if(currentMode === 'tools') {
                const name = document.createElement('div');
                name.className = 'name';
                name.textContent = item.name;
                el.appendChild(name);
            }

            enableDrag(el);
            trayEl.appendChild(el);
        });

        // Distribute nicely
        setTimeout(() => distributeTools(trayEl), 100);
    }

    // --- Drag & Drop ---

    function enableDrag(el) {
        let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false;

        const onDown = (e) => {
            e.preventDefault(); e.stopPropagation();
            const p = getPoint(e);
            dragging = true;
            el.classList.add('dragging');

            // Move to body to float above everything
            const rect = el.getBoundingClientRect();
            originX = rect.left + window.scrollX;
            originY = rect.top + window.scrollY;

            // Set initial absolute position matching current spot
            el.style.position = 'absolute';
            el.style.left = originX + 'px';
            el.style.top = originY + 'px';
            el.style.zIndex = 1000;

            startX = p.x - originX;
            startY = p.y - originY;

            document.body.appendChild(el);

            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', onUp, { once: true });
        };

        const onMove = (e) => {
            if (!dragging) return;
            e.preventDefault();
            const p = getPoint(e);
            el.style.left = (p.x - startX) + 'px';
            el.style.top = (p.y - startY) + 'px';
        };

        const onUp = (e) => {
            dragging = false;
            el.classList.remove('dragging');
            el.style.zIndex = '';
            window.removeEventListener('pointermove', onMove);

            const dropOk = tryDrop(el);
            if (!dropOk) {
                returnToTray(el);
            }
        };
        el.addEventListener('pointerdown', onDown);
    }

    function returnToTray(el) {
        trayEl.appendChild(el);
        el.style.position = 'relative';
        el.style.left = 'auto';
        el.style.top = 'auto';
        el.style.transform = 'none';
    }

    function tryDrop(toolEl) {
        const itemId = toolEl.dataset.id;
        const toolRect = toolEl.getBoundingClientRect();
        const slots = Array.from(slotsEl.querySelectorAll('.slot'));

        for (const slot of slots) {
            const rect = slot.getBoundingClientRect();
            // Check center point overlap
            const cx = toolRect.left + toolRect.width/2;
            const cy = toolRect.top + toolRect.height/2;

            if (cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom) {

                if (slot.dataset.accept === itemId && !slot.classList.contains('success')) {
                    // Success Match
                    slot.classList.add('success');
                    slot.innerHTML = ''; // Clear ghost

                    const ok = document.createElement('div');
                    ok.className = 'emoji';
                    const pool = currentMode === 'fruit' ? FRUITS : TOOLS;
                    ok.textContent = pool.find(t=>t.id===itemId)?.emoji || '✅';
                    slot.appendChild(ok);

                    toolEl.remove(); // Remove dragged item
                    placedCount++;

                    checkWin();
                    return true;
                }
            }
        }
        return false;
    }

    function checkWin() {
        if (placedCount >= levelItems.length) {
            stopTimer();
            showWinModal();
        }
    }

    // --- Timer ---

    function prepareTimer(seconds) {
        totalTime = seconds;
        timeLeft = seconds;
        updateTimerDisplay();
    }

    function startTimer() {
        stopTimer();
        countdownId = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if(timeLeft <= 0) {
                stopTimer();
                alert("时间到！再试一次吧！");
                startLevel(); // Restart level
            }
        }, 1000);
    }

    function stopTimer() {
        if(countdownId) clearInterval(countdownId);
    }

    function updateTimerDisplay() {
        if(timerText) {
            const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const ss = (timeLeft % 60).toString().padStart(2, '0');
            timerText.textContent = `${mm}:${ss}`;

            if(timeLeft < 10) timerText.style.color = 'var(--error)';
            else timerText.style.color = 'var(--text-main)';
        }
    }

    // --- Helpers ---

    function distributeTools(container) {
        // Just let flexbox/grid handle it in tray, but we had random position logic before.
        // For simplified version, standard flow is better for mobile.
        // We removed absolute positioning logic in 'returnToTray', so this is fine.
    }

    function showWinModal() {
        if(modal) {
            modal.setAttribute('aria-hidden', 'false');
            // Celebrate
            createConfetti();
        }
    }

    function closeModal() {
        if(modal) modal.setAttribute('aria-hidden', 'true');
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

    function createConfetti() {
        const colors = ['#7c5cff', '#ff7cc8', '#ffd700', '#2ecc71'];
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.style.position = 'fixed';
            c.style.left = Math.random()*100 + 'vw';
            c.style.top = '-10px';
            c.style.width = '10px';
            c.style.height = '10px';
            c.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
            c.style.transition = 'top 2s ease-in, transform 2s linear';
            c.style.zIndex = 9999;
            document.body.appendChild(c);

            setTimeout(() => {
                c.style.top = '100vh';
                c.style.transform = `rotate(${Math.random()*360}deg)`;
            }, 100);

            setTimeout(() => c.remove(), 2000);
        }
    }

})();
