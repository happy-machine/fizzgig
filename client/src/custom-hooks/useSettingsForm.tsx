import { useState } from "react";
import { IUser, IUserTicker } from "../components/types";
import { ISettings } from "../components/Settings";

export type ICallback = {
  message: string;
  success: boolean;
};

interface IUseSettingsForm {
  callback: (id: string, tickers: any) => any;
  setStatus: (status: string) => void;
  setUser: (user: IUser) => void;
  showSettings: ISettings;
  user: IUser;
}

const useSettingsForm = ({
  callback,
  setStatus,
  setUser,
  showSettings,
  user,
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
        high: inputs.high,
        low: inputs.low,
      },
      should_notify: true,
    };
    const newTickers = [
      ...user.tickers.filter(
        (ticker: IUserTicker) => ticker.symbol !== showSettings.symbol
      ),
      updatedTicker,
    ];
    const response = await callback(user._id, newTickers);
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
