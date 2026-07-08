import { View, Text, ScrollView, TouchableOpacity, Animated, useRef } from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

const currentNight = 4;
const totalNights = 21;

function NightDot({ index, filled, current }) {
  const pulse = useRef(new Animated.Value(1)).current;

  if (current) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.6, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }

  return (
    <Animated.View
      style={[
        styles.dot,
        filled && styles.dotFilled,
        current && { opacity: pulse, borderColor: theme.rose, ...theme.shadow.glow(theme.rose) },
      ]}
    >
      {current && <View style={styles.dotInner} />}
    </Animated.View>
  );
}

export default function TonightDashboard({ navigation }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.nightLabel}>Night {currentNight} of {totalNights}</Text>
        <Text style={styles.date}>{today}</Text>

        <View style={styles.constellationRow}>
          {Array.from({ length: totalNights }, (_, i) => (
            <NightDot
              key={i}
              index={i}
              filled={i < currentNight - 1}
              current={i === currentNight - 1}
            />
          ))}
        </View>

        <Card variant="highlight" padding={theme.spacing.lg} style={styles.promptCard}>
          <Ionicons name="sparkles" size={16} color={theme.gold} style={{ marginBottom: theme.spacing.sm }} />
          <Text style={styles.promptLabel}>Tonight's prompt</Text>
          <Text style={styles.promptText}>
            What is something you felt today but didn't say out loud?
          </Text>
        </Card>

        <Card padding={theme.spacing.md} style={styles.partnerCard}>
          <View style={styles.partnerRow}>
            <View style={[styles.statusDot, { backgroundColor: theme.green }]} />
            <Text style={styles.partnerText}>Your partner has written</Text>
            <Ionicons name="checkmark-circle" size={18} color={theme.green} />
          </View>
        </Card>

        <AppButton
          title="Write tonight's note"
          icon={<Ionicons name="create" size={18} color="#fff" />}
          onPress={() => navigation.navigate('Write')}
          style={styles.writeBtn}
        />

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('RevealProgress')}
          activeOpacity={0.7}
        >
          <Ionicons name="star" size={16} color={theme.inkM} />
          <Text style={styles.linkText}>Constellation</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.inkS} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('PartnerOverview')}
          activeOpacity={0.7}
        >
          <Ionicons name="people" size={16} color={theme.inkM} />
          <Text style={styles.linkText}>Partner</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.inkS} />
        </TouchableOpacity>

        <View style={styles.tabBar}>
          {['Tonight', 'Arena', 'Alerts', 'Me'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => {
                if (tab === 'Tonight') return;
                navigation.getParent()?.navigate('MainTabs', { screen: tab });
              }}
            >
              <Ionicons
                name={
                  tab === 'Tonight' ? 'moon' :
                  tab === 'Arena' ? 'compass' :
                  tab === 'Alerts' ? 'notifications' : 'person'
                }
                size={20}
                color={tab === 'Tonight' ? theme.rose : theme.inkS}
              />
              <Text style={[styles.tabLabel, tab === 'Tonight' && styles.tabLabelActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xl },
  nightLabel: { fontFamily: theme.fontSerif, fontSize: 22, color: theme.ink, textAlign: 'center' },
  date: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, textAlign: 'center', marginBottom: theme.spacing.lg },
  constellationRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginBottom: theme.spacing.lg },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: theme.cardS, borderWidth: 1, borderColor: theme.line,
  },
  dotFilled: {
    backgroundColor: theme.gold, borderColor: theme.gold,
    ...theme.shadow.glow(theme.gold),
  },
  dotInner: {
    width: 4, height: 4, borderRadius: 2, backgroundColor: theme.rose,
    alignSelf: 'center', marginTop: 2,
  },
  promptCard: { marginBottom: theme.spacing.md },
  promptLabel: { fontFamily: theme.fontSans, fontSize: 11, letterSpacing: 1.5, color: theme.inkS, textTransform: 'uppercase', marginBottom: theme.spacing.sm },
  promptText: { fontFamily: theme.fontSerif, fontSize: 18, color: theme.ink, lineHeight: 26 },
  partnerCard: { marginBottom: theme.spacing.md },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  partnerText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.inkM, flex: 1 },
  writeBtn: { marginBottom: theme.spacing.lg },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.line,
  },
  linkText: { fontFamily: theme.fontSans, fontSize: 15, color: theme.inkM, flex: 1 },
  tabBar: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg, borderTopWidth: 1, borderTopColor: theme.line,
  },
  tabItem: { alignItems: 'center', gap: 4 },
  tabLabel: { fontFamily: theme.fontSans, fontSize: 11, color: theme.inkS },
  tabLabelActive: { color: theme.rose },
});
