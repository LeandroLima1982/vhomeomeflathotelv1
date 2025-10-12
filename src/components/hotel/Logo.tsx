import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";

export function Logo({ className }: { className?: string }) {
  const { theme } = useTheme();
  const logoUrl = theme === "dark" ? "/logo-dark.svg" : "/logo.svg";

  const logoClasses = cn("h-10 w-auto", className);

  return (
    <img
      src={logoUrl}
      alt="V-Home Logo"
      className={logoClasses}
      width="150"
      height="40"
    />
  );
}