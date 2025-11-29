import { FC } from "react";

import { Outlet } from "react-router-dom";
import LayoutFooter from "./LayoutFooter";
import LayoutHeader from "./LayoutHeader";

export const Layout: FC = () => {
  return (
    <div className="h-screen overflow-x-hidden">
      <LayoutHeader />
      <main>
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  );
};

export default Layout;
