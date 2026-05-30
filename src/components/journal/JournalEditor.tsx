import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';
import { useToast } from '@/src/context/ToastContext';

type Props = {
  initialTitle?: string;
  initialBody?: string;
  submitLabel?: string;
  onSave: (values: { title: string; body: string }) => void;
  onCancel?: () => void;
};

export function JournalEditor({
  initialTitle = '',
  initialBody = '',
  submitLabel = 'Save entry',
  onSave,
  onCancel,
}: Props) {
  const { spacing } = useTheme();
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  useEffect(() => {
    setTitle(initialTitle);
    setBody(initialBody);
  }, [initialTitle, initialBody]);

  const handleSave = () => {
    const trimmedBody = body.trim();
    if (!trimmedBody) {
      showToast('Write something before saving');
      return;
    }
    onSave({ title: title.trim(), body: trimmedBody });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxxl }}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="label" color="muted">
        Title (optional)
      </Text>
      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="Give this entry a name"
        autoCapitalize="sentences"
        containerStyle={{ marginTop: spacing.xs }}
      />

      <Text variant="label" color="muted" style={{ marginTop: spacing.lg }}>
        Your journal
      </Text>
      <Input
        value={body}
        onChangeText={setBody}
        placeholder="What's on your heart today?"
        multiline
        scrollEnabled
        textAlignVertical="top"
        maxLength={8000}
        containerStyle={{ marginTop: spacing.xs, flex: 1 }}
        style={styles.bodyInput}
      />

      <Button
        label={submitLabel}
        onPress={handleSave}
        disabled={!body.trim()}
        fullWidth
        style={{ marginTop: spacing.xl }}
      />
      {onCancel ? (
        <Button
          label="Cancel"
          variant="ghost"
          onPress={onCancel}
          fullWidth
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  bodyInput: {
    minHeight: 200,
    maxHeight: 360,
  },
});
