import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-audio';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, calculateBearing, metersToSteps } from '../utils/geolocation';
import { TREASURE_COORDS, COLORS, HINT_THRESHOLDS } from '../constants';
import AnimatedArrow from '../components/AnimatedArrow';


export default function TreasureHuntScreen() {
  const { location, errorMsg } = useLocation();
  const [sound, setSound] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(null);
  const [treasureFound, setTreasureFound] = useState(false);
  const [hint, setHint] = useState(''); // <-- Adicione para evitar erro de variável não definida


  // Animated.Value para a cor de fundo
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;


  // Pré-carrega o som quando o componente monta
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/treasure-found.mp3')
        );
        setSound(sound);
      } catch (error) {
        console.error("Não foi possível carregar o som", error);
      }
    };
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Efeito principal que reage às atualizações de localização
  useEffect(() => {
    if (location) {
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };


      // Calcula distância e azimute
      const distMeters = calculateDistance(userCoords, TREASURE_COORDS);
      const distSteps = metersToSteps(distMeters);
      const newBearing = calculateBearing(userCoords, TREASURE_COORDS);


      // Atualiza os estados
      setDistance(distMeters);
      setSteps(distSteps);
      setBearing(newBearing);
      updateHint(distSteps);
      animateBackground(distSteps);


      // Verifica se o tesouro foi encontrado
      if (distSteps < HINT_THRESHOLDS.VERY_HOT &&!treasureFound) {
        playSound();
        setTreasureFound(true);
      }
    }
  }, [location, treasureFound]);


  const updateHint = (distSteps) => {
    if (distSteps < HINT_THRESHOLDS.VERY_HOT) {
      setHint('Muito quente! Está quase lá!');
    } else if (distSteps < HINT_THRESHOLDS.HOT) {
      setHint('Quente! Está perto!');
    } else if (distSteps < HINT_THRESHOLDS.WARM) {
      setHint('Morno! Continue procurando.');
    } else {
      setHint('Frio! Está longe do tesouro.');
    }
  };


  const animateBackground = (distSteps) => {
    const toValue = distSteps < HINT_THRESHOLDS.WARM? 1 : 0;
    Animated.timing(backgroundColorAnim, {
      toValue,
      duration: 500,
      useNativeDriver: false, // backgroundColor não é suportado pelo native driver
    }).start();
  };


  const playSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.error("Não foi possível tocar o som", error);
      }
    }
  };


  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.COLD, COLORS.WARM],
  });


  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{errorMsg}</Text>
      </View>
    );
  }


  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Obtendo localização...</Text>
      </View>
    );
  }


  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Caça ao Tesouro</Text>
      <View style={styles.infoBox}>
        <Text style={styles.text}>Distância: {steps!== null? `${steps} passos` : 'Calculando...'}</Text>
        <Text style={styles.hintText}>{hint}</Text>
      </View>
      <AnimatedArrow bearing={bearing} />
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  infoBox: {
    marginBottom: 50,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5
  },
  hintText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
});
