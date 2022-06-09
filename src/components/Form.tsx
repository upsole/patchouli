import { Formik, Form } from "formik";
import { postForm } from "../lib/axios";

const ImageForm: React.FC = () => {
  return <Formik initialValues={{ text: "" }} onSubmit={async (values) => { console.log(values); const res = await postForm(values); console.log(res); }}>
    {({ setFieldValue, values, handleChange }) => (
      <Form>
        <>
          <label> Text </label>
          <input type="text" name="text" value={values.text} onChange={handleChange} />
        </>
        <>
          <label>Image</label>
          <input type="file" name="image"
            onChange={(e) => {
              e.currentTarget.files instanceof FileList
                ? setFieldValue("image", e.currentTarget.files[0])
                : null;
            }}
          />
        </>
      </Form>
    )}

  </Formik>
}

export default ImageForm
