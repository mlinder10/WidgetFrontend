import React from "react";

export default function Goal({ values, settings }) {
  function getGoal() {
    try {
      console.log(parseInt(settings.goal))
      console.log(typeof parseInt(settings.goal))
      if (typeof parseInt(settings.goal) === NaN) return 0;
      return parseInt(settings.goal);
    } catch {
      return 0;
    }
  }

  function percentage() {
    try {
      const goal = getGoal();
      if (goal === 0) return 1;
      return current() / goal > 1
        ? 1
        : Math.round((current() / goal) * 100) / 100;
    } catch {
      return 1;
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
      return `hsl(${Math.floor(125 * percentage())}, 100%, 50%)`;
    } catch {
      return "green";
    }
  }

  return (
    <div className="goal-root">
      <div className="goal-info">
        <p className="goal-current">{current()}</p>
        <p className="goal-goal"> / {getGoal()}</p>
      </div>
      <div className="goal-outline">
        <div
          className="goal-fill"
          style={{ backgroundColor: color(), width: `${width()}vw` }}
        >
          <div className="goal-arrow" />
        </div>
      </div>
    </div>
  );
}
