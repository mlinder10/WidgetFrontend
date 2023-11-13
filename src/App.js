import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
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
import { backendUrl, defaultValues, apiKey } from "./constants";

const monday = mondaySdk();
monday.setToken(
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI5MjE3NzEzMiwiYWFpIjoxMSwidWlkIjo1MDcxNzk3OCwiaWFkIjoiMjAyMy0xMC0yN1QwMjozMzoxOC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTI2MzkxNSwicmduIjoidXNlMSJ9.1Goh2-01bUKDAtDg80_K20WooMWB2OQxAxSyQQ7czj8"
);

export default function App() {
  const [accountId, setAccountId] = useState(0);
  const [boards, setBoards] = useState([]);
  const [settings, setSettings] = useState({});
  const [values, setValues] = useState(defaultValues);
  const [ticker, setTicker] = useState({});

  useEffect(() => {
    monday.listen("context", (res) => {
      fetchBoards(res.data.boardIds, settings?.columns);
    });
    monday.listen("settings", (res) => {
      setSettings(res.data);
    });
  }, []);

  useEffect(() => {
    updateValues();
  }, [boards, settings]);

  useEffect(() => {
    if (typeof accountId === "number") fetchTickerValues();
  }, [accountId]);

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
      setAccountId(res.data.boards[0].workspace_id)
    } catch {
      return [];
    }
  }

  async function fetchTickerValues(id) {
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: apiKey },
        body: JSON.stringify({ id: id, ...values })
      });
      const json = await res.json();
      setTicker(json);
      console.log(json)
    } catch (err) {
      console.error(err?.message);
    }
  }

  function Root() {
    if (settings?.type === undefined) return null;
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
    <div className="App">
      <Root />
    </div>
  );
}
