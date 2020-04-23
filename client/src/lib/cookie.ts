import { COOKIE_TOKEN } from "../constants";

export const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 7 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

export const getCookie = (name: string | undefined) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return false;
};

export const deleteCookie = (name: string | undefined) => {
  document.cookie = `${name}=; Max-Age=-99999999;`;
};

export const cookieExists = () => getCookie(COOKIE_TOKEN) !== false;
