import { useEffect, useRef } from 'react';

export default function VantaBirdsBackground() {
  const vantaRef = useRef(null);

  useEffect(() => {
    let effect = null;
    const initVanta = () => {
      if (window.VANTA && window.VANTA.BIRDS && vantaRef.current && !effect) {
        effect = window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0x07192f,
          backgroundAlpha: 1.0,
          color1: 0xff0000,
          color2: 0x00d1ff,
          colorMode: "varianceGradient",
          quantity: 5,
          birdSize: 1,
          wingSpan: 30,
          speedLimit: 5,
          separation: 20,
          alignment: 20,
          cohesion: 20,
        });
      }
    };

    if (window.VANTA && window.VANTA.BIRDS) {
      initVanta();
    } else {
      const interval = setInterval(() => {
        if (window.VANTA && window.VANTA.BIRDS) {
          initVanta();
          clearInterval(interval);
        }
      }, 100);
      return () => {
        clearInterval(interval);
        if (effect) effect.destroy();
      };
    }

    return () => {
      if (effect) {
        effect.destroy();
        effect = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
