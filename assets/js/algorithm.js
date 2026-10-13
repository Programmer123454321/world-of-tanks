'use strict';

(() => {
  // Решение назначенного варианта перенесено из предоставленного algo.html.
  const TASK_1050_STATEMENT = "Дано вещественное число A. Вычислить x = a**2+4+5 при a < 62; в противном случае x = 1/(a**2) + 4a + 5";
  const numberInput = (name, label, value, extra = {}) => ({ name, label, type: 'number', value, step: 'any', ...extra });
  const positive = (name, label, value, extra = {}) => numberInput(name, label, value, { min: 0, exclusiveMin: true, ...extra });
  const result = (text, details = '') => ({ text, details });
  const ensureFinite = (value, label = 'Результат') => {
    if (!Number.isFinite(value)) throw new Error(`${label} выходит за допустимый числовой диапазон.`);
    return value;
  };
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(12)));
  const volumeInputs = [
    positive('cube_edge', 'Ребро куба A', 3),
    positive('cylinder_radius', 'Радиус цилиндра R', 2),
    positive('cylinder_height', 'Высота цилиндра H', 3),
    numberInput('liquid_volume', 'Объём жидкости M', 20, { min: 0 })
  ];
  function capacities(v) {
    return [ensureFinite(v.cube_edge ** 3, 'Объём куба'), ensureFinite(Math.PI * v.cylinder_radius ** 2 * v.cylinder_height, 'Объём цилиндра')];
  }
  function compareContainers(v, filling) {
    const [cube, cylinder] = capacities(v);
    const first = filling ? v.liquid_volume >= cube : v.liquid_volume <= cube;
    const second = filling ? v.liquid_volume >= cylinder : v.liquid_volume <= cylinder;
    const text = filling
      ? first && second ? 'Жидкости хватит для заполнения обеих ёмкостей (каждой отдельно).' : first ? 'Жидкости хватит только для первой ёмкости — куба.' : second ? 'Жидкости хватит только для второй ёмкости — цилиндра.' : 'Жидкости не хватит для заполнения ни одной ёмкости.'
      : first && second ? 'Жидкость поместится в обе ёмкости (каждую отдельно).' : first ? 'Жидкость поместится только в первую ёмкость — куб.' : second ? 'Жидкость поместится только во вторую ёмкость — цилиндр.' : 'Жидкость не поместится ни в одну ёмкость.';
    return result(text, `V куба = ${fmt(cube)}; V цилиндра = ${fmt(cylinder)}; M = ${fmt(v.liquid_volume)}. Для каждой ёмкости проверка выполняется отдельно.`);
  }

  const definitions = [
    {
      number: '1050', title: 'Функция с границей 62 — решение автора',
      statement: TASK_1050_STATEMENT,
      inputs: [numberInput('a', 'Аргумент a', 10)],
      calculate(v) {
        const a = v.a;
        // Оба выражения сохранены в точности как в algo.html.
        const value = ensureFinite(a < 62 ? a * a + 4 + 5 : 1 / (a * a) + 4 * a + 5);
        return { ...result('x = ' + String(value), a < 62 ? 'Ветвь a < 62: a² + 4 + 5.' : 'Ветвь a ≥ 62: 1/a² + 4a + 5.'), value };
      }
    },
    {
      number: '1001', title: 'Коробка и дверь',
      statement: 'Можно ли пронести прямоугольную коробку с размерами A, B, C через дверь шириной M и высотой K? Разрешён поворот коробки с выбором любой грани, параллельной проёму.',
      inputs: [positive('box_length', 'Длина коробки A', 80), positive('box_width', 'Ширина коробки B', 60), positive('box_height', 'Высота коробки C', 40), positive('door_width', 'Ширина двери M', 70), positive('door_height', 'Высота двери K', 50)],
      calculate(v) {
        const sides = [v.box_length, v.box_width, v.box_height].sort((a, b) => a - b);
        const door = [v.door_width, v.door_height].sort((a, b) => a - b);
        const fits = sides[0] <= door[0] && sides[1] <= door[1];
        return result(fits ? 'Коробка пройдёт через дверь.' : 'Коробка не пройдёт через дверь.', `Сравниваем две меньшие стороны (${fmt(sides[0])}, ${fmt(sides[1])}) с проёмом (${fmt(door[0])}, ${fmt(door[1])}).`);
      }
    },
    {
      number: '1002', title: 'Знак числа',
      statement: 'Для вещественного числа X определить, является оно положительным, отрицательным или нулём.',
      inputs: [numberInput('signed_number', 'Число X', -5)],
      calculate: v => result(v.signed_number > 0 ? 'Число положительное.' : v.signed_number < 0 ? 'Число отрицательное.' : 'Число равно нулю.')
    },
    {
      number: '1003', title: 'Брус из бревна',
      statement: 'Проверить, можно ли получить квадратный брус со стороной A из бревна диаметром D: диагональ квадрата не должна превышать диаметр.',
      inputs: [positive('beam_side', 'Сторона бруса A', 4), positive('log_diameter', 'Диаметр бревна D', 6)],
      calculate(v) { const diagonal = ensureFinite(Math.SQRT2 * v.beam_side); return result(diagonal <= v.log_diameter ? 'Брус можно выпилить.' : 'Брус не помещается в сечение бревна.', `Диагональ бруса: ${fmt(diagonal)}. Диаметр: ${fmt(v.log_diameter)}.`); }
    },
    {
      number: '1004', title: 'Сцена и проход',
      statement: 'В квадратном зале площадью S разместить круглую сцену радиуса R. Проверить, останется ли между сценой и каждой стеной проход шириной не меньше K.',
      inputs: [positive('hall_area', 'Площадь зала S', 100), positive('stage_radius', 'Радиус сцены R', 3), numberInput('passage_width', 'Ширина прохода K', 2, { min: 0 })],
      calculate(v) { const needed = ensureFinite(2 * (v.stage_radius + v.passage_width)); const side = Math.sqrt(v.hall_area); return result(needed <= side ? 'Сцена и проход помещаются в зале.' : 'Для сцены и прохода места недостаточно.', `Сторона зала: ${fmt(side)}; необходимая ширина: ${fmt(needed)}.`); }
    },
    {
      number: '1005', title: 'Место в плацкарте',
      statement: 'По номеру места N от 1 до 54 определить верхнее оно или нижнее, боковое или небоковое. Чётные места верхние; места 37–54 боковые.',
      inputs: [numberInput('seat_number', 'Номер места N', 37, { min: 1, max: 54, step: 1 })],
      calculate(v) { const upper = v.seat_number % 2 === 0; const side = v.seat_number >= 37; return result(`Место ${v.seat_number}: ${upper ? 'верхнее' : 'нижнее'}, ${side ? 'боковое' : 'небоковое'}.`); }
    },
    {
      number: '1006', title: 'Размен суммы',
      statement: 'Разменять целую неотрицательную сумму S номиналами 500, 100, 10 и 2. Определить количество каждого номинала или сообщить, что точный размен невозможен.',
      inputs: [numberInput('exchange_amount', 'Сумма S', 786, { min: 0, max: Number.MAX_SAFE_INTEGER, step: 1 })],
      calculate(v) {
        if (v.exchange_amount % 2 !== 0) return result('Точный размен невозможен: все номиналы чётные.');
        let remainder = v.exchange_amount;
        const parts = [500, 100, 10, 2].map(denomination => { const count = Math.floor(remainder / denomination); remainder %= denomination; return `${denomination} × ${count}`; });
        return result(parts.join('; '), `Сумма: ${fmt(v.exchange_amount)}. Остаток: ${remainder}.`);
      }
    },
    {
      number: '1007', title: 'Вместится ли жидкость',
      statement: 'Даны две ёмкости: куб с ребром A и цилиндр радиуса R и высоты H. Определить, поместится ли объём жидкости M в первую ёмкость, во вторую, в обе или ни в одну. Для каждой ёмкости проверяется M ≤ V.',
      inputs: volumeInputs,
      calculate: v => compareContainers(v, false)
    },
    {
      number: '1008', title: 'Хватит ли жидкости',
      statement: 'Даны две ёмкости: куб с ребром A и цилиндр радиуса R и высоты H. Определить, можно ли жидкостью объёма M заполнить первую ёмкость, вторую, обе или ни одну. Каждая ёмкость рассматривается отдельно: M ≥ V.',
      inputs: volumeInputs,
      calculate: v => compareContainers(v, true)
    },
    {
      number: '1009', title: 'Треугольник',
      statement: 'Для положительных длин X, Y, Z проверить, существует ли треугольник. Если существует, определить, является ли он прямоугольным.',
      inputs: [positive('triangle_x', 'Сторона X', 3), positive('triangle_y', 'Сторона Y', 4), positive('triangle_z', 'Сторона Z', 5)],
      calculate(v) {
        const sides = [v.triangle_x, v.triangle_y, v.triangle_z].sort((a, b) => a - b);
        const x = sides[0] / sides[2], y = sides[1] / sides[2];
        if (sides[0] <= sides[2] - sides[1]) return result('Треугольник с такими сторонами не существует.');
        const square = x * x + y * y;
        const rectangular = sides[1] < sides[2] && Math.abs(square - 1) <= 1e-12;
        return result(rectangular ? 'Треугольник существует и является прямоугольным.' : 'Треугольник существует, но не является прямоугольным.', 'Проверка прямого угла использует относительный допуск 10⁻¹² для вычислений с дробными числами.');
      }
    },
    {
      number: '1010', title: 'Число в интервале',
      statement: 'Проверить, принадлежит ли вещественное число X замкнутому интервалу [a, b], включая обе границы.',
      inputs: [numberInput('interval_value', 'Число X', 5), numberInput('interval_start', 'Левая граница a', 1), numberInput('interval_end', 'Правая граница b', 10)],
      calculate(v) { if (v.interval_start > v.interval_end) throw new Error('Левая граница a должна быть не больше правой границы b.'); return result(v.interval_start <= v.interval_value && v.interval_value <= v.interval_end ? 'Число принадлежит интервалу [a, b].' : 'Число не принадлежит интервалу [a, b].'); }
    },
    {
      number: '1011', title: 'Обратное произведение',
      statement: 'Для вещественных X и Y вычислить Z = 1 / (X · Y). При нулевом X или Y выражение не определено.',
      inputs: [numberInput('reciprocal_x', 'Число X', 2), numberInput('reciprocal_y', 'Число Y', 4)],
      calculate(v) { if (v.reciprocal_x === 0 || v.reciprocal_y === 0) throw new Error('X и Y должны быть отличны от нуля.'); const product = ensureFinite(v.reciprocal_x * v.reciprocal_y, 'Произведение X · Y'); if (product === 0) throw new Error('Произведение слишком мало для точного вычисления в JavaScript.'); return result(`Z = ${fmt(ensureFinite(1 / product))}`); }
    },
    {
      number: '1012', title: 'Сравнение трёх чисел',
      statement: 'Для чисел A, B, C определить, выполняется ли A < B < C либо A < B и B > C. Если ни одно условие не выполнено, сообщить об этом.',
      inputs: [numberInput('compare_a', 'Число A', 1), numberInput('compare_b', 'Число B', 3), numberInput('compare_c', 'Число C', 2)],
      calculate: v => result(v.compare_a < v.compare_b && v.compare_b < v.compare_c ? 'Выполняется A < B < C.' : v.compare_a < v.compare_b && v.compare_b > v.compare_c ? 'Выполняется A < B > C.' : 'Ни одно из двух условий не выполняется.')
    },
    {
      number: '1013', title: 'Произведение или логарифм',
      statement: 'Для X и Y вычислить Z = X · Y, если X > Y. Иначе вычислить Z = ln(X + Y); сумма должна быть положительной.',
      inputs: [numberInput('piecewise_x', 'Число X', 2), numberInput('piecewise_y', 'Число Y', 3)],
      calculate(v) { if (v.piecewise_x > v.piecewise_y) return result(`Z = ${fmt(ensureFinite(v.piecewise_x * v.piecewise_y))}`, 'Выбрана ветвь X > Y: произведение.'); const sum = ensureFinite(v.piecewise_x + v.piecewise_y, 'Сумма X + Y'); if (sum <= 0) throw new Error('Для натурального логарифма сумма X + Y должна быть больше нуля.'); return result(`Z = ${fmt(Math.log(sum))}`, 'Выбрана ветвь X ≤ Y: натуральный логарифм.'); }
    },
    {
      number: '1014', title: 'Прямоугольник в прямоугольнике',
      statement: 'Проверить, помещается ли прямоугольник со сторонами a, b внутри прямоугольника c, d. Допускается поворот на 90°, стороны должны остаться параллельны друг другу.',
      inputs: [positive('inner_side_a', 'Внутренняя сторона a', 4), positive('inner_side_b', 'Внутренняя сторона b', 6), positive('outer_side_c', 'Внешняя сторона c', 7), positive('outer_side_d', 'Внешняя сторона d', 5)],
      calculate(v) { const fits = v.inner_side_a <= v.outer_side_c && v.inner_side_b <= v.outer_side_d || v.inner_side_b <= v.outer_side_c && v.inner_side_a <= v.outer_side_d; return result(fits ? 'Внутренний прямоугольник помещается.' : 'Внутренний прямоугольник не помещается.'); }
    },
    {
      number: '1015', title: 'Функция с границей 62',
      statement: 'По формуле источника вычислить x = a² + 4 + 5 при a < 62; иначе x = 1/a² + 4a + 5. Первая ветвь упрощается до a² + 9.',
      inputs: [numberInput('function_argument', 'Аргумент a', 61)],
      calculate(v) { const a = v.function_argument; const value = a < 62 ? a ** 2 + 9 : (1 / a) ** 2 + 4 * a + 5; return result(`x = ${fmt(ensureFinite(value))}`, a < 62 ? 'Ветвь a < 62: a² + 9.' : 'Ветвь a ≥ 62: 1/a² + 4a + 5.'); }
    },
    {
      number: '1016', title: 'Три диапазона аргумента',
      statement: 'Вычислить x = 0 при a > 100; x = a при a < 61; в остальных случаях x = a⁴. Значения 61 и 100 входят в среднюю ветвь.',
      inputs: [numberInput('function_argument', 'Аргумент a', 61)],
      calculate(v) { const a = v.function_argument; return result(`x = ${fmt(ensureFinite(a > 100 ? 0 : a < 61 ? a : a ** 4))}`, a > 100 ? 'Ветвь a > 100.' : a < 61 ? 'Ветвь a < 61.' : 'Ветвь 61 ≤ a ≤ 100.'); }
    },
    {
      number: '1017', title: 'Степень и синус',
      statement: 'Вычислить x = a⁴ при a < 10; x = a при a > 61; иначе x = a − sin(a²). Аргумент синуса измеряется в радианах.',
      inputs: [numberInput('function_argument', 'Аргумент a', 10)],
      calculate(v) { const a = v.function_argument; const value = a < 10 ? a ** 4 : a > 61 ? a : a - Math.sin(a ** 2); return result(`x = ${fmt(ensureFinite(value))}`, a < 10 ? 'Ветвь a < 10.' : a > 61 ? 'Ветвь a > 61.' : 'Ветвь 10 ≤ a ≤ 61, синус в радианах.'); }
    },
    {
      number: '1018', title: 'Год и век',
      statement: 'По положительному целому номеру года определить, високосный ли он по григорианскому правилу, и к какому веку относится. Век равен ceil(год / 100).',
      inputs: [numberInput('calendar_year', 'Номер года', 2026, { min: 1, max: Number.MAX_SAFE_INTEGER, step: 1 })],
      calculate(v) { const year = v.calendar_year; const leap = year % 400 === 0 || year % 4 === 0 && year % 100 !== 0; return result(`${year} год — ${leap ? 'високосный' : 'невисокосный'}. Век: ${Math.ceil(year / 100)}.`); }
    }
  ];

  function validate(task, values) {
    const normalized = {};
    task.inputs.forEach(input => {
      if (input.condition && values[input.condition[0]] !== input.condition[1]) return;
      const value = values[input.name];
      if (input.type === 'select') {
        if (!input.options.some(option => option[0] === value)) throw new Error(`Выбери значение поля «${input.label}».`);
        normalized[input.name] = value;
        return;
      }
      if (value === '' || value == null || !Number.isFinite(Number(value))) throw new Error(`Поле «${input.label}» должно содержать конечное число.`);
      const number = Number(value);
      if (input.min !== undefined && (input.exclusiveMin ? number <= input.min : number < input.min)) throw new Error(`Поле «${input.label}» должно быть ${input.exclusiveMin ? 'больше' : 'не меньше'} ${input.min}.`);
      if (input.max !== undefined && number > input.max) throw new Error(`Поле «${input.label}» должно быть не больше ${input.max}.`);
      if (input.step === 1 && !Number.isSafeInteger(number)) throw new Error(`Поле «${input.label}» должно быть целым числом в безопасном диапазоне.`);
      normalized[input.name] = number;
    });
    return normalized;
  }

  const tasks = Object.fromEntries(definitions.map(task => [task.number, Object.freeze({ ...task, solve(values) { return task.calculate(validate(task, values)); } })]));
  window.AlgorithmTasks = Object.freeze(tasks);
  window.AlgorithmTools = Object.freeze({ solve(number, values) {
    if (!tasks[String(number)]) throw new Error('Выбери номер задачи из списка.');
    return tasks[String(number)].solve(values);
  } });

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('algorithm-form');
    if (!form) return;
    const selector = document.getElementById('algorithm-task');
    const inputsContainer = document.getElementById('algorithm-inputs');
    const statement = document.getElementById('algorithm-statement');
    const resultField = document.getElementById('algorithm-result-field');
    const resultText = document.getElementById('algorithm-result-text');
    const resultDetails = document.getElementById('algorithm-result-details');
    const status = document.getElementById('algorithm-status');
    const calculateButton = document.getElementById('calculate-algorithm');
    const submitButton = document.getElementById('submit-algorithm');

    definitions.forEach(task => {
      const option = document.createElement('option');
      option.value = task.number;
      option.textContent = `${task.number} — ${task.title}`;
      selector.append(option);
    });

    function clearResult() {
      resultField.value = '';
      resultText.textContent = selector.value ? 'Введи данные и нажми «Проверить».' : 'Выбери номер задачи.';
      resultDetails.textContent = '';
      status.textContent = '';
    }

    function updateConditions(task) {
      const values = Object.fromEntries(new FormData(form));
      task.inputs.forEach(input => {
        if (!input.condition) return;
        const element = document.getElementById(`algorithm-${input.name}`);
        const enabled = values[input.condition[0]] === input.condition[1];
        element.disabled = !enabled;
        element.closest('.field').hidden = !enabled;
      });
    }

    function chooseTask() {
      inputsContainer.replaceChildren();
      clearResult();
      const task = tasks[selector.value];
      statement.value = task ? task.statement : '';
      calculateButton.disabled = !task;
      submitButton.disabled = !task;
      if (!task) return;
      task.inputs.forEach(spec => {
        const wrapper = document.createElement('div');
        wrapper.className = 'field';
        const label = document.createElement('label');
        label.htmlFor = `algorithm-${spec.name}`;
        label.textContent = spec.label;
        const input = document.createElement(spec.type === 'select' ? 'select' : 'input');
        input.id = label.htmlFor;
        input.name = spec.name;
        input.required = true;
        if (spec.type === 'select') {
          spec.options.forEach(([value, text]) => { const option = document.createElement('option'); option.value = value; option.textContent = text; input.append(option); });
        } else {
          input.type = 'number';
          input.step = spec.step;
          if (spec.min !== undefined) input.min = spec.min;
          if (spec.max !== undefined) input.max = spec.max;
        }
        input.value = spec.value;
        wrapper.append(label, input);
        inputsContainer.append(wrapper);
        input.addEventListener('input', () => { input.setCustomValidity(''); clearResult(); });
        if (spec.type === 'select') input.addEventListener('change', () => { updateConditions(task); clearResult(); });
      });
      updateConditions(task);
    }

    function calculate() {
      if (!form.reportValidity()) {
        resultField.value = '';
        resultText.textContent = 'Проверь входные данные.';
        status.textContent = 'Введи допустимое число в каждое обязательное поле.';
        return false;
      }
      try {
        const solved = window.AlgorithmTools.solve(selector.value, Object.fromEntries(new FormData(form)));
        resultText.textContent = solved.text;
        resultDetails.textContent = solved.details;
        resultField.value = solved.value !== undefined ? String(solved.value) : solved.text + (solved.details ? ` ${solved.details}` : '');
        status.textContent = 'Результат готов. Можно отправить формулировку, данные и решение на сервер.';
        return true;
      } catch (error) {
        resultField.value = '';
        resultText.textContent = 'Проверь входные данные.';
        resultDetails.textContent = '';
        status.textContent = error.message;
        return false;
      }
    }

    selector.addEventListener('change', chooseTask);
    calculateButton.addEventListener('click', calculate);
    form.addEventListener('submit', event => { if (!calculate()) event.preventDefault(); });
    form.addEventListener('reset', () => setTimeout(() => { selector.value = (window.SITE_CONFIG || {}).algorithmTaskNumber || ''; chooseTask(); }, 0));
    selector.value = String((window.SITE_CONFIG || {}).algorithmTaskNumber || '');
    chooseTask();
  });
})();
