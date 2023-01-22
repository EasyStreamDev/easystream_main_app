import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth, auth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
          axios.delete("/auth/logout", {
            refreshToken: auth?.refreshToken,
          });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout
