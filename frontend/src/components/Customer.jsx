import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearUser } from "../redux/user.slice.js";

/* ============================================================
   PALETTE
============================================================ */

const INK = "#17213A";
const NAVY = "#14213D";
const CREAM = "#FFF6E4";
const PAGE_BG = "#FFFBF2";
const PINK = "#E63182";
const MUSTARD = "#F4B740";
const LINE = "#EADFC8";
const MUTED = "#6B5B45";
const FAINT = "#9A8B70";

/* ============================================================
   PLACEHOLDER DATA
   Replace with API data later.
============================================================ */

const CATEGORIES = [
  "All",
  "Biryani",
  "Fast Food",
  "Bangladeshi",
  "Pizza",
  "Desserts",
  "Drinks",
];

/* ============================================================
   ICONS
============================================================ */

const PinIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const ChevronDownIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SearchIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const BagIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8h12l1 13H5L6 8Z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
);

const StarIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />
  </svg>
);

const ClockIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const CloveIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2c3 3 6 6 6 10a6 6 0 1 1-12 0c0-4 3-7 6-10Z" />
  </svg>
);

const ChiliIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 14c6 2 11-1 14-7 2 7-2 13-9 13-3 0-5-2-5-6Z" />
    <path d="M17 7c1-2 2-3 4-4" />
  </svg>
);

const ScooterIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M8 18h6l2-7h-4l-2-4H7" />
    <path d="M16 11h3l2 4" />
  </svg>
);

/* ============================================================
   LOGO
============================================================ */

const LogoMark = () => (
  <span
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-['Baloo_2'] text-sm font-extrabold text-white shadow-sm"
    style={{
      background: "linear-gradient(135deg, #14213D, #0F5257)",
    }}
  >
    KD
  </span>
);

/* ============================================================
   CUSTOMER DASHBOARD
============================================================ */

