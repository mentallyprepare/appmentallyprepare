import { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { API_BASE } from '../../config';

export default function RazorpayCheckoutScreen({ route, navigation }) {
  const { orderId, amount, currency, keyId, name, paymentId } = route.params;
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const baseUrl = API_BASE.replace(/\/api\/?$/, '');
  const checkoutUrl = `${baseUrl}/checkout?order_id=${orderId}&amount=${amount}&currency=${currency}&key_id=${keyId}&name=${encodeURIComponent(name)}&payment_id=${paymentId}`;

  const handleMessage = async (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'payment_success') {
        setStatus('verifying');
        await api.verifyRazorpayPayment({
          razorpay_order_id: msg.razorpay_order_id,
          razorpay_payment_id: msg.razorpay_payment_id,
          razorpay_signature: msg.razorpay_signature
        });
        setStatus('done');
      } else if (msg.type === 'payment_cancelled') {
        navigation.goBack();
      } else if (msg.type === 'payment_failed') {
        setError(msg.error || 'Payment failed');
        setStatus('error');
      }
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>✅</Text>
        <Text style={styles.title}>Payment successful</Text>
        <Text style={styles.sub}>Your purchase is complete. You can find your download in Settings.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
        <Text style={styles.title}>Payment failed</Text>
        <Text style={styles.sub}>{error || 'Something went wrong. Please try again.'}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {status === 'verifying' && (
        <View style={styles.overlay}>
          <ActivityIndicator color={theme.roseL} size="large" />
          <Text style={{ color: theme.inkM, marginTop: 12, fontSize: 13 }}>Verifying payment...</Text>
        </View>
      )}
      <WebView
        source={{ uri: checkoutUrl }}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator color={theme.roseL} size="large" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  center: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(8,5,15,0.8)', zIndex: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: theme.fontSerif, fontSize: 22, color: theme.ink, textAlign: 'center', marginBottom: 8 },
  sub: { color: theme.inkM, fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btn: { backgroundColor: theme.roseD, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 100, marginTop: 8 },
  btnText: { color: '#fff', fontSize: 15, letterSpacing: 0.5 },
});
