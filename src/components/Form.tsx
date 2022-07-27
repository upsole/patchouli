import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { listTags, postEntry } from "../lib/axios";
import * as Yup from "yup";
import axios from "axios";
import { __prod__ } from "~/lib/constants";

import styles from "~/styles/Form.module.css";

const entrySchema = Yup.object({
  title: Yup.string().required("Required"),
  text: Yup.string().required("Required"),
  tags: Yup.array().min(1).required("Required")
});

interface Values {
  title: string;
  text: string;
  tags: string;
}

const TagSelector: React.FC<{
  queryData: string[];
  handleChange: any;
  errors: any;
  touched: any;
}> = ({ queryData, handleChange, errors, touched }) => {
  const [data, setData] = useState(queryData);
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (s: string) => {
    if (!data.includes(s)) {
      setData([...data, s]);
    }
    setNewTag("");
  };
  return (
    <>
      <label>
        Tags {errors.tags && touched.tags && <span>{errors.tags}</span>}
      </label>
      <div role="group" onChange={handleChange}>
        {data.map((t) => (
          <label key={t}>
            <input type="checkbox" name="tags" value={t} /> {t}
          </label>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.currentTarget.value)}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit(newTag);
          }}
        >
          +
        </button>
      </div>
    </>
  );
};

const EntryForm: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [mutationError, setMutationError] = useState<string>();
  const tagQuery = useQuery("listTags", () => listTags(), {
    refetchOnWindowFocus: false,
  });
  const postMutation = useMutation((newEntry: Values) => postEntry(newEntry), {
    onMutate: () => {
      setUploading(true);
    },
    onSuccess: () => {
      setUploading(false);
      queryClient.invalidateQueries("landingEntries");
    },
    onError: (err) => {
      setUploading(false);
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
        actions.validateField("tags")
        if (uploading) {
          return;
        }
        // console.log(values);
        postMutation
          .mutateAsync(values)
          .then(() => actions.resetForm())
          .then(() => router.push("/"));
      }}
    >
      {({ setFieldValue, values, handleChange, errors, touched }) => (
        <Form className={styles.form}>
          <>
            <label>
              Title
              {errors.title && touched.title && <span>{errors.title}</span>}
            </label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
            />
          </>
          <>
            <label>
              Text {errors.text && touched.text && <span>{errors.text}</span>}
            </label>
            <textarea
              name="text"
              value={values.text}
              onChange={handleChange}
              cols={120}
              rows={8}
            />
          </>
          {tagQuery.data && (
            <TagSelector
              queryData={tagQuery.data}
              handleChange={handleChange}
              errors={errors}
              touched={touched}
            />
          )}
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
          <button
            className={uploading ? styles.submitting : styles.submit}
            type="submit"
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
          {mutationError && <div className={styles.error}>{mutationError}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default EntryForm;