const Customer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ========================================================
       REDUX
    ======================================================== */

  const { user } = useSelector((state) => state.user);

  /* ========================================================
       USER INFORMATION
    ======================================================== */

  const userName = user?.name || "Customer";

  const firstName = userName.trim().split(" ")[0] || "there";

  const initials = userName.trim().charAt(0).toUpperCase() || "U";

  /* ========================================================
       LOCAL STATE
       
       IMPORTANT:
       This location is NOT a delivery address.
       It is used to SEARCH/FILTER restaurants.
    ======================================================== */

  const [searchLocation, setSearchLocation] = useState(LOCATIONS[0]);

  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [cartCount] = useState(2);

  /* ========================================================
       REFS
    ======================================================== */

  const locationRef = useRef(null);
  const profileRef = useRef(null);

  /* ========================================================
       LOAD FONTS
    ======================================================== */

  useEffect(() => {
    const link = document.createElement("link");

    link.rel = "stylesheet";

    link.href =
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap";

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  /* ========================================================
       CLOSE DROPDOWNS
    ======================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ========================================================
       FILTER RESTAURANTS

       First filter by LOCATION,
       then by SEARCH,
       then by CATEGORY.
    ======================================================== */

  const filteredRestaurants = RESTAURANTS.filter((restaurant) => {
    const matchesLocation = restaurant.location === searchLocation;

    const haystack = `${restaurant.name} ${restaurant.cuisine}`.toLowerCase();

    const matchesSearch = haystack.includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      restaurant.cuisine.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesLocation && matchesSearch && matchesCategory;
  });

  /* ========================================================
       LOGOUT
    ======================================================== */

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout request failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(clearUser());

      navigate("/login", {
        replace: true,
      });
    }
  };

  /* ========================================================
       SEARCH INPUT
    ======================================================== */

  const SearchInput = ({ className }) => (
    <div className={`relative ${className}`}>
      <SearchIcon
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{
          color: FAINT,
        }}
      />

      <input
        type="text"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search restaurants, cuisines, or dishes"
        className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-4"
        style={{
          borderColor: LINE,
          backgroundColor: PAGE_BG,
          color: INK,
        }}
      />
    </div>
  );

  /* ========================================================
       RENDER
    ======================================================== */

  return (
    <div
      className="min-h-screen font-['Work_Sans']"
      style={{
        backgroundColor: PAGE_BG,
      }}
    >
      {/* =================================================
                NAVBAR
            ================================================= */}

      <header
        className="sticky top-0 z-30 border-b bg-white"
        style={{
          borderColor: LINE,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-5 lg:px-8">
          {/* LOGO */}

          <button
            type="button"
            onClick={() => navigate("/customer")}
            className="flex shrink-0 items-center gap-2"
          >
            <LogoMark />

            <span
              className="hidden font-['Baloo_2'] text-lg font-extrabold sm:inline"
              style={{
                color: INK,
              }}
            >
              Khai
              <span
                style={{
                  color: PINK,
                }}
              >
                Dai
              </span>
            </span>
          </button>

          {/* SEARCH LOCATION */}

          <div className="relative shrink-0" ref={locationRef}>
            <button
              type="button"
              onClick={() => setIsLocationOpen((value) => !value)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-2 transition hover:border-[#E63182]"
              style={{
                borderColor: LINE,
              }}
            >
              <PinIcon
                className="h-4 w-4 shrink-0"
                style={{
                  color: PINK,
                }}
              />

              <span
                className="hidden text-[10px] font-semibold uppercase tracking-wide sm:inline"
                style={{
                  color: FAINT,
                }}
              >
                Search in
              </span>

              <span
                className="max-w-[96px] truncate text-sm font-semibold sm:max-w-[130px]"
                style={{
                  color: INK,
                }}
              >
                {searchLocation}
              </span>

              <ChevronDownIcon
                className="h-3.5 w-3.5 shrink-0 transition-transform"
                style={{
                  color: FAINT,
                  transform: isLocationOpen ? "rotate(180deg)" : "none",
                }}
              />
            </button>

            {isLocationOpen && (
              <div
                className="absolute left-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border bg-white py-1.5 shadow-lg"
                style={{
                  borderColor: LINE,
                }}
              >
                <p
                  className="px-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    color: FAINT,
                  }}
                >
                  Search restaurants in
                </p>

                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSearchLocation(loc);

                      setIsLocationOpen(false);
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#FDEBF3]"
                    style={{
                      color: loc === searchLocation ? PINK : INK,
                      fontWeight: loc === searchLocation ? 700 : 500,
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP SEARCH */}

          <SearchInput className="hidden flex-1 md:block" />

          {/* RIGHT SIDE */}

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {/* ORDERS */}

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="relative flex items-center gap-2 rounded-full border px-3 py-2 transition hover:border-[#E63182]"
              style={{
                borderColor: LINE,
              }}
            >
              <BagIcon
                className="h-5 w-5"
                style={{
                  color: NAVY,
                }}
              />

              <span
                className="hidden text-sm font-semibold sm:inline"
                style={{
                  color: INK,
                }}
              >
                My Orders
              </span>

              {cartCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{
                    backgroundColor: PINK,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* PROFILE */}

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-full font-['Baloo_2'] text-base font-bold text-white shadow-sm transition hover:opacity-90"
                style={{
                  backgroundColor: NAVY,
                }}
              >
                {initials}
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-2xl border bg-white py-1.5 shadow-lg"
                  style={{
                    borderColor: LINE,
                  }}
                >
                  <div className="px-4 py-2">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{
                        color: FAINT,
                      }}
                    >
                      Signed in as
                    </p>

                    <p
                      className="truncate text-sm font-semibold"
                      style={{
                        color: INK,
                      }}
                    >
                      {userName}
                    </p>

                    <p
                      className="mt-0.5 text-xs"
                      style={{
                        color: FAINT,
                      }}
                    >
                      {user?.email}
                    </p>
                  </div>

                  <div
                    className="my-1 h-px"
                    style={{
                      backgroundColor: LINE,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#FDEBF3]"
                    style={{
                      color: INK,
                    }}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#FDEBF3]"
                    style={{
                      color: INK,
                    }}
                  >
                    My Orders
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/addresses")}
                    className="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#FDEBF3]"
                    style={{
                      color: INK,
                    }}
                  >
                    Saved addresses
                  </button>

                  <div
                    className="my-1 h-px"
                    style={{
                      backgroundColor: LINE,
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm font-semibold transition hover:bg-[#FDEDE9]"
                    style={{
                      color: "#B93A22",
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}

        <div
          className="border-t px-4 py-2.5 md:hidden"
          style={{
            borderColor: LINE,
          }}
        >
          <SearchInput className="w-full" />
        </div>
      </header>

      {/* =================================================
                MAIN CONTENT
            ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        {/* HERO */}

        <section
          className="relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10"
          style={{
            background: `radial-gradient(120% 160% at 10% 0%, #0F5257 0%, ${NAVY} 45%, #0B1730 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,246,228,0.9) 1px, transparent 1.5px)",
              backgroundSize: "18px 18px",
            }}
          />

          <ChiliIcon
            className="pointer-events-none absolute -right-2 top-4 h-16 w-16 opacity-20"
            style={{
              color: MUSTARD,
            }}
          />

          <ScooterIcon
            className="pointer-events-none absolute bottom-2 right-16 hidden h-14 w-14 opacity-15 sm:block"
            style={{
              color: CREAM,
            }}
          />

          <p
            className="relative font-['Baloo_2'] text-xs font-bold uppercase tracking-[0.2em]"
            style={{
              color: MUSTARD,
            }}
          >
            Good to see you
          </p>

          <h1
            className="relative mt-2 max-w-md font-['Baloo_2'] text-2xl font-extrabold sm:text-3xl"
            style={{
              color: CREAM,
            }}
          >
            Hungry, {firstName}? Let's find something good in {searchLocation}.
          </h1>

          <p className="relative mt-2 max-w-sm text-sm text-white/70">
            Browse restaurants in your selected area or search for your favorite
            dish above.
          </p>
        </section>

        {/* CATEGORY CHIPS */}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition"
                style={{
                  borderColor: active ? PINK : LINE,
                  backgroundColor: active ? "#FDEBF3" : "#FFFFFF",
                  color: active ? PINK : MUTED,
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* RESTAURANT HEADING */}

        <div className="mt-6 flex items-center justify-between">
          <h2
            className="font-['Baloo_2'] text-lg font-bold"
            style={{
              color: INK,
            }}
          >
            Restaurants in {searchLocation}
          </h2>

          <span
            className="text-xs"
            style={{
              color: FAINT,
            }}
          >
            {filteredRestaurants.length} found
          </span>
        </div>

        {/* RESTAURANTS */}
      </main>
    </div>
  );
};

export default Customer;
