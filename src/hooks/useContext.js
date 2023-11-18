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
  parseBoards,
  getTickerValues,
} from "../utilities/Functions";
import { backendUrl, apiKey } from "../utilities/constants";
import axios from "axios";

const monday = mondaySdk();

export default function useContext() {
  const [workspaceId, setWorkspaceId] = useState(undefined);
  const [settings, setSettings] = useState(undefined);
  const [itemIds, setItemIds] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [boards, setBoards] = useState([]);
  const [ticker, setTicker] = useState(undefined);
  const [values, setValues] = useState(undefined);
  const [tickerValues, setTickerValues] = useState(undefined);

  useEffect(() => {
    async function fetchBoards(ids) {
      try {
        const res = await monday.api(boardsQuery(ids));
        const parsedBoards = parseBoards(res.data.boards);
        setBoards(parsedBoards);
        setWorkspaceId(res.data.boards[0].workspace_id);
      } catch {
        return [];
      }
    }

    monday.listen("itemIds", (res) => {
      setItemIds(res.data);
    });

    monday.listen("context", (res) => {
      fetchBoards(res.data.boardIds, settings?.columns);
      setTheme(res.data.theme);
    });

    monday.listen("settings", (res) => {
      setSettings(res.data);
    });
  }, []);

  useEffect(() => {
    if (settings?.type === undefined) return;
    const newValues = {
      sum: sumFunc(boards, settings, itemIds),
      min: minFunc(boards, settings, itemIds),
      max: maxFunc(boards, settings, itemIds),
      average: averageFunc(boards, settings, itemIds),
      count: countFunc(boards, settings, itemIds),
      median: medianFunc(boards, settings, itemIds),
    };
    setValues(newValues);
  }, [boards, settings, itemIds]);

  useEffect(() => {
    if (settings?.type === undefined || ticker === undefined) return;
    const newValues = getTickerValues(ticker, settings, itemIds);
    setTickerValues(newValues);
  }, [ticker, settings, itemIds]);

  useEffect(() => {
    async function fetchTickerValues() {
      try {
        const res = await axios.post(
          backendUrl,
          { workspace_id: workspaceId, boards },
          { headers: { Authorization: apiKey } }
        );
        setTicker(res.data.ticker.values);
      } catch (err) {
        console.error(err);
      }
    }

    if (workspaceId !== undefined && boards.length !== 0) fetchTickerValues();
  }, [workspaceId, values]);

  return { settings, values, tickerValues, theme };
}
