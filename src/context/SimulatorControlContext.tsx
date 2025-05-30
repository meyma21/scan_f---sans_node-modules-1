import React, { createContext, useContext, useEffect, useRef } from 'react';

const SimulatorControlContext = createContext({ sendCommand: (command: string) => {} });

export function SimulatorControlProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/simulator-control');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connecté au canal de commande simulateur');
    };

    ws.onerror = (err) => {
      console.error('🚨 Erreur WebSocket commande', err);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket commande fermé');
    };

    return () => ws.close();
  }, []);

  const sendCommand = (command: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command }));
    } else {
      console.warn('❌ WebSocket non prêt pour envoyer la commande');
    }
  };

  return (
    <SimulatorControlContext.Provider value={{ sendCommand }}>
      {children}
    </SimulatorControlContext.Provider>
  );
}

export function useSimulatorControl() {
  return useContext(SimulatorControlContext);
}
