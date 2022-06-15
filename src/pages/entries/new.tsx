import type { NextPage } from "next";
import Form from "../../components/Form";
import ContainerFlex from "../../components/ContainerFlex";
import Box from "../../components/Box";

const Upload: NextPage = () => {
  return (
    <ContainerFlex>
      <Box>
        <Form />
      </Box>
    </ContainerFlex>
  );
};

export default Upload;
