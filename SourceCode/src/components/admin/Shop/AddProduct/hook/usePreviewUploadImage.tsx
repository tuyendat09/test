import { useState } from "react";
import NoImg from "@@/assets/images/no-img.jpg";
import { FormikProps } from "formik";

interface ImageUploadProps {
  formik: FormikProps<any>;
  fieldToSetValue: string;
}

export default function usePreviewUploadImage({
  formik,
  fieldToSetValue,
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState(NoImg.src);

  function handlePreviewImg(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // Đặt giá trị cho Formik field trực tiếp mà không cần dấu ngoặc kép
        formik.setFieldValue(fieldToSetValue, file);
        console.log(fieldToSetValue); // Không cần dấu ngoặc kép
        console.log(formik.values);
      };
      reader.readAsDataURL(file);
    }
  }

  return {
    imagePreview,
    handlePreviewImg,
  };
}
