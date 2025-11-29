import { FC } from "react";
export type Logo = {
  logoName: string;
};

const Logo: FC<Logo> = ({ logoName }: Logo) => {
  return (
    <div className="navbar-center">
      <a className="btn btn-ghost text-xl normal-case">{logoName}</a>
    </div>
  );
};

export default Logo;
