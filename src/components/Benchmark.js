import React from "react";

export default function Benchmark({ values, boards, settings }) {
  function Current() {
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

  function Color() {
    const increasing = settings.benchmarkDirection === "increasing";
    try {
      const target = parseInt(settings.benchmarkValue);
      if (increasing) {
        if (Current() >= target) return "#0f0";
        else return "#f00";
      }
      if (Current() > target) return "#f00";
      else return "#0f0";
    } catch {
      return "initial";
    }
  }

  return (
    <div className={"benchmark-root"}>
      <div>Target: {settings.benchmarkValue}</div>
      <div className={"benchmark-current"}>
        <p>Current:</p>
        <p style={{color: Color()}}>{Current()}</p>
      </div>
    </div>
  );
}
