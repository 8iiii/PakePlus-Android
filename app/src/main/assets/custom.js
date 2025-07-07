// ==UserScript==
// @name                      叔叔不约只配女并自动问好
// @namespace                 wwbnq
// @version                   0.9
// @description               叔叔不约只配女 并自动问好，带悬浮窗控制
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
    let GREETING = "滴个打视频的妹妹";
    let isScriptActive = true; // 脚本是否激活
    let checkInterval; // 检查间隔

    // 创建悬浮窗按钮
    function createFloatingButton() {
        // 创建悬浮按钮元素
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'floatingBtn';
        floatingBtn.style.position = 'fixed';
        floatingBtn.style.bottom = '30px';
        floatingBtn.style.right = '30px';
        floatingBtn.style.width = '60px';
        floatingBtn.style.height = '60px';
        floatingBtn.style.background = isScriptActive ? 'linear-gradient(135deg, #ff416c, #ff4b2b)' : 'linear-gradient(135deg, #1a2980, #26d0ce)';
        floatingBtn.style.color = 'white';
        floatingBtn.style.borderRadius = '50%';
        floatingBtn.style.display = 'flex';
        floatingBtn.style.justifyContent = 'center';
        floatingBtn.style.alignItems = 'center';
        floatingBtn.style.fontSize = '24px';
        floatingBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        floatingBtn.style.cursor = 'pointer';
        floatingBtn.style.userSelect = 'none';
        floatingBtn.style.zIndex = '2147483647'; // 设置为最大z-index值
        floatingBtn.style.transition = 'all 0.3s ease';
        
        // 创建图标元素
        const btnIcon = document.createElement('i');
        btnIcon.id = 'btnIcon';
        btnIcon.className = isScriptActive ? 'fas fa-stop' : 'fas fa-power-off';
        
        // 添加图标到按钮
        floatingBtn.appendChild(btnIcon);
        
        // 添加到文档
        document.body.appendChild(floatingBtn);
        
        // 创建配置模态框
        createConfigModal();
        
        // 加载Font Awesome图标库
        loadFontAwesome();
        
        // 初始化按钮功能
        initButtonFunctionality(floatingBtn, btnIcon);
    }

    // 创建配置模态框
    function createConfigModal() {
        // 创建模态框容器
        const configModal = document.createElement('div');
        configModal.id = 'configModal';
        configModal.style.display = 'none';
        configModal.style.position = 'fixed';
        configModal.style.top = '0';
        configModal.style.left = '0';
        configModal.style.width = '100%';
        configModal.style.height = '100%';
        configModal.style.background = 'rgba(0, 0, 0, 0.7)';
        configModal.style.zIndex = '2147483646'; // 比按钮稍低
        configModal.style.overflowY = 'auto';
        
        // 创建配置容器
        const configContainer = document.createElement('div');
        configContainer.className = 'config-container';
        configContainer.style.background = 'white';
        configContainer.style.borderRadius = '15px';
        configContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        configContainer.style.width = '90%';
        configContainer.style.maxWidth = '500px';
        configContainer.style.margin = '30px auto';
        configContainer.style.overflow = 'hidden';
        
        // 创建配置头部
        const configHeader = document.createElement('div');
        configHeader.className = 'config-header';
        configHeader.style.background = 'linear-gradient(135deg, #1a2980, #26d0ce)';
        configHeader.style.color = 'white';
        configHeader.style.padding = '20px';
        configHeader.style.textAlign = 'center';
        
        const configTitle = document.createElement('h2');
        configTitle.textContent = '主要配置';
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
        closeBtn.style.zIndex = '2147483647'; // 确保关闭按钮在最顶层
        
        configHeader.appendChild(closeBtn);
        
        // 创建配置主体
        const configBody = document.createElement('div');
        configBody.className = 'config-body';
        configBody.style.padding = '20px';
        
        // 创建表单组
        function createFormGroup(labelText, inputId, inputType, inputValue, placeholder) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.style.marginBottom = '20px';
            
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.display = 'block';
            label.style.marginBottom = '8px';
            label.style.color = '#2c3e50';
            label.style.fontWeight = '500';
            
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
        saveBtn.style.display = 'block';
        saveBtn.style.width = '100%';
        saveBtn.style.padding = '14px';
        saveBtn.style.background = 'linear-gradient(to right, #3498db, #2980b9)';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '8px';
        saveBtn.style.fontSize = '16px';
        saveBtn.style.fontWeight = '600';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.marginTop = '20px';
        
        const saveIcon = document.createElement('i');
        saveIcon.className = 'fas fa-save';
        saveBtn.appendChild(saveIcon);
        saveBtn.appendChild(document.createTextNode(' 保存配置'));
        
        configBody.appendChild(saveBtn);
        
        // 组装配置容器
        configContainer.appendChild(configHeader);
        configContainer.appendChild(configBody);
        
        // 组装模态框
        configModal.appendChild(configContainer);
        
        // 添加到文档
        document.body.appendChild(configModal);
    }

    // 加载Font Awesome图标库
    function loadFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }

    // 初始化按钮功能
    function initButtonFunctionality(floatingBtn, btnIcon) {
        let longPressTimer = null;
        const longPressDuration = 1000; // 长按1秒触发
        
        // 点击事件 - 开始/停止
        floatingBtn.addEventListener('click', function() {
            isScriptActive = !isScriptActive;
            
            if (isScriptActive) {
                // 开始
                floatingBtn.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
                btnIcon.className = 'fas fa-stop';
                console.log('脚本已激活');
                startChecking();
            } else {
                // 停止
                floatingBtn.style.background = 'linear-gradient(135deg, #1a2980, #26d0ce)';
                btnIcon.className = 'fas fa-power-off';
                console.log('脚本已停用');
                stopChecking();
            }
        });
        
        // 长按事件 - 打开配置
        floatingBtn.addEventListener('mousedown', function() {
            longPressTimer = setTimeout(function() {
                document.getElementById('configModal').style.display = 'block';
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
                document.getElementById('configModal').style.display = 'block';
                console.log('长按触发，打开配置');
            }, longPressDuration);
        });
        
        floatingBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            clearTimeout(longPressTimer);
        });
        
        // 关闭配置
        document.getElementById('closeBtn').addEventListener('click', function() {
            document.getElementById('configModal').style.display = 'none';
        });
        
        // 保存配置
        document.getElementById('saveConfigBtn').addEventListener('click', function() {
            const greeting = document.getElementById('greeting').value;
            
            if (greeting) {
                GREETING = greeting;
                console.log('配置已保存:', { GREETING });
                document.getElementById('configModal').style.display = 'none';
                alert('配置保存成功！');
            } else {
                alert('问候语不能为空！');
            }
        });
    }

    // 当检测到新女生时，发送问候语
    function stay() {
        if (!isScriptActive) return;
        
        const msgInput = document.querySelector("#msgInput");  // 输入框
        const sendButton = document.querySelector("a.button-link.msg-send");  // 发送按钮
        const rightMessageCount = document.querySelectorAll(".message.right").length;  // 已发送的消息数量

        // 若已经发送消息则直接返回
        if (rightMessageCount !== 0) return;

        // 如果自己已发消息数量为0，则认为是新女生
        msgInput.value = GREETING;  // 设置问候语
        msgInput.dispatchEvent(new Event('input'));  // 触发输入事件
        msgInput.dispatchEvent(new Event('change'));  // 触发更改事件

        // 发送消息
        if (msgInput.value === GREETING && sendButton) sendButton.click();
    }

    // 当检测到对方是男生时，离开聊天并重新开始
    function leave() {
        if (!isScriptActive) return;
        
        const leftButton = document.querySelector("a.button-link.chat-control");  // 离开按钮
        if (leftButton) leftButton.click();

        const leftSecondButton = document.querySelector("span.actions-modal-button.actions-modal-button-bold.color-danger");  // 确认离开按钮
        if (leftSecondButton) leftSecondButton.click();

        const restartButton = document.querySelector("span.chat-control");  // 重新开始按钮
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

    // 开始检查
    function startChecking() {
        stopChecking(); // 先停止现有的检查
        checkInterval = setInterval(() => {
            const tab = document.querySelector("#partnerInfoText");  // 对方信息标签
            const tabText = tab ? tab.innerText : null;

            // ***********在这里修改想匹配的性别***********
            if (tabText && tabText.includes("女生")) {
                stay();  // 若为女生，调用 stay() 函数
            } else if (tabText && tabText.includes("男生")) {
                leave();  // 若为男生，调用 leave() 函数
            }
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