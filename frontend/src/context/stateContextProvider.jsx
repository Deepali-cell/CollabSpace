import axios from "axios";
import { useEffect, useState } from "react";
import { StateContext } from "./stateContext";

const StateContextProvider = ({ children }) => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userBoards, setuserBoards] = useState([]);
  const [userTeamBoards, setuserTeamBoards] = useState([]);
  const [allUsers, setallUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const fetchUserBoards = async () => {
    if (!accessToken) return;

    try {
      const { data } = await axios.get(
        `${backend_url}/api/v1/workspace/userboards`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (data.success) {
        setuserBoards(data.myBoards);
        setuserTeamBoards(data.teamBoards);
      } else {
        console.log(
          data.message || "some error while fetching the user boards",
        );
      }
    } catch (error) {
      console.error("Error fetching user boards:", error);
      throw error;
    }
  };
  const fetchUsers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backend_url}/api/v1/user/allusers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setallUsers(data.allUsers);
      }
    } catch (error) {
      console.log("Failed to load users :", error);
    } finally {
      setLoading(false);
    }
  };
  const userRequests = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${backend_url}/api/v1/team/allrequest`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (data.success) {
        setRequests(data.requests);
      } else {
        console.log("Failed to fetch requests:", data.message);
      }
    } catch (error) {
      console.log("Error fetching user requests:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllTeams = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backend_url}/api/v1/team/alluserteam`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (data.success) setTeams(data.teams);
    } catch (error) {
      console.log("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        `${backend_url}/api/v1/user/userdashboarddata`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      fetchUserBoards();
    } else {
      // logout ya unauthorized case
      setuserBoards([]);
      setuserTeamBoards([]);
    }
  }, [user, accessToken]);
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.post(
          `${backend_url}/api/v1/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        setAccessToken(res.data.accessToken);

        const userRes = await axios.get(`${backend_url}/api/v1/user/profile`, {
          headers: { Authorization: `Bearer ${res.data.accessToken}` },
        });

        setUser(userRes.data.data);
      } catch (err) {
        console.log("error while fething profile :", err);
        setUser(null);
        setAccessToken(null);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          !error.config._retry
        ) {
          error.config._retry = true;

          try {
            // refresh token call using httpOnly cookie
            const refreshRes = await axios.post(
              `${backend_url}/api/v1/user/refresh-token`,
              {},
              { withCredentials: true },
            );

            const newAccessToken = refreshRes.data.accessToken;
            setAccessToken(newAccessToken);

            // retry the original request with new access token
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(error.config);
          } catch (err) {
            // failed to refresh → logout user
            setUser(null);
            setAccessToken(null);
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [backend_url]);

  const value = {
    backend_url,
    user,
    setUser,
    accessToken,
    setAccessToken,
    fetchUsers,
    allUsers,
    setallUsers,
    userRequests,
    requests,
    setRequests,
    loading,
    setLoading,
    fetchAllTeams,
    teams,
    setTeams,
    fetchUserBoards,
    userBoards,
    setuserBoards,
    userTeamBoards,
    setuserTeamBoards,
    fetchDashboard,
    dashboard,
    setDashboard,
  };
  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export default StateContextProvider;
