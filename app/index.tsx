import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
<<<<<<< HEAD
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
<<<<<<< HEAD
//Index todo poderoso 
//Cambio e implementeacion de la poderosa base de datos
export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
=======

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

<<<<<<< HEAD
  const handleLogin = () => {
    if (username === 'Admin' && password === '1234') {
      router.replace('/controlParental');
    } else {
      alert('Credenciales incorrectas');
=======
  const handleLogin = async () => {
    if (!username || !password) {
      alert('Por favor ingresa usuario y contraseña.');
      return;
    }

    setLoading(true);
    try {
      // Usuario administrador hardcodeado
      if (username === 'Admin' && password === '1234') {
        router.replace('/controlParental');
        return;
      }

      // Buscar en usuarios registrados con AsyncStorage
      const usuariosJSON = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];

      const encontrado = usuarios.find(
        (u: any) => u.usuario === username && u.password === password
      );

      if (encontrado) {
        router.replace('/controlParental');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      alert('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
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
<<<<<<< HEAD
        {/* Encabezado con imagen */}
=======
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
        <View style={[styles.header, { backgroundColor: "#3D3D3D" }]}>
          <Image
            source={require('@/assets/images/user-icon.png')}
            style={styles.userImage}
          />
        </View>

<<<<<<< HEAD
        {/* Contenido del formulario */}
=======
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
        <View style={styles.formContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.titleText}>Iniciar sesión</ThemedText>
          </ThemedView>

          <ThemedView style={styles.inputsContainer}>
            <TextInput
<<<<<<< HEAD
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.inputBackground
              }]}
=======
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
              placeholder="Usuario"
              placeholderTextColor={colors.textDim}
              value={username}
              onChangeText={setUsername}
<<<<<<< HEAD
              returnKeyType="next"
            />
            
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.inputBackground
              }]}
=======
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
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
<<<<<<< HEAD
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#f78b2a' }]}
              onPress={handleLogin}
            >
              <ThemedText type="button" style={styles.buttonText}>Entrar</ThemedText>
            </TouchableOpacity>
          </View>
=======
            <TouchableOpacity
              style={[styles.button, { backgroundColor: loading ? '#ccc' : '#f78b2a' }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <ThemedText type="button" style={styles.buttonText}>
                {loading ? 'Entrando...' : 'Entrar'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.registerLinkContainer}
            onPress={() => router.push('/registro')}
          >
            <ThemedText style={[styles.registerLinkText, { color: colors.textDim }]}>
              ¿No tienes cuenta?{' '}
              <ThemedText style={[styles.registerLinkBold, { color: '#f78b2a' }]}>
                Regístrate
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
=======
  mainContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
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
<<<<<<< HEAD
    // borderWidth: 4,
=======
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
    borderColor: 'white',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 100,
<<<<<<< HEAD
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
=======
    paddingBottom: 40,
  },
  titleContainer: { alignItems: 'center', marginBottom: 30 },
  titleText: { fontSize: 28, fontWeight: 'bold' },
  inputsContainer: { gap: 20, marginBottom: 30 },
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
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
<<<<<<< HEAD
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
=======
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: 20 },
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
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
<<<<<<< HEAD
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
=======
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  registerLinkContainer: { alignItems: 'center', marginTop: 20 },
  registerLinkText: { fontSize: 14 },
  registerLinkBold: { fontWeight: 'bold' },
});
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
