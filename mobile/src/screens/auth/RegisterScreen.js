import { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { Icon } from '../../components/Icon';
import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const years = ['1st', '2nd', '3rd', '4th', '5th'];
  const genders = ['male', 'female', 'non-binary'];

  const emailErr = email && !EMAIL_RE.test(email) ? 'Enter a valid email address' : null;
  const passErr = password && password.length < 8 ? 'At least 8 characters' : null;
  const nameErr = name && name.length < 2 ? 'Enter your name' : null;
  const canSubmit = name.length > 0 && email.length > 0 && password.length > 0 && college.length > 0 && year.length > 0 && gender.length > 0;

  const handleRegister = async () => {
    if (!name || !email || !password || !college || !year || !gender) {
      toast.showError('All fields are required');
      return;
    }
    if (emailErr || passErr || nameErr) {
      toast.showError('Fix the highlighted fields');
      return;
    }
    setLoading(true);
    try {
      const data = await api.register({ name, email, password, college, year, gender, consentGiven: true });
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
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <Icon name="person-add-outline" size={32} color={theme.accent} />
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.sub}>Start preparing for what matters.</Text>
          </View>

          <FormField placeholder="Name" value={name} onChangeText={setName} error={nameErr} />
          <FormField placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" error={emailErr} />
          <FormField placeholder="Password (min 8 chars)" value={password} onChangeText={setPassword} secureTextEntry error={passErr} />
          <FormField placeholder="College" value={college} onChangeText={setCollege} />

          <Text style={styles.label}>Year</Text>
          <View style={styles.row}>
            {years.map((y) => (
              <TouchableOpacity key={y} style={[styles.chip, year === y && styles.chipOn]} onPress={() => { setYear(y); try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} }}>
                <Text style={[styles.chipText, year === y && styles.chipTextOn]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Gender</Text>
          <View style={styles.row}>
            {genders.map((g) => (
              <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipOn]} onPress={() => { setGender(g); try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} }}>
                <Text style={[styles.chipText, gender === g && styles.chipTextOn]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <AppButton title={loading ? 'Creating...' : 'Create account'} onPress={handleRegister} loading={loading} disabled={!canSubmit} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already registered? Sign in</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: theme.bg },
  container: { padding: 28, justifyContent: 'center', flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 32, gap: 8 },
  title: { fontFamily: theme.fontSerif, fontSize: 32, color: theme.ink, textAlign: 'center' },
  sub: { color: theme.inkM, fontSize: 14, marginTop: 4, textAlign: 'center' },
  label: { color: theme.inkS, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 12, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { flex: 1, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 12, alignItems: 'center' },
  chipOn: { borderColor: theme.accentD, backgroundColor: 'rgba(196,148,94,0.08)' },
  chipText: { color: theme.inkS, fontSize: 12 },
  chipTextOn: { color: theme.accent },
  link: { color: theme.inkS, textAlign: 'center', marginTop: 20, fontSize: 13 },
});
