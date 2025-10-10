"use client";

type LogoProps = {
  isScrolled?: boolean;
  isFooter?: boolean;
};

export function Logo({ isScrolled, isFooter }: LogoProps) {
  const primaryColor = isFooter ? "text-blue-600" : isScrolled ? "text-blue-800" : "text-white";
  const secondaryColor = isFooter ? "text-gray-300" : isScrolled ? "text-gray-800" : "text-gray-200";

  return (
    <div className="text-2xl font-bold">
      <span className={primaryColor}>V</span>
      <span className={secondaryColor}>Home</span>
    </div>
  );
}