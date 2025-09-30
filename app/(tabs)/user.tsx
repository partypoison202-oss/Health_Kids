import { useLevel } from '@/app/contexts/LevelContext';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { currentLevel, xp, totalXp } = useLevel(); // totalXp = currentLevel * 100
  
  // Sistema de ligas (puedes personalizar los nombres)
  const leagues = [
    { name: "Novato", icon: "trophy", color: "#A0A0A0", minLevel: 1 },
    { name: "Explorador", icon: "map-marker", color: "#4CAF50", minLevel: 5 },
    { name: "Aventurero", icon: "compass", color: "#2196F3", minLevel: 10 },
    { name: "Campeón", icon: "trophy", color: "#FFC107", minLevel: 15 },
    { name: "Leyenda", icon: "crown", color: "#F44336", minLevel: 20 }
  ];
  
  const currentLeague = leagues.reduce((highest, league) => 
    currentLevel >= league.minLevel ? league : highest
  , leagues[0]);

  const nextLeague = leagues.find(league => league.minLevel > currentLevel) || leagues[leagues.length - 1];

  return (
    <ImageBackground 
      source={require('@/assets/images/fondo3.jpg')} 
      style={styles.container}
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
        style={styles.overlay}
      >
        {/* Encabezado con avatar */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={[styles.avatarContainer, { borderColor: currentLeague.color }]}>
            <FontAwesome name="user" size={60} color={currentLeague.color} />
          </View>
          <Text style={styles.username}>Usuario Saludable</Text>
          <View style={styles.leagueBadge}>
            <FontAwesome name={currentLeague.icon} size={20} color="white" />
            <Text style={styles.leagueText}>{currentLeague.name}</Text>
          </View>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.levelText}>Nivel {currentLevel}</Text>
            <Text style={styles.xpText}>{xp}/{totalXp} XP</Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[currentLeague.color, nextLeague.color]}
              style={[styles.progressFill, { width: `${(xp/totalXp)*100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.nextLeagueText}>
            Siguiente liga: {nextLeague.name} (Nivel {nextLeague.minLevel})
          </Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="directions-walk" size={30} color="#f78b2a" />
            <Text style={styles.statValue}>1,245</Text>
            <Text style={styles.statLabel}>Pasos hoy</Text>
          </View>
          
          <View style={styles.statCard}>
            <FontAwesome name="map-marker" size={30} color="#f78b2a" />
            <Text style={styles.statValue}>5.7</Text>
            <Text style={styles.statLabel}>KM recorridos</Text>
          </View>
          
          <View style={styles.statCard}>
            <AntDesign name="clock-circle" size={30} color="#f78b2a" />
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Min activos</Text>
          </View>
        </View>

        {/* Logros recientes */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Logros Recientes</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementBadge}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.achievementText}>Explorador Novato</Text>
            </View>
            <View style={styles.achievementBadge}>
              <MaterialIcons name="favorite" size={24} color="#FF4081" />
              <Text style={styles.achievementText}>7 días consecutivos</Text>
            </View>
          </View>
        </View>

        {/* Botón de edición */}
        <TouchableOpacity style={styles.editButton}>
          <MaterialIcons name="edit" size={24} color="white" />
          <Text style={styles.editButtonText}>Personalizar perfil</Text>
        </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal:20,
  },
  scrollContent: {
    paddingBottom: 10, // para que no quede pegado al borde
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatarContainer: {
    backgroundColor: 'white',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  leagueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 8,
  },
  leagueText: {
    color: 'white',
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D3D3D',
  },
  xpText: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  nextLeagueText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D3D3D',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  achievementsContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D3D3D',
    marginBottom: 15,
  },
  achievementsList: {
    gap: 10,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(247, 139, 42, 0.2)',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  achievementText: {
    fontSize: 16,
    color: '#3D3D3D',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f78b2a',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});