import { DiscordUser } from "../types/generalTypes";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

interface AppLayoutProps {
  user: DiscordUser;
  children: React.FC<any>;
}

export const AppLayout = (props) => {
  return (
    <>
      <Nav user={props.user} />
      {props.children}
      <Footer />
    </>
  );
};
