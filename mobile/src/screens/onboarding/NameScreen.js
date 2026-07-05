import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function NameScreen({ onNext, onBack, name, setName }) {
  const inputRef = useRef(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400); }, []);
  const ok = name.trim().length >= 2;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.line} />
        <Text style={styles.eye}>Identity</Text>
        <Text style={styles.title}>What do{'\n'}<Text style={styles.em}>people call you?</Text></Text>
        <Text style={styles.body}>Not your full name. Just what the people who know you call you.</Text>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#B8B7B2"
          value={name}
          onChangeText={setName}
          maxLength={24}
          autoCapitalize="words"
        />
        <View style={styles.inputMeta}>
          <Text style={styles.greeting}>{name.trim().length > 0 ? `Nice to meet you, ${name.trim()}.` : ''}</Text>
          <Text style={[styles.charHint, ok && styles.charHintOk]}>{name.length}/24</Text>
        </View>

        {name.trim().length > 0 && (
          <View style={styles.quote}>
            <Text style={styles.quoteText}>"{name.trim()}, your scan is about to begin. Answer honestly — this only works if you do."</Text>
          </View>
        )}
      </View>

      <View style={styles.btns}>
        <TouchableOpacity style={[styles.btn, !ok && styles.btnDisabled]} onPress={onNext} disabled={!ok}>
          <Text style={[styles.btnText, !ok && styles.btnTextDisabled]}>{ok ? "That's me →" : 'Enter a name'}</Text>
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
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 52 },
  line: { width: 1, height: 40, backgroundColor: '#D1C2A3', marginBottom: 32 },
  eye: { color: '#7A7975', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: '#2B2A27', lineHeight: 40, marginBottom: 16 },
  em: { fontStyle: 'italic' },
  body: { color: '#7A7975', fontSize: 14, lineHeight: 22, marginBottom: 48, maxWidth: 280 },
  input: { fontSize: 32, fontFamily: theme.fontSerif, fontStyle: 'italic', color: '#2B2A27', borderBottomWidth: 1, borderBottomColor: '#B8B7B2', paddingVertical: 16 },
  inputMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  greeting: { fontFamily: theme.fontSerif, fontSize: 14, fontStyle: 'italic', color: '#7A7975' },
  charHint: { fontSize: 11, color: '#B8B7B2', textTransform: 'uppercase', letterSpacing: 1 },
  charHintOk: { color: '#2B2A27' },
  quote: { borderLeftWidth: 1, borderLeftColor: '#D1C2A3', paddingLeft: 20, marginTop: 48 },
  quoteText: { fontFamily: theme.fontSerif, fontSize: 16, fontStyle: 'italic', color: '#2B2A27', lineHeight: 24 },
  btns: { paddingHorizontal: 32, gap: 16 },
  btn: { backgroundColor: '#2C3E35', paddingVertical: 20, alignItems: 'center' },
  btnDisabled: { opacity: 0.32 },
  btnText: { color: '#F9F8F4', fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic' },
  btnTextDisabled: { color: '#F9F8F4' },
  cancel: { color: '#7A7975', fontSize: 11, textAlign: 'center', padding: 8, textTransform: 'uppercase', letterSpacing: 1 },
});
