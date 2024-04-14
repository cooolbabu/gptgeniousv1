import Link from "next/link";

function TourCard({ tour }) {
  const { city, title, id, country } = tour;
  console.log("TourCard: ", tour);
  console.log("City: ", city);
  console.log("Title: ", title);
  console.log("ID: ", id);

  return (
    <Link href={`/tours/${id}`} className="card card-compact rounded-xl bg-base-100">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-center">
          {city}, {country}
        </h2>
      </div>
    </Link>
  );
}

export default TourCard;
