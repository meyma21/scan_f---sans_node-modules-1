import React, { createContext, useContext, useEffect } from 'react';
import { useCheckStore } from '../store/checkStore';
import { CheckData, CheckImage } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

const ScannerDataContext = createContext({});

export const ScannerDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { processNewCheck } = useCheckStore();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/scanner');

    ws.onmessage = async (event) => {
      try {
        console.log('Received scanner data:', event.data);
        const data = JSON.parse(event.data);
        console.log('Parsed scanner data:', data);

        // Validate base64 data
        const validateBase64 = (base64: string) => {
          if (!base64) return false;
          try {
            // Check if the string is valid base64
            atob(base64);
            return true;
          } catch (e) {
            return false;
          }
        };

        // Create check images from the scanner data
        const images: CheckImage[] = [
          {
            id: uuidv4(),
            url: data.image1 ? `data:image/jpeg;base64,${data.image1}` : '',
            type: 'recto',
            width: 400,
            height: 150,
            createdAt: new Date().toISOString(),
          },
          {
            id: uuidv4(),
            url: data.image2 ? `data:image/jpeg;base64,${data.image2}` : '',
            type: 'verso',
            width: 400,
            height: 150,
            createdAt: new Date().toISOString(),
          },
          {
            id: uuidv4(),
            url: data.image3 ? `data:image/jpeg;base64,${data.image3}` : '',
            type: 'uv',
            width: 400,
            height: 150,
            createdAt: new Date().toISOString(),
          },
        ].filter(img => {
          const isValid = validateBase64(img.url.replace('data:image/jpeg;base64,', ''));
          if (!isValid) {
            console.warn(`Invalid base64 data for image type: ${img.type}`);
          }
          return isValid;
        });

        console.log('Created images:', images);

        if (images.length === 0) {
          throw new Error('No valid images received from scanner');
        }

        // Process the new check with the images
        await processNewCheck(images);
      } catch (error) {
        console.error('Erreur lors du traitement du scan :', error);
      }
    };

    ws.onopen = () => {
      console.log('✅ Connecté au flux du scanner');
    };

    ws.onerror = (err) => {
      console.error('🚨 Erreur WebSocket scanner', err);
    };

    ws.onclose = () => {
      console.log('❌ Connexion WebSocket scanner fermée');
    };

    return () => ws.close();
  }, [processNewCheck]);

  return <ScannerDataContext.Provider value={{}}>{children}</ScannerDataContext.Provider>;
};

export const useScannerData = () => useContext(ScannerDataContext);
