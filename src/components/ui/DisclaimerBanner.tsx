import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '@/src/context/ThemeContext';

const COMPACT_MESSAGE =
  'Spiritual encouragement only — not professional counseling or medical advice.';

const FULL_MESSAGE =
  'This app offers faith-based reflection and Scripture-centered encouragement. It is not therapy, counseling, or a substitute for pastoral care, medical, or mental health treatment. In crisis, seek immediate professional help.';

type Props = {
  compact?: boolean;
  /** Renders on the same row as the info icon (e.g. screen title). */
  headerSlot?: ReactNode;
};

export function DisclaimerBanner({ compact, headerSlot }: Props) {
  const { colors, radius, spacing, shadows } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const message = compact ? COMPACT_MESSAGE : FULL_MESSAGE;

  const iconButton = (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Spiritual encouragement disclaimer"
      accessibilityHint={expanded ? 'Tap to hide' : 'Tap to read disclaimer'}
      accessibilityState={{ expanded }}
      style={[
        styles.iconButton,
        {
          backgroundColor: colors.accent + '99',
          borderRadius: radius.full,
          padding: spacing.xs + 2,
        },
      ]}
    >
      <Ionicons
        name={expanded ? 'information-circle' : 'information-circle-outline'}
        size={22}
        color={colors.textSecondary}
      />
    </Pressable>
  );

  const expandedOverlay = expanded ? (
    <View
      style={[
        styles.overlay,
        {
          top: '100%',
          marginTop: spacing.xs,
          backgroundColor: colors.accent + 'EE',
          borderRadius: radius.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.borderSubtle,
          padding: spacing.sm,
        },
        shadows.soft,
        Platform.OS === 'android' ? styles.androidElevation : null,
      ]}
      pointerEvents="box-none"
    >
      <Text variant="caption" color="secondary">
        {message}
      </Text>
    </View>
  ) : null;

  if (headerSlot) {
    return (
      <View style={styles.wrap} collapsable={false}>
        <View style={[styles.titleRow, { gap: spacing.sm }]}>
          <View style={styles.titleSlot}>{headerSlot}</View>
          {iconButton}
        </View>
        {expandedOverlay}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, styles.wrapInline]} collapsable={false}>
      <View style={styles.iconRow}>{iconButton}</View>
      {expandedOverlay}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    position: 'relative',
    zIndex: 50,
  },
  wrapInline: {
    alignSelf: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSlot: { flex: 1, minWidth: 0 },
  iconRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  iconButton: { flexShrink: 0 },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 51,
  },
  androidElevation: {
    elevation: 12,
  },
});
