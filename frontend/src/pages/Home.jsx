import React from "react";
import { useSelector } from "react-redux";

import Customer from "../components/Customer";
import Restaurant from "../components/Restaurant";
import Rider from "../components/Rider";

function Home () {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  return (
        <div>
            {user?.role=="customer" && <Customer/>}
            {user?.role=="restaurant" && <Restaurant/>}
            {user?.role=="rider" && <Rider/>}
        </div>
      
   
  );
};

export default Home;
