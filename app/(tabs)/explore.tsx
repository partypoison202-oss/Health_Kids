import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function ExploreScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [distance, setDistance] = useState(0); // Distancia en metros
  const [steps, setSteps] = useState(0);
  const [path, setPath] = useState([]);
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Calcular distancia entre dos puntos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la Tierra en metros
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
      // 1. Solicitar permisos
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      // 2. Obtener ubicación inicial
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

      // 3. Configurar seguimiento
      const subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 2, // Actualizar cada 2 metros
        },
        (newLocation) => {
          if (location) {
            // Calcular distancia recorrida
            const dist = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              newLocation.coords.latitude,
              newLocation.coords.longitude
            );
            
            setDistance(prev => prev + dist);
            setSteps(prev => prev + Math.floor(dist / 0.75)); // Aprox. 0.75m por paso
          }

          setLocation(newLocation);
          setPath(prev => [...prev, {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude
          }]);
        }
      );

      // Animación de entrada
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      return () => subscriber.remove();
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
        showsUserLocation={false} // Desactivamos el marcador por defecto
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

      {/* Panel de estadísticas */}
      <Animated.View style={[styles.statsPanel, { opacity: fadeAnim }]}>
        <View style={styles.statItem}>
          <MaterialIcons name="directions-walk" size={24} color="#f78b2a" />
          <Text style={styles.statText}>{steps} pasos</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="directions" size={24} color="#f78b2a" />
          <Text style={styles.statText}>{(distance).toFixed(1)} metros</Text>
        </View>
      </Animated.View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={30} color="red" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerMap}
      >
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