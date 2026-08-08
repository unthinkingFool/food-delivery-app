import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setUser } from "../redux/user.slice.js";

/* ------------------------------------------------------------------ */
/* Palette (rickshaw-art inspired — deep navy/teal, hot pink, mustard) */
/* Matches Register.jsx so both auth screens share one identity.       */
/* ------------------------------------------------------------------ */
const INK = "#17213A";
const NAVY = "#14213D";
const CREAM = "#FFF6E4";
const PINK = "#E63182";
const MUSTARD = "#F4B740";

/* ------------------------------------------------------------------ */
/* Small flat-style icons (replace the emoji, same three roles)        */
/* ------------------------------------------------------------------ */
const BurgerIcon = ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none">
        <path d="M8 20c0-8 7.2-13 16-13s16 5 16 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="7" y="21" width="34" height="6" rx="3" fill="currentColor" opacity="0.85" />
        <rect x="6" y="29" width="36" height="5" rx="2.5" fill="currentColor" opacity="0.55" />
        <rect x="7" y="36" width="34" height="6" rx="3" fill="currentColor" />
    </svg>
);

const CloveIcon = ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none">
        <path d="M6 30c0-11 8-17 18-17s18 6 18 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="4" y="30" width="40" height="5" rx="2.5" fill="currentColor" />
        <circle cx="24" cy="9" r="2.6" fill="currentColor" />
        <rect x="14" y="38" width="20" height="4" rx="2" fill="currentColor" opacity="0.6" />
    </svg>
);

const ScooterIcon = ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none">
        <circle cx="12" cy="36" r="5" stroke="currentColor" strokeWidth="3" />
        <circle cx="37" cy="36" r="5" stroke="currentColor" strokeWidth="3" />
        <path
            d="M12 36h9l4-13h9m-9 13 5-13h6m-1 0h5.5a3.5 3.5 0 0 1 3.5 3.5V36"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M8 15h6l3 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const ChiliIcon = ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none">
        <path
            d="M9 12c6-4 9 1 9 6 0 9-7 13-7 21a6 6 0 0 0 11 3.4C29 33 34 27 34 19c0-5-3-9-3-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M9 12c-1-3-1-6 2-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

/* ------------------------------------------------------------------ */
/* Decorative scalloped divider between the two panels                 */
/* ------------------------------------------------------------------ */
const ScallopEdge = () => (
    <svg
        className="pointer-events-none absolute right-[-1px] top-0 hidden h-full w-7 lg:block"
        viewBox="0 0 28 28"
        preserveAspectRatio="none"
    >
        <defs>
            <pattern id="kd-scallop-login" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="28" r="14" fill={CREAM} />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kd-scallop-login)" />
    </svg>
);

/* ------------------------------------------------------------------ */
/* Signature element: rotating flower medallion + floating food icons  */
/* ------------------------------------------------------------------ */
const Medallion = () => (
    <div className="relative mx-auto h-44 w-44 sm:h-52 sm:w-52">
        <div className="kd-spin absolute inset-0">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <div
                    key={deg}
                    className="absolute left-1/2 top-1/2 h-[46%] w-[18%] origin-bottom rounded-full opacity-90"
                    style={{
                        transform: `translate(-50%, -100%) rotate(${deg}deg)`,
                        backgroundColor: i % 2 === 0 ? MUSTARD : PINK,
                    }}
                />
            ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div
                className="flex h-20 w-20 items-center justify-center rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:h-24 sm:w-24"
                style={{ backgroundColor: CREAM }}
            >
                <span className="font-['Baloo_2'] text-2xl font-extrabold sm:text-3xl" style={{ color: NAVY }}>
                    KD
                </span>
            </div>
        </div>
    </div>
);

const FloatIcon = ({ className, delay = "0s", children }) => (
    <div className={`kd-float absolute ${className}`} style={{ animationDelay: delay }}>
        {children}
    </div>
);

/* ------------------------------------------------------------------ */

