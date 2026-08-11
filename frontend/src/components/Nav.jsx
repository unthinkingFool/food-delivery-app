import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
function Nav() {
  const { userData } = useSelector((state) => state.user);
  const [showinfo, setshowinfo] = useState(false);
  return (
    <div>
      <h1>KhaiDai</h1>
      <div>
        <div>
          location: <div>khulna</div>
        </div>

        <div>
          <p>Search</p>
          <input type="text" placeholder="search food here" />
        </div>
      </div>
      <div>
        <p>cart</p>
        <span>0</span>
      </div>
      <button>My Orders</button>
      <div onClick={() => setshowinfo((prev) => !prev)}>
        {userData.name.slice(0, 1)}
      </div>

      {showinfo && (
        <div>
          {/** pop up options */}
          <div>{userData.name}</div>
          {/** for small devices , my order will be in thrid pop up */}
          <div>Log out</div>
        </div>
      )}
    </div>
  );
}

export default Nav;
