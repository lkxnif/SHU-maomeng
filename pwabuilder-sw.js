    // Based off of https://github.com/pwa-builder/PWABuilder/blob/main/docs/sw.js

    /*
      Welcome to our basic Service Worker! This Service Worker offers a basic offline experience
      while also being easily customizeable. You can add in your own code to implement the capabilities
      listed below, or change anything else you would like.


      Need an introduction to Service Workers? Check our docs here: https://docs.pwabuilder.com/#/home/sw-intro
      Want to learn more about how our Service Worker generation works? Check our docs here: https://docs.pwabuilder.com/#/studio/existing-app?id=add-a-service-worker

      Did you know that Service Workers offer many more capabilities than just offline? 
        - Background Sync: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/06
        - Periodic Background Sync: https://web.dev/periodic-background-sync/
        - Push Notifications: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07?id=push-notifications-on-the-web
        - Badges: https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/07?id=application-badges
    */

    // 缓存版本
    const VERSION = 'v0.1.1';
    const CACHE_NAME = `pwa-cache-${VERSION}`;

    // 需要缓存的资源列表
    const STATIC_CACHE_URLS = [
        '/',
        '/index.html',
        '/404.html',
        '/offline.html',
        '/offline-en.html',
        '/assets/css/main.css',
        '/assets/js/main.js',
        '/assets/img/favicons/web-app-manifest-192x192.png',
        '/assets/img/favicons/web-app-manifest-512x512.png',
        '/assets/img/favicons/apple-touch-icon.png',
        '/assets/img/favicons/favicon-48x48.png',
        '/assets/img/favicons/favicon.svg',
        '/assets/img/favicons/site.webmanifest',
    ];

    // 博客文章页面的正则表达式
    const BLOG_POST_REGEX = /^\/\d{4}\/\d{2}\/\d{2}\/.+\.html$/;
    // Jekyll 分页页面的正则表达式
    const PAGINATION_REGEX = /^\/page\/\d+\/$/;

    // 允许的主机名白名单
    const HOSTNAME_WHITELIST = [
        self.location.hostname,
        'fonts.gstatic.com',
        'fonts.googleapis.com',
        'cdn.jsdelivr.net'
    ];

    // 调试模式
    const DEBUG = true;

    function log(...args) {
        if (DEBUG) {
            console.log(`[Service Worker ${VERSION}]`, ...args);
        }
    }

    // 安装事件：缓存静态资源
    self.addEventListener('install', event => {
        log('安装事件触发');
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(STATIC_CACHE_URLS))
                .then(() => self.skipWaiting())
        );
    });

    // 激活事件：清理旧缓存
    self.addEventListener('activate', event => {
        log('激活事件触发');
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.startsWith('pwa-cache-') && cacheName !== CACHE_NAME) {
                            log(`删除旧缓存: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }).then(() => {
                log('现在使用的是最新版本的缓存');
                return self.clients.claim();
            })
        );
    });

    // Fetch 事件：处理资源请求
    self.addEventListener('fetch', event => {
        const url = new URL(event.request.url);

        if (HOSTNAME_WHITELIST.includes(url.hostname)) {
            // 首页和静态资源：网络优先，缓存兜底，并更新缓存
            if (STATIC_CACHE_URLS.includes(url.pathname) || url.pathname === '/' || url.pathname === '/index.html') {
                event.respondWith(
                    fetch(event.request)
                        .then(response => {
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        })
                        .catch(() => caches.match(event.request))
                );
            } 
            // 博客文章和分页：网络优先，缓存兜底，并更新缓存
            else if (BLOG_POST_REGEX.test(url.pathname) || PAGINATION_REGEX.test(url.pathname)) {
                event.respondWith(
                    fetch(event.request)
                        .then(response => {
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        })
                        .catch(() => caches.match(event.request))
                );
            } 
            // 其他资源：网络优先，缓存兜底，离线页面最后兜底
            else {
                event.respondWith(
                    fetch(event.request)
                        .then(response => {
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        })
                        .catch(() => {
                            return caches.match(event.request)
                                .then(cachedResponse => {
                                    if (cachedResponse) {
                                        return cachedResponse;
                                    }
                                    // 离线时根据语言返回相应的离线页面
                                    const lang = navigator.language || navigator.userLanguage;
                                    return caches.match(
                                        lang.includes('zh') 
                                        ? '/offline.html' 
                                        : '/offline-en.html'
                                    );
                                });
                        })
                );
            }
        }

        // Fetch 事件中添加的新代码
        if (event.request.mode === 'navigate' && !url.pathname.startsWith('/')) {
            event.respondWith(caches.match('/index.html'));
            return;
        }
    });

    // 更新检查
    self.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            log('收到跳过等待消息');
            self.skipWaiting();
        }
    });

    // 错误处理
    self.addEventListener('error', (error) => {
        log('Service Worker 错误:', error);
    });

    log('Service Worker 已加载');

