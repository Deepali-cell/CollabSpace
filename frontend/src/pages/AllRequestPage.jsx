import AllRequests from "@/components/AllRequests";
import Loader from "@/components/Loader";
import { StateContext } from "@/context/stateContext";
import React, { useContext, useEffect } from "react";

const AllRequestPage = () => {
  const { user, userRequests, requests, accessToken, loading } =
    useContext(StateContext);

  useEffect(() => {
    if (user && accessToken) {
      userRequests();
    }
  }, [user, accessToken]);

  if (loading) return <Loader title={"fetching your requests..."} />;

  if (requests && requests.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-700">No Requests Found</p>
        <p className="text-gray-500 mt-2">
          You don’t have any pending requests.
        </p>
      </div>
    );
  }

  return <AllRequests requests={requests} user={user} refetch={userRequests} />;
};

export default AllRequestPage;
