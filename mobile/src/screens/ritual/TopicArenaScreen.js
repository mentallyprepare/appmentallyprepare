import { View, Text, StyleSheet, ScrollView, TextInput, useState } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../components/Toast';

const mockEntries = [
  { id: '1', text: 'Sometimes I feel like I am the only one at the table who has no one to call.', time: '2m ago' },
  { id: '2', text: 'The pressure to have it all figured out by 25 is crushing.', time: '7m ago' },
  { id: '3', text: 'I left home at 16. Family has always felt like a word other people use.', time: '14m ago' },
  { id: '4', text: 'My boss took credit for my work again. I just nodded.', time: '22m ago' },
  { id: '5', text: 'We said goodnight and I knew it was the last one.', time: '31m ago' },
  { id: '6', text: 'I don t know who I am without the thing that broke.', time: '46m ago' },
];

export default function TopicArenaScreen({ route, navigation }) {
  const { room } = route.params;
  const [liked, setLiked] = useState({});
  const [input, setInput] = useState('');
  const { showToast } = useToast();

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    showToast('Your voice joined the room.');
    setInput('');
  };

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.roomName}>{room}</Text>
        <Text style={styles.subtitle}>Anonymous voices</Text>

        {mockEntries.map((entry) => (
          <Card key={entry.id} padding={theme.spacing.md} style={styles.entryCard}>
            <Text style={styles.entryText}>{entry.text}</Text>
            <View style={styles.entryFooter}>
              <Text style={styles.entryTime}>{entry.time}</Text>
              <TouchableOpacity onPress={() => toggleLike(entry.id)} style={styles.heartBtn}>
                <Ionicons
                  name={liked[entry.id] ? 'heart' : 'heart-outline'}
                  size={16}
                  color={liked[entry.id] ? theme.rose : theme.inkS}
                />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <Text style={styles.leaveLabel}>Leave a line</Text>
        <TextInput
          style={styles.input}
          placeholder="Write anonymously..."
          placeholderTextColor={theme.inkS}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <AppButton title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  roomName: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.xs },
  subtitle: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, marginBottom: theme.spacing.lg },
  entryCard: { marginBottom: theme.spacing.md },
  entryText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.ink, lineHeight: 20, marginBottom: theme.spacing.sm },
  entryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryTime: { fontFamily: theme.fontSans, fontSize: 11, color: theme.inkS },
  heartBtn: { padding: 4 },
  leaveLabel: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, marginBottom: theme.spacing.sm, marginTop: theme.spacing.md },
  input: {
    backgroundColor: theme.card, color: theme.ink, fontFamily: theme.fontSans, fontSize: 14,
    borderRadius: theme.borderRadius.md, padding: theme.spacing.md, minHeight: 80,
    borderWidth: 1, borderColor: theme.line, marginBottom: theme.spacing.md,
    textAlignVertical: 'top',
  },
});
