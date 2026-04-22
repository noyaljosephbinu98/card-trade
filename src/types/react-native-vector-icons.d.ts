// Minimal type shims for the subset of react-native-vector-icons used in this
// project. The upstream package ships types for some glyph sets but not all,
// and the versions don't always match what we import. Keeping this narrow
// declaration avoids a broken `@types/*` dependency.
declare module 'react-native-vector-icons/Ionicons' {
  import type { ComponentType } from 'react';
  import type { TextProps } from 'react-native';

  export type IconProps = TextProps & {
    name: string;
    size?: number;
    color?: string;
    allowFontScaling?: boolean;
  };

  const Ionicons: ComponentType<IconProps> & {
    getImageSource: (name: string, size?: number, color?: string) => Promise<unknown>;
  };

  export default Ionicons;
}
