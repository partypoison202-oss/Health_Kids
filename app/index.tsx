import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = () => {
    if (username === 'Admin' && password === '1234') {
      router.replace('/controlParental');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <StatusBar hidden />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado con imagen */}
        <View style={[styles.header, { backgroundColor: "#3D3D3D" }]}>
          <Image
            source={require('@/assets/images/user-icon.png')}
            style={styles.userImage}
          />
        </View>

        {/* Contenido del formulario */}
        <View style={styles.formContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.titleText}>Iniciar sesión</ThemedText>
          </ThemedView>

          <ThemedView style={styles.inputsContainer}>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.inputBackground
              }]}
              placeholder="Usuario"
              placeholderTextColor={colors.textDim}
              value={username}
              onChangeText={setUsername}
              returnKeyType="next"
            />
            
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.inputBackground
              }]}
              placeholder="Contraseña"
              placeholderTextColor={colors.textDim}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </ThemedView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#f78b2a' }]}
              onPress={handleLogin}
            >
              <ThemedText type="button" style={styles.buttonText}>Entrar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 2,
    marginBottom: -75,
    // borderWidth: 4,
    borderColor: 'white',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 100,
    paddingBottom: 40, // Espacio extra para el teclado
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});