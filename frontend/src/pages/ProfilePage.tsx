/**
 * ProfilePage.tsx — User Profile Page (ALL REAL DATA)
 * 
 * Fetches everything from backend API — NO demo/placeholder data.
 * Shows real user info from Clerk + MongoDB profile.
 * 
 * Sections:
 * 1. Hero Banner — Real avatar, real name, real bio from MongoDB
 * 2. Stats Grid — Real stats from user.stats (MongoDB)
 * 3. Activity Graph — Real activity data from user.toolHistory
 * 4. Badge Collection — Real badges computed from user.stats
 * 5. Quick Links
 */

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  MapPin, Calendar, Mail, Edit3, ExternalLink,
  CheckCircle, Star, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Link } from "react-router-dom";
import ProfileStats from "@/components/profile/ProfileStats";
import ActivityGraph from "@/components/profile/ActivityGraph";
import BadgeCollection from "@/components/profile/BadgeCollection";

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, stats, isLoading } = useUserProfile();
  const heroRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animations
  useEffect(() => {
    if (!heroRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".profile-avatar",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
      );
      gsap.fromTo(".profile-info",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(".profile-section",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.6, ease: "power2.out" }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [isLoading]);

  // Build activity graph data from real toolHistory
  const activityData = useMemo(() => {
    if (!profile?.toolHistory || profile.toolHistory.length === 0) return undefined;
    const data: Record<string, number> = {};
    for (const entry of profile.toolHistory) {
      if (entry.usedAt) {
        const dateKey = new Date(entry.usedAt).toISOString().split("T")[0];
        data[dateKey] = (data[dateKey] || 0) + 1;
      }
    }
    return Object.keys(data).length > 0 ? data : undefined;
  }, [profile?.toolHistory]);

  // Real user data from MongoDB profile (fallback to Clerk data)
  const displayName = profile?.firstName
    ? `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`
    : user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const username = profile?.username || user?.email?.split("@")[0] || "user";
  const email = profile?.email || user?.email || "";
  const bio = profile?.bio || "";
  const avatarUrl = profile?.avatar || "";
  const location = profile?.location;
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";
  const level = profile?.stats?.level || 1;

  // Real stats from MongoDB
  const realStats = {
    toolsUsed: stats?.toolsUsed ?? profile?.stats?.toolsUsed ?? 0,
    pdfProcessed: stats?.pdfProcessed ?? profile?.stats?.pdfProcessed ?? 0,
    newsRead: stats?.newsRead ?? profile?.stats?.newsRead ?? 0,
    examsTracked: stats?.examsTracked ?? profile?.stats?.examsTracked ?? 0,
    loginStreak: stats?.loginStreak ?? profile?.stats?.loginStreak ?? 0,
    points: stats?.points ?? profile?.stats?.points ?? 0,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={heroRef} className="max-w-5xl mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      {/* ══════ SECTION 1: Hero Banner ══════ */}
      <div className="relative mb-10 overflow-hidden rounded-2xl">
        {/* Cover Image or Gradient Background */}
        <div className="h-44 lg:h-56 relative overflow-hidden rounded-t-2xl">
          {profile?.coverImage ? (
            <img src={profile.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-violet-600/20 to-purple-600/30" />
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, hsl(217 100% 55% / 0.3), transparent 50%),
                  radial-gradient(circle at 80% 50%, hsl(260 100% 65% / 0.2), transparent 50%),
                  radial-gradient(circle at 50% 100%, hsl(330 100% 60% / 0.15), transparent 50%)
                `,
              }} />
            </>
          )}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }} />
          <button className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-black/50 transition-all">
            <Edit3 size={12} /> Edit Cover
          </button>
        </div>

        {/* Profile card */}
        <div className="relative -mt-16 px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar with glow ring */}
            <div className="profile-avatar relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 opacity-60 blur-sm"
                style={{ animation: "spin 8s linear infinite" }} />
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="relative h-28 w-28 rounded-full border-4 border-[hsl(225,50%,5%)] object-cover shadow-xl shadow-blue-500/20" />
              ) : (
                <div className="relative h-28 w-28 rounded-full border-4 border-[hsl(225,50%,5%)] bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <span className="text-3xl font-bold text-white">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              {profile?.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 border-2 border-[hsl(225,50%,5%)] shadow-lg"
                >
                  <CheckCircle size={14} className="text-white" />
                </motion.div>
              )}
            </div>

            {/* User info */}
            <div className="profile-info flex-1 min-w-0 pt-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-medium text-blue-400 uppercase tracking-wider">
                  <Star size={10} className="fill-blue-400" /> Level {level}
                </span>
              </div>
              <p className="text-sm text-white/40 mt-1">@{username}</p>
              {bio && <p className="text-sm text-white/50 mt-2 max-w-md">{bio}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/35">
                {location?.city && location?.state && (
                  <span className="flex items-center gap-1"><MapPin size={12} /> {location.city}, {location.state}</span>
                )}
                {joinDate && <span className="flex items-center gap-1"><Calendar size={12} /> Joined {joinDate}</span>}
                {email && <span className="flex items-center gap-1"><Mail size={12} /> {email}</span>}
              </div>
            </div>

            {/* Edit profile button */}
            <Link
              to="/settings"
              className="shrink-0 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-all mt-2 sm:mt-0"
            >
              <Edit3 size={14} /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ══════ SECTION 2: Stats Grid (REAL data) ══════ */}
      <div className="profile-section mb-10">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
          Your Stats
        </h2>
        <ProfileStats stats={realStats} />
      </div>

      {/* ══════ SECTION 3: Activity Graph (REAL data from toolHistory) ══════ */}
      <div className="profile-section mb-10">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-green-500" />
            Activity
          </h2>
          <p className="text-xs text-white/30 mb-5">Your activity over the past year</p>
          <ActivityGraph data={activityData} />
        </div>
      </div>

      {/* ══════ SECTION 4: Badge Collection (computed from REAL stats) ══════ */}
      <div className="profile-section mb-10">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:p-6">
          <BadgeCollection stats={realStats} badges={profile?.stats?.badges || []} />
        </div>
      </div>

      {/* ══════ SECTION 5: Quick Links ══════ */}
      <div className="profile-section grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { label: "View Saved Items", href: "/saved", icon: "⭐", desc: "Your bookmarks & saved results" },
          { label: "Exam Tracker", href: "/tracker", icon: "🎓", desc: "Track your exam applications" },
          { label: "Tool History", href: "/tools/history", icon: "🛠️", desc: "Your PDF tool usage log" },
          { label: "Account Settings", href: "/settings", icon: "⚙️", desc: "Preferences & security" },
        ].map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
          >
            <span className="text-2xl">{link.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{link.label}</p>
              <p className="text-xs text-white/30">{link.desc}</p>
            </div>
            <ExternalLink size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProfilePage;
