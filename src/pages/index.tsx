import type { NextPage } from "next";
import LandingEntries from "../components/LandingEntries";
import Box from "../components/Box";
import ContainerFlex from "../components/ContainerFlex";

const Home: NextPage = () => {
  return (
    <>
      <ContainerFlex>
          <LandingEntries />
      </ContainerFlex>
    </>
  );
};

export default Home;
