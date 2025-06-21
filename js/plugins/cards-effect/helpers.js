// Đảm bảo namespace cardsEffect đã được khởi tạo
window.cardsEffect = window.cardsEffect || {};

window.cardsEffect.clamp = function(num, min, max) {
  return Math.min(Math.max(num, min), max);
};

window.cardsEffect.valueAtPercentage = function({ from, to, percentage, unit }) {
  return from + (to - from) * percentage + (unit || '');
};
