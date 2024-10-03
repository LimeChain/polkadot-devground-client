import {
  useEffect,
  useState,
} from 'react';

const breakpoints = {
  mobile: 768,  // Change this value as per your needs
  tablet: 1024,  // Change this value as per your needs
};

export const useResponsive = () => {
  const [
    isMobile,
    setIsMobile,
  ] = useState<boolean>(false);
  const [
    isTablet,
    setIsTablet,
  ] = useState<boolean>(false);
  const [
    isDesktop,
    setIsDesktop,
  ] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < breakpoints.mobile);
      setIsTablet(width >= breakpoints.mobile && width < breakpoints.tablet);
      setIsDesktop(width >= breakpoints.tablet);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
};
