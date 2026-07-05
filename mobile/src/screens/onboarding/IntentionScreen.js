import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';

const opts = [
  { label: 'Social confidence', body: 'Navigating rooms, relationships, and rejection.' },
  { label: 'Identity clarity', body: 'Understanding who I actually am right now.' },
  { label: 'Emotional resilience', body: 'Bouncing back faster, feeling less broken.' },
  { label: 'Total reset', body: 'I need a full psychological overhaul.' },
];

export default function IntentionScreen({ onNext, onBack, name, pick, setPick }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.line} />
        <Text style={styles.eye}>Focus area</Text>
        <Text style={styles.title}>{name ? `${name}, what` : 'What'} brings{'\n'}<Text style={styles.em}>you here?</Text></Text>
        <Text style={styles.body}>This shapes your daily practice and archetype framing.</Text>

        {opts.map((o, i) => (
          <TouchableOpacity key={i} style={[styles.choice, pick === i && styles.choiceOn]} onPress={() => setPick(i)}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.choiceTitle, pick === i && styles.choiceTextOn]}>{o.label}</Text>
              <Text style={[styles.choiceBody, pick === i && { color: 'rgba(255,255,255,0.7)' }]}>{o.body}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.btns}>
        <TouchableOpacity style={[styles.btn, pick === null && styles.btnDisabled]} onPress={onNext} disabled={pick === null}>
          <Text style={styles.btnText}>Set intention →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cancel}>Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F4', paddingBottom: 48 },
  scroll: { flex: 1, paddingHorizontal: 32 },
  scrollContent: { paddingTop: 52 },
  line: { width: 1, height: 40, backgroundColor: '#D1C2A3', marginBottom: 32 },
  eye: { color: '#7A7975', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: '#2B2A27', lineHeight: 40, marginBottom: 16 },
  em: { fontStyle: 'italic' },
  body: { color: '#7A7975', fontSize: 14, lineHeight: 22, marginBottom: 40 },
  choice: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6E4DF', padding: 20, marginBottom: 12 },
  choiceOn: { backgroundColor: '#2C3E35', borderColor: '#2C3E35' },
  choiceTitle: { fontFamily: theme.fontSerif, fontSize: 18, color: '#2B2A27', marginBottom: 4 },
  choiceTextOn: { color: '#fff' },
  choiceBody: { fontSize: 13, color: '#7A7975', lineHeight: 20 },
  btns: { paddingHorizontal: 32, gap: 16, marginTop: 16 },
  btn: { backgroundColor: '#2C3E35', paddingVertical: 20, alignItems: 'center' },
  btnDisabled: { opacity: 0.3 },
  btnText: { color: '#F9F8F4', fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic' },
  cancel: { color: '#7A7975', fontSize: 11, textAlign: 'center', padding: 8, textTransform: 'uppercase', letterSpacing: 1 },
});
