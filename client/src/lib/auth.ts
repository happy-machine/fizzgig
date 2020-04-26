import { COOKIE_TOKEN } from "../constants";
import { authenticate } from "../lib/requests";
import { deleteCookie } from "../lib/cookie";
import { ILoginForm } from "../custom-hooks/useLoginForm";

export async function authenticateUser({
  username = "",
  password = "",
}: ILoginForm) {
  const error = { message: "Error Logging In", success: false };
  try {
    const response = await authenticate(username, password);
    if (response) {
      return { message: "", success: true };
    }
    return error;
  } catch (e) {
    return error;
  }
}

export function logout() {
  deleteCookie(COOKIE_TOKEN);
}
