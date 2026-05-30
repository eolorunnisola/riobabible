import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ProfileText } from './ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { COLOR_THEME_OPTIONS, ColorThemeId } from '@/src/theme/colorThemes';
import { isColorThemeAllowed } from '@/src/utils/subscriptionGates';

type Props = {
  value: ColorThemeId;
  onChange: (theme: ColorThemeId) => void;
  isPremium: boolean;
};

export function ThemeColorPicker({ value, onChange, isPremium }: Props) {
  const { colors, spacing, radius } = useProfileTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      {!isPremium ? (
        <ProfileText variant="caption" tone="secondary" style={{ lineHeight: 20 }}>
          Free plan includes Sage Mist. Upgrade to unlock all color themes.
        </ProfileText>
      ) : null}
      {COLOR_THEME_OPTIONS.map((option) => {
        const selected = value === option.id;
        const allowed = isColorThemeAllowed(option.id, isPremium);
        return (
          <Pressable
            key={option.id}
            disabled={!allowed}
            onPress={() => {
              if (!allowed) {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                router.push('/profile/paywall');
                return;
              }
              void Haptics.selectionAsync();
              onChange(option.id);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled: !allowed }}
            accessibilityLabel={`${option.label} theme`}
            style={({ pressed }) => [
              styles.option,
              {
                borderRadius: radius.lg,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary + '22' : colors.surface,
                opacity: !allowed ? 0.45 : pressed ? 0.88 : 1,
              },
            ]}
          >
            <View style={styles.optionHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <ProfileText variant="body" style={{ fontWeight: '600' }}>
                    {option.label}
                  </ProfileText>
                  {!allowed ? (
                    <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
                  ) : null}
                </View>
                <ProfileText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  {option.description}
                </ProfileText>
              </View>
              {selected ? (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              ) : null}
            </View>
            <View style={[styles.swatchRow, { marginTop: spacing.sm, gap: spacing.xs }]}>
              {option.swatches.map((swatch) => (
                <View
                  key={swatch}
                  style={[
                    styles.swatch,
                    {
                      backgroundColor: swatch,
                      borderColor: colors.borderSubtle,
                    },
                  ]}
                />
              ))}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    padding: 14,
    borderWidth: 1.5,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swatchRow: {
    flexDirection: 'row',
  },
  swatch: {
    flex: 1,
    height: 22,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
