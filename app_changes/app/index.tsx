// app/index.tsx  — Login + Registro conectado a MySQL via API
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { login, register } from '@/services/api';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const [mode, setMode]           = useState<Mode>('login');
  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
  const [nombre, setNombre]       = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const router      = useRouter();
  const colorScheme = useColorScheme();
  const colors      = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Completa usuario y contraseña');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      if (data.usuario.rol === 'admin' || data.usuario.rol === 'padre') {
        router.replace('/controlParental');
      } else {
        router.replace('/(tabs)/user');
      }
    } catch (e: any) {
      setError(e.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !nombre) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ username, email, password, nombre });
      router.replace('/(tabs)/user');
    } catch (e: any) {
      setError(e.message || 'Error al registrar');
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
        {/* Header */}
        <View style={[styles.header, { backgroundColor: '#3D3D3D' }]}>
          <Image
            source={require('@/assets/images/user-icon.png')}
            style={styles.userImage}
          />
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.titleText}>
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </ThemedText>
          </ThemedView>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => { setMode('login'); setError(''); }}
            >
              <ThemedText style={mode === 'login' ? styles.tabTextActive : styles.tabText}>
                Entrar
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.tabActive]}
              onPress={() => { setMode('register'); setError(''); }}
            >
              <ThemedText style={mode === 'register' ? styles.tabTextActive : styles.tabText}>
                Registrarme
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedView style={styles.inputsContainer}>
            {mode === 'register' && (
              <>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
                  placeholder="Nombre completo"
                  placeholderTextColor={colors.textDim}
                  value={nombre}
                  onChangeText={setNombre}
                />
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
                  placeholder="Correo electrónico"
                  placeholderTextColor={colors.textDim}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </>
            )}

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Usuario"
              placeholderTextColor={colors.textDim}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              placeholder="Contraseña"
              placeholderTextColor={colors.textDim}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={mode === 'login' ? handleLogin : handleRegister}
            />
          </ThemedView>

          {/* Error */}
          {error !== '' && (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          )}

          {/* Botón principal */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#f78b2a' }]}
              onPress={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <ThemedText style={styles.buttonText}>
                    {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
                  </ThemedText>
              }
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer:    { flex: 1 },
  scrollContainer:  { flexGrow: 1 },
  header: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userImage: {
    width: 150, height: 150,
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
  titleContainer: { alignItems: 'center', marginBottom: 20 },
  titleText:      { fontSize: 28, fontWeight: 'bold' },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f78b2a',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabActive:      { backgroundColor: '#f78b2a' },
  tabText:        { color: '#f78b2a', fontWeight: '600' },
  tabTextActive:  { color: 'white',   fontWeight: '600' },
  inputsContainer: { gap: 16, marginBottom: 20 },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 3,
  },
  errorText: {
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: 10 },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
