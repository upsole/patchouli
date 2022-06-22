import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { postEntry } from "../lib/axios";
import * as Yup from "yup";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { __prod__ } from "~/lib/constants";

import styles from "~/styles/Form.module.css";

const entrySchema = Yup.object({
  title: Yup.string().required("Required"),
  text: Yup.string().required("Required"),
  tags: Yup.string().required("Required"),
});

interface Values {
  title: string;
  text: string;
  tags: string;
}

const EntryForm: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [mutationError, setMutationError] = useState<string>();
  const postMutation = useMutation((newEntry: Values) => postEntry(newEntry), {
    onMutate: () => {
      setUploading(true);
    },
    onSuccess: () => {
      setUploading(false);
      queryClient.invalidateQueries("landingEntries");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        __prod__ ? null : console.error(err);
        //@ts-ignore
        setMutationError(err.response?.data.error);
      }
    },
  });
  return (
    <Formik
      initialValues={{ title: "", text: "", tags: "" }}
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
        <Form className={styles.form}>
          <>
            <label> Title {errors.title && <span>{errors.title}</span>} </label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
            />
          </>
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
          <button type="submit">{uploading ? "Uploading..." : "Submit"}</button>
          {mutationError && <div className={styles.error}>{mutationError}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default EntryForm;
