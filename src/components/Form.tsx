import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { postEntry } from "../lib/axios";
import * as Yup from "yup";
import { useState } from "react";

const entrySchema = Yup.object({
  text: Yup.string().required("Required"),
  tags: Yup.string().required("Required"),
});

const EntryForm: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const postMutation = useMutation((newEntry) => postEntry(newEntry), {
    onMutate: () => {
      setUploading(true);
    },
    onSuccess: () => {
      setUploading(false);
      queryClient.invalidateQueries("landingEntries");
    },
  });
  return (
    <Formik
      initialValues={{ text: "", tags: "" }}
      validationSchema={entrySchema}
      onSubmit={async (values, actions) => {
        values.tags = values.tags
          .replaceAll(/ +/g, ",")
          .replaceAll(/,+/g, ",")
          .replace(/,$/, "");
        postMutation
          .mutateAsync(values)
          .then(() => actions.resetForm())
          .then(() => router.push("/"));
      }}
    >
      {({ setFieldValue, values, handleChange, errors }) => (
        <Form>
          <>
            <label> Text {errors.text && <span>{errors.text}</span>} </label>
            <textarea
              name="text"
              value={values.text}
              onChange={handleChange}
              cols={120}
              rows={8}
            />
          </>
          <>
            <label> Tag {errors.tags && <span>{errors.tags}</span>} </label>
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
          <button type="submit">
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EntryForm;
