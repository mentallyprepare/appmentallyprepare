import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

export default function NameScreen({ navigation }) {
  const [name, setName] = useState('');

  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>What should we call you?</Text>
        <Text style={styles.subheading}>
          Just a first name or a nickname — whatever feels right.
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter a name..."
          placeholderTextColor={theme.inkPaperM}
          autoFocus
          maxLength={30}
        />
      </View>
      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={() => navigation.navigate('Intention')}
          disabled={name.trim().length === 0}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing.xl },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.sm },
  subheading: { color: theme.inkM, fontSize: 14, marginBottom: theme.spacing.xl, fontFamily: theme.fontSans, lineHeight: 20 },
  input: {
    backgroundColor: theme.paper,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: 18,
    fontFamily: theme.fontSerif,
    color: theme.inkPaper,
    borderWidth: 1,
    borderColor: 'rgba(241,234,225,0.6)',
  },
  footer: { paddingBottom: theme.spacing.xl },
});
