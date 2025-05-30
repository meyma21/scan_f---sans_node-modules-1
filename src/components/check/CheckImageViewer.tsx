import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { CheckImage } from '../../types';
import { ZoomIn, ZoomOut, Maximize2, RotateCw } from 'lucide-react';
import Button from '../ui/Button';

interface CheckImageViewerProps {
  images: CheckImage[];
}

const CheckImageViewer: React.FC<CheckImageViewerProps> = ({ images }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  const activeImage = images[activeImageIndex];
  
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden border border-gray-200">
      <div className="flex p-2 border-b border-gray-200 bg-white">
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveImageIndex(index)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                index === activeImageIndex
                  ? 'bg-primary-100 text-primary-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {image.type === 'recto' ? 'Front' : image.type === 'verso' ? 'Back' : 'UV'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative flex-grow">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          centerOnInit
          wheel={{ wheelEnabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-1.5 flex space-x-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => zoomIn()}
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => zoomOut()}
                  aria-label="Zoom out"
                >
                  <ZoomOut size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => resetTransform()}
                  aria-label="Reset zoom"
                >
                  <Maximize2 size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRotate}
                  aria-label="Rotate image"
                >
                  <RotateCw size={16} />
                </Button>
              </div>
              
              <TransformComponent>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  {activeImage && (
                    <img
                      src={activeImage.url}
                      alt={`Check ${activeImage.type}`}
                      className="max-w-full h-auto transition-transform duration-300 ease-in-out"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    />
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
      
      <div className="p-2 bg-white border-t border-gray-200 text-xs text-gray-500">
        {activeImage?.type === 'recto' && 'Front side of the check (Recto)'}
        {activeImage?.type === 'verso' && 'Back side of the check (Verso)'}
        {activeImage?.type === 'uv' && 'Ultraviolet scan showing security features'}
      </div>
    </div>
  );
};

export default CheckImageViewer;