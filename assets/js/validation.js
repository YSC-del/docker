(function () {
  'use strict';

  function matchesRegex(value, regex) {
    if (typeof value !== 'string') return false;
    return regex.test(value.trim());
  }

  function validateUsername(input) {
    return matchesRegex(input.value, /^[A-Za-z0-9_]{3,16}$/);
  }

  function validateEmail(input) {
    // 简化邮箱校验
    return matchesRegex(input.value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  function validatePassword(input) {
    var val = input.value || '';
    if (val.length < 6) return false;
    var hasLetter = /[A-Za-z]/.test(val);
    var hasDigit = /\d/.test(val);
    return hasLetter && hasDigit;
  }

  function validateReceiver(input) {
    return (input.value || '').trim().length > 0;
  }

  function validatePhone(input) {
    // 简易中国大陆手机校验：以1开头的11位数字
    return matchesRegex(input.value, /^1\d{10}$/);
  }

  function validateAddress(input) {
    return (input.value || '').trim().length >= 5;
  }

  function setValidity(input, valid) {
    if (valid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
  }

  function initValidation() {
    var form = document.getElementById('registerForm');
    if (!form) return;

    var username = document.getElementById('username');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var receiver = document.getElementById('receiver');
    var phone = document.getElementById('phone');
    var address = document.getElementById('address');
    var agree = document.getElementById('agree');

    function runAll() {
      setValidity(username, validateUsername(username));
      setValidity(email, validateEmail(email));
      setValidity(password, validatePassword(password));
      setValidity(receiver, validateReceiver(receiver));
      setValidity(phone, validatePhone(phone));
      setValidity(address, validateAddress(address));
      if (!agree.checked) {
        agree.classList.add('is-invalid');
      } else {
        agree.classList.remove('is-invalid');
      }
    }

    username.addEventListener('input', function () { setValidity(username, validateUsername(username)); });
    email.addEventListener('input', function () { setValidity(email, validateEmail(email)); });
    password.addEventListener('input', function () { setValidity(password, validatePassword(password)); });
    receiver.addEventListener('input', function () { setValidity(receiver, validateReceiver(receiver)); });
    phone.addEventListener('input', function () { setValidity(phone, validatePhone(phone)); });
    address.addEventListener('input', function () { setValidity(address, validateAddress(address)); });
    agree.addEventListener('change', function () {
      if (!agree.checked) {
        agree.classList.add('is-invalid');
      } else {
        agree.classList.remove('is-invalid');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      runAll();
      var isValid =
        validateUsername(username) &&
        validateEmail(email) &&
        validatePassword(password) &&
        validateReceiver(receiver) &&
        validatePhone(phone) &&
        validateAddress(address) &&
        agree.checked;
      if (isValid) {
        // 简单演示：弹窗提示成功
        alert('注册成功！');
        form.reset();
        [username, email, password, receiver, phone, address, agree].forEach(function (el) {
          el.classList.remove('is-valid', 'is-invalid');
        });
      } else {
        // 滚动到第一个无效字段
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid && typeof firstInvalid.scrollIntoView === 'function') {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initValidation);
  } else {
    initValidation();
  }
})();

