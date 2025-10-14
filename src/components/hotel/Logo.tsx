import React from "react";
import { cn } from "@/lib/utils";

const LOGO_URL = "https://i.imgur.com/J5O5W3s.png";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "medium", className }) => {
  const logoImageClasses = cn(
    "object-contain",
    {
      "h-10 w-10": size === "small",
      "h-12 w-12": size === "medium",
      "h-14 w-14": size === "large",
    },
    className
  );

  return (
    <div className="flex items-center space-x-3">
      <img
        src={LOGO_URL}
        alt="Flat Hotel Logo"
        className={logoImageClasses}
      />
      <span className="font-bold text-xl text-gray-800">Flat Hotel</span>
    </div>
  );
};

export default Logo;