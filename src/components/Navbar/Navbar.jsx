import React, { useState } from "react";
import "./Navbar.scss";
import FiltersList from "../FiltersList/FiltersList";

const Navbar = ({
  searchForBeer,
  filterBeers,
  clearFilters, // new: () => void
  filters = {}, // { abv, classic, acidic }
  currentCount = 0, // number of beers currently shown
  totalCount = 415, // full catalog size
  onSurprise, // new: () => void (fetch random beer)
}) => {
  const [open, setOpen] = useState(false);

  const active = Object.entries(filters)
    .filter(([, v]) => !!v)
    .map(([k]) => k);

  const labelForKey = (k) =>
    k === "abv"
      ? "High ABV"
      : k === "classic"
      ? "Classic"
      : k === "acidic"
      ? "Acidic"
      : k;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="navbar" aria-label="Beer filters and search">
        <form
          className="navbar__form"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <h1 className="navbar__title">
            Curious about a<br />
            BrewDog beer?
          </h1>

          {/* Search */}
          <div className="navbar__search">
            <label htmlFor="navbar-search" className="sr-only">
              Search for a beer
            </label>
            <input
              type="search"
              id="navbar-search"
              name="navbar-search"
              className="navbar__input"
              placeholder="Search for a beer…"
              autoComplete="off"
              onChange={searchForBeer}
            />
          </div>

          {/* Filters card (desktop view only) */}
          <section
            className="navbar__section navbar__section--desktop"
            aria-labelledby="filters__legend"
          >
            <FiltersList filterBeers={filterBeers} values={filters} />
            {/* Active chips + reset */}
            <div className="navbar__active">
              {active.length > 0 ? (
                <>
                  <div className="navbar__chips">
                    {active.map((k) => (
                      <span
                        key={k}
                        className="chip"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          filterBeers({ target: { value: k, checked: false } })
                        }
                        onKeyDown={(e) =>
                          (e.key === "Enter" || e.key === " ") &&
                          filterBeers({ target: { value: k, checked: false } })
                        }
                        aria-label={`Remove ${labelForKey(k)} filter`}
                      >
                        {labelForKey(k)} ×
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="link-reset"
                    onClick={clearFilters}
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </button>
                </>
              ) : (
                <p className="navbar__hint">
                  Tip: combine filters to narrow results.
                </p>
              )}
            </div>
          </section>

          {/* CTA + results footer (desktop) */}
          <div className="navbar__footer">
            <button
              type="button"
              className="btn-surprise"
              onClick={onSurprise}
              aria-label="Surprise me with a random beer"
            >
              🎲 Surprise me
            </button>

            <div className="results">
              <div className="results__text">
                Showing {currentCount} of {totalCount} beers
              </div>
              <div className="results__bar">
                <div
                  className="results__bar-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((currentCount / Math.max(1, totalCount)) * 100)
                    )}%`,
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </form>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="navtop">
        <div className="navtop__row">
          <input
            type="search"
            className="navtop__input"
            placeholder="Search for a beer…"
            onChange={searchForBeer}
            aria-label="Search for a beer"
          />
          <button
            className="navtop__btn"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-controls="filters-drawer"
          >
            Filters
          </button>
        </div>

        {/* Active chips row */}
        <div className="navtop__chips">
          {active.map((k) => (
            <span
              key={k}
              className="chip chip--small"
              role="button"
              tabIndex={0}
              onClick={() =>
                filterBeers({ target: { value: k, checked: false } })
              }
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                filterBeers({ target: { value: k, checked: false } })
              }
            >
              {labelForKey(k)} ×
            </span>
          ))}
          {active.length > 0 && (
            <button
              type="button"
              className="link-reset link-reset--small"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        <div className="navtop__footer">
          <div className="results results--compact">
            <span className="results__text">
              Showing {currentCount}/{totalCount}
            </span>
          </div>
          <button
            type="button"
            className="btn-surprise btn-surprise--small"
            onClick={onSurprise}
          >
            🎲 Surprise
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {open && (
        <>
          <div className="drawer__backdrop" onClick={() => setOpen(false)} />
          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            id="filters-drawer"
            aria-label="Filters"
          >
            <div className="drawer__header">
              <h2 className="drawer__title">Filters</h2>
              <button
                className="drawer__close"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="drawer__body">
              <FiltersList filterBeers={filterBeers} values={filters} />
            </div>

            <div className="drawer__footer">
              {active.length > 0 ? (
                <button
                  className="link-reset"
                  type="button"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              ) : (
                <span className="navbar__hint">Pick any filter to refine.</span>
              )}

              <button
                className="drawer__apply"
                type="button"
                onClick={() => setOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
