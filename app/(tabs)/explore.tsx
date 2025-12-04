import { useLevel } from '@/app/contexts/LevelContext';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';

export default function ExploreScreen() {
  const { currentLevel, xp, addXp, addSteps, steps } = useLevel();
  const [lastXpSteps, setLastXpSteps] = useState(0);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [distance, setDistance] = useState(0);
  const [path, setPath] = useState([]);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking...');
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 👇 Aquí va tu lógica de XP por pasos
  useEffect(() => {
    if (steps >= lastXpSteps + 10) {
      const stepsEarned = Math.floor((steps - lastXpSteps) / 10);
      addXp(stepsEarned); // +1 XP por cada 10 pasos
      setLastXpSteps(lastXpSteps + stepsEarned * 10);
    }
  }, [steps]);

  // Calcular distancia entre dos puntos (GPS)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    (async () => {
      // --- UBICACIÓN ---
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setPath([{
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      }]);

      const subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 2,
        },
        (newLocation) => {
          if (location) {
            const dist = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              newLocation.coords.latitude,
              newLocation.coords.longitude
            );
            setDistance(prev => prev + dist);
          }
          setLocation(newLocation);
          setPath(prev => [...prev, {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude
          }]);
        }
      );

      // --- CONTADOR DE PASOS ---
      const pedometerAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(pedometerAvailable ? 'sí' : 'no');

      let pedometerSubscription;
      if (pedometerAvailable) {
        pedometerSubscription = Pedometer.watchStepCount(result => {
          addSteps(result.steps); // pasos en tiempo real
        });
      }

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      return () => {
        subscriber?.remove();
        pedometerSubscription && pedometerSubscription.remove();
      };
    })();
  }, []);

  const centerMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {location && (
          <>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            >
              <Animated.View style={[styles.marker, { opacity: fadeAnim }]}>
                <FontAwesome name="child" size={28} color="#f78b2a" />
              </Animated.View>
            </Marker>
            <Polyline
              coordinates={path}
              strokeColor="#f78b2a"
              strokeWidth={4}
            />
          </>
        )}
      </MapView>

      <Animated.View style={[styles.statsPanel, { opacity: fadeAnim }]}>
        <View style={styles.statItem}>
          <MaterialIcons name="directions-walk" size={24} color="#f78b2a" />
          <Text style={styles.statText}>{steps} pasos</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="directions" size={24} color="#f78b2a" />
          <Text style={styles.statText}>{(steps * 0.64).toFixed(1)} metros</Text>
        </View>
      </Animated.View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={30} color="red" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.centerButton} onPress={centerMap}>
        <MaterialIcons name="my-location" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f78b2a',
  },
  statsPanel: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#3D3D3D',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  errorContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    color: '#333',
    fontSize: 16,
  },
  centerButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#f78b2a',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});