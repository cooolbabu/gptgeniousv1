import TourInfo from "@/components/TourInfo";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import React from "react";

function SingleTourPage({ params }) {
  // Your component logic goes here
  const tour = getSingleTour(params.id);

  if (tour === null) {
    redirect("/tours");
  }

  return (
    // JSX code for your component's UI goes here
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        Back to Tours
      </Link>
      <TourInfo tour={tour} />
    </div>
  );
}

export default SingleTourPage;
