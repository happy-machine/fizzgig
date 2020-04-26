import { COOKIE_TOKEN } from "../constants";
import { authenticate } from "../lib/requests";
import { register } from "../lib/requests";
import { deleteCookie } from "../lib/cookie";
import { ILoginFormInput } from "../custom-hooks/useLoginForm";
import { ISignupFormInput } from "../custom-hooks/useSignupForm";

export async function authenticateUser({
  username = "",
  password = "",
}: ILoginFormInput) {
  const error = { message: "Error Logging In", success: false };
  try {
    const response = await authenticate(username, password);
    if (response) {
      return { message: "You have successfully logged in!", success: true };
    }
    return error;
  } catch (e) {
    return error;
  }
}

export async function signupUser({
  username = "",
  password = "",
  name = "",
}: ISignupFormInput) {
  const error = { message: "Error Signing up", success: false };
  try {
    const response = await register({ username, name, password });
    if (response) {
      return { message: "You have successfully signed up!", success: true };
    }
    return error;
  } catch (e) {
    return error;
  }
}

export function logout() {
  deleteCookie(COOKIE_TOKEN);
}
