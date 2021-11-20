import { registerRoute, setCatchHandler } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';

declare var self: ServiceWorkerGlobalScope;
declare var config: any;

precacheAndRoute(config.pages);
precacheAndRoute(config.assets);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'hbs-pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

registerRoute(
  ({ request }) =>
    request.destination === 'style'
    || request.destination === 'script'
    || request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'hbs-assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'hbs-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);

setCatchHandler(async ({ request }) => {
  if (request.destination === 'document') {
    if (config.multilingual) {
      var lang = '';
      const url = new URL(request.url);
      const paths = url.pathname.split('/');
      if (paths.length > 1) {
        lang = '/' + paths[1] + '/';
      }
  
      return matchPrecache(lang + 'offline/');
    } else {
      return matchPrecache('/offline/');
    }
  }

  return Response.error();
});