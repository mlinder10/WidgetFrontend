import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";
import {
  boardsQuery,
  sumFunc,
  minFunc,
  maxFunc,
  countFunc,
  averageFunc,
  medianFunc,
} from "../utilities/Functions";
import { backendUrl, apiKey } from "../utilities/constants";
import axios from "axios";

const monday = mondaySdk();

export default function useContext() {
  const [workspaceId, setWorkspaceId] = useState(0);
  const [boards, setBoards] = useState([]);
  const [settings, setSettings] = useState({});
  const [values, setValues] = useState(undefined);
  const [ticker, setTicker] = useState(undefined);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    monday.listen("context", (res) => {
      console.log(res.data)
      fetchBoards(res.data.boardIds, settings?.columns);
      setTheme(res.data.theme);
    });
    monday.listen("settings", (res) => {
      setSettings(res.data);
    });
  }, []);

  useEffect(() => {
    updateValues();
  }, [boards, settings]);

  useEffect(() => {
    if (typeof workspaceId === "number" && values !== undefined)
      fetchTickerValues();
  }, [workspaceId, values]);

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
      setWorkspaceId(res.data.boards[0].workspace_id);
    } catch {
      return [];
    }
  }

  async function fetchTickerValues() {
    try {
      const res = await axios.post(
        backendUrl,
        { id: workspaceId, ...values },
        { headers: { Authorization: apiKey } }
      );
      setTicker(res.data.ticker);
    } catch (err) {
      console.error(err);
    }
  }

  return { settings, values, ticker, theme };
}
