import { useState } from "react";
import validate from "validate.js";
import registerConstraints from "../constants/validationConst.js";

const loginAndRegisterHook = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});

  const handleCompanyIdChange = (text) => {
    setInputs((inputs) => ({
      ...inputs,
      companyId: text,
    }));
  };

  const handleUsernameChange = (text) => {
    setInputs((inputs) => ({
      ...inputs,
      username: text,
    }));
  };

  const handlePasswordChange = (text) => {
    setInputs((inputs) => ({
      ...inputs,
      password: text,
    }));
  };

  const handleConfirmPasswordChange = (text) => {
    setInputs((inputs) => ({
      ...inputs,
      confirmPassword: text,
    }));
  };

  const handleEmailChange = (text) => {
    setInputs((inputs) => ({
      ...inputs,
      email: text,
    }));
  };
  const handlePhoneNumberChange = (text) => {
    setInputs((inputs) => ({
      ...inputs,
      phoneNumber: text,
    }));
  };

  const validateField = (attr) => {
    const attrName = Object.keys(attr).pop(); // get the only or last item from array
    const valResult = validate(attr, registerConstraints);
    let valid = undefined;
    if (valResult[attrName]) {
      valid = valResult[attrName][0]; // get just the first message
    }
    setErrors((errors) => ({
      ...errors,
      [attrName]: valid,
      fetch: undefined,
    }));
  };

  const checkUserAvail = async () => {
    const text = inputs.username;
    try {
      const result = await fetchGET("users/username", text);
      console.log(result);
      if (!result.available) {
        setErrors((errors) => ({
          ...errors,
          username: "Username not available.",
        }));
      }
    } catch (e) {
      setErrors((errors) => ({
        ...errors,
        fetch: e.message,
      }));
    }
  };

  const validateOnSignUp = (fields) => {
    //checkAvail();

    for (const [key, value] of Object.entries(fields)) {
      console.log(key, value);
      validateField(value);
    }

    return !(
      errors.username !== undefined ||
      errors.email !== undefined ||
      errors.full_name !== undefined ||
      errors.password !== undefined ||
      errors.confirmPassword !== undefined
    );
  };

  return {
    handleUsernameChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleEmailChange,
    handleCompanyIdChange,
    handlePhoneNumberChange,
    validateField,
    validateOnSignUp,
    inputs,
    errors,
    setErrors,
  };
};

export default loginAndRegisterHook;
