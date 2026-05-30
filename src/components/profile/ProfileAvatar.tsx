import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileText } from './ProfileText';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';

type Props = {
  uri: string | null;
  name: string;
  size?: 'sm' | 'lg';
  onPress?: () => void;
  showEditBadge?: boolean;
  /** Badge on avatar — pencil for profile edit, camera when changing photo only */
  editBadgeIcon?: keyof typeof Ionicons.glyphMap;
};

export function ProfileAvatar({
  uri,
  name,
  size = 'lg',
  onPress,
  showEditBadge,
  editBadgeIcon = 'pencil-outline',
}: Props) {
  const { colors, radius } = useProfileTheme();
  const dim = size === 'lg' ? 96 : 40;
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  const inner = (
    <View
      style={[
        styles.ring,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          borderColor: colors.primary + '66',
          backgroundColor: colors.surfaceElevated,
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: dim - 4, height: dim - 4, borderRadius: (dim - 4) / 2 }} />
      ) : (
        <View style={[styles.fallback, { borderRadius: (dim - 4) / 2, backgroundColor: colors.accent }]}>
          <ProfileText
            variant={size === 'lg' ? 'h1' : 'body'}
            style={{ fontSize: size === 'lg' ? 36 : 16 }}
          >
            {initial}
          </ProfileText>
        </View>
      )}
      {showEditBadge ? (
        <View style={[styles.badge, { backgroundColor: colors.primary, borderRadius: radius.full }]}>
          <Ionicons name={editBadgeIcon} size={14} color="#12100E" />
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fallback: {
    width: '92%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
