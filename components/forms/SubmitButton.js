import React from "react";
import { useFormikContext } from "formik";

import Button from "../AppButton";

function SubmitButton({ title, buttonIsInActive = false }) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      title={title}
      onPress={handleSubmit}
      buttonIsInActive={buttonIsInActive}
    />
  );
}

export default SubmitButton;
