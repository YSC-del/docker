// 蛋糕商城注册页面JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取表单元素
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const receiverInput = document.getElementById('receiver');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const agreeTermsInput = document.getElementById('agreeTerms');
    const togglePasswordBtn = document.getElementById('togglePassword');

    // 密码显示/隐藏功能
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // 实时表单验证
    function validateField(field, validator, errorMessage) {
        const isValid = validator(field.value);
        field.classList.toggle('is-valid', isValid);
        field.classList.toggle('is-invalid', !isValid);
        
        if (!isValid) {
            field.nextElementSibling.textContent = errorMessage;
        }
        return isValid;
    }

    // 用户名验证
    function validateUsername(username) {
        return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username);
    }

    // 邮箱验证
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 密码验证
    function validatePassword(password) {
        return password.length >= 8 && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/.test(password);
    }

    // 手机号验证
    function validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    // 收货人验证
    function validateReceiver(receiver) {
        return receiver.length >= 2 && receiver.length <= 10 && /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(receiver);
    }

    // 地址验证
    function validateAddress(address) {
        return address.length >= 10 && address.length <= 100;
    }

    // 实时验证事件监听
    usernameInput.addEventListener('input', function() {
        validateField(this, validateUsername, '用户名长度3-20位，只能包含字母、数字、下划线和中文');
    });

    emailInput.addEventListener('input', function() {
        validateField(this, validateEmail, '请输入有效的邮箱地址');
    });

    passwordInput.addEventListener('input', function() {
        validateField(this, validatePassword, '密码长度至少8位，必须包含字母和数字');
    });

    confirmPasswordInput.addEventListener('input', function() {
        const isValid = this.value === passwordInput.value && this.value.length > 0;
        this.classList.toggle('is-valid', isValid);
        this.classList.toggle('is-invalid', !isValid);
        
        if (!isValid) {
            this.nextElementSibling.textContent = '两次输入的密码不一致';
        }
    });

    receiverInput.addEventListener('input', function() {
        validateField(this, validateReceiver, '收货人姓名长度2-10位，只能包含中文、英文和空格');
    });

    phoneInput.addEventListener('input', function() {
        validateField(this, validatePhone, '请输入有效的11位手机号码');
    });

    addressInput.addEventListener('input', function() {
        validateField(this, validateAddress, '地址长度10-100位，请填写详细地址');
    });

    // 服务条款验证
    agreeTermsInput.addEventListener('change', function() {
        this.classList.toggle('is-valid', this.checked);
        this.classList.toggle('is-invalid', !this.checked);
    });

    // 表单提交处理
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 验证所有字段
        const isUsernameValid = validateField(usernameInput, validateUsername, '用户名长度3-20位，只能包含字母、数字、下划线和中文');
        const isEmailValid = validateField(emailInput, validateEmail, '请输入有效的邮箱地址');
        const isPasswordValid = validateField(passwordInput, validatePassword, '密码长度至少8位，必须包含字母和数字');
        const isConfirmPasswordValid = confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value.length > 0;
        const isReceiverValid = validateField(receiverInput, validateReceiver, '收货人姓名长度2-10位，只能包含中文、英文和空格');
        const isPhoneValid = validateField(phoneInput, validatePhone, '请输入有效的11位手机号码');
        const isAddressValid = validateField(addressInput, validateAddress, '地址长度10-100位，请填写详细地址');
        const isAgreeTermsValid = agreeTermsInput.checked;

        // 设置确认密码的验证状态
        confirmPasswordInput.classList.toggle('is-valid', isConfirmPasswordValid);
        confirmPasswordInput.classList.toggle('is-invalid', !isConfirmPasswordValid);
        
        if (!isConfirmPasswordValid) {
            confirmPasswordInput.nextElementSibling.textContent = '两次输入的密码不一致';
        }

        // 设置服务条款的验证状态
        agreeTermsInput.classList.toggle('is-valid', isAgreeTermsValid);
        agreeTermsInput.classList.toggle('is-invalid', !isAgreeTermsValid);

        // 检查所有验证是否通过
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && 
            isReceiverValid && isPhoneValid && isAddressValid && isAgreeTermsValid) {
            
            // 显示加载状态
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // 模拟注册过程
            setTimeout(() => {
                // 移除加载状态
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // 显示成功消息
                showSuccessMessage('注册成功！欢迎加入蛋糕商城！');
                
                // 清空表单
                registerForm.reset();
                
                // 移除所有验证状态
                const formControls = registerForm.querySelectorAll('.form-control, .form-check-input');
                formControls.forEach(control => {
                    control.classList.remove('is-valid', 'is-invalid');
                });

                // 重置密码显示状态
                passwordInput.setAttribute('type', 'password');
                const icon = togglePasswordBtn.querySelector('i');
                icon.classList.add('fa-eye');
                icon.classList.remove('fa-eye-slash');

            }, 2000);
        } else {
            // 显示错误消息
            showErrorMessage('请检查表单中的错误信息并重新提交');
        }
    });

    // 显示成功消息
    function showSuccessMessage(message) {
        // 移除现有的提示消息
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;
        
        registerForm.insertBefore(alertDiv, registerForm.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // 显示错误消息
    function showErrorMessage(message) {
        // 移除现有的提示消息
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        `;
        
        registerForm.insertBefore(alertDiv, registerForm.firstChild);
        
        // 5秒后自动移除
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // 搜索框功能
    const searchInput = document.querySelector('.input-group input[type="text"]');
    const searchBtn = document.querySelector('.input-group button');
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            showSearchMessage(`正在搜索"${searchTerm}"...`);
        } else {
            showErrorMessage('请输入搜索关键词');
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    function showSearchMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info';
        alertDiv.innerHTML = `
            <i class="fas fa-search me-2"></i>
            ${message}
        `;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '80px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 2000);
    }

    // 购物车功能
    const cartBtn = document.querySelector('a[href="cart.html"]');
    const cartBadge = cartBtn.querySelector('.badge');
    
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showSearchMessage('购物车功能开发中，敬请期待！');
    });

    // 下拉菜单增强效果
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('mouseenter', function() {
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.style.display = 'block';
                dropdown.classList.add('show');
            }
        });

        toggle.addEventListener('mouseleave', function() {
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                setTimeout(() => {
                    dropdown.style.display = 'none';
                    dropdown.classList.remove('show');
                }, 200);
            }
        });
    });

    // 页面加载动画
    window.addEventListener('load', function() {
        const card = document.querySelector('.card');
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });

    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 表单字段焦点效果
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        control.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // 页面滚动时导航栏效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        // ESC键关闭所有下拉菜单
        if (e.key === 'Escape') {
            const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // 表单自动保存功能（本地存储）
    const formData = {};
    
    // 保存表单数据到本地存储
    function saveFormData() {
        const inputs = registerForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.type !== 'password') { // 不保存密码
                formData[input.name] = input.value;
            }
        });
        localStorage.setItem('registerFormData', JSON.stringify(formData));
    }

    // 从本地存储恢复表单数据
    function loadFormData() {
        const savedData = localStorage.getItem('registerFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = registerForm.querySelector(`[name="${key}"]`);
                if (input && input.type !== 'password') {
                    input.value = data[key];
                }
            });
        }
    }

    // 监听表单输入变化
    registerForm.addEventListener('input', saveFormData);
    
    // 页面加载时恢复数据
    loadFormData();

    // 注册成功后清除本地数据
    registerForm.addEventListener('submit', function() {
        if (registerForm.checkValidity()) {
            localStorage.removeItem('registerFormData');
        }
    });

    console.log('蛋糕商城注册页面已加载完成！');
});