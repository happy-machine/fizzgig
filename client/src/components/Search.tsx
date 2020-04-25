import React, { useState, useCallback } from "react";
import { search } from "../lib/requests";
import { v4 as uuid } from "uuid";
import { IUser, IUserTicker } from "./types";
import ScaleLoader from "react-spinners/ClipLoader";
import { updateUserTickers } from "../lib/requests";

type IResultProps = {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
};

type ISearchProps = {
  searchString: string;
  setSearchString: (searchString: string) => void;
  setStatus: (status: string) => void;
  user: IUser | undefined;
  setUser: (user: IUser) => void;
};

function Search({
  searchString,
  setSearchString,
  setStatus,
  user,
  setUser,
}: ISearchProps) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const makeList = useCallback(() => {
    const handleSelectResult = async (result: IResultProps) => {
      if (user) {
        setResults([]);
        setSearchString("");
        setStatus(`Adding Symbol ${result["1. symbol"]} to your dashboard.`);
        const newTickers = [
          ...user?.tickers,
          {
            name: result["2. name"],
            symbol: result["1. symbol"],
          },
        ];
        const response = await updateUserTickers(user._id, newTickers);
        if (response.success) {
          setUser(response.data);
          setStatus(
            `You are subscribed to Symbol ${result["1. symbol"]}, only updated during stock market hours, please wait.`
          );
        } else {
          setStatus("Problem updating settings");
        }
      }
    };

    return (
      results &&
      results.map((result: IResultProps) => {
        return (
          <div
            className="search-result"
            onClick={() => handleSelectResult(result)}
            key={uuid()}
          >
            <div className="search-result-name">{`${result["2. name"]}  -  ${result["1. symbol"]}   [${result["4. region"]}]`}</div>
          </div>
        );
      })
    );
  }, [results, setSearchString, setStatus]);

  const handleOnChange = useCallback(
    async (e) => {
      setSearchString(e.target.value);
    },
    [setSearchString]
  );

  const handleOnKeyPress = useCallback(
    async (e) => {
      try {
        if (e.key === "Enter") {
          setLoading(true);
          const response = await search(searchString);
          if (!response.length) setStatus(`No results for ${searchString}`);
          setLoading(false);
          setResults(response);
        }
      } catch (e) {
        setStatus("Error Searching");
      }
    },
    [searchString, setStatus, setLoading]
  );

  return (
    <div id="search-container">
      <div id="search-spinner">
        <ScaleLoader size={150} color={"white"} loading={loading} />
      </div>
      <input
        value={searchString}
        id="search-input"
        placeholder="Search for a Ticker..."
        onKeyPress={handleOnKeyPress}
        onChange={handleOnChange}
        onPointerOver={() => setStatus("")}
      />
      {results && <ul id="results-list">{searchString && makeList()}</ul>}
    </div>
  );
}

export default Search;
