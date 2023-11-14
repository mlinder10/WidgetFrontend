import React from "react";
import { isWithinOneWeek } from "../Functions";

export default function Ticker({ values, ticker, settings }) {
  if (ticker === undefined) return <div>Loading...</div>;

  function change() {
    switch (settings.function) {
      case "sum":
        return values.sum - tickerValue().sum;
      case "min":
        return values.min - tickerValue().min;
      case "max":
        return values.max - tickerValue().max;
      case "count":
        return values.count - tickerValue().count;
      case "median":
        return values.median - tickerValue().median;
      case "average":
        return values.average - tickerValue().average;
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

  function arrowType() {
    if (settings.tickerDirection === "increasing") {
      return change() >=0 ? "arrow-up" : "arrow-down"
    }
    return change() < 0 ? "arrow-up" : "arrow-down"
  }

  return (
    <div className="ticker-root">
      <div className={arrowType()}></div>
      <p>{Math.abs(change())}</p>
    </div>
  );
}
