import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

const rooms = [
  { name: 'Loneliness', icon: '♡', count: 12 },
  { name: 'College Pressure', icon: '◈', count: 8 },
  { name: 'Family', icon: '⊙', count: 6 },
  { name: 'Work Stress', icon: '◇', count: 10 },
  { name: 'Relationships', icon: '∞', count: 14 },
  { name: 'Grief', icon: '〜', count: 5 },
  { name: 'Feeling Lost', icon: '☆', count: 9 },
];

export default function ArenaHomeScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Arena</Text>
        <View style={styles.grid}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.name}
              style={styles.cardWrap}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('TopicArena', { room: room.name })}
            >
              <Card padding={theme.spacing.md} style={styles.roomCard}>
                <Text style={styles.roomIcon}>{room.icon}</Text>
                <Text style={styles.roomName}>{room.name}</Text>
                <View style={styles.countRow}>
                  <Ionicons name="person" size={12} color={theme.inkS} />
                  <Text style={styles.roomCount}>{room.count}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cardWrap}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SilentRoom')}
          >
            <Card padding={theme.spacing.md} style={styles.silentCard}>
              <Text style={styles.silentIcon}>🕊</Text>
              <Text style={styles.silentName}>Silent Room</Text>
              <Text style={styles.silentSub}>just listen</Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  heading: { fontFamily: theme.fontSerif, fontSize: 32, color: theme.ink, marginBottom: theme.spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  cardWrap: { width: '47%' },
  roomCard: { alignItems: 'center', gap: theme.spacing.xs },
  roomIcon: { fontSize: 24, marginBottom: theme.spacing.xs },
  roomName: { fontFamily: theme.fontSans, fontSize: 14, color: theme.ink, textAlign: 'center' },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roomCount: { fontFamily: theme.fontSans, fontSize: 12, color: theme.inkS },
  silentCard: {
    alignItems: 'center', gap: theme.spacing.xs,
    backgroundColor: 'rgba(174,139,194,0.1)', borderColor: theme.mauve,
  },
  silentIcon: { fontSize: 24, marginBottom: theme.spacing.xs },
  silentName: { fontFamily: theme.fontSans, fontSize: 14, color: theme.mauve, textAlign: 'center' },
  silentSub: { fontFamily: theme.fontSans, fontSize: 11, color: theme.inkS },
});
