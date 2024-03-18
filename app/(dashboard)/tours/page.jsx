import ToursPage from "@/components/ToursPage";
import { getAllTours } from "@/utils/actions";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

async function AllToursPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tours", ""],
    queryFn: () => getAllTours(),
  }); // Assuming fetchTours is the function to fetch tours data
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ToursPage />
    </HydrationBoundary>
  );
}

export default AllToursPage;
