import React from "react";
import { isWithinOneWeek } from "../utilities/Functions";
import { Loader } from "monday-ui-react-core";

export default function Ticker({ values, tickerValues, settings }) {
  if (tickerValues === undefined) return <Loader size={Loader.sizes.SMALL} />;

  function change() {
    try {
      return Math.floor(
        (values[settings.function] / tickerValues[settings.function] - 1) * 100
      );
    } catch {
      return values[settings.function];
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
      <p className="ticker-percentage">{Math.abs(change())}%</p>
      <p className="ticker-words" style={{ fontSize: "1rem" }}>
        {timePeriod()}
      </p>
    </div>
  );
}
