'use strict';

(() => {
  // Задача 1050: x = a**2 + 4 + 5 при a < 62, иначе x = 1/(a**2) + 4a + 5.
  function solve(a) {
    const value = a < 62 ? a * a + 4 + 5 : 1 / (a * a) + 4 * a + 5;
    if (!Number.isFinite(value)) throw new Error('Результат выходит за допустимый числовой диапазон.');
    return {
      value,
      text: 'x = ' + value,
      details: a < 62 ? 'Ветвь a < 62: a² + 4 + 5.' : 'Ветвь a ≥ 62: 1/a² + 4a + 5.'
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('algorithm-form');
    if (!form) return;
    const inputA = document.getElementById('algorithm-a');
    const resultField = document.getElementById('algorithm-result-field');
    const calculateButton = document.getElementById('calculate-algorithm');

    function clearResult() {
      resultField.value = '';
    }

    function calculate() {
      const a = parseFloat(inputA.value);
      if (inputA.value.trim() === '' || Number.isNaN(a)) {
        resultField.value = 'Введи число в поле a';
        return false;
      }
      try {
        resultField.value = String(solve(a).value);
        return true;
      } catch (error) {
        resultField.value = error.message;
        return false;
      }
    }

    calculateButton.addEventListener('click', calculate);
    inputA.addEventListener('input', clearResult);
    form.addEventListener('submit', event => { if (!calculate()) event.preventDefault(); });
    form.addEventListener('reset', () => setTimeout(clearResult, 0));
    clearResult();
  });
})();
