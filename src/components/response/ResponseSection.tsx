import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: ReactNode;
  accent?: boolean;
};

export function ResponseSection({ icon, title, children, accent }: Props) {
  const { colors, spacing } = useTheme();

  return (
    <Card
      style={[
        styles.section,
        {
          marginBottom: spacing.md,
          backgroundColor: accent ? colors.backgroundSecondary : colors.card,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + '22' }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text variant="label" color="muted">
          {title}
        </Text>
      </View>
      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: {},
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
