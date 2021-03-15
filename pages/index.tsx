import { Button } from "@chakra-ui/button";
import { GetServerSideProps } from "next";
import { HomePage } from "../components/HomePage";
import { LandingPage } from "../components/LandingPage";
import { DiscordUser } from "../types/generalTypes";
import { parseUser } from "../utils/parseDiscordUser";

interface HomePageProps {
  user: DiscordUser | null;
}

export default function Home(props) {
  if (!props.user) {
    return <LandingPage />;
  }

  return <HomePage user={props.user} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = parseUser(ctx);
  if (!user) {
    return { props: { user: null } };
  }

  return { props: { user } };
};
