import { METERS_PER_STEP } from '../constants';


/**
 * Converte graus para radianos. Essencial para as funções trigonométricas do JavaScript.
 * @param {number} deg - O valor em graus.
 * @returns {number} O valor em radianos.
 */
function toRadians(deg) {
  return deg * (Math.PI / 180);
}


/**
 * Calcula a distância entre duas coordenadas geográficas usando a fórmula de Haversine.
 * @param {object} startCoords - Coordenadas de início { latitude, longitude }.
 * @param {object} endCoords - Coordenadas de fim { latitude, longitude }.
 * @returns {number} A distância em metros.
 */
export function calculateDistance(startCoords, endCoords) {
  const R = 6371e3; // Raio da Terra em metros
  const lat1Rad = toRadians(startCoords.latitude);
  const lat2Rad = toRadians(endCoords.latitude);
  const deltaLat = toRadians(endCoords.latitude - startCoords.latitude);
  const deltaLon = toRadians(endCoords.longitude - startCoords.longitude);


  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


  return R * c; // Distância em metros
}


/**
 * Calcula o azimute (bearing) de um ponto inicial para um ponto final.
 * @param {object} startCoords - Coordenadas de início { latitude, longitude }.
 * @param {object} endCoords - Coordenadas de fim { latitude, longitude }.
 * @returns {number} O azimute em graus (0-360).
 */
export function calculateBearing(startCoords, endCoords) {
  const startLat = toRadians(startCoords.latitude);
  const startLng = toRadians(startCoords.longitude);
  const destLat = toRadians(endCoords.latitude);
  const destLng = toRadians(endCoords.longitude);


  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  
  let brng = Math.atan2(y, x);
  brng = brng * (180 / Math.PI); // Converte radianos para graus


  // Normaliza o resultado para o intervalo 0-360
  return (brng + 360) % 360;
}


/**
 * Converte uma distância em metros para o número equivalente de passos.
 * @param {number} meters - A distância em metros.
 * @returns {number} O número de passos.
 */
export function metersToSteps(meters) {
  return Math.round(meters / METERS_PER_STEP);
}
