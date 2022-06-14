import { Formik, Form } from "formik";
import { useMutation, useQueryClient } from "react-query";
import { postEntry } from "../lib/axios";
import * as Yup from "yup";

const entrySchema = Yup.object({
  text: Yup.string().required("Required"),
  tags: Yup.string().required("Required")
})

const EntryForm: React.FC = () => {
  const queryClient = useQueryClient();
  const postMutation = useMutation((newEntry) => postEntry(newEntry), {
    onSuccess: () => {
      queryClient.invalidateQueries("listEntries");
    },
  });
  return (
    <Formik
      initialValues={{ text: "", tags: "" }}
      validationSchema={entrySchema}
      onSubmit={async (values) => {
        values.tags = values.tags.replaceAll(/ +/g, ",").replaceAll(/,+/g, ",").replace(/,$/, "")
        postMutation.mutateAsync(values);
      }}
    >
      {({ setFieldValue, values, handleChange, errors }) => (
        <Form>
          <>
            <label> Text {errors.text && <span>{errors.text}</span> } </label>
            <input
              type="text"
              name="text"
              value={values.text}
              onChange={handleChange}
            />
          </>
          <>
            <label> Tag {errors.tags && <span>{errors.tags}</span> } </label>
            <input
              type="text"
              name="tags"
              value={values.tags}
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
