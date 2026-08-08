import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    setUser,
    clearUser,
} from "../src/redux/user.slice.js";

const getCurrentUser = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const fetchCurrentUser = async () => {

            try {

                const response = await fetch(
                    "http://localhost:3000/api/user/me",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    dispatch(clearUser());

                    return;
                }

                console.log(
                    "USER FROM BACKEND:",
                    data.user
                );

                console.log(
                    "ABOUT TO DISPATCH"
                );
                console.log(setUser(data.user));

                dispatch(setUser(data.user));

                console.log(
                    "DISPATCHED"
                );

            } catch (error) {

                console.error(
                    "Get current user error:",
                    error
                );

                dispatch(clearUser());

            }

        };

        fetchCurrentUser();

    }, [dispatch]);

};

export default getCurrentUser;