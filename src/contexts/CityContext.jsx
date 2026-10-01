import React, { createContext, useState, useEffect } from 'react';
import { storageService, KEYS } from '../services/storageService';
import { CITIES } from '../data/cities';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState(() => storageService.getItem(KEYS.CITIES, 'all'));

  useEffect(() => {
    storageService.setItem(KEYS.CITIES, selectedCityId);
  }, [selectedCityId]);

  const selectedCity = CITIES.find(c => c.id === selectedCityId) || null;

  return (
    <CityContext.Provider value={{ selectedCityId, setSelectedCityId, selectedCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  );
};
