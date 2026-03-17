import AsyncStorage from '@react-native-async-storage/async-storage';

export const seedDatabase = async () => {
  const usuarios = await AsyncStorage.getItem('usuarios');
  
  if (!usuarios) {
    const usuarioPrueba = [
      {
        email: 'admin@healthkids.com',
        password: '123456',
        nombre: 'Administrador'
      }
    ];
    await AsyncStorage.setItem('usuarios', JSON.stringify(usuarioPrueba));
    console.log('Usuario de prueba creado');
  }
};