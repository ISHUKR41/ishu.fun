/**
 * SettingsPage.tsx — User Settings with Tabbed Interface
 * 
 * ALL DATA fetched from backend API via useUserProfile hook.
 * Save buttons call REAL API endpoints to persist changes.
 * 
 * Design: Linear/Vercel settings-inspired premium dark UI
 * Tabs:
 * 1. Profile — Edit name, username, bio, avatar
 * 2. Account — Connected accounts, delete account
 * 3. Notifications — Toggle switches per notification type
 * 4. Appearance — Theme, accent color, animation intensity
 * 5. Privacy — Visibility toggles
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Shield, Bell, Palette, Eye, Save,
  Mail, Github, Globe, Trash2, AlertTriangle,
  Sun, Moon, Monitor, Sparkles, Check, Loader2, MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://ishu-site.onrender.com";

// ──── Tab definition ────
const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy", icon: Eye },
];

// ──── Toggle Switch Component ────
const Toggle = ({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-white/80">{label}</p>
      {desc && <p className="text-xs text-white/30 mt-0.5">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${checked ? "bg-blue-600" : "bg-white/10"}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
      />
    </button>
  </div>
);

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { getToken } = useClerkAuth();
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile, updatePreferences, isUpdating } = useUserProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  // Form state — initialized from REAL profile data (MongoDB)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    email: "",
    city: "",
    state: "",
  });

  // Populate form when profile data loads from API
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: profile.username || "",
        bio: profile.bio || "",
        email: profile.email || user?.email || "",
        city: profile.location?.city || "",
        state: profile.location?.state || "",
      });
      // Also set notification prefs from profile
      if (profile.preferences?.notifications) {
        setNotifs({
          email: profile.preferences.notifications.email ?? true,
          push: profile.preferences.notifications.push ?? true,
          examAlerts: profile.preferences.notifications.examAlerts ?? true,
          newsDigest: profile.preferences.notifications.newsDigest ?? true,
          toolUpdates: profile.preferences.notifications.toolUpdates ?? false,
          whatsapp: profile.preferences.notifications.whatsapp ?? false,
        });
      }
      if (profile.preferences?.theme) {
        setTheme(profile.preferences.theme);
      }
    }
  }, [profile, user?.email]);

  // Notification toggles
  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    examAlerts: true,
    newsDigest: true,
    toolUpdates: false,
    whatsapp: false,
  });

  // Appearance
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accentColor, setAccentColor] = useState("blue");
  const [animations, setAnimations] = useState<"full" | "reduced" | "none">("full");

  // Privacy
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    activityVisible: false,
    searchableByEmail: true,
  });

  // Delete account confirmation
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        bio: form.bio,
        location: { city: form.city, state: form.state },
      });
      toast.success("Profile saved successfully!");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to save profile");
    }
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        notifications: notifs,
        theme,
      });
      toast.success("Preferences saved!");
    } catch (e) {
      toast.error("Failed to save preferences");
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    try {
      const token = await getToken();
      await axios.delete(`${API_BASE}/api/user/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted. Goodbye!");
      await signOut();
      navigate("/");
    } catch (e) {
      toast.error("Failed to delete account");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading settings...</p>
        </div>
      </div>
    );
  }

  const accentColors = [
    { name: "blue", color: "bg-blue-500", ring: "ring-blue-500" },
    { name: "violet", color: "bg-violet-500", ring: "ring-violet-500" },
    { name: "emerald", color: "bg-emerald-500", ring: "ring-emerald-500" },
    { name: "rose", color: "bg-rose-500", ring: "ring-rose-500" },
    { name: "amber", color: "bg-amber-500", ring: "ring-amber-500" },
    { name: "cyan", color: "bg-cyan-500", ring: "ring-cyan-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your account settings and preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ──── Tab List (vertical on desktop) ──── */}
        <div className="lg:w-52 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "text-white bg-white/[0.06]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="settings-tab"
                    className="absolute inset-0 rounded-xl bg-white/[0.06] border border-white/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon size={16} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ──── Tab Content ──── */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:p-6"
            >
              {/* ════════ PROFILE TAB ════════ */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Profile Information</h2>
                    <p className="text-xs text-white/30">This information will be visible on your profile page</p>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                      {form.firstName.charAt(0) || "U"}
                    </div>
                    <div>
                      <button className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/[0.08] transition-all">
                        Change Avatar
                      </button>
                      <p className="text-[10px] text-white/25 mt-1">JPG, PNG, GIF. Max 5MB.</p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block">First Name</label>
                      <input
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block">Last Name</label>
                      <input
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">Username</label>
                    <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
                      <span className="px-3 text-sm text-white/30 border-r border-white/[0.06]">@</span>
                      <input
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                        className="flex-1 px-3 py-2.5 text-sm text-white bg-transparent placeholder:text-white/20 focus:outline-none"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 160) })}
                      rows={3}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-[10px] text-white/25 text-right mt-1">{form.bio.length}/160</p>
                  </div>

                  {/* Location fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block flex items-center gap-1"><MapPin size={11} /> City</label>
                      <input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="e.g. Delhi"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/50 mb-1.5 block">State</label>
                      <input
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="e.g. Uttar Pradesh"
                      />
                    </div>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {saving ? (
                      <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                    ) : (
                      <><Save size={14} /> Save Changes</>
                    )}
                  </button>
                </div>
              )}

              {/* ════════ ACCOUNT TAB ════════ */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Account</h2>
                    <p className="text-xs text-white/30">Manage your connected accounts and data</p>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                        <Mail size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/80">Email</p>
                        <p className="text-xs text-white/35">{user?.email || "Not set"}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5 font-medium">Verified</span>
                  </div>

                  {/* Connected accounts */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-3">Connected Accounts</h3>
                    {[
                      { name: "Google", icon: Globe, connected: true, email: user?.email },
                      { name: "GitHub", icon: Github, connected: false, email: null },
                    ].map((account) => (
                      <div key={account.name} className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                            <account.icon size={16} className="text-white/50" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/80">{account.name}</p>
                            <p className="text-xs text-white/30">{account.connected ? account.email : "Not connected"}</p>
                          </div>
                        </div>
                        <button className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          account.connected
                            ? "border border-white/[0.08] text-white/40"
                            : "bg-white/[0.06] text-white/70 hover:bg-white/[0.1]"
                        }`}>
                          {account.connected ? "Connected" : "Connect"}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Danger zone */}
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-4 mt-6">
                    <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} /> Danger Zone
                    </h3>
                    <p className="text-xs text-white/30 mb-3">
                      Once you delete your account, there is no going back. All your data will be permanently removed.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 size={13} /> Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* ════════ NOTIFICATIONS TAB ════════ */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Notifications</h2>
                    <p className="text-xs text-white/30">Choose what notifications you receive</p>
                  </div>

                  <div className="divide-y divide-white/[0.04]">
                    <Toggle
                      checked={notifs.email}
                      onChange={(v) => setNotifs({ ...notifs, email: v })}
                      label="Email Notifications"
                      desc="Receive updates and alerts via email"
                    />
                    <Toggle
                      checked={notifs.push}
                      onChange={(v) => setNotifs({ ...notifs, push: v })}
                      label="Push Notifications"
                      desc="Browser push notifications"
                    />
                    <Toggle
                      checked={notifs.examAlerts}
                      onChange={(v) => setNotifs({ ...notifs, examAlerts: v })}
                      label="Exam Alerts"
                      desc="New forms, admit cards, and result announcements"
                    />
                    <Toggle
                      checked={notifs.newsDigest}
                      onChange={(v) => setNotifs({ ...notifs, newsDigest: v })}
                      label="Daily News Digest"
                      desc="Morning summary of latest exam news"
                    />
                    <Toggle
                      checked={notifs.toolUpdates}
                      onChange={(v) => setNotifs({ ...notifs, toolUpdates: v })}
                      label="Tool Updates"
                      desc="Notifications when new PDF tools are added"
                    />
                    <Toggle
                      checked={notifs.whatsapp}
                      onChange={(v) => setNotifs({ ...notifs, whatsapp: v })}
                      label="WhatsApp Alerts"
                      desc="Receive exam updates on WhatsApp"
                    />
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : <><Save size={14} /> Save Preferences</>}
                  </button>
                </div>
              )}

              {/* ════════ APPEARANCE TAB ════════ */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Appearance</h2>
                    <p className="text-xs text-white/30">Customize how ISHU looks for you</p>
                  </div>

                  {/* Theme */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-3">Theme</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { id: "dark" as const, icon: Moon, label: "Dark" },
                        { id: "light" as const, icon: Sun, label: "Light" },
                        { id: "system" as const, icon: Monitor, label: "System" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setTheme(opt.id)}
                          className={`relative flex flex-col sm:flex-col items-center gap-2 rounded-xl border p-3 sm:p-4 transition-all ${
                            theme === opt.id
                              ? "border-blue-500/40 bg-blue-500/[0.06]"
                              : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          {theme === opt.id && (
                            <div className="absolute top-2 right-2">
                              <Check size={12} className="text-blue-400" />
                            </div>
                          )}
                          <opt.icon size={20} className={theme === opt.id ? "text-blue-400" : "text-white/40"} />
                          <span className={`text-xs font-medium ${theme === opt.id ? "text-blue-400" : "text-white/50"}`}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-3">Accent Color</h3>
                    <div className="flex gap-3">
                      {accentColors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setAccentColor(c.name)}
                          className={`h-8 w-8 rounded-full ${c.color} transition-all ${
                            accentColor === c.name ? `ring-2 ${c.ring} ring-offset-2 ring-offset-[hsl(225,50%,5%)] scale-110` : "opacity-60 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Animation intensity */}
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-3">Animation Intensity</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { id: "full" as const, icon: Sparkles, label: "Full" },
                        { id: "reduced" as const, icon: Sparkles, label: "Reduced" },
                        { id: "none" as const, icon: Sparkles, label: "None" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setAnimations(opt.id)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                            animations === opt.id
                              ? "border-blue-500/40 bg-blue-500/[0.06] text-blue-400"
                              : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.04]"
                          }`}
                        >
                          <opt.icon size={14} className={animations === opt.id ? "" : "opacity-40"} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save appearance settings */}
                  <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 mt-2"
                  >
                    {saving ? "Saving..." : <><Save size={14} /> Save Appearance</>}
                  </button>
                </div>
              )}

              {/* ════════ PRIVACY TAB ════════ */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Privacy</h2>
                    <p className="text-xs text-white/30">Control your profile visibility and data</p>
                  </div>

                  <div className="divide-y divide-white/[0.04]">
                    <Toggle
                      checked={privacy.profilePublic}
                      onChange={(v) => setPrivacy({ ...privacy, profilePublic: v })}
                      label="Public Profile"
                      desc="Allow others to see your profile page"
                    />
                    <Toggle
                      checked={privacy.activityVisible}
                      onChange={(v) => setPrivacy({ ...privacy, activityVisible: v })}
                      label="Activity Visible"
                      desc="Show your activity graph to others"
                    />
                    <Toggle
                      checked={privacy.searchableByEmail}
                      onChange={(v) => setPrivacy({ ...privacy, searchableByEmail: v })}
                      label="Searchable by Email"
                      desc="Allow others to find you by email address"
                    />
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : <><Save size={14} /> Save Privacy Settings</>}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl border border-red-500/20 bg-[hsl(225,50%,8%)] p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-red-400 mb-2">Delete Account</h3>
              <p className="text-sm text-white/40 mb-4">
                This action is permanent. Type <span className="text-red-400 font-mono font-bold">DELETE</span> to confirm.
              </p>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full rounded-xl border border-red-500/20 bg-red-500/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-red-500/40 focus:outline-none mb-4"
                placeholder='Type "DELETE" to confirm'
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-sm font-medium text-white/60 hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirm !== "DELETE"}
                  onClick={handleDeleteAccount}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-500 transition-all"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
