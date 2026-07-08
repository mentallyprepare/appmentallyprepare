import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Icon } from '../../components/Icon';
import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen({ navigation }) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const emailErr = email && !EMAIL_RE.test(email) ? 'Enter a valid email address' : null;

  const handleSubmit = async () => {
    if (!email) { toast.showError('Enter your email address'); return; }
    if (emailErr) { toast.showError('Fix the highlighted field'); return; }
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (e) {
      toast.showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Icon name="mail-open-outline" size={56} color={theme.accent} />
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.sub}>If an account exists for {email}, you'll receive a reset link shortly.</Text>
          <AppButton title="Back to sign in" variant="ghost" onPress={() => navigation.navigate('Login')} />
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.header}>
          <Icon name="lock-closed-outline" size={32} color={theme.accent} />
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.sub}>Enter the email you used to sign up.</Text>
        </View>

        <FormField placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" error={emailErr} />

        <AppButton title={loading ? 'Sending...' : 'Send reset link'} onPress={handleSubmit} loading={loading} disabled={!email} />

        <AppButton title="Back to sign in" variant="ghost" onPress={() => navigation.navigate('Login')} style={{ marginTop: 8 }} />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 28, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40, gap: 8 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: theme.ink, textAlign: 'center', marginTop: 12 },
  sub: { color: theme.inkM, fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 22 },
});
