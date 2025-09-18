import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';


const AnimatedArrow = ({ bearing }) => {
  // Animated.Value para controlar a rotação
  const rotationAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    // Atualiza o valor da rotação diretamente, sem animação de tempo,
    // para uma resposta instantânea como uma bússola.
    rotationAnim.setValue(bearing);
  }, [bearing]);


  // Interpola o valor numérico (0-360) para uma string de rotação
   const spin = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });


  return (
    <Animated.View style={[styles.container, { transform: [{ rotate: spin }] }]}>
      <Image
        source={require('../assets/images/arrow.png')}
        style={styles.arrowImage}
      />
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});


export default AnimatedArrow;
