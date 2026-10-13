'use strict';

(() => {
  const letterMap = {
    а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'yo', ж:'zh', з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'kh', ц:'ts', ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya'
  };
  function transliterate(value) {
    const text = String(value);
    const isUppercase = text === text.toUpperCase();
    return Array.from(text).map(letter => {
      const replacement = letterMap[letter.toLowerCase()];
      if (replacement === undefined) return letter;
      if (isUppercase) return replacement.toUpperCase();
      return letter === letter.toUpperCase() ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
    }).join('');
  }
  function toRoman(value) {
    let number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 3999) return String(value);
    let roman = '';
    const parts = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    parts.forEach(([amount, symbol]) => {
      while (number >= amount) { roman += symbol; number -= amount; }
    });
    return roman;
  }
  window.PassportTools = Object.freeze({ transliterate, toRoman });

  document.addEventListener('DOMContentLoaded', () => {
    const student = (window.SITE_CONFIG || {}).student || {};
    const original = {
      surname: String(student.surname || 'Макарьев'),
      firstname: String(student.firstName || 'Виталий'),
      patronymic: String(student.patronymic || 'Юрьевич'),
      year: String(student.birthYear || '2007'),
      gender: 'не указан',
      birthplace: 'не указано'
    };
    const fields = Object.fromEntries(Object.keys(original).map(id => [id, document.getElementById(id)]));
    const language = document.getElementById('passport-language');
    const status = document.getElementById('passport-status');
    function write(values) {
      Object.keys(values).forEach(id => { if (fields[id]) fields[id].innerText = values[id]; });
    }
    function setState(label, message) {
      if (language) language.innerText = label;
      if (status) status.innerText = message;
    }
    write(original);
    // Как в passport_latin.html: функции onclick меняют innerText поверх скана.
    window.toLatin = function toLatin() {
      write({
        surname: transliterate(original.surname),
        firstname: transliterate(original.firstname),
        patronymic: transliterate(original.patronymic),
        gender: 'unknown',
        birthplace: 'not specified',
        year: toRoman(original.year)
      });
      setState('Латиница', 'Данные переведены на латиницу. Год рождения: ' + toRoman(original.year) + '.');
    };
    window.toCyrillic = function toCyrillic() {
      write(original);
      setState('Кириллица', 'Исходные данные и год рождения ' + original.year + ' восстановлены.');
    };

    const read = document.getElementById('read-passport');
    if (read) read.addEventListener('click', () => {
      // Индексы соответствуют passport.html из предоставленного образца.
      document.getElementById('read-surname').innerText = document.getElementsByTagName('p')[1].childNodes[1].innerText;
      document.getElementById('read-name').innerText = document.getElementsByTagName('p')[2].childNodes[1].innerText;
      document.getElementById('read-year').innerText = document.getElementsByTagName('p')[5].childNodes[2].innerText;
      setState('Кириллица', 'Фамилия, имя и год рождения считаны из DOM.');
    });
  });
})();
