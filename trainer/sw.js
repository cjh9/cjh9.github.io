self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('mycache').then(function(cache) {
      return cache.addAll(['./trainer.html'])
    })
  )
})



self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request))
})