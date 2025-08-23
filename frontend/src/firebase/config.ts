/**
 * Firebase Configuration
 * 
 * Setup für Firebase Cloud Messaging (FCM) Push-Nachrichten
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

// Conditional Firebase imports to avoid Vite issues
let firebaseApp: any = null;
let messaging: any = null;

const initFirebase = async () => {
  try {
    const { initializeApp } = await import('firebase/app');
    const { getMessaging } = await import('firebase/messaging');
    
    // Firebase Konfiguration
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "underneath-app.firebaseapp.com",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "underneath-app",
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "underneath-app.appspot.com",
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
    };

    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
    
    console.log('Firebase initialized successfully');
    return { app: firebaseApp, messaging };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return { app: null, messaging: null };
  }
};

// VAPID Key für Web Push (muss in Firebase Console generiert werden)
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || "demo-vapid-key";

/**
 * Browser-Permission für Push-Nachrichten anfordern
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    console.log('Requesting notification permission...');
    
    // Browser-Permission anfordern
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Firebase initialisieren falls noch nicht geschehen
      if (!messaging) {
        const firebase = await initFirebase();
        if (!firebase.messaging) {
          console.log('Firebase messaging not available');
          return null;
        }
      }
      
      try {
        const { getToken } = await import('firebase/messaging');
        const token = await getToken(messaging, { vapidKey });
        
        if (token) {
          console.log('FCM Registration token:', token);
          return token;
        } else {
          console.log('No registration token available');
          return null;
        }
      } catch (tokenError) {
        console.error('Error getting FCM token:', tokenError);
        return null;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * Listener für eingehende Push-Nachrichten (wenn App im Vordergrund ist)
 */
export const onMessageListener = () =>
  new Promise<any>((resolve, reject) => {
    initFirebase().then(async (firebase) => {
      if (!firebase.messaging) {
        reject(new Error('Firebase messaging not available'));
        return;
      }
      
      try {
        const { onMessage } = await import('firebase/messaging');
        onMessage(messaging, (payload) => {
          console.log('Foreground message received:', payload);
          resolve(payload);
        });
      } catch (error) {
        reject(error);
      }
    });
  });

/**
 * Push-Nachricht senden (über Backend)
 */
export const sendPushNotification = async (
  token: string, 
  title: string, 
  body: string, 
  data?: Record<string, string>
) => {
  try {
    // API-Call an unser Backend
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        token,
        notification: {
          title,
          body,
        },
        data: data || {},
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send push notification');
    }

    console.log('Push notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Firebase als Default Export (mit Lazy Loading)
export default {
  initFirebase,
  get app() {
    return firebaseApp;
  },
  get messaging() {
    return messaging;
  }
};