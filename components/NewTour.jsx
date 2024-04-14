"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import TourInfo from "./TourInfo";
import {
  createNewTour,
  generateTourResponse,
  getExistingTour,
  getTokensByUserId,
  reduceTokensByUserId,
} from "@/utils/actions";

function NewTour() {
  // Access mutation state and functions
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);
      if (existingTour) {
        // console.log("Existing tour: ", existingTour);
        return existingTour;
      }
      console.log("NewTour.jsx - No Tour found in database. Generating new tour.");
      const currentTokens = await getTokensByUserId(userId);
      if (currentTokens === null || currentTokens.tokens < 300) {
        toast.error("Not enough tokens to generate a new tour");
        return null;
      }

      const newTour = await generateTourResponse(destination);
      // console.log("New tour: ", newTour);
      await reduceTokensByUserId(userId, newTour.tokens);

      if (newTour.tour) {
        await createNewTour(newTour.tour);
        queryClient.invalidateQueries({ queryKey: "tours" });
        return newTour.tour;
      } else {
        toast.error("No matching city found");
        return null;
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    console.log("Form data: ", destination);

    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className=" mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="city"
            name="city"
            required
          />
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="country"
            name="country"
            required
          />
          <button className="btn btn-primary join-item" type="submit">
            Generate tour
          </button>
        </div>
      </form>
      <div className="mt-16">
        {tour === null && <p>No matching city found</p>}
        {tour && <TourInfo tour={tour} />}
        {/* <TourInfo tour={tour} /> */}
      </div>
    </div>
  );
}
export default NewTour;
