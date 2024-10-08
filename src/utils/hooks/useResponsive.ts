import {
  useEffect,
  useState,
} from 'react';

const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

export const useResponsive = () => {
  const [
    responsiveState,
    setResponsiveState,
  ] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setResponsiveState({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
        isDesktop: width >= breakpoints.tablet,
      });
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return responsiveState;
};
