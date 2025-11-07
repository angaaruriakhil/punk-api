import React from "react";
import Card from "../Card/Card";
import "./CardList.scss";

const CardList = ({
  beerData = [],
  searchResults = [],
  hasMore,
  loading,
  loadMore,
}) => {
  const list =
    Array.isArray(searchResults) && searchResults.length > 0
      ? searchResults
      : beerData;
  const isSearching = Array.isArray(searchResults) && searchResults.length > 0;

  return (
    <div className="card-list">
      {list.map((beer) => (
        <Card
          key={beer.id}
          name={beer.name}
          imageUrl={beer.image_url}
          tagline={beer.tagline}
          firstBrewed={beer.first_brewed}
          description={beer.description}
          abv={beer.abv}
          pH={beer.ph}
        />
      ))}

      {!isSearching && (
        <div className="card-list__pager">
          <button
            className="card-list__pager-btn"
            onClick={loadMore}
            disabled={loading || !hasMore}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Loading…" : hasMore ? "Load more" : "No more beers"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CardList;
