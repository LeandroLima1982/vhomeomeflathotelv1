"use client";

type LogoProps = {
  isScrolled: boolean;
};

export function Logo({ isScrolled }: LogoProps) {
  const textColor = isScrolled ? "text-gray-800" : "text-white";
  
  return (
    <div className="text-2xl font-bold">
      <span className="text-blue-600">V</span>
      <span className={`${textColor} transition-colors`}>Home</span>
    </div>
  );
}