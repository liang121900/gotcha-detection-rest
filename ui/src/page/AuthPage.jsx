import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {json, useNavigate} from 'react-router-dom';
import useQuery from "../hook/useQuery";
import {setUser} from "../redux/Slice/slice";

export default function AuthPage() {
    const query = useQuery();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const authCode = query.get("code")
    const authState = query.get("state")


    const populateUserData = useCallback(async (authCode) => {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', '487i4k0674hh71nbmm4ecqfoau');
        params.append('code', authCode);
        // params.append('redirect_uri', `http://localhost:3000/auth`)
        params.append('redirect_uri', `https://gotcha-dev.ga/auth`)
        

        const response = await axios.post('https://gotcha-dev.auth.us-east-1.amazoncognito.com/oauth2/token', params);
        const {id_token: idToken, access_token: accessToken, refresh_token: refreshToken} = response.data;

        const userResponse = await axios.get('https://gotcha-dev.auth.us-east-1.amazoncognito.com/oauth2/userInfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const {email_verified: emailVerified, email, username} = userResponse.data;
        // update the user on store 
        dispatch(setUser({
            username,
            email,
            emailVerified,
            isAuthenticated: true,
            auth: {
                idToken,
                accessToken,
                refreshToken,
            }
        }))

    }, [dispatch])

    /*
     * If authCode is not blank and authState matches, get the token, use the token to get user data, and then store them to redux store 
     * 
     */
    useEffect(() => {
        /*
        console.log(authCode)
        console.log(authState)
        console.log(user?.auth?.authState)
        */
        if (authCode && authState === (user?.auth?.authState || null)) {
            populateUserData(authCode)
                .then(() => navigate("/"))
        } else {
            throw new Error("Invalid auth code or auth state")
        }
    }, [])


    return (
        <Box sx={{display: 'flex'}}>
            <CircularProgress/>
        </Box>
    );

}