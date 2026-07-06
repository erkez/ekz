import { Colors } from '@blueprintjs/core';

// Blueprint's own neutral/semantic color scale, reshaped for spreading into a
// styled-components theme. Apps add their own brand-specific tokens (primary,
// accent, ...) on top — this only covers colors Blueprint already defines, so
// there's nothing here for an app to get "wrong" or drift on.
export const blueprintBaseTheme = {
    white: Colors.WHITE,
    gray1: Colors.GRAY1,
    gray2: Colors.GRAY2,
    gray3: Colors.GRAY3,
    gray4: Colors.GRAY4,
    gray5: Colors.GRAY5,
    lightGray1: Colors.LIGHT_GRAY1,
    lightGray2: Colors.LIGHT_GRAY2,
    lightGray3: Colors.LIGHT_GRAY3,
    lightGray4: Colors.LIGHT_GRAY4,
    lightGray5: Colors.LIGHT_GRAY5,
    darkGray1: Colors.DARK_GRAY1,
    darkGray2: Colors.DARK_GRAY2,
    darkGray3: Colors.DARK_GRAY3,
    darkGray4: Colors.DARK_GRAY4,
    darkGray5: Colors.DARK_GRAY5,
    blue1: Colors.BLUE1,
    blue2: Colors.BLUE2,
    blue3: Colors.BLUE3,
    blue4: Colors.BLUE4,
    blue5: Colors.BLUE5,
    green1: Colors.GREEN1,
    green2: Colors.GREEN2,
    green3: Colors.GREEN3,
    green4: Colors.GREEN4,
    green5: Colors.GREEN5,
    orange1: Colors.ORANGE1,
    orange2: Colors.ORANGE2,
    orange3: Colors.ORANGE3,
    orange4: Colors.ORANGE4,
    orange5: Colors.ORANGE5,
    red1: Colors.RED1,
    red2: Colors.RED2,
    red3: Colors.RED3,
    red4: Colors.RED4,
    red5: Colors.RED5
};

export type BlueprintBaseTheme = typeof blueprintBaseTheme;
