import { FREE_TIER_LIMITS } from '@/src/constants/subscription';
import type { ColorThemeId } from '@/src/theme/colorThemes';
import type { SavedReflection } from '@/src/types';

/** Saved items that count toward the free-plan reflection cap. */
export function countBillableReflections(reflections: SavedReflection[]): number {
  return reflections.filter((r) => r.type === 'verse' || r.type === 'prayer' || r.type === 'response')
    .length;
}

export function canSaveBillableReflection(
  reflections: SavedReflection[],
  isPremium: boolean,
  itemId: string,
): boolean {
  if (isPremium) return true;
  if (reflections.some((r) => r.id === itemId)) return true;
  return countBillableReflections(reflections) < FREE_TIER_LIMITS.savedReflectionsLimit;
}

export function effectiveColorTheme(stored: ColorThemeId, isPremium: boolean): ColorThemeId {
  if (isPremium) return stored;
  return FREE_TIER_LIMITS.freeColorTheme;
}

export function isColorThemeAllowed(themeId: ColorThemeId, isPremium: boolean): boolean {
  if (isPremium) return true;
  return themeId === FREE_TIER_LIMITS.freeColorTheme;
}
