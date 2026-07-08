import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../components/Toast';

const reportTypes = [
  { key: 'unsafe', label: 'I feel unsafe' },
  { key: 'inappropriate', label: 'Inappropriate content' },
  { key: 'suspicious', label: 'Suspicious behavior' },
  { key: 'other', label: 'Other' },
];

export default function ReportScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState(null);
  const [details, setDetails] = useState('');
  const { showToast } = useToast();

  const canSubmit = selectedType !== null;

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Report a concern</Text>

        <Card padding={0} style={styles.choicesCard}>
          {reportTypes.map((type, i) => (
            <TouchableOpacity
              key={type.key}
              style={[styles.choiceRow, i < reportTypes.length - 1 && styles.choiceRowBordered]}
              onPress={() => setSelectedType(type.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, selectedType === type.key && styles.radioSelected]}>
                {selectedType === type.key && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.choiceLabel}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={styles.detailsLabel}>Tell us more (optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Describe what happened..."
          placeholderTextColor={theme.inkS}
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <AppButton
          title="Submit report"
          disabled={!canSubmit}
          onPress={() => {
            showToast('Report submitted. We\'ll review it within 24 hours.', 'success');
            navigation.goBack();
          }}
          style={styles.submitBtn}
        />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.lg },
  choicesCard: { marginBottom: theme.spacing.lg },
  choiceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, gap: theme.spacing.md },
  choiceRowBordered: { borderBottomWidth: 1, borderBottomColor: theme.line },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.inkS, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: theme.rose },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.rose },
  choiceLabel: { fontFamily: theme.fontSans, fontSize: 15, color: theme.ink, flex: 1 },
  detailsLabel: { fontFamily: theme.fontSans, fontSize: 14, color: theme.inkM, marginBottom: theme.spacing.sm },
  textInput: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, fontFamily: theme.fontSans, fontSize: 14, color: theme.ink, minHeight: 100 },
  submitBtn: { marginTop: theme.spacing.lg },
});
