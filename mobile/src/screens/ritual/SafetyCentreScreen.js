import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

const resources = [
  { icon: 'shield-outline', title: 'Anonymous reporting', desc: 'Report concerns without revealing your identity. Your privacy is protected.' },
  { icon: 'hand-left-outline', title: 'Blocking', desc: 'Block your partner if you feel unsafe. The pairing will end immediately.' },
  { icon: 'eye-outline', title: 'Moderation', desc: 'Our team reviews flagged content to keep the community safe for everyone.' },
  { icon: 'heart-outline', title: 'Emergency resources', desc: 'If you need immediate help, crisis support lines are available 24/7.' },
];

export default function SafetyCentreScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Safety centre</Text>

        {resources.map((item) => (
          <Card key={item.title} padding={theme.spacing.md} style={styles.resourceCard}>
            <View style={styles.resourceRow}>
              <Ionicons name={item.icon} size={22} color={theme.rose} />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{item.title}</Text>
                <Text style={styles.resourceDesc}>{item.desc}</Text>
              </View>
            </View>
          </Card>
        ))}

        <AppButton
          title="Block your partner"
          variant="danger"
          onPress={() => navigation.navigate('BlockPartner')}
          style={styles.actionBtn}
        />

        <AppButton
          title="Report a concern"
          variant="ghost"
          onPress={() => navigation.navigate('Report')}
          style={styles.actionBtn}
        />

        <View style={styles.helplineBox}>
          <Ionicons name="call-outline" size={16} color={theme.inkM} />
          <Text style={styles.helplineText}>
            If you're in immediate danger, please contact your local emergency services or a crisis helpline.
          </Text>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.lg },
  resourceCard: { marginBottom: theme.spacing.sm },
  resourceRow: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'flex-start' },
  resourceContent: { flex: 1 },
  resourceTitle: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.ink, marginBottom: 4 },
  resourceDesc: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, lineHeight: 18 },
  actionBtn: { marginTop: theme.spacing.md },
  helplineBox: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.xl, padding: theme.spacing.md, backgroundColor: theme.cardS, borderRadius: theme.borderRadius.md, alignItems: 'flex-start' },
  helplineText: { fontFamily: theme.fontSans, fontSize: 12, color: theme.inkS, flex: 1, lineHeight: 17 },
});
