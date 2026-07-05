import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { theme } from '../../theme';
import { api } from '../../services/api';

const archetypeData = {
  protector: {
    emoji: '🌑', name: 'The Retreating Protector',
    quote: '"You want in. You just keep locking the door."',
    description: 'You feel things deeply but pull back before anyone gets close enough to see it. Your default is distance — not because you don\'t care, but because closeness feels like a risk you can\'t afford.',
    strengths: ['Deep emotional awareness', 'Strong personal boundaries', 'Thoughtful and intentional', 'Protective of those you trust'],
    growth: ['Letting people stay close without pushing them away', 'Recognising that vulnerability isn\'t weakness', 'Trusting connection before needing proof of safety'],
  },
  connector: {
    emoji: '🌒', name: 'The Anxious Connector',
    quote: '"You give everything. It still doesn\'t feel like enough."',
    description: 'You reach toward people instinctively. You\'re the one who texts first, checks in, remembers things nobody else does. But underneath the warmth, there\'s a quiet panic — what if I\'m too much?',
    strengths: ['Naturally empathetic and caring', 'Emotionally expressive', 'Deeply loyal in relationships', 'Creates warmth in every room'],
    growth: ['Receiving care without guilt', 'Letting silence be comfortable, not threatening', 'Trusting that people stay because they want to'],
  },
  performer: {
    emoji: '🌓', name: 'The Invisible Performer',
    quote: '"Everyone knows you. Nobody knows you."',
    description: 'You\'re great in social settings. People like you. But when the room empties, you feel something hollow. You\'ve perfected the version people want — and lost track of the real one.',
    strengths: ['Socially adaptable and skilled', 'High emotional intelligence', 'Can connect with anyone quickly', 'Deeply perceptive of others\' needs'],
    growth: ['Showing the unpolished version of yourself', 'Letting relationships go deeper than surface', 'Admitting when you\'re not okay instead of performing fine'],
  },
  disconnector: {
    emoji: '🌔', name: 'The Drifting Disconnector',
    quote: '"It always starts well. Then you pull back."',
    description: 'Connections start strong — there\'s excitement, warmth, real potential. Then something shifts. You lose interest, or it gets too close, and you drift. Not dramatically. Just quietly.',
    strengths: ['Independent and self-sufficient', 'Comfortable with solitude', 'Non-clingy and emotionally steady', 'Open to new experiences'],
    growth: ['Staying present when connection gets uncomfortable', 'Noticing the drift before it becomes distance', 'Choosing to stay — even when leaving is easier'],
  },
};

export default function ResultScreen({ route, navigation }) {
  const { scores, archetype, answers } = route.params;
  const data = archetypeData[archetype] || archetypeData.protector;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, { toValue: 1, duration: 1000, useNativeDriver: false }).start();
  }, []);

  const handleContinue = async () => {
    try {
      await api.scan({ scores, archetype });
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  const TraitBar = ({ name, value }) => {
    const width = barAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', `${value}%`],
    });
    return (
      <View style={styles.trait}>
        <View style={styles.traitTop}>
          <Text style={styles.traitName}>{name}</Text>
          <Text style={styles.traitPct}>{value}%</Text>
        </View>
        <View style={styles.traitBar}>
          <Animated.View style={[styles.traitFill, { width }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.glow}>
        <View style={styles.glowInner}>
          <Text style={{ fontSize: 44 }}>{data.emoji}</Text>
        </View>
      </View>

      <Text style={styles.tag}>Your Archetype</Text>
      <Text style={styles.type}>{data.name}</Text>
      <Text style={styles.quote}>{data.quote}</Text>

      <Text style={styles.bodyText}>{data.description}</Text>

      {/* Scores */}
      <View style={styles.card}>
        <TraitBar name="Openness" value={scores.openness ?? 50} />
        <TraitBar name="Awareness" value={scores.awareness ?? 50} />
        <TraitBar name="Guardedness" value={scores.guard ?? 50} />
        <TraitBar name="Reciprocity" value={scores.reciprocity ?? 50} />
      </View>

      {/* Strengths */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Strengths</Text>
        {data.strengths.map((s, i) => (
          <View key={i} style={styles.bullet}>
            <Text style={styles.bulletDot}>✦</Text>
            <Text style={styles.bulletText}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Growth */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Growth Edges</Text>
        {data.growth.map((g, i) => (
          <View key={i} style={styles.bullet}>
            <Text style={styles.bulletDot}>→</Text>
            <Text style={styles.bulletText}>{g}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleContinue}>
        <Text style={styles.btnText}>Begin your journey →</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { alignItems: 'center', padding: 24, paddingTop: 48 },
  glow: { width: 110, height: 110, borderRadius: 55, marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  glowInner: { width: '100%', height: '100%', borderRadius: 55, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212,133,154,0.1)' },
  tag: { color: theme.rose, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  type: { fontFamily: theme.fontSerif, fontSize: 26, fontStyle: 'italic', color: theme.roseL, marginBottom: 8, textAlign: 'center' },
  quote: { fontFamily: theme.fontSerif, fontSize: 14, fontStyle: 'italic', color: theme.inkM, marginBottom: 20, textAlign: 'center', lineHeight: 22, paddingHorizontal: 12 },
  bodyText: { color: theme.inkM, fontSize: 14, lineHeight: 22, marginBottom: 20, textAlign: 'center', paddingHorizontal: 8 },
  card: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 20, padding: 20, width: '100%', marginBottom: 16 },
  cardTitle: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.roseL, marginBottom: 14 },
  trait: { marginBottom: 13 },
  traitTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  traitName: { color: theme.inkM, fontSize: 11, letterSpacing: 0.5 },
  traitPct: { color: theme.roseL, fontSize: 11, fontFamily: theme.fontSerif },
  traitBar: { height: 4, backgroundColor: 'rgba(248,242,255,0.06)', borderRadius: 100, overflow: 'hidden' },
  traitFill: { height: '100%', backgroundColor: theme.roseD, borderRadius: 100 },
  bullet: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  bulletDot: { color: theme.roseL, fontSize: 12, marginTop: 2 },
  bulletText: { color: theme.inkM, fontSize: 13, flex: 1, lineHeight: 20 },
  btn: { backgroundColor: theme.roseD, paddingVertical: 18, paddingHorizontal: 40, borderRadius: 100, alignItems: 'center', marginTop: 8, width: '100%', shadowColor: theme.roseD, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 32 },
  btnText: { color: '#fff', fontSize: 15, letterSpacing: 0.5 },
});
