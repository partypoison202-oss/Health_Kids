import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface LevelContextType {
  currentLevel: number;
  xp: number;
  totalXp: number;
  steps: number; // 👈 nuevo
  addXp: (amount: number) => Promise<void>;
  addSteps: (amount: number) => Promise<void>; // 👈 nuevo
  resetSteps: () => Promise<void>; // 👈 opcional (para reiniciar contador)
  resetXp: () => Promise<void>; // 👈 opcional (para reiniciar contador)
  unlockedMissions: number[];
  unlockMission: (missionId: number) => Promise<void>;
  isLoading: boolean;
}

const LevelContext = createContext<LevelContextType>({
  currentLevel: 1,
  xp: 0,
  totalXp: 0,
  steps: 0,
  addXp: async () => {},
  addSteps: async () => {},
  resetSteps: async () => {},
  resetXp: async () => {},
  unlockedMissions: [],
  unlockMission: async () => {},
  isLoading: true,
});

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [steps, setSteps] = useState(0); // 👈 nuevo
  const [unlockedMissions, setUnlockedMissions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalXp, setTotalXp] = useState(0); // 👈 por si luego quieres XP acumulada total

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem('userLevel');
        const savedXp = await AsyncStorage.getItem('userXp');
        const savedSteps = await AsyncStorage.getItem('userSteps'); // 👈
        const savedMissions = await AsyncStorage.getItem('unlockedMissions');

        if (savedLevel) setCurrentLevel(parseInt(savedLevel));
        if (savedXp) setXp(parseInt(savedXp));
        if (savedSteps) setSteps(parseInt(savedSteps)); // 👈
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
    setTotalXp(totalXp + amount);

    try {
      await AsyncStorage.setItem('userXp', newXp.toString());
      await AsyncStorage.setItem('totalXp', (totalXp + amount).toString());

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

  const addSteps = async (amount: number) => {
    const newSteps = steps + amount;
    setSteps(newSteps);
    try {
      await AsyncStorage.setItem('userSteps', newSteps.toString());
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

  const resetSteps = async () => {
    setSteps(0);
    try {
      await AsyncStorage.setItem('userSteps', '0');
    } catch (error) {
      console.error('Error resetting steps:', error);
    }
  };

  const resetXp = async () => {
  setXp(0);
  setTotalXp(0);
  try {
    await AsyncStorage.setItem('userXp', '0');
    await AsyncStorage.setItem('totalXp', '0');
  } catch (error) {
    console.error('Error resetting XP:', error);
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
    <LevelContext.Provider
      value={{
        currentLevel,
        xp,
        totalXp,
        steps,
        addXp,
        addSteps,
        resetSteps,
        resetXp,
        unlockedMissions,
        unlockMission,
        isLoading,
      }}
    >
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => useContext(LevelContext);
