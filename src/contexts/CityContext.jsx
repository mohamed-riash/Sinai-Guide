import React, { createContext, useState, useEffect, useMemo } from 'react';
import { storageService, KEYS } from '../services/storageService';
import { CITIES } from '../data/cities';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState(() => storageService.getItem(KEYS.CITIES, 'all'));

  useEffect(() => {
    storageService.setItem(KEYS.CITIES, selectedCityId);
  }, [selectedCityId]);

  const selectedCity = CITIES.find(c => c.id === selectedCityId) || null;
  const value = useMemo(() => ({ selectedCityId, setSelectedCityId, selectedCity, cities: CITIES }), [selectedCityId, selectedCity]);

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};
