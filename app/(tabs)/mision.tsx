import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLevel } from '@/app/contexts/LevelContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const missions = [
  {
    id: 1,
    title: "Primeros Pasos",
    description: "Completa tu primera lección",
    reward: 50,
    requiredLevel: 1,
    icon: 'directions-walk',
    color: '#4CAF50'
  },
  {
    id: 2,
    title: "Estudiante Aplicado",
    description: "Completa 3 días consecutivos",
    reward: 100,
    requiredLevel: 2,
    icon: 'school',
    color: '#2196F3'
  },
  // ... más misiones
];

export default function MissionsScreen() {
  const { currentLevel, xp, addXp, unlockedMissions } = useLevel();

  const handleComplete = (mission) => {
    addXp(mission.reward);
    Alert.alert(
      '¡Misión Completada!',
      `Has ganado ${mission.reward} XP\nNuevo total: ${xp + mission.reward} XP`,
      [
        { 
          text: 'OK', 
          onPress: () => console.log('XP added') 
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Encabezado con progreso */}
      <LinearGradient
        colors={['#f78b2a', '#ff9e40']}
        style={styles.progressHeader}
      >
        <Text style={styles.levelText}>Nivel {currentLevel}</Text>
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>{xp} / {currentLevel * 100} XP</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${(xp/(currentLevel*100))*100}%` }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Lista de misiones */}
      <View style={styles.missionsList}>
        {missions.map(mission => (
          <View 
            key={mission.id} 
            style={[
              styles.missionCard,
              currentLevel < mission.requiredLevel && styles.lockedCard
            ]}
          >
            <View style={styles.missionHeader}>
              <MaterialIcons 
                name={mission.icon} 
                size={28} 
                color={mission.color} 
              />
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionDesc}>{mission.description}</Text>
              </View>
            </View>

            {currentLevel >= mission.requiredLevel ? (
              <TouchableOpacity
                style={[styles.rewardButton, { backgroundColor: mission.color }]}
                onPress={() => handleComplete(mission)}
              >
                <Text style={styles.buttonText}>+{mission.reward} XP</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.lockedBadge}>
                <MaterialIcons name="lock" size={16} color="#fff" />
                <Text style={styles.lockedText}>Nivel {mission.requiredLevel}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressHeader: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  levelText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  xpContainer: {
    width: '100%',
  },
  xpText: {
    color: 'white',
    marginBottom: 5,
  },
  xpBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: 'white',
  },
  missionsList: {
    padding: 15,
  },
  missionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.6,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionInfo: {
    flex: 1,
    marginLeft: 15,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  missionDesc: {
    fontSize: 14,
    color: '#666',
  },
  rewardButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#999',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  lockedText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
  },
});