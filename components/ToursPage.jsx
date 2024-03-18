"use client";

import React from "react";
import { getAllTours } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import ToursList from "@/components/ToursList";

function ToursPage() {
  const { searchValue, setSearchValue } = useSearch();

  const { data, isPending } = useQuery({
    queryKey: ["tours", searchValue],
    queryFn: () => getAllTours(searchValue),
  });
  return (
    <>
      <div className="join w-full">
        <form className="input input-bordered join-item w-full">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search for a city or country"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
          />
          <button
            className="btn btn-primary"
            type="button"
            disabled={isPending}
            onClick={() => setSearchValue("")}
          >
            {isPending ? "Searching..." : "Clear"}
          </button>
        </form>
      </div>
      {isPending ? (
        <span className="loading loading-lg">Loading</span>
      ) : (
        <ToursList tours={data} />
      )}
    </>
  );
}

export default ToursPage;
