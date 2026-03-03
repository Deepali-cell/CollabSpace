import { stateContext } from "@/context/stateContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "sonner";

const AllUsers = ({ allUsers, loadUsers }) => {
  const { backend_url, accessToken } = useContext(stateContext);
  const [actionLoading, setActionLoading] = useState({});
  const sendTeamRequest = async (receiverId) => {
    setActionLoading((prev) => ({ ...prev, [receiverId]: true }));

    try {
      const { data } = await axios.post(
        `${backend_url}/api/v1/team/sendrequest`,
        { receiverId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message || "Team request sent successfully!");
        await loadUsers(); // refresh the list
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setActionLoading((prev) => ({ ...prev, [receiverId]: false }));
    }
  };
  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-10 tracking-tight">All Users</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allUsers.map((u) => {
          let buttonText = "Send Team Request";
          let buttonDisabled = false;

          if (u.iSentRequestToUser) {
            if (u.myRequestStatus === "pending") {
              buttonText = "Request Sent (Pending)";
              buttonDisabled = true;
            } else if (u.myRequestStatus === "accepted") {
              buttonText = "Request Accepted";
              buttonDisabled = true;
            } else if (u.myRequestStatus === "rejected") {
              buttonText = "Request Rejected";
              buttonDisabled = true;
            }
          } else if (u.userSentRequestToMe) {
            if (u.userRequestStatus === "pending") {
              buttonText = "Request Received";
              buttonDisabled = true;
            } else if (u.userRequestStatus === "accepted") {
              buttonText = "Already in Team";
              buttonDisabled = true;
            }
          }

          const isProcessing = actionLoading[u.id] || false;

          return (
            <div
              key={u.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{u.name}</h2>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>

              <button
                onClick={() => sendTeamRequest(u.id)}
                disabled={buttonDisabled || isProcessing}
                className={`w-full py-2.5 rounded-xl font-medium transition ${
                  buttonDisabled || isProcessing
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isProcessing ? "Sending..." : buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllUsers;
