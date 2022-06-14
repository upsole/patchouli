import type { NextPage } from "next";
import Form from "../../components/Form";
import ListEntries from "../../components/ListEntries";

const Upload: NextPage = () => {
  return (
    <main>
      <Form />
      <ListEntries />
    </main>
  );
};

export default Upload;
