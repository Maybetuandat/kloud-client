import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`bg-background min-h-screen ${className}`}>{children}</div>
  );
};
