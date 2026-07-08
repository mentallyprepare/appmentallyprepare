import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { api } from '../services/api';
import { navigate } from '../utils/navigationRef';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function setupChannels() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('journal', {
    name: 'Journal Reminders',
    description: 'Daily journaling prompts and reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'notification-sound.wav',
  });
  await Notifications.setNotificationChannelAsync('partner', {
    name: 'Partner Activity',
    description: 'When your partner writes an entry or reacts',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'notification-sound.wav',
  });
  await Notifications.setNotificationChannelAsync('match', {
    name: 'Match Updates',
    description: 'New matches and reveal notifications',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'notification-sound.wav',
  });
  await Notifications.setNotificationChannelAsync('system', {
    name: 'System Notifications',
    description: 'Account and app notifications',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export default function usePushNotifications(enabled) {
  const subbedRef = useRef(false);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      subbedRef.current = false;
      return;
    }

    if (subbedRef.current) return;
    subbedRef.current = true;

    async function subscribe() {
      try {
        await setupChannels();
        if (Platform.OS === 'web') {
          await subscribeWeb();
        } else {
          await subscribeNative();
        }
      } catch {}
    }

    subscribe();

    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      if (data?.type === 'partner_entry' || data?.type === 'partner_comment') {
        navigate('MainTabs', { screen: 'Exchange' });
      } else if (data?.type === 'daily_prompt' || data?.type === 'entry_shared') {
        navigate('MainTabs', { screen: 'Prepare' });
      } else {
        navigate('MainTabs', { screen: 'Notifications' });
      }
    });

    unsubRef.current = async () => {
      try {
        await api.unsubscribePush();
      } catch {}
    };

    return () => {
      Notifications.removeNotificationSubscription(responseSub);
    };
  }, [enabled]);
}

async function subscribeWeb() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const pubKeyRes = await fetch('/api/push/public-key');
    const { publicKey } = await pubKeyRes.json();
    if (!publicKey) return;
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  await api.subscribePush(sub);
}

async function subscribeNative() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    applicationId: undefined,
  });
  if (expoPushToken?.data) {
    await api.subscribePush({
      endpoint: `expo:${expoPushToken.data}`,
      keys: { p256dh: '', auth: '' },
    });
  }
}

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}
