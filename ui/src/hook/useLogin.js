import Link from '@mui/material/Link';
import {useDispatch} from "react-redux";
import {v1 as uuidv1} from 'uuid';
import {resetUser, setAuthState as setGlobalAuthState} from "../redux/Slice/slice";
import {useMemo, useCallback} from "react";

/*
A link like button for login.
When user clicks on the link:
1. assign a uuid to the authState
2. redirect to cognito login page with the authState to against CSRF attack
*/
export default function useLogin() {
    const dispatch = useDispatch()
    const redirectToLogin = useCallback(async () => {
        const authState = uuidv1();
        // const loginLink = `https://gotcha-dev.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=487i4k0674hh71nbmm4ecqfoau&redirect_uri=http://localhost:3000/auth&state=${authState}`
        const loginLink = `https://gotcha-dev.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=487i4k0674hh71nbmm4ecqfoau&redirect_uri=https://gotcha-dev.ga/auth&state=${authState}`
        dispatch(resetUser());
        await dispatch(setGlobalAuthState(authState))
        window.location.href = loginLink
    },[dispatch])

    const LoginLink = useMemo(() => {
        return () => (
            <Link color="inherit"
                  component="button"
                  onClick={redirectToLogin}>
                Login
            </Link>
        )
        //note that we list the dependencies here -- any time these change useMemo will
        //rerun and create a new component type resulting in a tear down and re-render
        //of <Modal> and its children
    }, [redirectToLogin])


    return {redirectToLogin, LoginLink}
}