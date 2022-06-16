import type { NextPage } from "next";
import ListEntries from "../components/ListEntries";
import Box from "../components/Box";
import ContainerFlex from "../components/ContainerFlex";

const Home: NextPage = () => {
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
