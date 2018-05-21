importScripts('https://www.gstatic.com/firebasejs/5.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '413515801589'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  return self.registration.showNotification(payload.notificationTitle);
});
