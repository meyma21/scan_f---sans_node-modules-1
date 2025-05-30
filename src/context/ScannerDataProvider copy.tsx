// context/ScannerDataProvider.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useCheckStore } from '../store/checkStore';
import { transformSimulatorData } from '../utils/transformers';

const ScannerDataContext = createContext({});

export const ScannerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addCheck } = useCheckStore();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/scanner');

    ws.onopen = () => console.log('✅ Scanner connecté');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.checkNumber) {
            const parsed = JSON.parse(event.data);
            const check = transformSimulatorData(parsed);
            useCheckStore.getState().addCheck(check);
         
        }
      } catch (err) {
        console.error('Erreur message WebSocket:', err);
      }
    };
    return () => ws.close();
  }, [addCheck]);

  return (
    <ScannerDataContext.Provider value={{}}>
      {children}
    </ScannerDataContext.Provider>
  );
};
