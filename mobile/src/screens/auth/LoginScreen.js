import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required');
      return;
    }
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      await login(data.user);
      const me = await api.me();
      if (me.user.archetype) {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back.</Text>
        <Text style={styles.sub}>Continue your practice.</Text>
      </View>

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={theme.inkS} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={theme.inkS} value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.5 }]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>No account? Create one</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 28, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: theme.ink, textAlign: 'center' },
  sub: { color: theme.inkM, fontSize: 14, marginTop: 8, textAlign: 'center' },
  input: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 14, padding: 15, fontSize: 14, color: theme.ink, marginBottom: 12 },
  btn: { backgroundColor: theme.roseD, paddingVertical: 18, borderRadius: 100, alignItems: 'center', marginTop: 8, shadowColor: theme.roseD, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 32 },
  btnText: { color: '#fff', fontSize: 15, letterSpacing: 0.5 },
  link: { color: theme.inkS, textAlign: 'center', marginTop: 20, fontSize: 13 },
});
