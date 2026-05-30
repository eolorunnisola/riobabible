import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ProfileAvatar } from '@/src/components/profile/ProfileAvatar';
import { ProfileText } from '@/src/components/profile/ProfileText';
import { useApp } from '@/src/context/AppContext';
import { useProfileTheme } from '@/src/context/ProfileThemeContext';
import { useToast } from '@/src/context/ToastContext';

export default function EditProfileScreen() {
  const { profile, updateProfile } = useApp();
  const { showToast } = useToast();
  const { colors, spacing, radius, typography } = useProfileTheme();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(profile.displayName);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Photo permission is required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const save = () => {
    const trimmed = name.trim() || 'Friend in Faith';
    updateProfile({ displayName: trimmed, avatarUri });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Profile Updated');
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={[styles.topBar, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <ProfileText variant="h3" style={{ flex: 1, textAlign: 'center' }}>
          Edit profile
        </ProfileText>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center' }}>
          <ProfileAvatar
            uri={avatarUri}
            name={name}
            size="lg"
            showEditBadge
            editBadgeIcon="camera-outline"
            onPress={pickImage}
          />
          <Pressable onPress={pickImage} style={{ marginTop: spacing.sm }}>
            <ProfileText variant="bodySmall" style={{ color: colors.primary }}>
              Change photo
            </ProfileText>
          </Pressable>
        </View>

        <ProfileText variant="label" tone="muted" style={{ marginTop: spacing.xl }}>
          Display name
        </ProfileText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          style={[
            typography.body,
            styles.input,
            {
              marginTop: spacing.sm,
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              borderRadius: radius.lg,
              color: colors.text,
            },
          ]}
          maxLength={40}
          autoCapitalize="words"
          returnKeyType="done"
        />

        <Pressable
          onPress={save}
          style={({ pressed }) => [
            styles.saveBtn,
            {
              marginTop: spacing.xxl,
              backgroundColor: colors.primary,
              borderRadius: radius.lg,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <ProfileText variant="button" style={{ color: '#12100E', textAlign: 'center' }}>
            Save changes
          </ProfileText>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  saveBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
});
