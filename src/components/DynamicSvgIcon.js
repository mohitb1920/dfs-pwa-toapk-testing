import React, { useState, useEffect } from "react";
import * as SvgIcons from "../assets";

function DynamicSvgIcon({ image, ...props }) {
  const [SvgComponent, setSvgComponent] = useState(null);

  useEffect(() => {
    if (!image) return;

    const importSvg = async () => {
      try {
        const Svg = SvgIcons[String(image)];
        if (Svg) {
          setSvgComponent(() => Svg);
        } else {
          return;
        }
      } catch (error) {
        console.error("Error importing SVG:", error);
        setSvgComponent(null);
      }
    };

    importSvg();
  }, [image]);

  if (!SvgComponent) {
    return null;
  }

  return <SvgComponent {...props} />;
}

export default DynamicSvgIcon;
