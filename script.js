// 蛋糕商城 - JavaScript 功能

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initFormValidation();
    initPasswordToggle();
    initAddressSelect();
    initSearchFunction();
    initDropdownInteractions();
    initTooltips();
});

// 表单验证功能
function initFormValidation() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // 验证规则
    const validationRules = {
        username: {
            required: true,
            minLength: 3,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
            message: {
                required: '请输入用户名',
                minLength: '用户名至少3个字符',
                maxLength: '用户名不能超过20个字符',
                pattern: '用户名只能包含中英文和数字'
            }
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: {
                required: '请输入邮箱地址',
                pattern: '请输入有效的邮箱地址'
            }
        },
        password: {
            required: true,
            minLength: 6,
            maxLength: 20,
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/,
            message: {
                required: '请输入密码',
                minLength: '密码至少6位',
                maxLength: '密码不能超过20位',
                pattern: '密码必须包含字母和数字'
            }
        },
        confirmPassword: {
            required: true,
            match: 'password',
            message: {
                required: '请确认密码',
                match: '两次输入的密码不一致'
            }
        },
        recipient: {
            required: true,
            minLength: 2,
            maxLength: 10,
            pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
            message: {
                required: '请输入收货人姓名',
                minLength: '姓名至少2个字符',
                maxLength: '姓名不能超过10个字符',
                pattern: '姓名只能包含中英文'
            }
        },
        phone: {
            required: true,
            pattern: /^1[3-9]\d{9}$/,
            message: {
                required: '请输入手机号码',
                pattern: '请输入有效的11位手机号码'
            }
        },
        province: {
            required: true,
            message: {
                required: '请选择省份'
            }
        },
        city: {
            required: true,
            message: {
                required: '请选择城市'
            }
        },
        district: {
            required: true,
            message: {
                required: '请选择区县'
            }
        },
        detailAddress: {
            required: true,
            minLength: 5,
            maxLength: 100,
            message: {
                required: '请输入详细地址',
                minLength: '详细地址至少5个字符',
                maxLength: '详细地址不能超过100个字符'
            }
        },
        agreement: {
            required: true,
            message: {
                required: '请阅读并同意用户协议和隐私政策'
            }
        }
    };
    
    // 为每个输入框添加验证事件
    inputs.forEach(input => {
        // 实时验证
        input.addEventListener('blur', function() {
            validateField(this, validationRules);
        });
        
        input.addEventListener('input', function() {
            // 清除错误状态（延迟验证）
            if (this.classList.contains('is-invalid')) {
                setTimeout(() => {
                    validateField(this, validationRules);
                }, 500);
            }
        });
    });
    
    // 表单提交验证
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // 验证所有字段
        inputs.forEach(input => {
            if (!validateField(input, validationRules)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // 显示加载状态
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> 注册中...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // 模拟注册过程
            setTimeout(() => {
                showSuccessMessage('注册成功！欢迎加入蛋糕商城！');
                form.reset();
                // 重置按钮状态
                submitBtn.innerHTML = '<i class="bi bi-person-plus"></i> 立即注册';
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                // 清除所有验证状态
                inputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            }, 2000);
        } else {
            showErrorMessage('请检查并修正表单中的错误信息');
            // 滚动到第一个错误字段
            const firstError = form.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
}

// 验证单个字段
function validateField(field, rules) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rule = rules[fieldName];
    
    if (!rule) return true;
    
    const feedback = field.parentNode.querySelector('.invalid-feedback') || 
                    field.closest('.mb-3, .mb-4').querySelector('.invalid-feedback');
    
    // 必填验证
    if (rule.required && !fieldValue) {
        setFieldError(field, feedback, rule.message.required);
        return false;
    }
    
    // 如果字段为空且不是必填，则通过验证
    if (!fieldValue && !rule.required) {
        setFieldValid(field, feedback);
        return true;
    }
    
    // 长度验证
    if (rule.minLength && fieldValue.length < rule.minLength) {
        setFieldError(field, feedback, rule.message.minLength);
        return false;
    }
    
    if (rule.maxLength && fieldValue.length > rule.maxLength) {
        setFieldError(field, feedback, rule.message.maxLength);
        return false;
    }
    
    // 正则验证
    if (rule.pattern && !rule.pattern.test(fieldValue)) {
        setFieldError(field, feedback, rule.message.pattern);
        return false;
    }
    
    // 匹配验证（确认密码）
    if (rule.match) {
        const matchField = document.getElementById(rule.match);
        if (fieldValue !== matchField.value) {
            setFieldError(field, feedback, rule.message.match);
            return false;
        }
    }
    
    // 复选框验证
    if (field.type === 'checkbox' && rule.required && !field.checked) {
        setFieldError(field, feedback, rule.message.required);
        return false;
    }
    
    // 验证通过
    setFieldValid(field, feedback);
    return true;
}

// 设置字段错误状态
function setFieldError(field, feedback, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    if (feedback) {
        feedback.textContent = message;
    }
}

// 设置字段有效状态
function setFieldValid(field, feedback) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (feedback) {
        feedback.textContent = '';
    }
}

