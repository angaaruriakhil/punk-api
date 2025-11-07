import "./App.scss";
import React, { useEffect, useState } from "react";
import CardList from "./components/CardList/CardList";
import Navbar from "./components/Navbar/Navbar";

const BASE = "https://punkapi.online/v3";
const PER_PAGE = 80; // max the API allows as per https://github.com/alxiw/punkapi/tree/master

const buildParams = ({ page, perPage, query, filters }) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("per_page", String(perPage));

  if (query) params.set("beer_name", query); // Search
  if (filters.abv) params.set("abv_gt", "6"); // "High ABV"
  if (filters.classic) params.set("brewed_before", "2010"); // "Classic"

  return params.toString();
};

const App = () => {
  const [beerData, setBeerData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState(""); // search string
  const [filters, setFilters] = useState({
    abv: false, // abv_gt>6 (server-side)
    classic: false, // brewed_before 2010 (server-side)
    acidic: false, // ph < 4 (client-side because API doesn't filter by ph)
  });

  // central fetch that respects page + query + filters
  const fetchBeers = async (pageNum, { append }) => {
    try {
      setLoading(true);

      const qs = buildParams({
        page: pageNum,
        perPage: PER_PAGE,
        query,
        filters,
      });
      const res = await fetch(`${BASE}/beers?${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();

      // normalize image urls
      const withImages = data.map((b) => ({
        ...b,
        image_url: `${BASE}/images/${String(b.id).padStart(3, "0")}.png`,
      }));

      // client-side 'acidic' filter (API has no pH filter)
      const finalList = filters.acidic
        ? withImages.filter((b) => typeof b.ph === "number" && b.ph < 4)
        : withImages;

      setBeerData((prev) => (append ? [...prev, ...finalList] : finalList));

      // pagination flag
      setHasMore(finalList.length === PER_PAGE);
    } catch (e) {
      console.error(e);
      if (!append) setBeerData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // load page 1 on first mount
  useEffect(() => {
    fetchBeers(1, { append: false });
  }, []);

  // whenever query or filters change: reset to page 1 and refetch
  useEffect(() => {
    setPage(1);
    fetchBeers(1, { append: false });
  }, [query, filters.abv, filters.classic, filters.acidic]);

  // when page number increments (via "Load more"), append
  useEffect(() => {
    if (page > 1) fetchBeers(page, { append: true });
  }, [page]);

  // ---------------- handlers passed to Navbar ----------------
  const searchForBeer = (e) => {
    const q = e?.target?.value?.trim() || "";
    setQuery(q); // triggers the effect above (server-side search)
  };

  const filterBeers = (e) => {
    const { value, checked } = e.target;
    if (value === "abv") setFilters((f) => ({ ...f, abv: checked }));
    if (value === "classic") setFilters((f) => ({ ...f, classic: checked }));
    if (value === "acidic") setFilters((f) => ({ ...f, acidic: checked })); // client-side
  };

  const clearFilters = () =>
    setFilters({ abv: false, classic: false, acidic: false });

  const onSurprise = async () => {
    try {
      const res = await fetch(`${BASE}/beers/random`);
      const data = await res.json();
      const b = Array.isArray(data) ? data[0] : data; // <-- handle object or array

      const mapped = {
        ...b,
        image_url: `${BASE}/images/${String(b.id).padStart(3, "0")}.png`,
      };

      // Put it at the top; avoid duplicate if already present
      setBeerData((prev) => {
        const exists = prev.some((x) => x.id === mapped.id);
        return exists
          ? [mapped, ...prev.filter((x) => x.id !== mapped.id)]
          : [mapped, ...prev];
      });
    } catch (e) {
      console.error(e);
    }
  };

  // pager
  const loadMore = () => {
    if (!loading && hasMore) setPage((p) => p + 1);
  };

  return (
    <div className="App">
      <Navbar
        searchForBeer={searchForBeer}
        filterBeers={filterBeers}
        clearFilters={clearFilters}
        filters={filters}
        currentCount={beerData.length}
        totalCount={415}
        onSurprise={onSurprise}
      />

      <CardList
        beerData={beerData}
        searchResults={[]}
        hasMore={hasMore}
        loading={loading}
        loadMore={loadMore}
      />
    </div>
  );
};

export default App;
