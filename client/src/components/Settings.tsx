import React, { useCallback } from "react";
import { updateUserTickers } from "../lib/requests";
import useSettingsForm from "../custom-hooks/useSettingsForm";
import { IUser, IUserTicker } from "../components/types";
import { InfoOutlined, Close } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

export interface ISettings {
  visible: boolean;
  symbol: string;
}

type ISettingsProps = {
  setUser: (user: IUser) => void;
  setStatus: (status: string) => void;
  showSettings: ISettings;
  setShowSettings: (showSettings: ISettings) => void;
  user: IUser;
  tickers: Map<string, string> | undefined | undefined;
  setTickers: (tickers: Map<string, string>) => void;
};

function Settings({
  setUser,
  setStatus,
  user,
  setShowSettings,
  showSettings,
}: ISettingsProps) {
  const getSetting = useCallback(
    (setting: string) => {
      const ticker = user.tickers.find(
        (ticker: IUserTicker) => ticker.symbol === showSettings.symbol
      );
      return ticker?.notification_thresholds[setting];
    },
    [user, showSettings.symbol]
  );
  const { inputs, handleInputChange, handleSubmit } = useSettingsForm({
    callback: updateUserTickers,
    setStatus,
    showSettings,
    setUser,
    user,
    oldHigh: getSetting("high"),
    oldLow: getSetting("low"),
  });
  const { low, high } = inputs;

  return (
    <div id="settings-outer-container">
      <div id="settings-container">
        <div className="settings-item">
          <Close
            className={"close"}
            onClick={() => setShowSettings({ visible: false, symbol: "" })}
          />
          <Tooltip
            title="Set a threshold to recieve an email when the stock reaches higher than your high threshold or lower than your low threshold"
            placement="top"
          >
            <InfoOutlined className={"info"} />
          </Tooltip>
          <form onSubmit={handleSubmit} className="form form-login">
            <div className="form-field">
              <input
                id="high-threshold"
                name="high"
                type="text"
                className="form-input"
                placeholder={getSetting("high")}
                // required
                value={high}
                onChange={handleInputChange}
              />
              <span className="threshold-text">High Threshold</span>
            </div>

            <div className="form-field">
              <input
                id="low-threshold"
                type="text"
                name="low"
                className="form-input"
                placeholder={getSetting("low")}
                // required
                value={low}
                onChange={handleInputChange}
              />
              <span className="threshold-text">Low Threshold</span>
            </div>

            <div className="form-field">
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
