import { Formik, Form } from "formik";
import { useMutation, useQueryClient } from "react-query";
import { postEntry } from "../lib/axios";

const EntryForm: React.FC = () => {
  const queryClient = useQueryClient();
  const postMutation = useMutation((newEntry) => postEntry(newEntry), {
    onSuccess: () => {
      queryClient.invalidateQueries("listEntries");
    },
  });
  return (
    <Formik
      initialValues={{ text: "", tag: "" }}
      onSubmit={async (values) => {
        postMutation.mutateAsync(values);
      }}
    >
      {({ setFieldValue, values, handleChange }) => (
        <Form>
          <>
            <label> Text </label>
            <input
              type="text"
              name="text"
              value={values.text}
              onChange={handleChange}
            />
          </>
          <>
            <label> Tag </label>
            <input
              type="text"
              name="tag"
              value={values.tag}
              onChange={handleChange}
            />
          </>
          <>
            <label>Doc</label>
            <input
              type="file"
              name="document"
              onChange={(e) => {
                e.currentTarget.files instanceof FileList
                  ? setFieldValue("document", e.currentTarget.files[0])
                  : null;
              }}
            />
          </>
          <>
            <label>Image</label>
            <input
              type="file"
              name="file"
              onChange={(e) => {
                e.currentTarget.files instanceof FileList
                  ? setFieldValue("image", e.currentTarget.files[0])
                  : null;
              }}
            />
          </>
          <button type="submit"> Submit </button>
        </Form>
      )}
    </Formik>
  );
};

export default EntryForm;
