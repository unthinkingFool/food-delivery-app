import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user.slice.js";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Palette (rickshaw-art inspired — deep navy/teal, hot pink, mustard) */
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
            <pattern id="kd-scallop" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="28" r="14" fill={CREAM} />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kd-scallop)" />
    </svg>
);

/* ------------------------------------------------------------------ */
/* Signature element: rotating flower medallion + floating food icons  */
/* Sized to shrink on short viewports so it never forces page scroll.  */
/* ------------------------------------------------------------------ */
const Medallion = () => (
    <div className="kd-medallion relative mx-auto h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
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
                className="flex h-16 w-16 items-center justify-center rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:h-20 sm:w-20"
                style={{ backgroundColor: CREAM }}
            >
                <span className="font-['Baloo_2'] text-xl font-extrabold sm:text-2xl" style={{ color: NAVY }}>
                    KD
                </span>
            </div>
        </div>
    </div>
);

const FloatIcon = ({ className, delay = "0s", children }) => (
    <div className={`kd-float kd-decor absolute ${className}`} style={{ animationDelay: delay }}>
        {children}
    </div>
);

/* ------------------------------------------------------------------ */

const Register = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState("customer");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone_number: "",
        contact_no: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            description: "Order food from your favorite restaurants",
            Icon: BurgerIcon,
        },
        {
            value: "restaurant",
            label: "Restaurant",
            description: "List your restaurant and sell food",
            Icon: CloveIcon,
        },
        {
            value: "rider",
            label: "Rider",
            description: "Deliver orders and earn money",
            Icon: ScooterIcon,
        },
    ];

    const activeRole = roles.find((item) => item.value === role);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const dispatch=useDispatch()

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/auth/register/${role}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            dispatch(setUser(data.user))

            navigate("/login")

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="h-dvh font-['Work_Sans'] lg:flex lg:h-screen lg:overflow-hidden"
            style={{ backgroundColor: CREAM }}
        >
            {/* Inline keyframes / motion-safety / short-viewport tightening */}
            <style>{`
                @keyframes kd-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes kd-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .kd-spin { animation: kd-spin 42s linear infinite; }
                .kd-float { animation: kd-float 4.5s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .kd-spin, .kd-float { animation: none !important; }
                }
                /* On short viewports, drop the floating icons and shrink the
                   medallion further so the brand panel never dictates page height. */
                @media (max-height: 680px) {
                    .kd-decor { display: none; }
                    .kd-medallion { transform: scale(0.82); }
                }
            `}</style>

            {/* ---------------------------------------------------------- */}
            {/* LEFT — brand panel                                         */}
            {/* ---------------------------------------------------------- */}
            <aside
                className="relative flex flex-col justify-between overflow-hidden px-8 py-6 sm:px-12 sm:py-8 lg:h-screen lg:w-[42%] lg:py-10 xl:w-[38%]"
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
                    <h1 className="font-['Baloo_2'] text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Khai<span style={{ color: MUSTARD }}>Dai</span>
                    </h1>
                    <p className="mt-1.5 max-w-xs text-xs text-white/70 sm:text-sm">
                        One plate, one ride, one order away.
                    </p>
                </div>

                {/* medallion + floating icons */}
                <div className="relative z-10 flex flex-1 items-center justify-center py-4 lg:py-0">
                    <div className="relative">
                        <Medallion />
                        <FloatIcon className="-left-10 -top-6 text-[#F4B740]" delay="0s">
                            <ChiliIcon className="h-7 w-7" />
                        </FloatIcon>
                        <FloatIcon className="-right-8 top-4 text-[#E63182]" delay="1.1s">
                            <BurgerIcon className="h-8 w-8" />
                        </FloatIcon>
                        <FloatIcon className="-bottom-6 -left-6 text-[#F4B740]" delay="2s">
                            <CloveIcon className="h-7 w-7" />
                        </FloatIcon>
                        <FloatIcon className="-bottom-8 right-0 text-white/90" delay="0.6s">
                            <ScooterIcon className="h-8 w-8" />
                        </FloatIcon>
                    </div>
                </div>

                {/* footer note */}
                <p className="relative z-10 text-[11px] text-white/60 sm:text-xs">
                    Customers, restaurants and riders — all part of the same table.
                </p>
            </aside>

            {/* ---------------------------------------------------------- */}
            {/* RIGHT — form panel (scrolls internally only if it must)    */}
            {/* ---------------------------------------------------------- */}
            <main className="flex flex-1 justify-center overflow-y-auto px-6 py-6 sm:px-10 lg:h-screen lg:py-8">
                <div className="my-auto w-full max-w-md">
                    <p
                        className="font-['Baloo_2'] text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
                        style={{ color: PINK }}
                    >
                        Join KhaiDai
                    </p>
                    <h2 className="mt-1 font-['Baloo_2'] text-2xl font-extrabold" style={{ color: INK }}>
                        Create your account
                    </h2>
                    <p className="mt-1 mb-4 text-xs text-[#6B5B45]">
                        Choose how you want to use KhaiDai
                    </p>

                    {/* ROLE SELECTION */}
                    <div className="mb-1.5 grid grid-cols-3 gap-2.5">
                        {roles.map(({ value, label, Icon }) => {
                            const active = role === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRole(value)}
                                    aria-pressed={active}
                                    className="flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-center transition-all duration-200 focus:outline-none focus-visible:ring-4"
                                    style={{
                                        borderColor: active ? PINK : "#EADFC8",
                                        backgroundColor: active ? "#FDEBF3" : "#FFFDF8",
                                        boxShadow: active ? "0 6px 16px rgba(230,49,130,0.15)" : "none",
                                    }}
                                >
                                    <Icon
                                        className="h-6 w-6 transition-colors"
                                        style={{ color: active ? PINK : NAVY }}
                                    />
                                    <span
                                        className="font-['Baloo_2'] text-xs font-bold"
                                        style={{ color: active ? PINK : INK }}
                                    >
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <p className="mb-4 text-center text-[11px] text-[#9A8B70]">
                        {activeRole?.description}
                    </p>

                    {/* FORM */}
                    <form onSubmit={handleRegister} className="space-y-3">
                        {/* Name */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6B5B45]">
                                {role === "restaurant" ? "Restaurant name" : "Full name"}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={
                                    role === "restaurant"
                                        ? "Enter restaurant name"
                                        : "Enter your full name"
                                }
                                required
                                className="w-full rounded-xl border-2 border-[#EADFC8] bg-white px-3.5 py-2.5 text-sm text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6B5B45]">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-xl border-2 border-[#EADFC8] bg-white px-3.5 py-2.5 text-sm text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6B5B45]">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password (min. 6 characters)"
                                required
                                className="w-full rounded-xl border-2 border-[#EADFC8] bg-white px-3.5 py-2.5 text-sm text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                            />
                        </div>

                        {/* CUSTOMER */}
                        {role === "customer" && (
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6B5B45]">
                                    Phone number
                                </label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="01XXXXXXXXX"
                                    required
                                    className="w-full rounded-xl border-2 border-[#EADFC8] bg-white px-3.5 py-2.5 text-sm text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                                />
                            </div>
                        )}

                        {/* RIDER */}
                        {role === "rider" && (
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6B5B45]">
                                    Contact number
                                </label>
                                <input
                                    type="text"
                                    name="contact_no"
                                    value={formData.contact_no}
                                    onChange={handleChange}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full rounded-xl border-2 border-[#EADFC8] bg-white px-3.5 py-2.5 text-sm text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                                />
                            </div>
                        )}

                        {/* RESTAURANT */}
                        {role === "restaurant" && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6B5B45]">
                                        Restaurant address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter restaurant address"
                                        required
                                        rows="2"
                                        className="w-full resize-none rounded-xl border-2 border-[#EADFC8] bg-white px-3.5 py-2.5 text-sm text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#6B5B45]">
                                        Contact number
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_no"
                                        value={formData.contact_no}
                                        onChange={handleChange}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full rounded-xl border-2 border-[#EADFC8] bg-white px-3.5 py-2.5 text-sm text-[#17213A] outline-none transition focus:border-[#E63182] focus:ring-4 focus:ring-[#E63182]/15"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div
                                className="rounded-xl border px-3.5 py-2.5 text-xs"
                                style={{ backgroundColor: "#FDEDE9", borderColor: "rgba(232,67,43,0.4)", color: "#B93A22" }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit + Login, kept tight together */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full py-3 font-['Baloo_2'] text-sm font-bold tracking-wide shadow-[0_10px_24px_rgba(20,33,61,0.18)] transition-colors duration-300 disabled:opacity-50"
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
                                {loading ? "Creating account..." : `Create ${activeRole?.label} account`}
                            </button>

                            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-[#6B5B45]">
                                Already have an account?
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="font-semibold"
                                    style={{ color: PINK }}
                                >
                                    Login instead
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;