// Derives app spacing from Blueprint's own --bp-surface-spacing custom property
// (see blueprintTheme.ts's `theme.spacing` override) instead of hardcoding pixel
// values, so app-wide gaps/padding stay in lockstep if that variable ever changes.
export function spacing(multiplier: number): string {
    return `calc(var(--bp-surface-spacing) * ${multiplier})`;
}

// The app's standard gap/padding unit — 12px at Blueprint's default 4px surface spacing.
export const GAP = spacing(3);
