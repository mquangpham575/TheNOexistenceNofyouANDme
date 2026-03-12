import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "#context/AuthContext";
import { api } from "#lib/api";
import type { Profile } from "#types/auth";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .getProfile()
      .then((p) => {
        setProfile(p);
        setDisplayName(p.displayName);
        setBio(p.bio ?? "");
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const updated = await api.updateProfile({
        displayName,
        bio: bio || null,
      });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
        <h1 className="font-title text-5xl text-white text-center mb-2 tracking-widest">
          PROFILE
        </h1>
        <p className="text-white/40 text-xs text-center mb-8">{user?.email}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-white text-sm font-bold tracking-widest uppercase">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="bg-black/50 border border-white text-white px-3 py-2 text-sm outline-none focus:border-[#FF959E] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white text-sm font-bold tracking-widest uppercase">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="bg-black/50 border border-white text-white px-3 py-2 text-sm outline-none focus:border-[#FF959E] transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-[#FF959E] text-sm text-center">{error}</p>
          )}
          {saved && (
            <p className="text-green-400 text-sm text-center">Saved!</p>
          )}

          <button
            type="submit"
            disabled={loading || !profile}
            className="mt-2 border-2 border-white text-white font-title text-2xl tracking-widest py-2 hover:text-[#FF959E] hover:border-[#FF959E] transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "SAVE"}
          </button>
        </form>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-white/40 text-white/60 text-sm py-2 hover:text-white hover:border-white transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 border border-[#DB404A]/60 text-[#DB404A]/80 text-sm py-2 hover:text-[#DB404A] hover:border-[#DB404A] transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
