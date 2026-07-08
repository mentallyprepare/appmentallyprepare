import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';

const messages = [
  'Finding a kindred spirit...',
  'Somewhere in the silence, someone is writing too...',
  'Two strangers, one night, one truth...',
  'Connecting anonymous souls...',
  'Your match is being drawn by the stars...',
];

export default function MatchingScreen({ navigation }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const dot1Y = useRef(new Animated.Value(0)).current;
  const dot2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulseAnim.start();

    const dotAnim1 = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Y, { toValue: -12, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(dot1Y, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    dotAnim1.start();

    const dotAnim2 = Animated.loop(
      Animated.sequence([
        Animated.timing(dot2Y, { toValue: 12, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(dot2Y, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    dotAnim2.start();

    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    const navTimer = setTimeout(() => {
      navigation.replace('MatchFound');
    }, 5000);

    return () => {
      pulseAnim.stop();
      dotAnim1.stop();
      dotAnim2.stop();
      clearInterval(msgInterval);
      clearTimeout(navTimer);
    };
  }, [pulse, dot1Y, dot2Y, navigation]);

  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Finding your match</Text>
        <View style={styles.dotsWrap}>
          <View style={styles.lineWrap}>
            <Animated.View style={[styles.connectingLine, { opacity: pulse }]} />
          </View>
          <Animated.View style={[styles.dot, styles.dotRose, { transform: [{ translateY: dot1Y }] }]} />
          <Animated.View style={[styles.dot, styles.dotGold, { transform: [{ translateY: dot2Y }] }]} />
        </View>
        <Text style={styles.status}>{messages[messageIndex]}</Text>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: theme.fontSerif, fontSize: 26, color: theme.ink, marginBottom: theme.spacing['2xl'] },
  dotsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
    height: 60,
  },
  lineWrap: {
    position: 'absolute',
    width: 80,
    height: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: theme.inkS,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
  },
  dotRose: {
    backgroundColor: theme.rose,
    ...theme.shadow.glow(theme.rose),
  },
  dotGold: {
    backgroundColor: theme.gold,
    ...theme.shadow.glow(theme.gold),
  },
  status: { fontFamily: theme.fontSerif, fontStyle: 'italic', fontSize: 15, color: theme.inkM, textAlign: 'center', lineHeight: 24 },
});
