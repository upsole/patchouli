import { Formik, Form } from "formik";
import { postImage, postDoc } from "../lib/axios";

const ImageForm: React.FC = () => {
  return <Formik initialValues={{ text: "" }} onSubmit={async (values) => { const res = await postDoc(values); console.log(res); }}>
    {({ setFieldValue, values, handleChange }) => (
      <Form>
        <>
          <label> Text </label>
          <input type="text" name="text" value={values.text} onChange={handleChange} />
        </>
        <>
          <label>Image</label>
          <input type="file" name="document"
            onChange={(e) => {
              e.currentTarget.files instanceof FileList
                ? setFieldValue("document", e.currentTarget.files[0])
                : null;
            }}
          />
        </>
      </Form>
    )}

  </Formik>
}

export default ImageForm
