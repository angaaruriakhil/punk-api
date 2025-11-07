import React from "react";
import "./FiltersList.scss";

const FILTERS = [
  { key: "abv", label: "High ABV (≥ 6.0%)" },
  { key: "classic", label: "Classic (Brew Date < 2010)" },
  { key: "acidic", label: "Acidic (pH < 4)" },
];

const FiltersList = ({ filterBeers, values = {} }) => {
  return (
    <fieldset
      className="filters"
      role="group"
      aria-labelledby="filters__legend"
    >
      <legend id="filters__legend" className="filters__legend">
        Filters
      </legend>

      {FILTERS.map((f) => (
        <label key={f.key} className="filters__item">
          <span className="filters__label">{f.label}</span>
          <input
            type="checkbox"
            name={`filters__${f.key}`}
            value={f.key}
            checked={!!values[f.key]}
            onChange={filterBeers}
          />
        </label>
      ))}
    </fieldset>
  );
};

export default FiltersList;
