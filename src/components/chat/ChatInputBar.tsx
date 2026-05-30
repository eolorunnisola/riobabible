import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  onSubmit: (text: string) => void;
  loading?: boolean;
};

export function ChatInputBar({ onSubmit, loading }: Props) {
  const { colors, spacing } = useTheme();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setText('');
  };

  return (
    <View
      style={[
        styles.bar,
        {
          paddingHorizontal: spacing.md,
          paddingTop: spacing.xs,
          paddingBottom: 0,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Input
        containerStyle={styles.inputContainer}
        style={styles.input}
        placeholder="Share what is on your heart…"
        value={text}
        onChangeText={setText}
        multiline
        scrollEnabled
        textAlignVertical="top"
        maxLength={2000}
        editable={!loading}
        returnKeyType="default"
        blurOnSubmit={false}
      />
      <Button
        label="Get Bible-based guidance"
        onPress={handleSubmit}
        loading={loading}
        disabled={!text.trim()}
        fullWidth
        style={{ marginTop: spacing.xxs }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { width: '100%' },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    maxHeight: 100,
    minHeight: 48,
  },
});
