/*
  network-first 전략: 온라인이면 항상 최신 파일을 받아오고 캐시를 갱신한다.
  콘텐츠 파일(mindmap.html 등)을 수정/교체해도 캐시 버전을 따로 올릴 필요 없이
  다음 접속 때 바로 반영됨. 오프라인일 때만 캐시로 폴백.
*/
const CACHE_NAME = 'sobang-review-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './shell.js',
  './apps/mindmap.html',
  './apps/notes.html',
  './apps/quiz.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => {}))
      )
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
