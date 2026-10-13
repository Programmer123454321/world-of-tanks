'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const config = window.SITE_CONFIG || {};
  const student = config.student || {};
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');

  document.querySelectorAll('.photo-slot img').forEach(img => {
    const reveal = () => {
      img.style.visibility = 'visible';
      img.closest('.photo-slot').classList.add('photo-loaded');
    };
    const hide = () => {
      img.style.visibility = 'hidden';
      img.closest('.photo-slot').classList.remove('photo-loaded');
    };
    img.addEventListener('load', reveal);
    img.addEventListener('error', hide);
    if (img.complete) (img.naturalWidth > 0 ? reveal : hide)();
  });

  document.querySelectorAll('[data-today]').forEach(input => {
    input.value = today;
    input.defaultValue = today;
  });
  document.querySelectorAll('[data-student-field]').forEach(input => {
    const value = student[input.dataset.studentField];
    if (value) {
      input.value = value;
      input.defaultValue = value;
    }
  });
  document.querySelectorAll('form[data-remote-form]').forEach(form => {
    if (config.formEndpoint) form.action = config.formEndpoint;
  });

  // Дополняем встроенную HTML-валидацию понятной проверкой телефона.
  const phone = document.querySelector('#contact-mobile');
  if (phone) {
    phone.addEventListener('input', () => phone.setCustomValidity(''));
    phone.form.addEventListener('submit', event => {
      const digits = phone.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        event.preventDefault();
        phone.setCustomValidity('Введите мобильный номер: от 10 до 15 цифр.');
        phone.reportValidity();
      }
    });
  }
});
