import React from "react";

export default function Number({ style, values, settings }) {
  function value() {
    switch (settings.function) {
      case "sum":
        return values.sum
      case "min":
        return values.min
      case "max":
        return values.max
      case "count":
        return values.count
      case "average":
        return values.average
      case "median":
        return values.median
    }
  }

  function units() {
    let unit = (settings?.unit === undefined) ? "" : settings.unit.symbol
    if (unit === "custom") unit = settings.unit.custom_unit
    return unit
  }

  return (
    <>
    {settings.unit.direction === "left" && <p style={style}>{`${units()}${value()}`}</p>}
    {settings.unit.direction === "right" && <p style={style}>{`${value()}${units()}`}</p>}
    </>
  );
}
