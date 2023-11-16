import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Loader } from "monday-ui-react-core";
import {
  boardsQuery,
  sumFunc,
  minFunc,
  maxFunc,
  countFunc,
  averageFunc,
  medianFunc,
} from "./Functions";
import Number from "./components/Number";
import Ticker from "./components/Ticker";
import Benchmark from "./components/Benchmark";
import Goal from "./components/Goal";
import { backendUrl, apiKey } from "./constants";
import axios from "axios";

const monday = mondaySdk();

export default function App() {
  const [accountId, setAccountId] = useState(0);
  const [boards, setBoards] = useState([]);
  const [settings, setSettings] = useState({});
  const [values, setValues] = useState(undefined);
  const [ticker, setTicker] = useState(undefined);
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    monday.listen("context", (res) => {
      console.log(res)
      fetchBoards(res.data.boardIds, settings?.columns);
      setTheme(res.data.theme)
    });
    monday.listen("settings", (res) => {
      setSettings(res.data);
    });
  }, []);

  useEffect(() => {
    updateValues();
  }, [boards, settings]);

  useEffect(() => {
    if (typeof accountId === "number" && values !== undefined)
      fetchTickerValues();
  }, [accountId, values]);

  function updateValues() {
    if (settings.type === undefined) return;
    const newValues = {
      sum: sumFunc(boards, settings),
      min: minFunc(boards, settings),
      max: maxFunc(boards, settings),
      average: averageFunc(boards, settings),
      count: countFunc(boards, settings),
      median: medianFunc(boards, settings),
    };
    setValues(newValues);
  }

  async function fetchBoards(ids) {
    try {
      const res = await monday.api(boardsQuery(ids));
      setBoards(res.data.boards);
      setAccountId(res.data.boards[0].workspace_id);
    } catch {
      return [];
    }
  }

  async function fetchTickerValues() {
    try {
      const res = await axios.post(
        backendUrl,
        { id: accountId, ...values },
        { headers: { Authorization: apiKey } }
      );
      setTicker(res.data.ticker);
    } catch (err) {
      console.error(err);
    }
  }

  function Root() {
    if (settings?.type === undefined || values === undefined) return <Loader size={Loader.sizes.SMALL} />;
    return (
      <div>
        {settings.type === "numbers" && (
          <Number values={values} settings={settings} />
        )}
        {settings.type === "ticker" && (
          <Ticker values={values} ticker={ticker} settings={settings} />
        )}
        {settings.type === "benchmark" && (
          <Benchmark values={values} settings={settings} />
        )}
        {settings.type === "goal" && (
          <Goal values={values} settings={settings} />
        )}
      </div>
    );
  }

  return (
    <div className={`${theme} App`}>
      <Root />
    </div>
  );
}
