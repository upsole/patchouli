import { Formik, Form } from "formik";
import { postImage, postDoc } from "../lib/axios";

const ImageForm: React.FC = () => {
  return <Formik initialValues={{ text: "", tag: "" }} onSubmit={async (values) => { const res = await postDoc(values); console.log(res); }}>
    {({ setFieldValue, values, handleChange }) => (
      <Form>
          <>
            <label> Text </label>
            <input type="text" name="text" value={values.text} onChange={handleChange} />
          </>
          <>
            <label> Tag </label>
            <input type="text" name="tag" value={values.tag} onChange={handleChange} />
          </>
          <>
            <label>Doc</label>
            <input type="file" name="document"
              onChange={(e) => {
                e.currentTarget.files instanceof FileList
                  ? setFieldValue("document", e.currentTarget.files[0])
                  : null;
              }}
            />
          </>
          <>
            <label>Image</label>
            <input type="file" name="file"
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
}

export default ImageForm
