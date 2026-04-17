import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRegister = async () => {
    if (!nombre || !correo || !usuario || !password || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      // Verificar si el usuario ya existe
      const usuariosJSON = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];

      const yaExiste = usuarios.find(
        (u: any) => u.usuario === usuario || u.correo === correo
      );

      if (yaExiste) {
        Alert.alert('Error', 'El usuario o correo ya está registrado.');
        setLoading(false);
        return;
      }

      // Guardar nuevo usuario
      const nuevoUsuario = { nombre, correo, usuario, password };
      usuarios.push(nuevoUsuario);
      await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

      Alert.alert('¡Registro exitoso!', `Bienvenido, ${nombre}!`, [
        { text: 'Iniciar sesión', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
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
        <View style={[styles.header, { backgroundColor: '#3D3D3D' }]}>
          <Image
            source={require('@/assets/images/user-icon.png')}
            style={styles.userImage}
          />
        </View>

        <View style={styles.formContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.titleText}>
              Crear cuenta
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.inputsContainer}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Nombre completo"
              placeholderTextColor={colors.textDim}
              value={nombre}
              onChangeText={setNombre}
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Correo electrónico"
              placeholderTextColor={colors.textDim}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Usuario"
              placeholderTextColor={colors.textDim}
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Contraseña"
              placeholderTextColor={colors.textDim}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Confirmar contraseña"
              placeholderTextColor={colors.textDim}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </ThemedView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: loading ? '#ccc' : '#f78b2a' }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <ThemedText type="button" style={styles.buttonText}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginLinkContainer}
            onPress={() => router.replace('/')}
          >
            <ThemedText style={[styles.loginLinkText, { color: colors.textDim }]}>
              ¿Ya tienes cuenta?{' '}
              <ThemedText style={[styles.loginLinkBold, { color: '#f78b2a' }]}>
                Inicia sesión
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
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
    borderColor: 'white',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 100,
    paddingBottom: 40,
  },
  titleContainer: { alignItems: 'center', marginBottom: 30 },
  titleText: { fontSize: 28, fontWeight: 'bold' },
  inputsContainer: { gap: 20, marginBottom: 30 },
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
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: 20 },
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
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  loginLinkContainer: { alignItems: 'center', marginTop: 20 },
  loginLinkText: { fontSize: 14 },
  loginLinkBold: { fontWeight: 'bold' },
});
