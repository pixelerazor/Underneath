/**
 * Firebase Messaging Service Worker
 * 
 * Behandelt Push-Nachrichten im Hintergrund (wenn App geschlossen ist)
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

// Firebase SDK importieren
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase Konfiguration (identisch zur main app)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "underneath-app.firebaseapp.com", 
  projectId: "underneath-app",
  storageBucket: "underneath-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Messaging Service
const messaging = firebase.messaging();

// Background Message Handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'Underneath';
  const notificationOptions = {
    body: payload.notification?.body || 'Sie haben eine neue Nachricht',
    icon: '/icon-192x192.png', // App Icon
    badge: '/badge-72x72.png', // Badge Icon
    image: payload.notification?.image,
    data: payload.data,
    tag: 'underneath-notification',
    renotify: true,
    requireInteraction: true, // Bleibt sichtbar bis User interagiert
    actions: [
      {
        action: 'open',
        title: 'Öffnen',
        icon: '/action-open.png'
      },
      {
        action: 'dismiss', 
        title: 'Schließen',
        icon: '/action-close.png'
      }
    ],
    // Underneath App Styling
    silent: false,
    vibrate: [200, 100, 200],
  };

  // Notification anzeigen
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    // Notification schließen - nichts tun
    return;
  }
  
  // App öffnen/fokussieren
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Prüfen ob App bereits offen ist
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // App öffnen wenn nicht bereits offen
      if (clients.openWindow) {
        const targetUrl = event.notification.data?.url || '/dashboard/overview';
        return clients.openWindow(self.location.origin + targetUrl);
      }
    })
  );
});

// Service Worker Installation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing');
  self.skipWaiting();
});

// Service Worker Activation 
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(self.clients.claim());
});