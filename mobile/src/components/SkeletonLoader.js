import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { theme } from '../theme';

function Shimmer({ style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return <Animated.View style={[styles.shimmer, { opacity }, style]} />;
}

export function SkeletonBlock({ width, height, borderRadius = theme.borderRadius.md }) {
  return <Shimmer style={{ width: width || '100%', height: height || 20, borderRadius }} />;
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <View style={styles.card}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} />
      ))}
    </View>
  );
}

export function JournalSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <SkeletonBlock width={60} height={12} borderRadius={6} />
        <SkeletonBlock width={80} height={12} borderRadius={6} />
      </View>
      <View style={styles.pips}><SkeletonBlock width="100%" height={4} borderRadius={2} /></View>
      <View style={styles.moon}><SkeletonBlock width={72} height={72} borderRadius={36} /></View>
      <SkeletonBlock width="70%" height={24} borderRadius={8} />
      <View style={{ height: 16 }} />
      <SkeletonCard lines={2} />
      <View style={{ height: 16 }} />
      <SkeletonCard lines={4} />
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', paddingTop: 28 }}>
        <SkeletonBlock width={86} height={86} borderRadius={43} />
        <View style={{ height: 16 }} />
        <SkeletonBlock width={160} height={22} borderRadius={8} />
        <View style={{ height: 6 }} />
        <SkeletonBlock width={100} height={14} borderRadius={6} />
      </View>
      <View style={{ height: 24 }} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[1, 2, 3].map(i => <SkeletonBlock key={i} style={{ flex: 1 }} height={80} borderRadius={16} />)}
      </View>
      <View style={{ height: 24 }} />
      <SkeletonCard lines={2} />
      <View style={{ height: 12 }} />
      <SkeletonCard lines={1} />
    </View>
  );
}

export function PartnerSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBlock width="100%" height={80} borderRadius={20} />
      <View style={{ height: 24 }} />
      <SkeletonCard lines={2} />
      <View style={{ height: 12 }} />
      <SkeletonCard lines={3} />
      <View style={{ height: 12 }} />
      <SkeletonCard lines={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 24 },
  shimmer: { backgroundColor: 'rgba(248,242,255,0.06)', borderRadius: theme.borderRadius.md },
  card: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: theme.borderRadius.lg, padding: 16, gap: 10 },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  pips: { marginBottom: 20 },
  moon: { alignItems: 'center', marginBottom: 24 },
});
