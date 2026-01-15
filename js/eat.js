(function () {
  const MAIN_DISHES = [
    {
      id: 'jx',
      name: '美味江西小炒',
      icon: '🍆🥘',
      detail: '推荐理由主打：茄子煲',
      tags: ['spicy', 'comfort', 'rice', 'quick']
    },
    { id: 'xhotpot', name: '举高高旋转小火锅', icon: '🍲', detail: '热乎乎的小火锅', tags: ['hotpot', 'comfort', 'group'] },
    { id: 'dominos', name: '永康之芯达美乐', icon: '🍕', detail: '披萨快乐', tags: ['pizza', 'fast', 'group'] },
    { id: 'yunnan', name: '傣香云云南菜', icon: '🥗', detail: '清爽酸辣开胃', tags: ['light', 'spicy'] },
    { id: 'kfc', name: '肯德基', icon: '🍗', detail: '省事又解馋', tags: ['fast', 'fried'] },
    { id: 'pizzahut', name: '万达必胜客', icon: '🍕', detail: '披萨+小食组合', tags: ['pizza', 'group'] },
    { id: 'bk', name: '宝龙汉堡王', icon: '🍔', detail: '汉堡一口满足', tags: ['fast', 'fried'] },
    { id: 'beefhotpot', name: '一牛九品牛肉火锅', icon: '🥩🍲', detail: '牛肉火锅补能量', tags: ['hotpot', 'beef', 'comfort', 'group'] },
    { id: 'luosifen', name: '螺蛳粉', icon: '🍜', detail: '重口但很治愈', tags: ['noodle', 'spicy', 'comfort'] },
    { id: 'zhou', name: '韦记砂锅粥', icon: '🥣', detail: '暖胃又舒服', tags: ['soup', 'comfort', 'light'] }
  ];

  const SIDE_DISHES = [
    { id: 'none', name: '今天不吃配菜', icon: '🚫', tags: ['none'] },
    { id: 'milktea', name: '喝奶茶', icon: '🧋', tags: ['drink', 'sweet'] },
    { id: 'duckhead', name: '衢州鸭头', icon: '🦆', tags: ['savory', 'spicy'] },
    { id: 'coke', name: '喝可乐', icon: '🥤', tags: ['drink'] },
    { id: 'scallion', name: '小葱饼', icon: '🥞', tags: ['snack', 'savory'] },
    { id: 'juewei', name: '绝味鸭脖', icon: '🍗', tags: ['savory', 'spicy'] },
    { id: 'zhouheiya', name: '周黑鸭', icon: '🦆', tags: ['savory', 'spicy'] }
  ];

  const WEEKDAY_LABELS = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
  };

  const WEATHER_LABELS = {
    sunny: '晴朗',
    cloudy: '多云',
    rainy: '下雨',
    hot: '炎热',
    cold: '寒冷',
    windy: '大风',
    custom: '自定义'
  };

  const MOOD_LABELS = {
    happy: '开心',
    calm: '平静',
    tired: '有点累',
    down: '有点丧',
    treat: '想放纵一下',
    custom: '自定义'
  };

  function clampNonNegative(n) {
    return n < 0 ? 0 : n;
  }

  function normalizeWeights(items) {
    const sum = items.reduce((acc, it) => acc + it.weight, 0);
    if (sum <= 0) {
      const w = 1 / items.length;
      return items.map(it => ({ ...it, weight: w }));
    }
    return items.map(it => ({ ...it, weight: it.weight / sum }));
  }

  function pickWeighted(items, rng = Math.random) {
    const list = normalizeWeights(items);
    const r = rng();
    let acc = 0;
    for (const it of list) {
      acc += it.weight;
      if (r <= acc) return it.item;
    }
    return list[list.length - 1].item;
  }

  function isWeekend(weekday) {
    return weekday === 0 || weekday === 6;
  }

  function buildContext({ weekday, weatherKey, weatherText, moodKey, moodText }) {
    const weekdayLabel = WEEKDAY_LABELS[weekday] || '今天';
    const weatherLabel = weatherKey === 'custom' ? (weatherText || '天气一般') : (WEATHER_LABELS[weatherKey] || '天气一般');
    const moodLabel = moodKey === 'custom' ? (moodText || '心情一般') : (MOOD_LABELS[moodKey] || '心情一般');

    return {
      weekday,
      weekdayLabel,
      weatherKey,
      weatherLabel,
      moodKey,
      moodLabel,
      weekend: isWeekend(weekday)
    };
  }

  function scoreMainDish(dish, ctx) {
    let score = 10;
    const tags = new Set(dish.tags || []);

    if (ctx.weekend) {
      if (tags.has('group')) score += 4;
      if (tags.has('pizza')) score += 2;
      if (tags.has('hotpot')) score += 2;
    } else {
      if (tags.has('quick')) score += 2;
      if (tags.has('fast')) score += 3;
    }

    if (ctx.weatherKey === 'rainy' || ctx.weatherKey === 'cold') {
      if (tags.has('hotpot')) score += 5;
      if (tags.has('soup')) score += 5;
      if (tags.has('comfort')) score += 3;
      if (tags.has('noodle')) score += 2;
      if (tags.has('light')) score -= 1;
    }

    if (ctx.weatherKey === 'hot') {
      if (tags.has('light')) score += 4;
      if (tags.has('soup') || tags.has('hotpot')) score -= 2;
      if (tags.has('spicy')) score -= 1;
    }

    if (ctx.weatherKey === 'sunny') {
      if (tags.has('group')) score += 1;
      if (tags.has('light')) score += 1;
    }

    if (ctx.moodKey === 'tired') {
      if (tags.has('fast')) score += 4;
      if (tags.has('comfort')) score += 3;
      if (tags.has('hotpot')) score -= 1;
    }

    if (ctx.moodKey === 'down') {
      if (tags.has('comfort')) score += 5;
      if (tags.has('hotpot') || tags.has('soup')) score += 2;
    }

    if (ctx.moodKey === 'happy') {
      if (tags.has('group')) score += 3;
      if (tags.has('spicy')) score += 2;
      if (tags.has('pizza')) score += 2;
    }

    if (ctx.moodKey === 'treat') {
      if (tags.has('fried')) score += 4;
      if (tags.has('hotpot')) score += 3;
      if (tags.has('spicy')) score += 2;
    }

    if (dish.id === 'jx') score += 1;

    return score;
  }

  function pickOne(items, rng = Math.random) {
    if (!items.length) return null;
    return items[Math.floor(rng() * items.length)];
  }

  function pickSidePureRandom(rng = Math.random) {
    if (rng() < 0.5) return SIDE_DISHES[0];
    const others = SIDE_DISHES.slice(1);
    return pickOne(others, rng);
  }

  function dishTone(main) {
    const tags = new Set(main.tags || []);
    if (main.id === 'jx') return '来点下饭又有锅气的';
    if (tags.has('hotpot')) return '热热闹闹涮一顿';
    if (tags.has('soup')) return '暖胃又舒服';
    if (tags.has('pizza')) return '轻松快乐的';
    if (tags.has('fried')) return '放纵一下也没关系';
    if (tags.has('noodle')) return '重口但很治愈';
    if (tags.has('light')) return '清爽一点刚刚好';
    return '就顺着感觉吃';
  }

  function sideTone(side) {
    if (!side || side.id === 'none') return '配菜就先不加了';
    if (side.id === 'milktea') return '再来杯奶茶加点甜';
    if (side.id === 'coke') return '可乐一开，快乐就来';
    if (side.id === 'scallion') return '加个小葱饼垫垫';
    if (side.id === 'duckhead') return '再整点鸭头解馋';
    if (side.id === 'juewei') return '鸭脖安排上';
    if (side.id === 'zhouheiya') return '周黑鸭来点辣';
    return '配菜随缘加一点';
  }

  function buildReason(ctx, main, side) {
    const base = `今天是${ctx.weekdayLabel}，天气${ctx.weatherLabel}，心情${ctx.moodLabel}。`;
    const w =
      ctx.weatherKey === 'rainy' ? '下雨就适合吃点踏实的。' :
      ctx.weatherKey === 'cold' ? '冷就要吃点热乎的。' :
      ctx.weatherKey === 'hot' ? '热也要吃得开心一点。' :
      ctx.weatherKey === 'windy' ? '风大就吃点有安全感的。' :
      '就按今天的感觉来。';
    const m =
      ctx.moodKey === 'tired' ? '省点脑子，直接安排。' :
      ctx.moodKey === 'down' ? '先把自己哄好最重要。' :
      ctx.moodKey === 'treat' ? '放纵一下，明天再说。' :
      ctx.moodKey === 'happy' ? '开心就吃点更满足的。' :
      '稳稳当当就挺好。';
    const d = `主菜就选${main.name}：${dishTone(main)}。`;
    const s = `配菜：${sideTone(side)}。`;
    return `${base}${w}${m}${d}${s}`;
  }

  function buildRecommendation(input, rng = Math.random) {
    const ctx = buildContext(input);
    const main = pickOne(MAIN_DISHES, rng);
    const side = pickSidePureRandom(rng);
    const reason = buildReason(ctx, main, side);

    return {
      ctx,
      main,
      side,
      reason,
      scoredMains: [],
      topIds: []
    };
  }

  function el(id) {
    return document.getElementById(id);
  }

  function ensureLogin() {
    const ok = (window.authService && authService.isLoggedIn && authService.isLoggedIn()) || sessionStorage.getItem('isLoggedIn') === 'true';
    if (!ok) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  function setTodayWeekday() {
    const weekday = new Date().getDay();
    const select = el('weekdaySelect');
    if (!select) return;
    select.value = String(weekday);
  }

  function readInput() {
    const weekday = parseInt(el('weekdaySelect').value, 10);
    const weatherKey = el('weatherSelect').value;
    const moodKey = el('moodSelect').value;
    const weatherText = (el('weatherCustom').value || '').trim();
    const moodText = (el('moodCustom').value || '').trim();
    return { weekday, weatherKey, weatherText, moodKey, moodText };
  }

  function showCustomInputs() {
    const weatherKey = el('weatherSelect').value;
    const moodKey = el('moodSelect').value;
    const weatherCustom = el('weatherCustom');
    const moodCustom = el('moodCustom');

    if (weatherKey === 'custom') weatherCustom.classList.remove('hidden');
    else weatherCustom.classList.add('hidden');

    if (moodKey === 'custom') moodCustom.classList.remove('hidden');
    else moodCustom.classList.add('hidden');
  }

  function renderRecommendCard(container, title, item) {
    container.innerHTML = `
      <div class="eat-rec-icon">${item.icon}</div>
      <div class="eat-rec-name">${title}</div>
      <div class="eat-rec-sub">${item.name}</div>
      ${item.detail ? `<div class="eat-rec-sub">${item.detail}</div>` : ''}
    `;
  }

  function renderOptions(container, options, highlightIds, scoreMap) {
    container.innerHTML = '';
    for (const opt of options) {
      const div = document.createElement('div');
      div.className = 'eat-option';

      if (highlightIds && highlightIds[0] === opt.id) div.classList.add('eat-top1');
      else if (highlightIds && highlightIds.includes(opt.id)) div.classList.add('eat-top3');

      const score = scoreMap ? scoreMap.get(opt.id) : null;
      const tags = (opt.tags || []).slice(0, 2);
      const meta = [];
      if (typeof score === 'number') meta.push(`<span class="eat-tag">匹配度 ${Math.round(score)}</span>`);
      for (const t of tags) meta.push(`<span class="eat-tag">${t}</span>`);

      div.innerHTML = `
        <div class="eat-option-icon">${opt.icon}</div>
        <div class="eat-option-main">
          <div class="eat-option-name" title="${opt.name}">${opt.name}</div>
          <div class="eat-option-meta">${meta.join('')}</div>
        </div>
      `;

      container.appendChild(div);
    }
  }

  function render(rec) {
    el('recommendReason').textContent = rec.reason;
    renderRecommendCard(el('mainRecommendCard'), '主菜推荐', rec.main);
    renderRecommendCard(el('sideRecommendCard'), '配菜推荐', rec.side);

    renderOptions(el('mainOptions'), MAIN_DISHES, null, null);
    renderOptions(el('sideOptions'), SIDE_DISHES, null, null);
  }

  function clearForm() {
    el('weatherSelect').value = 'sunny';
    el('moodSelect').value = 'happy';
    el('weatherCustom').value = '';
    el('moodCustom').value = '';
    setTodayWeekday();
    showCustomInputs();
  }

  function init() {
    if (!ensureLogin()) return;

    setTodayWeekday();
    showCustomInputs();

    el('weatherSelect').addEventListener('change', showCustomInputs);
    el('moodSelect').addEventListener('change', showCustomInputs);

    const doRecommend = () => {
      const input = readInput();
      const rec = buildRecommendation(input);
      render(rec);
    };

    el('btnRecommend').addEventListener('click', doRecommend);
    el('btnAgain').addEventListener('click', doRecommend);
    el('btnReset').addEventListener('click', () => {
      clearForm();
      el('recommendReason').textContent = '填写后点击“开始推荐”';
      el('mainRecommendCard').innerHTML = '';
      el('sideRecommendCard').innerHTML = '';
      el('mainOptions').innerHTML = '';
      el('sideOptions').innerHTML = '';
    });

    renderOptions(el('sideOptions'), SIDE_DISHES, null, null);
    doRecommend();
  }

  window.eatRecommender = { buildRecommendation };

  document.addEventListener('DOMContentLoaded', init);
})();

