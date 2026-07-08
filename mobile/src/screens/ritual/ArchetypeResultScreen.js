import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Icon } from '../../components/Icon';

const archetypes = [
  {
    id: 'poet',
    name: 'The Poet',
    icon: 'moon',
    color: theme.rose,
    description: 'You write in shades of feeling, finding meaning between the lines.',
  },
  {
    id: 'seeker',
    name: 'The Seeker',
    icon: 'star',
    color: theme.gold,
    description: 'You write to understand, to question, to uncover what lies beneath.',
  },
  {
    id: 'witness',
    name: 'The Witness',
    icon: 'water',
    color: theme.mauve,
    description: 'You observe without judgment, holding space for what is.',
  },
];

export default function ArchetypeResultScreen({ route, navigation }) {
  const [archetype, setArchetype] = useState(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * archetypes.length);
    setArchetype(archetypes[idx]);
  }, []);

  if (!archetype) return null;

  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.label}>YOUR ARCHETYPE</Text>
        <Card variant="highlight" padding={theme.spacing.xl} style={styles.card}>
          <View style={[styles.iconRing, { borderColor: archetype.color }]}>
            <Icon name={archetype.icon} size={40} color={archetype.color} />
          </View>
          <Text style={[styles.archetypeName, { color: archetype.color }]}>{archetype.name}</Text>
          <Text style={styles.description}>{archetype.description}</Text>
        </Card>
      </View>
      <View style={styles.footer}>
        <AppButton title="Continue to matching" onPress={() => navigation.navigate('Matching')} />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: theme.spacing['2xl'] },
  label: { fontFamily: theme.fontSans, fontSize: 11, letterSpacing: 2, color: theme.inkS, marginBottom: theme.spacing.lg },
  card: { width: '100%', alignItems: 'center' },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: theme.spacing.lg,
  },
  archetypeName: { fontFamily: theme.fontSerif, fontSize: 28, marginBottom: theme.spacing.sm },
  description: { fontFamily: theme.fontSans, fontSize: 15, color: theme.inkM, textAlign: 'center', lineHeight: 24 },
  footer: { paddingBottom: theme.spacing.xl },
});
