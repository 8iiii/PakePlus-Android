// ==UserScript==
// @name                      叔叔不约只配女并自动问好(带自动重连)
// @namespace                 wwbnq
// @version                   1.2
// @description               叔叔不约只配女并自动问好，带悬浮窗控制和对方离开自动重连
// @author                    WWBNQ
// @match                     *://*.shushubuyue.net/*
// @match                     *://*.shushubuyue.com/*
// @icon                      https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license                   MIT
// @website                   https://soujiaoben.org/#/s?id=483290&host=greasyfork
// @grant                     none
// ==/UserScript==

(function () {
    'use strict';

    // ************在这里定义问候语*************
    let GREETING = "";
    let isScriptActive = true; // 脚本是否激活
    let checkInterval; // 检查间隔

    // 创建悬浮窗按钮
    function createFloatingButton() {
        // 创建悬浮按钮元素
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'floatingBtn';
        floatingBtn.style.position = 'fixed';
        floatingBtn.style.top = '15px';
        floatingBtn.style.right = '15px';
        floatingBtn.style.width = '80px';
        floatingBtn.style.height = '36px';
        floatingBtn.style.background = isScriptActive ? '#ff4b2b' : '#26d0ce';
        floatingBtn.style.color = 'white';
        floatingBtn.style.borderRadius = '8px';
        floatingBtn.style.display = 'flex';
        floatingBtn.style.justifyContent = 'center';
        floatingBtn.style.alignItems = 'center';
        floatingBtn.style.fontSize = '14px';
        floatingBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        floatingBtn.style.cursor = 'pointer';
        floatingBtn.style.userSelect = 'none';
        floatingBtn.style.zIndex = '2147483647';
        floatingBtn.style.transition = 'all 0.3s ease';
        floatingBtn.style.border = '2px solid white';
        floatingBtn.style.fontWeight = 'bold';
        
        // 创建文本元素
        const btnText = document.createElement('span');
        btnText.id = 'btnText';
        btnText.textContent = isScriptActive ? '运行中' : '已停止';
        
        // 添加文本到按钮
        floatingBtn.appendChild(btnText);
        
        // 添加到文档
        document.body.appendChild(floatingBtn);
        
        // 创建配置模态框
        createConfigModal();
        
        // 加载Font Awesome图标库
        loadFontAwesome();
        
        // 初始化按钮功能
        initButtonFunctionality(floatingBtn, btnText);
    }

    // 创建配置模态框
    function createConfigModal() {
        // 创建模态框容器
        const configModal = document.createElement('div');
        configModal.id = 'configModal';
        configModal.style.display = 'none';
        configModal.style.position = 'fixed';
        configModal.style.bottom = '0';
        configModal.style.left = '0';
        configModal.style.width = '100%';
        configModal.style.maxHeight = '70vh';
        configModal.style.background = 'rgba(0, 0, 0, 0.9)';
        configModal.style.zIndex = '2147483646';
        configModal.style.overflowY = 'auto';
        configModal.style.transform = 'translateY(100%)';
        configModal.style.transition = 'transform 0.3s ease';
        configModal.style.paddingTop = '20px';
        configModal.style.backdropFilter = 'blur(5px)';
        
        // 创建配置容器
        const configContainer = document.createElement('div');
        configContainer.className = 'config-container';
        configContainer.style.background = 'white';
        configContainer.style.borderRadius = '15px 15px 0 0';
        configContainer.style.boxShadow = '0 -5px 15px rgba(0, 0, 0, 0.2)';
        configContainer.style.width = '100%';
        configContainer.style.maxWidth = '100%';
        configContainer.style.margin = '0 auto';
        configContainer.style.padding = '20px';
        configContainer.style.paddingBottom = '80px'; // 为保存按钮留出空间
        
        // 创建配置头部
        const configHeader = document.createElement('div');
        configHeader.className = 'config-header';
        configHeader.style.background = 'linear-gradient(135deg, #1a2980, #26d0ce)';
        configHeader.style.color = 'white';
        configHeader.style.padding = '15px';
        configHeader.style.textAlign = 'center';
        configHeader.style.position = 'relative';
        configHeader.style.borderRadius = '15px 15px 0 0';
        configHeader.style.marginTop = '-20px';
        configHeader.style.marginLeft = '-20px';
        configHeader.style.marginRight = '-20px';
        
        const configTitle = document.createElement('h2');
        configTitle.textContent = '主要配置';
        configTitle.style.margin = '0';
        configTitle.style.fontSize = '18px';
        configHeader.appendChild(configTitle);
        
        // 创建关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.id = 'closeBtn';
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '15px';
        closeBtn.style.right = '15px';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '2147483647';
        
        configHeader.appendChild(closeBtn);
        
        // 创建配置主体
        const configBody = document.createElement('div');
        configBody.className = 'config-body';
        configBody.style.padding = '10px 0';
        
        // 创建表单组
        function createFormGroup(labelText, inputId, inputType, inputValue, placeholder) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.style.marginBottom = '15px';
            
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.display = 'block';
            label.style.marginBottom = '8px';
            label.style.color = '#2c3e50';
            label.style.fontWeight = '500';
            label.style.fontSize = '14px';
            
            let input;
            if (inputType === 'select') {
                input = document.createElement('select');
                const option1 = document.createElement('option');
                option1.value = 'old';
                option1.textContent = '旧版';
                
                const option2 = document.createElement('option');
                option2.value = 'new';
                option2.textContent = '新版';
                
                const option3 = document.createElement('option');
                option3.value = 'beta';
                option3.textContent = '测试版';
                
                input.appendChild(option1);
                input.appendChild(option2);
                input.appendChild(option3);
            } else {
                input = document.createElement('input');
                input.type = inputType;
            }
            
            input.id = inputId;
            input.className = 'form-control';
            input.style.width = '100%';
            input.style.padding = '12px';
            input.style.border = '2px solid #e0e7ff';
            input.style.borderRadius = '8px';
            input.style.fontSize = '16px';
            input.style.boxSizing = 'border-box';
            
            if (inputValue) input.value = inputValue;
            if (placeholder) input.placeholder = placeholder;
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            
            return formGroup;
        }
        
        // 添加表单组
        configBody.appendChild(createFormGroup('问候语', 'greeting', 'text', GREETING, '请输入问候语'));
        
        // 创建保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveConfigBtn';
        saveBtn.className = 'btn';
        saveBtn.style.position = 'fixed';
        saveBtn.style.bottom = '20px';
        saveBtn.style.left = '20px';
        saveBtn.style.right = '20px';
        saveBtn.style.width = 'calc(100% - 40px)';
        saveBtn.style.padding = '14px';
        saveBtn.style.background = 'linear-gradient(to right, #3498db, #2980b9)';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '8px';
        saveBtn.style.fontSize = '16px';
        saveBtn.style.fontWeight = '600';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.zIndex = '2147483647';
        saveBtn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        
        const saveIcon = document.createElement('i');
        saveIcon.className = 'fas fa-save';
        saveIcon.style.marginRight = '8px';
        saveBtn.appendChild(saveIcon);
        saveBtn.appendChild(document.createTextNode('保存配置'));
        
        // 组装配置容器
        configContainer.appendChild(configHeader);
        configContainer.appendChild(configBody);
        
        // 组装模态框
        configModal.appendChild(configContainer);
        configModal.appendChild(saveBtn);
        
        // 添加到文档
        document.body.appendChild(configModal);
        
        // 监听键盘弹出事件
        window.addEventListener('resize', function() {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                adjustForKeyboard();
            }
        });
    }

    // 调整键盘弹出时的布局
    function adjustForKeyboard() {
        const configModal = document.getElementById('configModal');
        if (configModal.style.display === 'block') {
            configModal.style.transform = 'translateY(0)';
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    }

    // 加载Font Awesome图标库
    function loadFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }

    // 初始化按钮功能
    function initButtonFunctionality(floatingBtn, btnText) {
        let longPressTimer = null;
        const longPressDuration = 1000;
        
        // 点击事件 - 开始/停止
        floatingBtn.addEventListener('click', function() {
            isScriptActive = !isScriptActive;
            
            if (isScriptActive) {
                floatingBtn.style.background = '#ff4b2b';
                btnText.textContent = '运行中';
                console.log('脚本已激活');
                startChecking();
            } else {
                floatingBtn.style.background = '#26d0ce';
                btnText.textContent = '已停止';
                console.log('脚本已停用');
                stopChecking();
            }
        });
        
        // 长按事件 - 打开配置
        floatingBtn.addEventListener('mousedown', function() {
            longPressTimer = setTimeout(function() {
                const configModal = document.getElementById('configModal');
                configModal.style.display = 'block';
                setTimeout(() => {
                    configModal.style.transform = 'translateY(0)';
                }, 10);
                console.log('长按触发，打开配置');
            }, longPressDuration);
        });
        
        // 清除长按计时器
        floatingBtn.addEventListener('mouseup', function() {
            clearTimeout(longPressTimer);
        });
        
        floatingBtn.addEventListener('mouseleave', function() {
            clearTimeout(longPressTimer);
        });
        
        // 触摸设备支持
        floatingBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            longPressTimer = setTimeout(function() {
                const configModal = document.getElementById('configModal');
                configModal.style.display = 'block';
                setTimeout(() => {
                    configModal.style.transform = 'translateY(0)';
                }, 10);
                console.log('长按触发，打开配置');
            }, longPressDuration);
        });
        
        floatingBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            clearTimeout(longPressTimer);
        });
        
        // 关闭配置
        document.getElementById('closeBtn').addEventListener('click', function() {
            const configModal = document.getElementById('configModal');
            configModal.style.transform = 'translateY(100%)';
            setTimeout(() => {
                configModal.style.display = 'none';
            }, 300);
        });
        
        // 保存配置
        document.getElementById('saveConfigBtn').addEventListener('click', function() {
            const greeting = document.getElementById('greeting').value;
            
            if (greeting) {
                GREETING = greeting;
                console.log('配置已保存:', { GREETING });
                const configModal = document.getElementById('configModal');
                configModal.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    configModal.style.display = 'none';
                }, 300);
                alert('配置保存成功！');
            } else {
                alert('问候语不能为空！');
            }
        });
        
        // 点击模态框外部关闭
        document.getElementById('configModal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    this.style.display = 'none';
                }, 300);
            }
        });
    }

    // 当检测到新女生时，发送问候语
    function stay() {
        if (!isScriptActive) return;
        
        const msgInput = document.querySelector("#msgInput");
        const sendButton = document.querySelector("a.button-link.msg-send");
        const rightMessageCount = document.querySelectorAll(".message.right").length;

        if (rightMessageCount !== 0) return;

        msgInput.value = GREETING;
        msgInput.dispatchEvent(new Event('input'));
        msgInput.dispatchEvent(new Event('change'));

        if (msgInput.value === GREETING && sendButton) sendButton.click();
    }

    // 当检测到对方是男生时，离开聊天并重新开始
    function leave() {
        if (!isScriptActive) return;
        
        const leftButton = document.querySelector("a.button-link.chat-control");
        if (leftButton) leftButton.click();

        const leftSecondButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");
        if (leftSecondButton) leftSecondButton.click();

        const restartButton = document.querySelector("span.chat-control");
        if (restartButton && restartButton.innerText) {
            if (restartButton.innerText === "离开") {
                restartButton.click();
                setTimeout(() => restartButton.click(), 500);
            } else if (restartButton.innerText === "重新开始") {
                restartButton.click();
            } else {
                console.error("error restartButton");
            }
        }
    }

    // 新功能：对方离开后自动重新开始
    function handlePartnerLeft() {
        if (!isScriptActive) return;
        
        // 检查是否存在"对方已离开"的提示
        const partnerLeftHint = Array.from(document.querySelectorAll('*'))
            .find(el => el.textContent && el.textContent.includes('对方离开了。'));
        
        if (partnerLeftHint) {
            console.log('检测到对方已离开，正在重新开始...');
            
            const restartButton = document.querySelector("span.chat-control");
            if (restartButton && restartButton.innerText === "重新开始") {
                restartButton.click();
                console.log('已点击重新开始按钮');
            } else {
                console.log('未找到重新开始按钮，尝试离开后重新开始');
                leave();
            }
        }
    }

    // 开始检查
    function startChecking() {
        stopChecking();
        checkInterval = setInterval(() => {
            const tab = document.querySelector("#partnerInfoText");
            const tabText = tab ? tab.innerText : null;

            // ***********在这里修改想匹配的性别***********
            if (tabText && tabText.includes("女生")) {
                stay();
            } else if (tabText && tabText.includes("男生")) {
                leave();
            }
            
            // 新增：检查对方是否离开
            handlePartnerLeft();
        }, 1000);
    }

    // 停止检查
    function stopChecking() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    // 初始化函数
    function init() {
        createFloatingButton();
        if (isScriptActive) {
            startChecking();
        }
    }

    // 延迟5秒后启动脚本
    setTimeout(init, 5000);
})();