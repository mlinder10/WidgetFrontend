import React from "react";

export default function Number({ style, values, settings }) {
  function value() {
    return values[settings.function]
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
