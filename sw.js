const DB_NAME = 'DomBroSiteServiceWorker'

function fetchWithTimeout (request) {
  let timeout = 5 * 1000
  if (['document', 'script', 'style'].includes(request.destination)) timeout = 20 * 1000
  const timeoutPromise = timeout => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Response('timeout', { status: 504, statusText: 'timeout ' }))
      }, timeout)
    })
  }
  let response
  return Promise.race([
    timeoutPromise(timeout),
    fetch(request).then(async res => {
      response = res
      if (res.status) {
        const newHeaders = new Headers(res.headers)
        newHeaders.delete('content-security-policy-report-only')
        newHeaders.delete('content-security-policy')

        response = new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: newHeaders
        })
      }
      const storage = await caches.open(DB_NAME)
      storage.put(request, response.clone())
      // console.log('========', request.url, response)
      return response
    }).catch(error => {
      response = new Response(null, {
        status: 500,
        statusText: error,
      })
      // console.log('-------', request.url, response)
      return response
    }).finally(response => {
    })
  ])
}

self.addEventListener('fetch', e => {
  console.log('>>>>>>>> fetch', e.request.url)
  if (!e.request.url.startsWith(location.origin) || e.request.method === 'POST') return
  e.respondWith(
    caches.open(DB_NAME).then(storage => storage.match(e.request, {
      ignoreSearch: e.request.destination === 'image',
    }).then(cachedResponse => {
      console.log('<<<<<<<<<< fetch respondWith', e.request.url, cachedResponse)
      const fetchLatest = fetchWithTimeout(e.request)
      return cachedResponse || fetchLatest
    }))
  )
})

self.addEventListener('install', e => {
  console.log('sw install', e, self)
  caches.delete(DB_NAME)
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  console.log('sw activate', e)
  return self.clients.claim()
})
