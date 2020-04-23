import React, { useState, useCallback } from "react";
import { BRAND_ORANGE } from "../constants";
import { Settings, Close } from "@material-ui/icons";
import { updateUserTickers } from "../lib/requests";
import { IUser, IUserTicker } from "./types";

interface ISettings {
  visible: boolean;
  symbol: string;
}

type IThresholds = {
  high: string;
  low: string;
};

type IWidgetProps = {
  stockValue: string;
  symbol: string;
  thresholds: IThresholds;
  showSettings: ISettings;
  setShowSettings: (showSettings: ISettings) => void;
  user: IUser;
  setUser: (user: IUser) => void;
  setStatus: (status: string) => void;
};

function Widget({
  stockValue,
  thresholds,
  symbol,
  showSettings,
  setShowSettings,
  user,
  setUser,
  setStatus,
}: IWidgetProps) {
  const [alert, setAlert] = useState(
    parseFloat(thresholds.high) < parseFloat(stockValue) ||
      parseFloat(thresholds.low) > parseFloat(stockValue)
  );
  //   console.log(
  //     parseFloat(thresholds.low),
  //     parseFloat(stockValue),
  //     parseFloat(thresholds.high)
  //   );
  //   console.log(parseFloat(thresholds.low) > parseFloat(stockValue));
  //   console.log(parseFloat(thresholds.high) < parseFloat(stockValue));
  //   console.log(
  //     !(
  //       parseFloat(thresholds.high) < parseFloat(stockValue) ||
  //       parseFloat(thresholds.low) > parseFloat(stockValue)
  //     )
  //   );
  //   console.log("____________________________");
  const handleDelete = useCallback(async () => {
    const response = await updateUserTickers(
      user.tickers.filter((ticker: IUserTicker) => ticker.symbol !== symbol)
    );
    if (response.success) {
      setUser(response.data);
      setStatus("Settings updated successfully");
      setShowSettings({ visible: false, symbol: "" });
    } else {
      setStatus("Problem updating settings");
    }
  }, []);

  return (
    <div className="widget">
      <div className="settings-container">
        <Close className={"close"} onClick={() => handleDelete()} />
        <Settings
          className="settings"
          onClick={() => setShowSettings({ visible: true, symbol })}
        />
      </div>
      <div className="widget-title-container">
        <div className="widget-title">{symbol}</div>
      </div>
      <div className="widget-text-container">
        <div
          style={{ color: alert ? BRAND_ORANGE : "#11ff00" }}
          className={"widget-text" + (alert ? " blink-me" : "")}
        >
          {stockValue}
        </div>
      </div>
    </div>
  );
}

export default Widget;
