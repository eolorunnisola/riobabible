import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileText } from './ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

type Props = {
  name: string;
  avatarUri: string | null;
  onEditPress: () => void;
};

export function ProfileStickyHeader({ name, avatarUri, onEditPress }: Props) {
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useProfileTheme();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <BlurView intensity={72} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.inner,
          {
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.sm,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <ProfileAvatar uri={avatarUri} name={name} size="sm" />
        <View style={styles.titleBlock}>
          <ProfileText variant="h3" numberOfLines={1}>
            {name}
          </ProfileText>
          <ProfileText variant="caption" tone="muted">
            Profile
          </ProfileText>
        </View>
        <Pressable
          onPress={onEditPress}
          hitSlop={12}
          accessibilityLabel="Edit profile"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.editBtn,
            { backgroundColor: colors.surfaceElevated, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="pencil-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 10,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleBlock: { flex: 1 },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
