import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const years = ['1st', '2nd', '3rd', '4th', '5th'];
  const genders = ['male', 'female', 'non-binary'];

  const handleRegister = async () => {
    if (!name || !email || !password || !college || !year || !gender) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await api.register({ name, email, password, college, year, gender, consentGiven: true });
      await login(data.user);
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.sub}>Start your journey inward.</Text>
      </View>

      <TextInput style={styles.input} placeholder="Name" placeholderTextColor={theme.inkS} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={theme.inkS} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password (min 8 chars)" placeholderTextColor={theme.inkS} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="College" placeholderTextColor={theme.inkS} value={college} onChangeText={setCollege} />

      <Text style={styles.label}>Year</Text>
      <View style={styles.row}>
        {years.map((y) => (
          <TouchableOpacity key={y} style={[styles.chip, year === y && styles.chipOn]} onPress={() => setYear(y)}>
            <Text style={[styles.chipText, year === y && styles.chipTextOn]}>{y}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        {genders.map((g) => (
          <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipOn]} onPress={() => setGender(g)}>
            <Text style={[styles.chipText, gender === g && styles.chipTextOn]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.5 }]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already registered? Sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 28, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontFamily: theme.fontSerif, fontSize: 32, color: theme.ink, textAlign: 'center' },
  sub: { color: theme.inkM, fontSize: 14, marginTop: 8, textAlign: 'center' },
  label: { color: theme.inkS, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 12, marginBottom: 8 },
  input: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 14, padding: 15, fontSize: 14, color: theme.ink, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { flex: 1, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 12, alignItems: 'center' },
  chipOn: { borderColor: theme.roseD, backgroundColor: 'rgba(212,133,154,0.08)' },
  chipText: { color: theme.inkS, fontSize: 12 },
  chipTextOn: { color: theme.roseL },
  btn: { backgroundColor: theme.roseD, paddingVertical: 18, borderRadius: 100, alignItems: 'center', marginTop: 16, shadowColor: theme.roseD, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 32 },
  btnText: { color: '#fff', fontSize: 15, letterSpacing: 0.5 },
  link: { color: theme.inkS, textAlign: 'center', marginTop: 20, fontSize: 13 },
});
