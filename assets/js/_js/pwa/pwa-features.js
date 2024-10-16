// PWA 功能

// Service Worker 注册
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/pwabuilder-sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// 添加到主屏幕提示
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // 可以在这里显示自定义的 "添加到主屏幕" 按钮
});

// 模拟简单的通知功能
function checkForNewContent() {
  // 这里应该是检查新内容的逻辑
  // 为了演示，我们只是使用 localStorage 来模拟
  const lastCheck = localStorage.getItem('lastContentCheck');
  const now = new Date().getTime();
  if (!lastCheck || now - lastCheck > 86400000) { // 24小时检查一次
    // 模拟发现新内容
    showNotification('新内容可用！');
    localStorage.setItem('lastContentCheck', now);
  }
}

function showNotification(message) {
  // 如果浏览器支持原生通知，使用原生通知
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(message);
  } else {
    // 否则使用自定义的通知UI
    alert(message); // 这里可以替换为更优雅的UI通知
  }
}

// 页面加载时检查新内容
window.addEventListener('load', checkForNewContent);