const Login = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState("customer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();

    // Load display + body typefaces once on mount.
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    const roles = [
        {
            value: "customer",
            label: "Customer",
            description: "Order delicious food",
            Icon: BurgerIcon,
        },
        {
            value: "restaurant",
            label: "Restaurant",
            description: "Manage your restaurant",
            Icon: CloveIcon,
        },
        {
            value: "rider",
            label: "Rider",
            description: "Deliver food",
            Icon: ScooterIcon,
        },
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        
       

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/auth/login/${role}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            dispatch(setUser(data.user));

            // // Redirect according to role
            // if (role === "customer") {
            //     navigate("/customer");
            // }

            // if (role === "restaurant") {
            //     navigate("/restaurant");
            // }

            // if (role === "rider") {
            //     navigate("/rider");
            // }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen font-['Work_Sans'] lg:flex"
            style={{ backgroundColor: CREAM }}
        >
            {/* Inline keyframes / motion-safety */}
            <style>{`
                @keyframes kd-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes kd-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
                .kd-spin { animation: kd-spin 42s linear infinite; }
                .kd-float { animation: kd-float 4.5s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .kd-spin, .kd-float { animation: none !important; }
                }
            `}</style>

            {/* ---------------------------------------------------------- */}
            {/* LEFT — brand panel                                         */}
            {/* ---------------------------------------------------------- */}
            <aside
                className="relative flex flex-col justify-between overflow-hidden px-8 py-10 sm:px-12 sm:py-12 lg:w-[42%] lg:min-h-screen lg:py-16 xl:w-[38%]"
                style={{
                    background: `radial-gradient(120% 140% at 15% 0%, #0F5257 0%, ${NAVY} 45%, #0B1730 100%)`,
                    color: CREAM,
                }}
            >
                <ScallopEdge />

                {/* faint dotted texture, rickshaw-signage nod */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(255,246,228,0.9) 1px, transparent 1.5px)",
                        backgroundSize: "18px 18px",
                    }}
                />

                {/* wordmark */}
                <div className="relative z-10">
                    <h1 className="font-['Baloo_2'] text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Khai<span style={{ color: MUSTARD }}>Dai</span>
                    </h1>
                    <p className="mt-2 max-w-xs text-sm text-white/70 sm:text-base">
                        Your food. Your way.
                    </p>
                </div>

                {/* medallion + floating icons */}
                <div className="relative z-10 my-10 flex flex-1 items-center justify-center lg:my-0">
                    <div className="relative">
                        <Medallion />
                        <FloatIcon className="-left-10 -top-6 text-[#F4B740]" delay="0s">
                            <ChiliIcon className="h-8 w-8" />
                        </FloatIcon>
                        <FloatIcon className="-right-8 top-4 text-[#E63182]" delay="1.1s">
                            <BurgerIcon className="h-9 w-9" />
                        </FloatIcon>
                        <FloatIcon className="-bottom-6 -left-6 text-[#F4B740]" delay="2s">
                            <CloveIcon className="h-8 w-8" />
                        </FloatIcon>
                        <FloatIcon className="-bottom-8 right-0 text-white/90" delay="0.6s">
                            <ScooterIcon className="h-9 w-9" />
                        </FloatIcon>
                    </div>
                </div>

                {/* footer note */}
                <p className="relative z-10 text-xs text-white/60 sm:text-sm">
                    Customers, restaurants and riders — all part of the same table.
                </p>
            </aside>

            {/* ---------------------------------------------------------- */}
            {/* RIGHT — form panel                                         */}
            {/* ---------------------------------------------------------- */}
            <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:py-16">
                <div className="w-full max-w-md">
                    <p
                        className="font-['Baloo_2'] text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: PINK }}
                    >
                        Welcome back
                    </p>
                    <h2 className="mt-2 font-['Baloo_2'] text-3xl font-extrabold" style={{ color: INK }}>
                        Log in to KhaiDai
                    </h2>
                    <p className="mt-1 mb-8 text-sm text-[#6B5B45]">
                        Select your account type to continue
                    </p>

                    {/* ROLE SELECTION */}
                    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {roles.map(({ value, label, description, Icon }) => {
                            const active = role === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRole(value)}
                                    aria-pressed={active}
                                    className="group flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all duration-200 focus:outline-none focus-visible:ring-4"
                                    style={{
                                        borderColor: active ? PINK : "#EADFC8",
                                        backgroundColor: active ? "#FDEBF3" : "#FFFDF8",
                                        boxShadow: active ? "0 6px 18px rgba(230,49,130,0.15)" : "none",
                                    }}
                                >
                                    <Icon
                                        className="h-8 w-8 transition-colors"
                                        style={{ color: active ? PINK : NAVY }}
                                    />
                                    <span
                                        className="font-['Baloo_2'] text-sm font-bold"
                                        style={{ color: active ? PINK : INK }}
                                    >
                                        {label}
                                    </span>
                                    <span className="text-[11px] leading-snug text-[#6B5B45]">
                                        {description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B5B45]">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-2xl border-2 border-[#EADFC8] bg-white px-4 py-3 text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6B5B45]">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-2xl border-2 border-[#EADFC8] bg-white px-4 py-3 text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                            />
                        </div>
                        {/* forget password */}
                        <div onClick={()=>navigate("/forget-password")}>
                            Forget Password
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="rounded-xl border px-4 py-3 text-sm"
                                style={{ backgroundColor: "#FDEDE9", borderColor: "rgba(232,67,43,0.4)", color: "#B93A22" }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full py-3.5 font-['Baloo_2'] font-bold tracking-wide shadow-[0_10px_24px_rgba(20,33,61,0.18)] transition-colors duration-300 disabled:opacity-50"
                            style={{
                                backgroundColor: loading ? "#F4B74099" : MUSTARD,
                                color: NAVY,
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = PINK;
                                    e.currentTarget.style.color = CREAM;
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = loading ? "#F4B74099" : MUSTARD;
                                e.currentTarget.style.color = NAVY;
                            }}
                        >
                            {loading
                                ? "Logging in..."
                                : `Login as ${roles.find((item) => item.value === role)?.label}`}
                        </button>
                    </form>

                    {/* Register */}
                    <div className="mt-7 text-center">
                        <p className="text-sm text-[#6B5B45]">Don't have an account?</p>
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="mt-2 font-semibold"
                            style={{ color: PINK }}
                        >
                            Create an account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;