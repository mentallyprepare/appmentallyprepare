import { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { Icon } from '../../components/Icon';
import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const emailErr = email && !EMAIL_RE.test(email) ? 'Enter a valid email address' : null;
  const passErr = password && password.length < 8 ? 'At least 8 characters' : null;
  const canSubmit = email.length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!email || !password) { toast.showError('Email and password required'); return; }
    if (emailErr || passErr) { toast.showError('Fix the highlighted fields'); return; }
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      await login(data.user);
      try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      toast.showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.header}>
          <Icon name="moon" size={36} color={theme.accent} />
          <Text style={styles.title}>Welcome back.</Text>
          <Text style={styles.sub}>Prepare for what's ahead.</Text>
        </View>

        <FormField placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" accessibilityLabel="Email address" error={emailErr} />
        <FormField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry accessibilityLabel="Password" error={passErr} />

        <AppButton title={loading ? 'Signing in...' : 'Sign in'} onPress={handleLogin} loading={loading} disabled={!canSubmit} />

        <TouchableOpacity onPress={() => {}} style={styles.linkSmall}>
          <Text style={styles.linkSmallText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>No account? Create one</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 28, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40, gap: 8 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: theme.ink, textAlign: 'center' },
  sub: { color: theme.inkM, fontSize: 14, marginTop: 4, textAlign: 'center' },
  linkSmall: { alignItems: 'center', marginTop: 12 },
  linkSmallText: { color: theme.inkS, fontSize: 12, opacity: 0.7 },
  link: { color: theme.inkS, textAlign: 'center', marginTop: 20, fontSize: 13 },
});
