import type { NextPage } from "next";
import Form from "../../components/Form";
import Box from "../../components/Box";
import { useSession } from "next-auth/react";
import LoginWarning from "~/components/NeedToLogin";
import Meta from "~/components/Meta";

const Upload: NextPage = () => {
  const session = useSession();
  if (session.status === "authenticated") {
    return (
      <Box>
        <Meta title="New Entry" />
        <Form />
      </Box>
    );
  } else {
    return <LoginWarning />;
  }
};

export default Upload;
