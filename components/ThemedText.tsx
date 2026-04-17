import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 
    | 'default' 
    | 'title' 
    | 'defaultSemiBold' 
    | 'subtitle' 
    | 'link'
    | 'button'; // 👈 AGREGADO
<<<<<<< HEAD
=======
    
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    type === 'button' ? 'background' : 'text' // 👈 opcional (puedes dejar 'text' si quieres)
  );

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'button' ? styles.button : undefined, // 👈 AGREGADO
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },

  // 👇 NUEVO ESTILO PARA BOTONES
  button: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});