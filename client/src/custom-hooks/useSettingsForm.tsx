import { useState } from "react";
import { IUser, IUserTicker } from "../components/types";
import { ISettings } from "../components/Settings";

export type ICallback = {
  message: string;
  success: boolean;
};

interface IUseSettingsForm {
  callback: (args: any) => any;
  setStatus: (status: string) => void;
  setUser: (user: IUser) => void;
  showSettings: ISettings;
  user: IUser;
  oldLow: string | undefined;
  oldHigh: string | undefined;
}

const useSettingsForm = ({
  callback,
  setStatus,
  setUser,
  showSettings,
  user,
  oldLow,
  oldHigh,
}: IUseSettingsForm) => {
  const [inputs, setInputs] = useState({ high: "", low: "" });

  const handleSubmit = async (event: React.ChangeEvent<EventTarget>) => {
    if (event) {
      event.preventDefault();
    }
    const selectedTicker = user.tickers.find(
      (ticker: IUserTicker) => ticker.symbol === showSettings.symbol
    );
    const updatedTicker = {
      ...selectedTicker,
      notification_thresholds: {
        high: inputs.high || oldHigh,
        low: inputs.low || oldLow,
        should_notify: true,
      },
    };
    /***
     * I want the placeholder to show the old value as a reminder, but i don't want
     * the old values to populate the input when the user starts typing, so here
     * we default to the old values passed down from the settings form
     ***/
    const newTickers = [
      ...user.tickers.filter(
        (ticker: IUserTicker) => ticker.symbol !== showSettings.symbol
      ),
      updatedTicker,
    ];
    const response = await callback(newTickers);
    if (response.success) {
      setUser(response.data);
      setStatus("Settings updated successfully");
    } else {
      setStatus("Problem updating settings");
    }
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

export default useSettingsForm;
