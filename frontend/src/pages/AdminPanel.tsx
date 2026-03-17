/**
 * AdminPanel.tsx - Admin Dashboard (876 lines)
 * 
 * Protected page accessible only to users with "admin" role.
 * Provides a full dashboard for managing the platform.
 * 
 * Features:
 * - Collapsible sidebar navigation
 * - Dashboard overview with key metrics (animated counters)
 * - Recent activity feed
 * - System health monitoring (CPU, memory, storage, uptime)
 * - Content management sections: Results, News, Blog, Users
 * - Analytics charts placeholder
 * - Notification management
 * - Settings panel
 * - Responsive layout with mobile sidebar toggle
 * 
 * Protected by: ProtectedRoute with adminOnly flag
 * Admin check: Uses has_role() database function via AuthContext
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  LayoutDashboard, FileText, Newspaper, BookOpen, Users, Bell,
  BarChart3, Settings, Wrench, ChevronLeft, ChevronRight, LogOut,
  Plus, Search, Eye, MessageCircle, Edit, Trash2, Upload,
  Activity, TrendingUp, Clock, AlertCircle, CheckCircle2, Zap,
  Globe, Shield, Database, Server, Cpu, HardDrive, Wifi,
  RefreshCw, Download, Calendar, Filter, ArrowUpRight, Sparkles,
  PieChart, BarChart, LineChart, Target, Award, Star, Heart
} from "lucide-react";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import FadeInView from "@/components/animations/FadeInView";
import gsap from "gsap";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Results", href: "/admin/results" },
  { icon: Newspaper, label: "News", href: "/admin/news" },
  { icon: BookOpen, label: "Blog", href: "/admin/blog" },
  { icon: Wrench, label: "Tools Analytics", href: "/admin/tools" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const recentActivity = [
  { action: "New Result Added", detail: "SSC CGL 2026 Notification", time: "2 min ago", type: "result" },
  { action: "Blog Published", detail: "UPSC CSE 2026 Preparation Guide", time: "15 min ago", type: "blog" },
  { action: "News Imported", detail: "250 articles auto-imported", time: "30 min ago", type: "news" },
  { action: "WhatsApp Sent", detail: "Notification to 5,420 users", time: "1 hour ago", type: "notification" },
  { action: "New User", detail: "rahul.verma@gmail.com signed up", time: "2 hours ago", type: "user" },
  { action: "Tool Usage Spike", detail: "Merge PDF — 2,340 uses today", time: "3 hours ago", type: "tool" },
];

const topTools = [
  { name: "Merge PDF", uses: 12540 },
  { name: "Compress PDF", uses: 9870 },
  { name: "PDF to Word", uses: 8450 },
  { name: "Word to PDF", uses: 7230 },
  { name: "Split PDF", uses: 5610 },
];

// Sub-page content components
const DashboardContent = () => (
  <div>
    <FadeInView>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back, Admin. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            System Online
          </motion.div>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </FadeInView>

    {/* Stats */}
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Total Users", value: 124530, icon: Users, change: "+12%", color: "text-blue-400", gradient: "from-blue-500/10 to-cyan-500/10" },
        { label: "Active Results", value: 342, icon: FileText, change: "+5", color: "text-emerald-400", gradient: "from-emerald-500/10 to-green-500/10" },
        { label: "News Today", value: 856, icon: Newspaper, change: "+120", color: "text-amber-400", gradient: "from-amber-500/10 to-orange-500/10" },
        { label: "Tool Uses Today", value: 45230, icon: Wrench, change: "+18%", color: "text-violet-400", gradient: "from-violet-500/10 to-purple-500/10" },
      ].map((stat, i) => (
        <FadeInView key={stat.label} delay={i * 0.08}>
          <motion.div whileHover={{ y: -4, scale: 1.02 }} className={`relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${stat.gradient} p-5 transition-all hover:shadow-card hover:border-primary/20`}>
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-xl" />
            <div className="flex items-center justify-between">
              <div className={`rounded-lg bg-background/50 p-2 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                <TrendingUp size={10} />{stat.change}
              </span>
            </div>
            <div className="mt-3 font-display text-2xl font-bold text-foreground">
              <AnimatedCounter target={stat.value} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            <div className="mt-3 h-1 rounded-full bg-background/30">
              <motion.div initial={{ width: 0 }} animate={{ width: `${60 + i * 10}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                className="h-1 rounded-full bg-primary/50" />
            </div>
          </motion.div>
        </FadeInView>
      ))}
    </div>

    {/* Server Status */}
    <FadeInView delay={0.05}>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          { icon: Server, label: "Server Status", value: "Healthy", color: "text-success" },
          { icon: Database, label: "Database", value: "6.2 GB / 10 GB", color: "text-blue-400" },
          { icon: Cpu, label: "CPU Usage", value: "34%", color: "text-amber-400" },
          { icon: HardDrive, label: "Storage", value: "12.4 GB / 50 GB", color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4">
            <s.icon size={18} className={s.color} />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </FadeInView>

    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <FadeInView delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground">Recent Activity</h2>
            <div className="mt-4 space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>
      </div>

      <FadeInView delay={0.15}>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold text-foreground">Top Tools Today</h2>
          <div className="mt-4 space-y-3">
            {topTools.map((tool, i) => (
              <div key={tool.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 font-display text-xs font-bold text-primary">{i + 1}</span>
                  <span className="text-sm text-foreground">{tool.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{tool.uses.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeInView>
    </div>

    {/* Quick Actions */}
    <FadeInView delay={0.2}>
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Zap size={18} className="text-primary" /> Quick Actions
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4">
          {[
            { icon: FileText, label: "Add Result", desc: "Post new vacancy", gradient: "from-blue-500/10 to-cyan-500/10", href: "/admin/results" },
            { icon: Newspaper, label: "Add News", desc: "Publish article", gradient: "from-amber-500/10 to-orange-500/10", href: "/admin/news" },
            { icon: BookOpen, label: "Write Blog", desc: "Create post", gradient: "from-emerald-500/10 to-green-500/10", href: "/admin/blog" },
            { icon: MessageCircle, label: "Send WhatsApp", desc: "Notify users", gradient: "from-violet-500/10 to-purple-500/10", href: "/admin/notifications" },
          ].map((action) => (
            <Link key={action.label} to={action.href}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`group cursor-pointer rounded-xl border border-border bg-gradient-to-br ${action.gradient} p-5 text-center transition-all hover:border-primary/30 hover:shadow-card`}>
                <motion.div whileHover={{ rotateY: 180 }} transition={{ duration: 0.5 }}
                  className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-background/50" style={{ transformStyle: "preserve-3d" }}>
                  <action.icon size={24} className="text-primary" />
                </motion.div>
                <p className="font-display text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowUpRight size={10} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </FadeInView>

    {/* Live Activity Feed */}
    <FadeInView delay={0.25}>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Activity size={18} className="text-primary" /> Live Activity
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="ml-2 h-2 w-2 rounded-full bg-red-500" />
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "Active Users Now", value: "1,234", icon: Users, color: "text-blue-400" },
            { label: "Page Views / min", value: "456", icon: Eye, color: "text-emerald-400" },
            { label: "Tool Operations / min", value: "89", icon: Wrench, color: "text-amber-400" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
              <m.icon size={18} className={m.color} />
              <div>
                <p className="font-display text-lg font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeInView>
  </div>
);

const ResultsManagement = () => (
  <div>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Results Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add, edit, and manage exam results & vacancies</p>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        <Plus size={14} /> Add New Result
      </button>
    </div>
    <div className="mt-6 flex gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
        <Search size={14} className="text-muted-foreground" />
        <input type="text" placeholder="Search results..." className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
      </div>
      {["All", "Active", "Upcoming", "Result Out", "Expired"].map((f) => (
        <button key={f} className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary">{f}</button>
      ))}
    </div>
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-border text-xs text-muted-foreground">
          <th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Vacancies</th><th className="px-4 py-3">Views</th><th className="px-4 py-3">WA</th><th className="px-4 py-3">Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {[
            { title: "SSC CGL 2026", cat: "SSC", level: "Central", status: "Active", vacancies: 14582, views: 12450, wa: true },
            { title: "UPSC CSE 2026", cat: "UPSC", level: "Central", status: "Active", vacancies: 1056, views: 34210, wa: true },
            { title: "IBPS PO 2026", cat: "Banking", level: "Central", status: "Result Out", vacancies: 4500, views: 8900, wa: false },
            { title: "UP Police 2026", cat: "Police", level: "State - UP", status: "Active", vacancies: 25000, views: 45000, wa: true },
            { title: "Bihar TET 2026", cat: "Teaching", level: "State - BR", status: "Upcoming", vacancies: 8000, views: 5670, wa: false },
            { title: "NEET UG 2026", cat: "NTA", level: "Central", status: "Active", vacancies: 108000, views: 67000, wa: true },
          ].map((r) => (
            <tr key={r.title} className="text-foreground hover:bg-secondary/30">
              <td className="px-4 py-3 font-medium">{r.title}</td>
              <td className="px-4 py-3"><span className="rounded bg-secondary px-2 py-0.5 text-xs">{r.cat}</span></td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{r.level}</td>
              <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs font-medium ${r.status === "Active" ? "bg-success/10 text-success" : r.status === "Result Out" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>{r.status}</span></td>
              <td className="px-4 py-3 text-muted-foreground">{r.vacancies.toLocaleString()}</td>
              <td className="px-4 py-3 text-muted-foreground"><Eye size={12} className="inline mr-1" />{r.views.toLocaleString()}</td>
              <td className="px-4 py-3">{r.wa ? <span className="text-success text-xs">✓ Sent</span> : <button className="text-xs text-primary">Send</button>}</td>
              <td className="px-4 py-3 flex gap-2">
                <button className="text-primary"><Edit size={14} /></button>
                <button className="text-destructive"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NewsManagement = () => (
  <div>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">News Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add, import, and manage news articles</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
          <Upload size={14} /> Bulk Import
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus size={14} /> Add News
        </button>
      </div>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[
        { label: "Today's Articles", value: "856", change: "+120" },
        { label: "Categories", value: "30", change: "Active" },
        { label: "Languages", value: "22", change: "Supported" },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{s.value}</p>
          <span className="text-xs text-success">{s.change}</span>
        </div>
      ))}
    </div>
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h3 className="font-display text-base font-bold text-foreground">Recent News</h3>
      <div className="mt-4 space-y-3">
        {[
          { title: "CBSE Board Exams 2026 Date Sheet", cat: "Education", time: "2h ago", source: "TOI" },
          { title: "SSC CGL 15000+ Vacancies Announced", cat: "Govt Jobs", time: "4h ago", source: "NDTV" },
          { title: "ISRO Reusable Rocket Test Success", cat: "Science", time: "2d ago", source: "The Print" },
          { title: "India 3rd Largest Economy - IMF", cat: "International", time: "3d ago", source: "Reuters" },
        ].map((n) => (
          <div key={n.title} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.cat} · {n.source} · {n.time}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-primary"><Edit size={14} /></button>
              <button className="text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BlogManagement = () => (
  <div>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Blog Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create, edit, and publish blog posts</p>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        <Plus size={14} /> Write Post
      </button>
    </div>
    <div className="mt-6 space-y-3">
      {[
        { title: "UPSC CSE 2026 Complete Strategy", status: "Published", views: 12450, likes: 342 },
        { title: "Top 10 SSC CGL Mistakes", status: "Published", views: 8900, likes: 256 },
        { title: "Banking Exams 90-Day Plan", status: "Draft", views: 0, likes: 0 },
        { title: "NEET UG Preparation Timeline", status: "Published", views: 5600, likes: 389 },
      ].map((b) => (
        <div key={b.title} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">{b.title}</h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className={`rounded px-2 py-0.5 ${b.status === "Published" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{b.status}</span>
              <span><Eye size={10} className="inline mr-0.5" />{b.views.toLocaleString()}</span>
              <span>♥ {b.likes}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-primary"><Edit size={14} /></button>
            <button className="text-destructive"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UsersManagement = () => (
  <div>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">View and manage registered users</p>
      </div>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[
        { label: "Total Users", value: "124,530" },
        { label: "WhatsApp Subscribers", value: "45,230" },
        { label: "Active Today", value: "12,340" },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{s.value}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-border text-xs text-muted-foreground">
          <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">WA Sub</th><th className="px-4 py-3">Joined</th>
        </tr></thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "Rahul Verma", email: "rahul@gmail.com", phone: "+91 98765xxxxx", role: "User", wa: true, joined: "Mar 8" },
            { name: "Priya Sharma", email: "priya@gmail.com", phone: "+91 87654xxxxx", role: "User", wa: true, joined: "Mar 7" },
            { name: "Amit Kumar", email: "amit@gmail.com", phone: "+91 76543xxxxx", role: "User", wa: false, joined: "Mar 6" },
            { name: "Ishu Kumar", email: "ishukryk@gmail.com", phone: "+91 89869xxxxx", role: "Admin", wa: true, joined: "Jan 1" },
          ].map((u) => (
            <tr key={u.email} className="text-foreground hover:bg-secondary/30">
              <td className="px-4 py-3 font-medium">{u.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
              <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
              <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs ${u.role === "Admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{u.role}</span></td>
              <td className="px-4 py-3">{u.wa ? <span className="text-success text-xs">✓</span> : <span className="text-muted-foreground text-xs">✗</span>}</td>
              <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NotificationsPage = () => (
  <div>
    <h1 className="font-display text-2xl font-bold text-foreground">WhatsApp Notifications</h1>
    <p className="mt-1 text-sm text-muted-foreground">Manage WhatsApp message templates and send notifications</p>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[
        { label: "Total Subscribers", value: "45,230" },
        { label: "Messages Sent Today", value: "5,420" },
        { label: "Delivery Rate", value: "98.5%" },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{s.value}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h3 className="font-display text-base font-bold text-foreground">Send Notification</h3>
      <div className="mt-4 space-y-4">
        <select className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:outline-none">
          <option>Select Result / Vacancy</option>
          <option>SSC CGL 2026</option>
          <option>UPSC CSE 2026</option>
          <option>NEET UG 2026</option>
        </select>
        <textarea rows={4} placeholder="Custom message (optional)" className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none" />
        <button className="flex items-center gap-2 rounded-lg bg-success px-6 py-3 text-sm font-medium text-success-foreground">
          <MessageCircle size={14} /> Send to All Subscribers
        </button>
      </div>
    </div>
  </div>
);

const ToolsAnalytics = () => {
  const toolStats = [
    { name: "Merge PDF", uses: 12540, avgTime: "2.3s", errorRate: "0.8%", avgSize: "4.2 MB" },
    { name: "Compress PDF", uses: 9870, avgTime: "3.1s", errorRate: "1.2%", avgSize: "8.5 MB" },
    { name: "PDF to Word", uses: 8450, avgTime: "4.5s", errorRate: "2.1%", avgSize: "3.8 MB" },
    { name: "Word to PDF", uses: 7230, avgTime: "1.8s", errorRate: "0.5%", avgSize: "2.1 MB" },
    { name: "Split PDF", uses: 5610, avgTime: "1.2s", errorRate: "0.3%", avgSize: "5.6 MB" },
    { name: "JPG to PDF", uses: 4890, avgTime: "1.5s", errorRate: "0.6%", avgSize: "6.2 MB" },
    { name: "Edit PDF", uses: 3420, avgTime: "5.2s", errorRate: "3.4%", avgSize: "4.8 MB" },
    { name: "OCR PDF", uses: 2100, avgTime: "8.7s", errorRate: "4.1%", avgSize: "7.3 MB" },
  ];
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Tools Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Monitor PDF tool usage, performance, and error rates</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Uses Today", value: "45,230", change: "+18%" },
          { label: "Unique Users", value: "12,340", change: "+8%" },
          { label: "Avg Processing Time", value: "3.2s", change: "-12%" },
          { label: "Error Rate", value: "1.4%", change: "-0.3%" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{s.value}</p>
            <span className="text-xs text-success">{s.change}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-4 py-3">#</th><th className="px-4 py-3">Tool</th><th className="px-4 py-3">Uses</th><th className="px-4 py-3">Avg Time</th><th className="px-4 py-3">Error Rate</th><th className="px-4 py-3">Avg File Size</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {toolStats.map((t, i) => (
              <tr key={t.name} className="text-foreground hover:bg-secondary/30">
                <td className="px-4 py-3 font-display text-xs text-primary">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.uses.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.avgTime}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${parseFloat(t.errorRate) > 3 ? "bg-destructive/10 text-destructive" : parseFloat(t.errorRate) > 1 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                    {t.errorRate}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.avgSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-foreground">Usage by Category</h3>
          <div className="mt-4 space-y-3">
            {[
              { cat: "Convert", pct: 42 }, { cat: "Edit", pct: 28 }, { cat: "Organize", pct: 18 }, { cat: "Security", pct: 12 },
            ].map((c) => (
              <div key={c.cat}>
                <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{c.cat}</span><span>{c.pct}%</span></div>
                <div className="h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${c.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-foreground">Peak Hours</h3>
          <div className="mt-4 space-y-3">
            {[
              { time: "10 AM - 12 PM", uses: "8,450" }, { time: "2 PM - 4 PM", uses: "7,230" },
              { time: "6 PM - 8 PM", uses: "6,890" }, { time: "8 PM - 10 PM", uses: "5,420" },
            ].map((h) => (
              <div key={h.time} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <span className="text-sm text-foreground">{h.time}</span>
                <span className="text-xs font-medium text-muted-foreground">{h.uses} uses</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SiteAnalytics = () => (
  <div>
    <h1 className="font-display text-2xl font-bold text-foreground">Site Analytics</h1>
    <p className="mt-1 text-sm text-muted-foreground">Traffic, page views, search keywords & performance metrics</p>
    <div className="mt-6 grid gap-4 md:grid-cols-4">
      {[
        { label: "Page Views Today", value: "234,560", change: "+15%" },
        { label: "Unique Visitors", value: "89,230", change: "+12%" },
        { label: "Bounce Rate", value: "32.4%", change: "-2.1%" },
        { label: "Avg Session", value: "4m 32s", change: "+18s" },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{s.value}</p>
          <span className="text-xs text-success">{s.change}</span>
        </div>
      ))}
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-bold text-foreground">Top Pages</h3>
        <div className="mt-4 space-y-3">
          {[
            { page: "/", views: "45,230", title: "Home" },
            { page: "/results", views: "34,210", title: "Results" },
            { page: "/tools/merge-pdf", views: "12,540", title: "Merge PDF" },
            { page: "/news", views: "11,230", title: "News" },
            { page: "/tools/compress-pdf", views: "9,870", title: "Compress PDF" },
            { page: "/blog", views: "8,560", title: "Blog" },
            { page: "/tools", views: "7,890", title: "All Tools" },
          ].map((p, i) => (
            <div key={p.page} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 font-display text-xs font-bold text-primary">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.page}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{p.views} views</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-bold text-foreground">Top Search Keywords</h3>
        <div className="mt-4 space-y-3">
          {[
            { keyword: "indian student hub", clicks: "12,340" },
            { keyword: "ssc cgl 2026", clicks: "8,560" },
            { keyword: "upsc result", clicks: "7,230" },
            { keyword: "merge pdf online", clicks: "5,890" },
            { keyword: "government job vacancy", clicks: "4,560" },
            { keyword: "neet result 2026", clicks: "3,890" },
            { keyword: "pdf to word converter", clicks: "3,450" },
          ].map((k, i) => (
            <div key={k.keyword} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 font-display text-xs font-bold text-primary">{i + 1}</span>
                <span className="text-sm text-foreground">{k.keyword}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{k.clicks} clicks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-bold text-foreground">Traffic Sources</h3>
        <div className="mt-4 space-y-3">
          {[
            { source: "Google Search", pct: 58 }, { source: "Direct", pct: 22 }, { source: "Social Media", pct: 12 }, { source: "Referral", pct: 8 },
          ].map((s) => (
            <div key={s.source}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{s.source}</span><span>{s.pct}%</span></div>
              <div className="h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${s.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-bold text-foreground">Device Breakdown</h3>
        <div className="mt-4 space-y-3">
          {[
            { device: "Mobile", pct: 72 }, { device: "Desktop", pct: 22 }, { device: "Tablet", pct: 6 },
          ].map((d) => (
            <div key={d.device}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{d.device}</span><span>{d.pct}%</span></div>
              <div className="h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${d.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-bold text-foreground">Core Web Vitals</h3>
        <div className="mt-4 space-y-3">
          {[
            { metric: "LCP", value: "1.8s", status: "Good" },
            { metric: "FID", value: "45ms", status: "Good" },
            { metric: "CLS", value: "0.05", status: "Good" },
            { metric: "TTFB", value: "320ms", status: "Good" },
          ].map((m) => (
            <div key={m.metric} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
              <span className="text-sm font-medium text-foreground">{m.metric}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{m.value}</span>
                <span className="rounded bg-success/10 px-2 py-0.5 text-xs font-medium text-success">{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SiteSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Site configuration, API keys, maintenance mode & feature flags</p>
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-foreground">General Configuration</h3>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Site Name</label>
                <input type="text" defaultValue="ISHU — Indian StudentHub University" className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Admin Email</label>
                <input type="email" defaultValue="ishukryk@gmail.com" className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Phone</label>
                <input type="tel" defaultValue="8986985813" className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp Number</label>
                <input type="tel" defaultValue="8986985813" className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-foreground">Feature Flags</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "Maintenance Mode", desc: "Show maintenance page to all users", key: "maintenance", active: maintenanceMode },
              { label: "WhatsApp Notifications", desc: "Enable automated WhatsApp alerts", key: "whatsapp", active: true },
              { label: "News Auto-Import", desc: "Fetch news every 30 minutes from RSS feeds", key: "newsImport", active: true },
              { label: "User Registration", desc: "Allow new user sign-ups", key: "registration", active: true },
              { label: "Blog Comments", desc: "Enable comments on blog posts", key: "comments", active: false },
              { label: "Test Series", desc: "Enable test page (currently Coming Soon)", key: "testSeries", active: false },
            ].map((f) => (
              <div key={f.key} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
                <button
                  onClick={() => f.key === "maintenance" && setMaintenanceMode(!maintenanceMode)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${f.active ? "bg-success" : "bg-secondary"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${f.active ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-foreground">API Keys & Integrations</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "Google Analytics ID", value: "G-XXXXXXXXXX", status: "Connected" },
              { label: "Google Translate API", value: "••••••••••••", status: "Active" },
              { label: "SMTP Email", value: "ishukryk@gmail.com", status: "Connected" },
              { label: "WhatsApp Session", value: "Session Active", status: "Connected" },
              { label: "Cloudinary", value: "••••••••••••", status: "Active" },
            ].map((k) => (
              <div key={k.label} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{k.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{k.value}</p>
                </div>
                <span className="rounded bg-success/10 px-2 py-0.5 text-xs font-medium text-success">{k.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-foreground">SEO & Sitemap</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "Sitemap", status: "Auto-generated", lastUpdated: "Today, 6:00 AM" },
              { label: "Robots.txt", status: "Configured", lastUpdated: "Mar 1, 2026" },
              { label: "Schema Markup", status: "Active on all pages", lastUpdated: "Today" },
              { label: "Meta Tags", status: "All pages covered", lastUpdated: "Today" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">Last updated: {s.lastUpdated}</p>
                </div>
                <span className="rounded bg-success/10 px-2 py-0.5 text-xs font-medium text-success">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="rounded-lg bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
          Save Settings
        </button>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const getContent = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return <DashboardContent />;
    if (path === "/admin/results") return <ResultsManagement />;
    if (path === "/admin/news") return <NewsManagement />;
    if (path === "/admin/blog") return <BlogManagement />;
    if (path === "/admin/users") return <UsersManagement />;
    if (path === "/admin/notifications") return <NotificationsPage />;
    if (path === "/admin/tools") return <ToolsAnalytics />;
    if (path === "/admin/analytics") return <SiteAnalytics />;
    if (path === "/admin/settings") return <SiteSettings />;
    return <DashboardContent />;
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.02]" />

      {/* Dynamic Background Image for AdminPanel (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-card/95 backdrop-blur-xl"
      >
        {/* Sidebar top gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex h-16 items-center justify-between px-4">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <motion.div animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary" style={{ transformStyle: "preserve-3d" }}>
                <span className="text-xs font-bold text-primary-foreground">ISH</span>
              </motion.div>
              <span className="font-display text-sm font-bold text-foreground">
                Admin <span className="text-gradient">Panel</span>
              </span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
            return (
              <Link key={item.href} to={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                {isActive && (
                  <motion.div layoutId="admin-nav" className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary" />
                )}
                <item.icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && sidebarOpen && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar bottom */}
        <div className="border-t border-border p-3 space-y-1">
          {sidebarOpen && (
            <div className="mb-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">Pro Admin</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">All features enabled</p>
            </div>
          )}
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <LogOut size={18} />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Main */}
      <div className={`relative flex-1 transition-all ${sidebarOpen ? "ml-[260px]" : "ml-[72px]"}`}>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 transition-all focus-within:border-primary/30 focus-within:shadow-sm">
              <Search size={14} className="text-muted-foreground" />
              <input type="text" placeholder="Search anything..." className="w-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <RefreshCw size={14} />
              </button>
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <Download size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:shadow-glow transition-all">
              <Plus size={14} /> Add New
            </motion.button>
            <div className="relative">
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary">
                <Bell size={16} />
              </button>
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground flex items-center justify-center">3</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-xs font-bold text-primary-foreground">A</div>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {getContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
