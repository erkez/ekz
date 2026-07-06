// Blueprint 6 themes its compiled CSS via custom properties on :root (see
// @blueprintjs/core/lib/css/blueprint.css: --bp-intent-<name>-rest/hover/active/disabled/foreground).
// This lets an app drive those variables straight from its own design tokens (e.g. a
// styled-components theme), instead of hand-overriding compiled component selectors
// (which only covers the components you remembered to patch, and breaks on Blueprint
// upgrades) or hardcoding the same brand hex a second time in Sass.

export type IntentName = 'primary' | 'success' | 'warning' | 'danger' | 'default';

export type IntentShades = {
    rest: string;
    hover?: string;
    active?: string;
    disabled?: string;
    foreground?: string;
};

export type BlueprintTheme = Partial<Record<IntentName, IntentShades>>;

function clampByte(value: number): number {
    return Math.min(255, Math.max(0, Math.round(value)));
}

function hexToRgb(hex: string): [number, number, number] {
    const value = hex.replace('#', '');
    const parts =
        value.length === 3
            ? value.split('').map((c) => c + c)
            : [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)];
    const [r, g, b] = parts.map((part) => parseInt(part, 16));
    return [r, g, b];
}

function byteToHex(c: number): string {
    const hex = clampByte(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex([r, g, b]: [number, number, number]): string {
    return '#' + byteToHex(r) + byteToHex(g) + byteToHex(b);
}

// Mixes `hex` toward black (target 0) or white (target 255) by `weight` (0-1),
// approximating what a design tool's "darken/lighten" slider would produce.
function mix(hex: string, target: number, weight: number): string {
    const rgb = hexToRgb(hex);
    return rgbToHex(rgb.map((c) => c + (target - c) * weight) as [number, number, number]);
}

function cssPropsForIntent(intent: IntentName, shades: IntentShades): Record<string, string> {
    return {
        [`--bp-intent-${intent}-rest`]: shades.rest,
        [`--bp-intent-${intent}-hover`]: shades.hover ?? mix(shades.rest, 0, 0.15),
        [`--bp-intent-${intent}-active`]: shades.active ?? mix(shades.rest, 0, 0.3),
        [`--bp-intent-${intent}-disabled`]: shades.disabled ?? mix(shades.rest, 255, 0.45),
        [`--bp-intent-${intent}-foreground`]: shades.foreground ?? '#ffffff'
    };
}

export function applyBlueprintTheme(
    theme: BlueprintTheme,
    target: HTMLElement = document.documentElement
): void {
    const intents = Object.keys(theme) as IntentName[];

    for (const intent of intents) {
        const shades = theme[intent];

        if (!shades) {
            continue;
        }

        const cssProps = cssPropsForIntent(intent, shades);

        for (const prop of Object.keys(cssProps)) {
            target.style.setProperty(prop, cssProps[prop]);
        }
    }

    if (theme.primary) {
        target.style.setProperty('--bp-emphasis-focus-color', theme.primary.rest);
    }
}
