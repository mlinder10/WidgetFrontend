import React from "react";
import { isWithinOneWeek } from "../Functions";

export default function Ticker({ values, ticker, settings }) {
  if (ticker.values === undefined) return null

  function change() {
    switch (settings.function) {
      case "sum":
        return values.sum / Math.floor(tickerValue().sum * 100) / 100;
      case "min":
        return values.min / Math.floor(tickerValue().min * 100) / 100;
      case "max":
        return values.max / Math.floor(tickerValue().max * 100) / 100;
      case "count":
        return values.count / Math.floor(tickerValue().count * 100) / 100;
      case "median":
        return values.median / Math.floor(tickerValue().median * 100) / 100;
      case "average":
        return values.average / Math.floor(tickerValue().average * 100) / 100;
    }
  }

  function tickerValue() {
    switch (settings.tickerCadence) {
      case "day":
        return ticker.values[ticker.values.length - 1];
      case "week":
        let index = ticker.values.length - 1;
        while (index > 0 && !isWithinOneWeek(ticker.values[index].date)) {
          index--;
        }
        return ticker.values[index];
      case "month":
        return ticker.values[0];
    }
  }

  return (
    <div>
      <p>{change()}</p>
      <div className={`${change() >= 1 ? "arrow-up" : "arrow-down"}`}></div>
    </div>
  );
}
