import { DiscordUser } from "../types/generalTypes";
import { AppLayout } from "./AppLayout";
import { CardGrid } from "./CardGrid";

interface HomePageProps {
  user: DiscordUser;
}

export const HomePage = (props) => {
  return (
    <AppLayout user={props.user}>
      <div>{/* <CardGrid /> */}</div>
    </AppLayout>
  );
};
