import { useState } from "react";

export type ISignupFormInput = {
  password?: string;
  username?: string;
  name?: string;
};

export type ICallback = {
  message: string;
  success: boolean;
};

const useSignupForm = (
  callback: (args: ISignupFormInput) => Promise<ICallback>,
  setStatus: (status: string) => void,
  setLoggedIn: (loggedIn: boolean) => void,
  setShowSignup: (signup: boolean) => void
) => {
  const [inputs, setInputs] = useState({
    password: "",
    username: "",
    name: "",
  });

  const handleSubmit = async (event: React.ChangeEvent<EventTarget>) => {
    if (event) {
      event.preventDefault();
    }
    const response = await callback(inputs);
    setStatus(response.message);
    setLoggedIn(response.success);
    setShowSignup(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setInputs((inputs: any) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };
  return {
    handleSubmit,
    handleInputChange,
    inputs,
  };
};

export default useSignupForm;
