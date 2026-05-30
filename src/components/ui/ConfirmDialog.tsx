import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { Text } from './Text';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  /** Optional emphasized line (e.g. conversation title) */
  highlight?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  highlight,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  icon = 'trash-outline',
  onConfirm,
  onCancel,
}: Props) {
  const { colors, spacing, radius, shadows, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Dismiss">
          <BlurView
            intensity={isDark ? 48 : 32}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} />
        </Pressable>

        <View style={[styles.cardWrap, { paddingHorizontal: spacing.lg }]}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceElevated,
                borderRadius: radius.xxl,
                padding: spacing.xl,
                borderColor: colors.borderSubtle,
              },
              shadows.modal,
            ]}
          >
            <View
              style={[
                styles.iconRing,
                {
                  backgroundColor: colors.dangerSurface,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Ionicons name={icon} size={28} color={colors.danger} />
            </View>

            <Text variant="h2" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
              {title}
            </Text>
            <Text
              variant="body"
              color="secondary"
              style={{ marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 }}
            >
              {message}
            </Text>

            {highlight ? (
              <View
                style={[
                  styles.highlightBox,
                  {
                    marginTop: spacing.md,
                    backgroundColor: colors.accent + (isDark ? '44' : '99'),
                    borderRadius: radius.lg,
                    padding: spacing.md,
                    borderColor: colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="caption" color="muted" style={{ textAlign: 'center' }}>
                  Conversation
                </Text>
                <Text variant="h3" numberOfLines={2} style={{ marginTop: spacing.xs, textAlign: 'center' }}>
                  {highlight}
                </Text>
              </View>
            ) : null}

            <View style={[styles.actions, { marginTop: spacing.xl, gap: spacing.sm }]}>
              <Button label={cancelLabel} variant="secondary" onPress={onCancel} fullWidth />
              <Button label={confirmLabel} variant="danger" onPress={onConfirm} fullWidth />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  cardWrap: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  card: {
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconRing: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightBox: {
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    width: '100%',
  },
});
