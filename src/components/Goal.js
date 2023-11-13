import React from "react";

export default function Goal({ values, settings }) {
  function percentage() {
    try {
      const goal = parseInt(settings.goal);
      return current() / goal > 1 ? 1 : Math.round(current() / goal * 100) / 100;
    } catch {
      return 0;
    }
  }

  function current() {
    switch (settings.function) {
      case "sum":
        return values.sum;
      case "min":
        return values.min;
      case "max":
        return values.max;
      case "median":
        return values.median;
      case "average":
        return values.average;
      case "count":
        return values.count;
    }
  }

  function width() {
    return percentage() * 80;
  }

  function color() {
    try {
      const color = `rgb(${Math.floor(255 - 255 * percentage())}, ${Math.floor(
        255 * percentage()
      )}, 0)`;
      return color;
    } catch {
      return "blue";
    }
  }

  return (
    <div className="goal-root">
      <div className="goal-info">
        <p>{current()}</p>
        <p>{`${percentage() * 100}%`}</p>
        <p>{settings.goal}</p>
      </div>
      <div className="goal-outline">
        <div
          className="goal-fill"
          style={{ backgroundColor: color(), width: `${width()}vw` }}
        ></div>
      </div>
    </div>
  );
}
