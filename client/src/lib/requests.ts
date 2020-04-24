import { GET, POST, PUT, API_PATH, COOKIE_TOKEN } from "../constants";
import { setCookie, getCookie } from "./cookie";
import {
  IUserTickerNotificationThresholds,
  IUser,
  IUserTicker,
} from "../components/types";
const axios = require("axios");

export type ICallbackArgs = {
  inputs: IUserTickerNotificationThresholds;
  user: IUser;
};

const addAuthHeaders = (
  url: string,
  type = GET,
  credentials = getCookie(COOKIE_TOKEN)
) => {
  const request = {
    method: type,
    url: url,
    headers: {
      Authorization: `Bearer ${credentials}`,
    },
  };
  return request;
};

export const diagnostic = async () => {
  const res = await axios(addAuthHeaders(`${API_PATH}/diagnostic`, GET));
  return res.data;
};

export const search = async (searchString: string) => {
  try {
    const res = await axios(
      addAuthHeaders(`${API_PATH}/search?keywords=${searchString}`, GET)
    );
    if (!res.data.bestMatches) throw new Error("Badly formed response.");
    return res.data.bestMatches;
  } catch (e) {
    return e;
  }
};

export const getUser = async () => {
  try {
    const res = await axios(addAuthHeaders(`${API_PATH}/userTickers`, GET));
    if (!res.data) throw new Error("Bad response.");
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      data: null,
    };
  }
};

export const getTickers = async (symbols: string[]) => {
  try {
    const res = await axios({
      method: POST,
      url: `${API_PATH}/tickers`,
      headers: {
        Authorization: `Bearer ${getCookie(COOKIE_TOKEN)}`,
      },
      data: {
        symbols,
      },
    });
    if (!res.data) throw new Error("Bad response.");
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      data: null,
    };
  }
};

export const updateUserTickers = async (tickers: IUserTicker[]) => {
  try {
    const res = await axios({
      method: PUT,
      url: `${API_PATH}/userTickers`,
      headers: {
        Authorization: `Bearer ${getCookie(COOKIE_TOKEN)}`,
      },
      data: {
        tickers,
      },
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    return {
      success: false,
      data: null,
    };
  }
};

export const authenticate = async (username: string, password: string) => {
  try {
    const res = await axios({
      method: POST,
      url: `${API_PATH}/login`,
      data: {
        email: username,
        password,
      },
    });
    if (!res.data.auth) throw new Error("Not Authed");
    setCookie(COOKIE_TOKEN, res.data.token, 7);
    return res.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};
