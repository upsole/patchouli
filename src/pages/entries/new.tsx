import type { NextPage } from "next";
import Form from "../../components/Form";
import Box from "../../components/Box";
import { useSession } from "next-auth/react";
import LoginWarning from "~/components/NeedToLogin";

const Upload: NextPage = () => {
  const { status } = useSession();
  // if (status === "authenticated") {
  //   return (
  //     <Box>
  //       <Form />
  //     </Box>
  //   );
  // } else {
  //   return <LoginWarning />;
  // }

    return (
      <Box>
        <Form />
      </Box>
    );
};

export default Upload;
