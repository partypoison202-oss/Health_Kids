import { View, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function ParentalSettingsScreen() {
    const router = useRouter();
  const [settings, setSettings] = useState({
    parentalControl: false,
    blockContent: false,
    timeLimit: true
  });

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const saveSettings = () => {
    alert('Configuración guardada correctamente');
    router.replace('/(tabs)/user');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Encabezado limpio sin texto adicional */}
      <View style={styles.header}>
        <MaterialIcons name="family-restroom" size={32} color="#f78b2a" />
        <ThemedText type="title" style={styles.title}>Configuración Parental</ThemedText>
      </View>
      
      <View style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="admin-panel-settings" size={24} color="#3D3D3D" />
            <ThemedText style={styles.settingText}>Activar control parental</ThemedText>
          </View>
          <Switch
            value={settings.parentalControl}
            onValueChange={() => toggleSetting('parentalControl')}
            trackColor={{ false: '#e0e0e0', true: '#f78b2a' }}
            thumbColor={settings.parentalControl ? '#ffffff' : '#f5f5f5'}
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="block" size={24} color="#3D3D3D" />
            <ThemedText style={styles.settingText}>Bloquear contenido sensible</ThemedText>
          </View>
          <Switch
            value={settings.blockContent}
            onValueChange={() => toggleSetting('blockContent')}
            trackColor={{ false: '#e0e0e0', true: '#f78b2a' }}
            thumbColor={settings.blockContent ? '#ffffff' : '#f5f5f5'}
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="access-time" size={24} color="#3D3D3D" />
            <ThemedText style={styles.settingText}>Limitar tiempo de uso</ThemedText>
          </View>
          <Switch
            value={settings.timeLimit}
            onValueChange={() => toggleSetting('timeLimit')}
            trackColor={{ false: '#e0e0e0', true: '#f78b2a' }}
            thumbColor={settings.timeLimit ? '#ffffff' : '#f5f5f5'}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={saveSettings}
        activeOpacity={0.8}
      >
        <MaterialIcons name="save" size={22} color="white" />
        <ThemedText style={styles.saveButtonText}>Guardar configuración</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginTop: 120,
    alignItems: 'center',
    marginVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3D3D3D',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#3D3D3D',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#f78b2a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#f78b2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});