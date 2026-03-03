import axios from "axios";
import { useContext } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { StateContext } from "@/context/stateContext";

const AllRequests = ({ requests = [], user, refetch }) => {
  const { backend_url, accessToken } = useContext(StateContext);
  const navigate = useNavigate();

  const receivedRequests = requests.filter(
    (req) => req.receiver?.id === user.id,
  );

  const sentRequests = requests.filter((req) => req.sender?.id === user.id);

  const handleAction = async (requestId, actionType) => {
    try {
      const endpoint =
        actionType === "accept" ? "acceptrequest" : "declinerequest";

      const { data } = await axios.post(
        `${backend_url}/api/v1/team/${endpoint}`,
        { requestId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (data.success) {
        toast.success(data.message);
        await refetch();
        if (actionType === "accept") navigate("/allteams");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || `Error ${actionType}ing request`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-4xl font-bold mb-12 text-center tracking-tight">
        Team Requests
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ================= RECEIVED ================= */}
        <div className="bg-black text-white rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Received Requests</h2>
            <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
              {receivedRequests.length}
            </span>
          </div>

          {receivedRequests.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No incoming requests
            </div>
          ) : (
            <div className="space-y-4">
              {receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white text-black p-5 rounded-xl hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold">{req.sender.name}</h3>
                  <p className="text-sm text-gray-600">{req.sender.email}</p>

                  <div className="mt-3 flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${
                        req.status === "pending"
                          ? "text-yellow-600"
                          : req.status === "accepted"
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {req.status.toUpperCase()}
                    </span>

                    {req.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req.id, "accept")}
                          className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => handleAction(req.id, "decline")}
                          className="px-4 py-1.5 border border-black rounded-lg hover:bg-gray-100 transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= SENT ================= */}
        <div className="bg-gray-100 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Sent Requests</h2>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
              {sentRequests.length}
            </span>
          </div>

          {sentRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No outgoing requests
            </div>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-xl hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold">{req.receiver.name}</h3>
                  <p className="text-sm text-gray-600">{req.receiver.email}</p>

                  <p
                    className={`mt-3 text-sm font-medium ${
                      req.status === "pending"
                        ? "text-yellow-600"
                        : req.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRequests;
