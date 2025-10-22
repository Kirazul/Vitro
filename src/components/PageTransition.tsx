import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsVisible(true);
      }, 100); // Even shorter transition time to prevent white flash

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-opacity duration-100 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};
