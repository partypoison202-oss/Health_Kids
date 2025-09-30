import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Color por defecto si useThemeColor no devuelve nada
  const defaultLight = '#f8f8f8';
  const defaultDark = '#121212';

  const backgroundColor = useThemeColor(
    { light: lightColor ?? defaultLight, dark: darkColor ?? defaultDark },
    'background'
  );

  return <View style={[styles.container, { backgroundColor }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda la pantalla
  },
});
