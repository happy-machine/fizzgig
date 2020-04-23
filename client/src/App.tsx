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
import "./css/App.scss";
import "./css/components.scss";

function App() {
  useEffect(() => {
    async function setUp() {
      const user = await getUser();
      if (user != null) {
        setUser(user as IUser | undefined);
      }
      const symbols = mapUserToSymbols(user);
      if (symbols) {
        const userTickers = await getTickers(symbols);
        const userTickersMap = mapTickersToMap(userTickers);
        setTickers(userTickersMap);
      }
    }
    setUp();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        const symbols = mapUserToSymbols(user);
        if (symbols) {
          const userTickers = await getTickers(symbols);
          const userTickersMap = mapTickersToMap(userTickers);
          setTickers(userTickersMap);
          setStatus("");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
    // Polling due to lack of time, this would be websocket
  });

  const handleLogout = useCallback(async () => {
    logout();
    setLoggedIn(false);
  }, []);

  const [loggedIn, setLoggedIn] = useState(cookieExists());
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
              stockValue={String(tickers.get(symbol)) || "N/A"}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              thresholds={{
                high: notification_thresholds.high,
                low: notification_thresholds.low,
              }}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