// 密码显示/隐藏功能
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        } else {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        }
    });
}

// 地址联动选择功能
function initAddressSelect() {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    // 城市数据
    const cityData = {
        '北京': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区'],
        '上海': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区'],
        '广东': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市'],
        '浙江': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市'],
        '江苏': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市']
    };
    
    // 区县数据
    const districtData = {
        '广州市': ['天河区', '越秀区', '荔湾区', '海珠区', '白云区', '黄埔区', '番禺区'],
        '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区'],
        '杭州市': ['西湖区', '上城区', '下城区', '江干区', '拱墅区', '滨江区', '余杭区'],
        '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区']
    };
    
    // 省份变化时更新城市
    provinceSelect.addEventListener('change', function() {
        const province = this.value;
        citySelect.innerHTML = '<option value="">选择城市</option>';
        districtSelect.innerHTML = '<option value="">选择区县</option>';
        
        if (province && cityData[province]) {
            cityData[province].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        
        // 触发验证
        validateField(citySelect, {});
        validateField(districtSelect, {});
    });
    
    // 城市变化时更新区县
    citySelect.addEventListener('change', function() {
        const city = this.value;
        districtSelect.innerHTML = '<option value="">选择区县</option>';
        
        if (city && districtData[city]) {
            districtData[city].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
        
        // 触发验证
        validateField(districtSelect, {});
    });
}

// 搜索功能
function initSearchFunction() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // 搜索按钮点击
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 搜索建议（模拟）
    const suggestions = ['生日蛋糕', '巧克力蛋糕', '芝士蛋糕', '慕斯蛋糕', '纸杯蛋糕', '婚礼蛋糕'];
    
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        // 这里可以实现搜索建议功能
        if (value.length > 0) {
            // 模拟搜索建议
            console.log('搜索建议:', suggestions.filter(s => s.includes(value)));
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // 模拟搜索
            showSuccessMessage(`正在搜索"${query}"...`);
            console.log('搜索:', query);
        }
    }
}

// 下拉菜单交互效果
function initDropdownInteractions() {
    // 使用data-toggle="dropdown"实现下拉菜单
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    
    dropdownToggles.forEach(toggle => {
        const dropdown = new bootstrap.Dropdown(toggle);
        
        // 添加动画效果
        toggle.addEventListener('show.bs.dropdown', function() {
            const menu = this.nextElementSibling;
            if (menu && menu.classList.contains('dropdown-menu')) {
                menu.style.transform = 'translateY(-10px)';
                menu.style.opacity = '0';
                
                setTimeout(() => {
                    menu.style.transform = 'translateY(0)';
                    menu.style.opacity = '1';
                    menu.style.transition = 'all 0.3s ease';
                }, 10);
            }
        });
        
        toggle.addEventListener('hide.bs.dropdown', function() {
            const menu = this.nextElementSibling;
            if (menu && menu.classList.contains('dropdown-menu')) {
                menu.style.transform = 'translateY(-10px)';
                menu.style.opacity = '0';
            }
        });
    });
    
    // 购物车数量更新（模拟）
    const cartBtn = document.querySelector('.btn-outline-primary .badge');
    if (cartBtn) {
        let cartCount = 0;
        
        // 模拟添加到购物车
        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn-outline-primary') && e.target.closest('.btn-outline-primary').querySelector('.badge')) {
                cartCount++;
                cartBtn.textContent = cartCount;
                
                // 添加动画效果
                cartBtn.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    cartBtn.style.transform = 'scale(1)';
                    cartBtn.style.transition = 'transform 0.3s ease';
                }, 200);
            }
        });
    }
}

// 初始化工具提示
function initTooltips() {
    // Bootstrap 工具提示
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // 自定义工具提示
    const helpIcons = document.querySelectorAll('.form-text');
    helpIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.color = '#007bff';
            this.style.transition = 'color 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.color = '#6c757d';
        });
    });
}

// 显示成功消息
function showSuccessMessage(message) {
    // 移除现有消息
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建成功消息
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${message}`;
    
    // 插入到表单前
    const form = document.getElementById('registerForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // 显示消息
    setTimeout(() => {
        messageDiv.style.display = 'block';
    }, 100);
    
    // 5秒后自动隐藏
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// 显示错误消息
function showErrorMessage(message) {
    // 移除现有消息
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建错误消息
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${message}`;
    
    // 插入到表单前
    const form = document.getElementById('registerForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // 显示消息
    setTimeout(() => {
        messageDiv.style.display = 'block';
    }, 100);
    
    // 5秒后自动隐藏
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// 平滑滚动到页面顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 页面滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 3px rgba(233, 30, 99, 0.1)';
    }
});

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    // 隐藏加载动画
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.classList.remove('loading');
    });
    
    // 添加页面加载完成的动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 导出功能函数（如果需要在其他地方使用）
window.CakeShop = {
    showSuccessMessage,
    showErrorMessage,
    validateField,
    scrollToTop,
    debounce,
    throttle
};