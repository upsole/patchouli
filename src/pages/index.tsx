import type { NextPage } from "next";
import ListEntries from "../components/ListEntries";
import Box from "../components/Box";
import ContainerFlex from "../components/ContainerFlex";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const sessionInfo = useSession();
  console.log(sessionInfo);
  return (
    <>
      <ContainerFlex>
        <Box>
          <ListEntries />
        </Box>
      </ContainerFlex>
    </>
  );
};

export default Home;
