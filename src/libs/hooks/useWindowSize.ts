import { useLayoutEffect, useState } from "react";

export const useWindowSize = () => {
  const [sideMenu, setSideMenu] = useState(
    window.innerWidth > 768 ? true : false
  );
  const [largeSide, setLargeSide] = useState(
    window.innerWidth > 1330 ? true : false
  );

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSideMenu(true);
      } else {
        setSideMenu(false);
      }

      if (window.innerWidth > 1330) {
        setLargeSide(true);
      } else {
        setLargeSide(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [sideMenu, largeSide];
};
