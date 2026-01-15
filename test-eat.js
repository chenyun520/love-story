const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync(require('path').join(__dirname, 'js', 'eat.js'), 'utf8');

const context = {
  window: {},
  document: {
    addEventListener: () => {},
    getElementById: () => null
  },
  sessionStorage: {
    getItem: () => 'true'
  },
  console
};

vm.createContext(context);
vm.runInContext(source, context);

if (!context.window.eatRecommender || typeof context.window.eatRecommender.buildRecommendation !== 'function') {
  throw new Error('eatRecommender.buildRecommendation 未暴露');
}

const input = { weekday: 1, weatherKey: 'sunny', weatherText: '', moodKey: 'calm', moodText: '' };

let noneCount = 0;
const iterations = 20000;
for (let i = 0; i < iterations; i++) {
  const rec = context.window.eatRecommender.buildRecommendation(input);
  if (rec.side && rec.side.id === 'none') noneCount++;
}

const rate = noneCount / iterations;
const ok = rate > 0.42 && rate < 0.58;
if (!ok) {
  throw new Error(`“不吃配菜”比例异常：${rate}`);
}

console.log(JSON.stringify({ iterations, noneRate: rate }));

