import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LevelContextType {
  currentLevel: number;
  xp: number;
  totalXp: number;
  addXp: (amount: number) => Promise<void>;
  unlockedMissions: number[];
  unlockMission: (missionId: number) => Promise<void>;
  isLoading: boolean;
}

const LevelContext = createContext<LevelContextType>({
  currentLevel: 1,
  xp: 0,
  addXp: async () => {},
  unlockedMissions: [],
  unlockMission: async () => {},
  isLoading: true
});

export const LevelProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [unlockedMissions, setUnlockedMissions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem('userLevel');
        const savedXp = await AsyncStorage.getItem('userXp');
        const savedMissions = await AsyncStorage.getItem('unlockedMissions');
        
        if (savedLevel) setCurrentLevel(parseInt(savedLevel));
        if (savedXp) setXp(parseInt(savedXp));
        if (savedMissions) setUnlockedMissions(JSON.parse(savedMissions));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addXp = async (amount: number) => {
    const newXp = xp + amount;
    setXp(newXp);
    
    try {
      await AsyncStorage.setItem('userXp', newXp.toString());
      
      // 100 XP requeridos por nivel
      if (newXp >= currentLevel * 100) {
        const newLevel = currentLevel + 1;
        setCurrentLevel(newLevel);
        setXp(0);
        await AsyncStorage.setItem('userLevel', newLevel.toString());
        await AsyncStorage.setItem('userXp', '0');
      }
    } catch (error) {
      console.error('Error saving XP:', error);
    }
  };

  const unlockMission = async (missionId: number) => {
    const newUnlocked = [...new Set([...unlockedMissions, missionId])];
    setUnlockedMissions(newUnlocked);
    try {
      await AsyncStorage.setItem('unlockedMissions', JSON.stringify(newUnlocked));
    } catch (error) {
      console.error('Error saving missions:', error);
    }
  };

  return (
    <LevelContext.Provider value={{ 
      currentLevel, 
      xp, 
      addXp,
      unlockedMissions,
      unlockMission,
      isLoading
    }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => useContext(LevelContext);