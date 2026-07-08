import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function FormField({
  label, error, required,
  value, onChangeText, onBlur,
  placeholder, secureTextEntry, autoCapitalize, keyboardType,
  multiline, returnKeyType, onSubmitEditing, editable, maxLength, autoFocus,
  accessibilityLabel,
}) {
  const [touched, setTouched] = useState(false);
  const showError = touched && error;

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label}{required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      )}
      <TextInput
        style={[styles.input, showError && styles.inputError, multiline && styles.multiline]}
        placeholder={placeholder}
        placeholderTextColor={theme.inkS}
        value={value}
        onChangeText={onChangeText}
        onBlur={(e) => { setTouched(true); onBlur?.(e); }}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        editable={editable}
        maxLength={maxLength}
        autoFocus={autoFocus}
        accessibilityLabel={accessibilityLabel || placeholder}
      />
      {showError && (
        <View style={styles.errorRow}>
          <Text style={styles.errorIcon}>{'\u26A0'}</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { color: theme.inkS, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  required: { color: theme.roseL, fontWeight: '600' },
  input: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: theme.borderRadius.md, padding: 15, fontSize: 14, color: theme.ink },
  inputError: { borderColor: theme.roseD },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, marginLeft: 2 },
  errorIcon: { color: theme.roseL, fontSize: 10 },
  errorText: { color: theme.roseL, fontSize: 11, flex: 1 },
});
