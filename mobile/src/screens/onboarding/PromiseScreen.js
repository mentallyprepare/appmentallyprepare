import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';

export default function PromiseScreen({ onNext, onBack }) {
  const features = [
    { no: '01', title: 'A mirror, not a cheerleader', body: 'It shows you who you actually are — not who you want to be told you are.' },
    { no: '02', title: 'Psychological depth', body: 'Emotionally precise. Uncomfortably accurate. Designed for people who can handle truth.' },
    { no: '03', title: 'For the real world', body: 'Social situations. Identity shifts. Emotional spirals. This is for right now.' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.line} />
        <Text style={styles.eye}>Before we begin</Text>
        <Text style={styles.title}>This is not a{'\n'}<Text style={styles.em}>wellness app.</Text></Text>
        <Text style={styles.body}>No toxic positivity. No mood trackers. No journaling prompts with illustrated sunflowers.</Text>
        {features.map((f, i) => (
          <View key={i} style={styles.feature}>
            <Text style={styles.featNo}>{f.no}</Text>
            <View>
              <Text style={styles.featTitle}>{f.title}</Text>
              <Text style={styles.featBody}>{f.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.btns}>
        <TouchableOpacity style={styles.btn} onPress={onNext}>
          <Text style={styles.btnText}>I understand →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cancel}>Cancel</Text>
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
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: '#2B2A27', lineHeight: 40, marginBottom: 24 },
  em: { color: '#7A7975', fontStyle: 'italic' },
  body: { color: '#7A7975', fontSize: 14, lineHeight: 22, marginBottom: 40 },
  feature: { flexDirection: 'row', gap: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E6E4DF' },
  featNo: { fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic', color: '#D1C2A3', minWidth: 24 },
  featTitle: { fontFamily: theme.fontSerif, fontSize: 18, color: '#2B2A27', marginBottom: 6 },
  featBody: { fontSize: 13, color: '#7A7975', lineHeight: 20 },
  btns: { paddingHorizontal: 32, gap: 16, marginTop: 16 },
  btn: { backgroundColor: '#2C3E35', paddingVertical: 20, alignItems: 'center', shadowColor: '#2C3E35', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24 },
  btnText: { color: '#F9F8F4', fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic' },
  cancel: { color: '#7A7975', fontSize: 11, textAlign: 'center', padding: 8, textTransform: 'uppercase', letterSpacing: 1 },
});
