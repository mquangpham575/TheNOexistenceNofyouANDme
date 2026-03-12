import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "#context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/main-menu/bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/75" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm px-8 py-10 border-2 border-white bg-black/60"
      >
        <h1 className="font-title text-5xl text-white text-center mb-8 tracking-widest">
          SIGN IN
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-white text-sm font-bold tracking-widest uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black/50 border border-white text-white px-3 py-2 text-sm outline-none focus:border-[#FF959E] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white text-sm font-bold tracking-widest uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black/50 border border-white text-white px-3 py-2 text-sm outline-none focus:border-[#FF959E] transition-colors"
            />
          </div>

          {error && (
            <p className="text-[#FF959E] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 border-2 border-white text-white font-title text-2xl tracking-widest py-2 hover:text-[#FF959E] hover:border-[#FF959E] transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "ENTER"}
          </button>
        </form>

        <p className="mt-6 text-center text-white/60 text-sm">
          No account?{" "}
          <Link to="/register" className="text-[#FF959E] hover:underline">
            Register
          </Link>
        </p>

        <p className="mt-2 text-center text-white/40 text-sm">
          <Link to="/" className="hover:text-white/60 transition-colors">
            ← Back to menu
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
