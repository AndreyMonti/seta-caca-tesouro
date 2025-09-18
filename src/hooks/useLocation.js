import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';


export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const locationSubscription = useRef(null);


  useEffect(() => {
    const startWatching = async () => {
      // Solicita permissão para acessar a localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }


      // Inicia o monitoramento da posição
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Atualiza a cada 1 segundo
          distanceInterval: 1, // Atualiza a cada 1 metro
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    };


    startWatching();


    // Função de limpeza: para o monitoramento quando o componente é desmontado
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  },);


  return { location, errorMsg };
};
