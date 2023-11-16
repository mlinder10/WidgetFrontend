import React from "react";
import { isWithinOneWeek } from "../Functions";
import { Loader } from "monday-ui-react-core";

export default function Ticker({ values, ticker, settings }) {
  if (ticker === undefined) return <Loader size={Loader.sizes.SMALL} />;

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

  function change() {
    switch (settings.function) {
      case "sum":
        if (tickerValue().sum === 0) return values.sum;
        return Math.floor((values.sum / tickerValue().sum) * 100) / 100;
      case "min":
        if (tickerValue().min === 0) return values.sum;
        return Math.floor((values.min / tickerValue().min) * 100) / 100;
      case "max":
        if (tickerValue().max === 0) return values.sum;
        return Math.floor((values.max / tickerValue().max) * 100) / 100;
      case "count":
        if (tickerValue().count === 0) return values.sum;
        return Math.floor((values.count / tickerValue().count) * 100) / 100;
      case "median":
        if (tickerValue().median === 0) return values.sum;
        return Math.floor((values.median / tickerValue().median) * 100) / 100;
      case "average":
        if (tickerValue().average === 0) return values.sum;
        return Math.floor((values.average / tickerValue().average) * 100) / 100;
    }
  }

  function arrowType() {
    if (settings.tickerDirection === "increasing") {
      return change() >= 0 ? "arrow-up" : "arrow-down";
    }
    return change() < 0 ? "arrow-up" : "arrow-down";
  }

  function timePeriod() {
    switch (settings.tickerCadence) {
      case "day":
        return "as of yesterday";
      case "week":
        return "as of last week";
      case "month":
        return "as of last month";
    }
  }

  return (
    <div className="ticker-root">
      <div className={arrowType()}></div>
      <p className="ticker-percentage">{change()}%</p>
      <p className="ticker-words" style={{ fontSize: "1rem" }}>
        {timePeriod()}
      </p>
    </div>
  );
}
