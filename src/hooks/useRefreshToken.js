import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const { auth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/auth/refresh', {
            refreshToken: auth?.refreshToken,
            // withcredentials: true
        });
        setAuth(prev => {
            return { ...prev, accessToken: response.data }
        });
        return response.data;
    }
    return refresh;
};

export default useRefreshToken;
