import TourInfo from "@/components/TourInfo";
import { getTourById } from "@/utils/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

async function SingleTourPage({ params }) {
  // console.log("[page.jsx] SingleTourPage: ", params.id);
  const tour = await getTourById(params.id);
  if (!tour) {
    redirect("/tours");
  }
  return (
    // <h2>Single Page Tour info</h2>
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        back to tours
      </Link>
      <TourInfo tour={tour} />
    </div>
  );
}
export default SingleTourPage;
