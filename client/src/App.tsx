import React, { useState, useCallback, useEffect } from "react";
import logo from "./logo.svg";
import { v4 as uuid } from "uuid";
import { cookieExists } from "./lib/cookie";
import { logout } from "./lib/auth";
import Login from "./components/Login";
import Search from "./components/Search";
import Settings from "./components/Settings";
import Widget from "./components/Widget";
import { mapUserToSymbols, mapTickersToMap } from "./lib/lib";
import { IUser } from "./components/types";
import { getUser, getTickers } from "./lib/requests";
import Tooltip from "@material-ui/core/Tooltip";
import { InfoOutlined } from "@material-ui/icons";
import "./css/App.scss";
import "./css/components.scss";

function App() {
  const [loggedIn, setLoggedIn] = useState(cookieExists());
  useEffect(() => {
    async function setUp() {
      const user = await getUser();
      if (user.success && user.data !== null) {
        setUser(user.data as IUser | undefined);
      } else {
        setStatus("Error getting settings");
      }
      const symbols = mapUserToSymbols(user.data);
      if (symbols) {
        const response = await getTickers(symbols);
        if (response.success) {
          const userTickersMap = mapTickersToMap(response.data);
          setTickers(userTickersMap);
        } else {
          setStatus("Error getting tickers");
        }
      }
    }
    if (loggedIn) {
      setUp();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      const interval = setInterval(async () => {
        if (user) {
          const symbols = mapUserToSymbols(user);
          if (symbols) {
            const response = await getTickers(symbols);
            if (response.success) {
              const userTickersMap = mapTickersToMap(response.data);
              setTickers(userTickersMap);
              setStatus("");
            } else {
              setStatus("Error getting tickers");
            }
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    /***
     *  Polling due to lack of time, this would be websocket
     * I only want this useEffect to depend on the interval
     * the 'componentWillMount' takes care of login
     ***/
  });

  const handleLogout = useCallback(async () => {
    logout();
    setLoggedIn(false);
  }, []);

  const [user, setUser] = useState({} as IUser | undefined);
  const [tickers, setTickers] = useState(
    new Map() as Map<string, string> | undefined
  );
  const [status, setStatus] = useState("");
  const [showSettings, setShowSettings] = useState({
    visible: false,
    symbol: "",
  });
  const [searchString, setSearchString] = useState("");
  return (
    <div className="App">
      {!loggedIn && (
        <div id="logged-out">
          <Login setLoggedIn={setLoggedIn} setStatus={setStatus} />
        </div>
      )}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loggedIn && (
          <>
            <div id="app-title">Stock Alert Manager</div>
            <div id="logout" onClick={handleLogout}>
              <div id="info">
                <Tooltip
                  title="Fizzgig sends you email when an added stock goes out of the thresholds you set on it's widgets settings. To add a stock, use the search on the left and select any result to add to your dashboard"
                  placement="top"
                >
                  <InfoOutlined className={"info"} fontSize="small" />
                </Tooltip>
              </div>
              Logout
            </div>
          </>
        )}
      </header>

      <div id="status">{status}</div>
      {loggedIn && (
        <Search
          setStatus={setStatus}
          searchString={searchString}
          setSearchString={setSearchString}
          setUser={setUser}
          user={user}
        />
      )}
      {user && showSettings.visible && (
        <Settings
          user={user}
          setUser={setUser}
          setStatus={setStatus}
          setShowSettings={setShowSettings}
          showSettings={showSettings}
          tickers={tickers}
          setTickers={setTickers}
        />
      )}
      <div id="container">
        {tickers &&
          user?.tickers?.map(({ notification_thresholds, symbol }) => (
            <Widget
              key={uuid()}
              symbol={symbol}
              user={user}
              setUser={setUser}
              setStatus={setStatus}
              stockValue={String(tickers.get(symbol) || "N/A")}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              thresholds={{
                high: notification_thresholds?.high,
                low: notification_thresholds?.low,
              }}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
