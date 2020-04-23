import { useState } from "react";

export type ISignUpFormInput = {
  password?: string;
  username?: string;
};
export type ICallback = {
  message: string;
  success: boolean;
};

const useSignUpForm = (
  callback: (args: ISignUpFormInput) => Promise<ICallback>,
  setStatus: (status: string) => void,
  setLoggedIn: (loggedIn: boolean) => void
) => {
  const [inputs, setInputs] = useState({ password: "", username: "" });

  const handleSubmit = async (event: React.ChangeEvent<EventTarget>) => {
    if (event) {
      event.preventDefault();
    }
    const response = await callback(inputs);
    setStatus(response.message);
    setLoggedIn(response.success);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
  };
  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
};

export default useSignUpForm;
