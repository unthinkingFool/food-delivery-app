import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";


function useGetCity() {
  const dispatch = useDispatch();
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(async(position)=>{
        console.log(position)
        const latitude=position.coords.latitude;
        const longitude=position.coords.longitude;
        const apikey=import.meta.env.GEOAPIFY_API_KEY;
        const result=await axios.get(`
            https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`)
    })
    console.log(result)
  },[])
}

export default useGetCity;
