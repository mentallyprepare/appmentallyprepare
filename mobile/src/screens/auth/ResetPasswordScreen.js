import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Icon } from '../../components/Icon';
import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';

export default function ResetPasswordScreen({ navigation, route }) {
  const toast = useToast();
  const [code, setCode] = useState(route?.params?.code || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const passErr = password && password.length < 8 ? 'At least 8 characters' : null;
  const confirmErr = confirm && password !== confirm ? 'Passwords do not match' : null;

  const handleReset = async () => {
    if (!code) { toast.showError('Reset code is required'); return; }
    if (passErr) { toast.showError('Fix the highlighted fields'); return; }
    if (confirmErr) { toast.showError('Fix the highlighted fields'); return; }
    setLoading(true);
    try {
      await api.resetPassword({ code, newPassword: password });
      setDone(true);
    } catch (e) {
      toast.showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Icon name="unlock-outline" size={56} color={theme.accent} />
          <Text style={styles.title}>Password reset</Text>
          <Text style={styles.sub}>Your password has been updated. Sign in with your new password.</Text>
          <AppButton title="Sign in" onPress={() => navigation.navigate('Login')} />
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.header}>
          <Icon name="key-outline" size={32} color={theme.accent} />
          <Text style={styles.title}>New password</Text>
          <Text style={styles.sub}>Choose a strong password you haven't used before.</Text>
        </View>

        {!route?.params?.code && (
          <FormField placeholder="Reset code" value={code} onChangeText={setCode} autoCapitalize="none" />
        )}
        <FormField placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry error={passErr} />
        <FormField placeholder="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry error={confirmErr} />

        <AppButton title={loading ? 'Resetting...' : 'Reset password'} onPress={handleReset} loading={loading} disabled={!password || !confirm} />

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
