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
  const [settings, setSettings] = useState(undefined);
  const [values, setValues] = useState(undefined);
  const [ticker, setTicker] = useState(undefined);
  const [theme, setTheme] = useState("dark");
  const [itemIds, setItemIds] = useState([]);

  useEffect(() => {
    async function fetchBoards(ids) {
      try {
        const res = await monday.api(boardsQuery(ids));
        setBoards(res.data.boards);
        setWorkspaceId(res.data.boards[0].workspace_id);
        console.log("Boards", res.data.boards);
      } catch {
        return [];
      }
    }

    monday.listen("itemIds", (res) => {
      setItemIds(res.data);
      console.log("itemIds", res.data);
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
    function updateValues() {
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
    }

    updateValues();
  }, [boards, settings, itemIds]);

  useEffect(() => {
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

    if (typeof workspaceId === "number" && values !== undefined)
      fetchTickerValues();
  }, [workspaceId, values]);

  return { settings, values, ticker, theme, itemIds };
}
