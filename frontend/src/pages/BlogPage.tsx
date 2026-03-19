/**
 * BlogPage.tsx - Blog Articles Listing (538 lines)
 * 
 * Displays all blog posts for exam preparation guides, tips, and success stories.
 * 
 * Features:
 * - Hero section with featured post highlight
 * - Category filter tabs (UPSC, SSC, Banking, NTA, etc.)
 * - Blog cards with cover images, excerpts, read time, likes
 * - Featured posts badge and visual distinction
 * - Search functionality
 * - Newsletter subscription CTA
 * - Author information display
 * - GSAP scroll animations
 * - 3D tilt cards with glassmorphism
 * - SEO: BreadcrumbSchema
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientBorderCard from "@/components/animations/GradientBorderCard";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Heart, ArrowRight, Tag, Search, TrendingUp, Mail, BookOpen, Sparkles, Star, Users, Eye, MessageCircle, ChevronRight, Bookmark, Share2, Zap, Award, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import blogUpsc from "@/assets/blog-upsc.jpg";
import blogSsc from "@/assets/blog-ssc.jpg";
import blogBanking from "@/assets/blog-banking.jpg";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";

gsap.registerPlugin(ScrollTrigger);

const blogCategories = ["All", "UPSC", "SSC", "Banking", "NTA", "Railways", "Defence", "Teaching", "Career Guide", "Tools", "Tips & Tricks", "Success Stories"];

const blogImages: Record<string, string> = { "UPSC": blogUpsc, "SSC": blogSsc, "Banking": blogBanking };

const blogs = [
  { title: "Complete UPSC CSE 2026 Preparation Strategy", excerpt: "A comprehensive guide to cracking UPSC Civil Services with the right strategy, resources, and timeline. Covers Prelims, Mains, and Interview preparation with month-wise schedule.", readTime: 12, likes: 342, views: 15200, category: "UPSC", featured: true, date: "Mar 8, 2026", author: "Ishu Kumar" },
  { title: "Top 10 Mistakes SSC CGL Aspirants Make", excerpt: "Avoid these common pitfalls that most SSC CGL candidates fall into during their preparation journey.", readTime: 8, likes: 256, views: 9800, category: "SSC", featured: false, date: "Mar 7, 2026", author: "Content Team" },
  { title: "How to Crack Banking Exams in 3 Months", excerpt: "A proven 90-day plan for IBPS PO, SBI PO, and RBI exams with daily schedule and resource list.", readTime: 10, likes: 189, views: 7600, category: "Banking", featured: false, date: "Mar 6, 2026", author: "Ishu Kumar" },
  { title: "JEE Main vs JEE Advanced: Key Differences", excerpt: "Understanding the exam pattern, difficulty level, and preparation approach for both JEE exams.", readTime: 6, likes: 421, views: 22400, category: "NTA", featured: true, date: "Mar 5, 2026", author: "Content Team" },
  { title: "Best Free PDF Tools for Students in 2026", excerpt: "How to use PDF tools effectively for organizing study materials, notes, and previous year papers.", readTime: 5, likes: 178, views: 6300, category: "Tools", featured: false, date: "Mar 4, 2026", author: "Ishu Kumar" },
  { title: "State PCS vs UPSC: Which One Should You Choose?", excerpt: "A detailed comparison to help you decide the right path based on your goals and preparation level.", readTime: 9, likes: 267, views: 11200, category: "Career Guide", featured: false, date: "Mar 3, 2026", author: "Content Team" },
  { title: "From Village to IAS: Inspiring Success Stories", excerpt: "Real stories of IAS officers who came from humble backgrounds and cracked the toughest exam in India.", readTime: 15, likes: 534, views: 28900, category: "Success Stories", featured: false, date: "Mar 2, 2026", author: "Ishu Kumar" },
  { title: "NEET UG 2026: Complete Preparation Timeline", excerpt: "Month-by-month preparation strategy for NEET aspirants. Covers Physics, Chemistry & Biology with best books.", readTime: 14, likes: 389, views: 18700, category: "NTA", featured: false, date: "Mar 1, 2026", author: "Content Team" },
  { title: "Railway Group D Exam: Everything You Need to Know", excerpt: "Complete guide covering eligibility, syllabus, previous papers, and preparation strategy for RRB Group D.", readTime: 7, likes: 212, views: 8400, category: "Railways", featured: false, date: "Feb 28, 2026", author: "Ishu Kumar" },
  { title: "How WhatsApp Alerts Can Help Your Exam Preparation", excerpt: "Never miss an important notification — learn how to set up exam alerts on WhatsApp.", readTime: 4, likes: 156, views: 5100, category: "Tips & Tricks", featured: false, date: "Feb 27, 2026", author: "Content Team" },
  { title: "NDA 2026: Complete Guide for Aspirants", excerpt: "Everything about NDA exam — eligibility, syllabus, physical fitness, SSB interview tips.", readTime: 11, likes: 298, views: 13500, category: "Defence", featured: false, date: "Feb 26, 2026", author: "Ishu Kumar" },
  { title: "CTET vs State TET: Which to Prepare First?", excerpt: "Strategic comparison for teaching aspirants to maximize their career opportunities.", readTime: 6, likes: 167, views: 6700, category: "Teaching", featured: false, date: "Feb 25, 2026", author: "Content Team" },
];

const trendingTags = [
  "UPSC 2026", "SSC CGL", "NEET UG", "JEE Main", "IBPS PO", "RRB NTPC",
  "Study Tips", "PDF Tools", "Current Affairs", "Mock Tests", "Previous Papers",
  "Exam Strategy", "Time Management", "Answer Key", "Cut Off",
];

const authorSpotlight = {
  name: "Ishu Kumar",
  role: "Founder & Lead Author",
  bio: "Full-stack developer & education enthusiast, helping millions of Indian students achieve their dreams.",
  articles: 45,
  followers: 12000,
};

const BlogPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTitles = document.querySelectorAll(".blog-hero-title");
      if (heroTitles.length > 0) {
        gsap.fromTo(heroTitles, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" });
      }
      const catPills = document.querySelectorAll(".blog-cat-pill");
      if (catPills.length > 0) {
        gsap.fromTo(catPills, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.03, duration: 0.4, delay: 0.5, ease: "back.out(2)", clearProps: "all" });
      }
      const statCards = document.querySelectorAll(".blog-stat-card");
      if (statCards.length > 0 && statsRef.current) {
        gsap.fromTo(statCards,
          { y: 30, opacity: 0 },
          { scrollTrigger: { trigger: statsRef.current, start: "top 85%", toggleActions: "play none none none" },
            y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out", clearProps: "all" }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const filtered = blogs.filter((b) => {
    if (activeCat !== "All" && b.category !== activeCat) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = filtered.filter((b) => b.featured);
  const regular = filtered.filter((b) => !b.featured);
  const trending = [...blogs].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const mostViewed = [...blogs].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <Layout>
      <SEOHead {...SEO_DATA.blog} />
      <BreadcrumbSchema items={[{ name: "Blog", url: "/blog" }]} />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=2073&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-hero py-28 overflow-hidden">
        <GradientMesh variant="cool" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-15" />
        <MorphingBlob color="hsl(210 100% 56% / 0.08)" size={500} className="left-[10%] top-[15%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.06)" size={400} className="right-[15%] bottom-[20%]" duration={22} />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
            >
              <PenTool size={14} className="text-primary" />
              <span className="font-semibold text-foreground"><strong>ISHU</strong> — Indian StudentHub University · Expert Articles & Guides</span>
            </motion.div>
            
            <h1 className="blog-hero-title font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Expert <span className="text-shimmer">Blog</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              In-depth guides, preparation tips, and success stories for government exam aspirants.
            </p>
            
            {/* Stats row */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {[
                { icon: BookOpen, value: blogs.length + "+", label: "Articles" },
                { icon: Users, value: "50K+", label: "Readers" },
                { icon: Star, value: "4.9", label: "Rating" },
              ].map((stat) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <stat.icon size={16} className="text-primary" />
                  <strong className="text-foreground">{stat.value}</strong>
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="mx-auto mt-6 gradient-line w-32" />
          </div>

          <FadeInView delay={0.1}>
            <div className="mx-auto mt-10 max-w-xl">
              <div className="flex items-center gap-3 rounded-2xl border border-border glass-ultra px-5 py-4 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                <Search size={20} className="text-muted-foreground" />
                <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none" />
              </div>
            </div>
          </FadeInView>

          <FadeInView delay={0.15}>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {blogCategories.map((cat) => (
                <motion.button key={cat} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCat(cat)}
                  className={`blog-cat-pill rounded-xl px-4 py-2 text-sm font-medium transition-all ${activeCat === cat ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary/80 text-muted-foreground hover:text-foreground"}`}>
                  {cat}
                </motion.button>
              ))}
            </div>
          </FadeInView>
        </div>
        
        {/* Bottom gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Blog Stats */}
      <section ref={statsRef} className="border-b border-border bg-card/50 py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">            {[
              { value: blogs.length, suffix: "+", label: "Articles", icon: BookOpen },
              { value: 12, suffix: "", label: "Categories", icon: Tag },
              { value: 50000, suffix: "+", label: "Monthly Readers", icon: Users },
              { value: 4.8, suffix: "/5", label: "Reader Rating", icon: Star },
            ].map((s) => (
              <div key={s.label} className="blog-stat-card flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon size={20} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-foreground">
                    {typeof s.value === 'number' && s.value > 100 ? <AnimatedCounter target={s.value} suffix={s.suffix} /> : `${s.value}${s.suffix}`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hero Post */}
      {featured.length > 0 && (
        <section className="py-12 aurora-bg">
          <div className="container">
            <FadeInView>
              <div className="mb-8">
                <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Featured</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                  Editor's <span className="text-gradient">Picks</span>
                </h2>
              </div>
            </FadeInView>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {featured.map((blog, i) => {
                const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
                return (
                  <FadeInView key={blog.title} delay={i * 0.1}>
                    <Link to={`/blog/${slug}`}>
                      <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={1.02}>
                        <GradientBorderCard>
                          <div className="group flex h-full flex-col overflow-hidden">
                            {blogImages[blog.category] && (
                              <div className="relative h-52 w-full overflow-hidden">
                                <img src={blogImages[blog.category]} alt={blog.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                  <span className="rounded-md bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">{blog.category}</span>
                                  <span className="rounded-md bg-warning/90 px-2 py-1 text-[10px] font-medium text-warning-foreground">⭐ Featured</span>
                                </div>
                              </div>
                            )}
                            <div className="flex flex-1 flex-col p-8">
                              <h2 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">{blog.title}</h2>
                              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{blog.excerpt}</p>
                              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1"><Clock size={14} /> {blog.readTime} min</span>
                                  <span className="flex items-center gap-1"><Heart size={14} /> {blog.likes}</span>
                                  <span className="flex items-center gap-1"><Eye size={14} /> {(blog.views / 1000).toFixed(1)}k</span>
                                </div>
                                <span className="flex items-center gap-1 font-medium text-primary">Read <ArrowRight size={14} /></span>
                              </div>
                              <p className="mt-3 text-xs text-muted-foreground">{blog.author} · {blog.date}</p>
                            </div>
                          </div>
                        </GradientBorderCard>
                      </Tilt>
                    </Link>
                  </FadeInView>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Most Viewed Horizontal Scroll */}
      <section className="border-y border-border bg-card/50 py-10">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <Eye size={18} className="text-primary" /> Most Viewed
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
            {mostViewed.map((b) => {
              const slug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
              return (
                <Link key={b.title} to={`/blog/${slug}`} className="min-w-[260px] sm:min-w-[300px] snap-start">
                  <motion.div whileHover={{ y: -4 }}
                    className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-card">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Eye size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{b.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{(b.views / 1000).toFixed(1)}k views</span>
                        <span>{b.readTime} min read</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 mesh-gradient">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Regular Posts */}
              <div className="mb-6">
                <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Latest Articles</span>
                <h2 className="mt-2 font-display text-xl font-bold text-foreground">
                  All <span className="text-gradient">Posts</span>
                </h2>
              </div>

              <div className="space-y-4">
                {(regular.length > 0 ? regular : filtered).map((blog, i) => {
                  const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
                  return (
                  <FadeInView key={blog.title} delay={Math.min(i * 0.05, 0.3)}>
                    <Link to={`/blog/${slug}`}>
                      <motion.div whileHover={{ x: 4 }}
                        className="group flex gap-6 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-card">
                        {blogImages[blog.category] ? (
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                            <img src={blogImages[blog.category]} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                          </div>
                        ) : (
                          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/5 transition-all group-hover:bg-primary/10">
                            <BookOpen size={24} className="text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">{blog.category}</span>
                            <span className="text-xs text-muted-foreground">{blog.date}</span>
                          </div>
                          <h3 className="mt-2 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">{blog.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime} min</span>
                            <span className="flex items-center gap-1"><Heart size={12} /> {blog.likes}</span>
                            <span className="flex items-center gap-1"><Eye size={12} /> {(blog.views / 1000).toFixed(1)}k</span>
                            <span>{blog.author}</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                          <motion.button whileHover={{ scale: 1.2 }} className="hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>
                            <Bookmark size={16} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.2 }} className="hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>
                            <Share2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    </Link>
                  </FadeInView>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">No articles found.</div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Spotlight */}
              <FadeInView delay={0.05}>
                <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02}>
                  <div className="rounded-2xl border border-border glass-strong p-6 text-center transition-all hover:shadow-card">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 font-display text-xl font-bold text-primary ring-2 ring-primary/20">
                      IK
                    </motion.div>
                    <h3 className="font-display text-base font-bold text-foreground">{authorSpotlight.name}</h3>
                    <p className="text-xs text-primary">{authorSpotlight.role}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{authorSpotlight.bio}</p>
                    <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
                      <span><strong className="text-foreground">{authorSpotlight.articles}</strong> Articles</span>
                      <span><strong className="text-foreground">{(authorSpotlight.followers / 1000).toFixed(0)}k</strong> Followers</span>
                    </div>
                  </div>
                </Tilt>
              </FadeInView>

              {/* Newsletter */}
              <FadeInView delay={0.1}>
                <div className="rounded-2xl border border-border bg-card p-6 animate-breathe">
                  <h3 className="font-display text-base font-bold text-foreground">📬 Newsletter</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Get weekly exam preparation tips & updates directly in your inbox.
                  </p>
                  {!subscribed ? (
                    <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2.5 transition-all focus-within:border-primary/40">
                        <Mail size={14} className="text-muted-foreground" />
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com" className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                      </div>
                      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                        Subscribe
                      </button>
                    </form>
                  ) : (
                    <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-xs text-success">✅ Subscribed!</p>
                  )}
                </div>
              </FadeInView>

              {/* Trending */}
              <FadeInView delay={0.15}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                    <TrendingUp size={16} className="text-primary" /> Trending
                  </h3>
                  <div className="mt-4 space-y-3">
                    {trending.map((b, i) => {
                      const tSlug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
                      return (
                      <Link key={b.title} to={`/blog/${tSlug}`} className="flex gap-3 group">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-primary/10 font-display text-xs font-bold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-foreground leading-snug group-hover:text-primary transition-colors">{b.title}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">{b.likes} ♥ · {b.readTime} min</p>
                        </div>
                      </Link>
                      );
                    })}
                  </div>
                </div>
              </FadeInView>

              {/* Popular Tags */}
              <FadeInView delay={0.2}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                    <Tag size={16} className="text-primary" /> Popular Tags
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trendingTags.map((tag) => (
                      <motion.span key={tag} whileHover={{ scale: 1.08 }}
                        className="cursor-pointer rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground hover:bg-primary/5">
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </FadeInView>

              {/* WhatsApp CTA */}
              <FadeInView delay={0.25}>
                <div className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center">
                  <MessageCircle size={24} className="mx-auto text-success" />
                  <h3 className="mt-3 font-display text-sm font-bold text-foreground">Get Alerts on WhatsApp</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Never miss a new article or exam update</p>
                  <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-success px-5 py-2 text-xs font-semibold text-success-foreground transition-all hover:opacity-90">
                    <MessageCircle size={14} /> Join Now
                  </motion.a>
                </div>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ READING RECOMMENDATIONS ═══ */}
      <section className="border-t border-border py-16 bg-card/30">
        <div className="container">
          <FadeInView>
            <div className="mb-10 text-center">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Curated for You</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                Reading <span className="text-shimmer">Recommendations</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Hand-picked articles based on what's trending among aspirants</p>
            </div>
          </FadeInView>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.slice(0, 4).map((blog, i) => {
              const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
              return (
                <FadeInView key={blog.title} delay={i * 0.08}>
                  <Link to={`/blog/${slug}`}>
                    <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={400}>
                      <motion.div whileHover={{ y: -4 }}
                        className="group h-full rounded-xl border border-border glass-strong p-5 transition-all hover:border-primary/20 hover:shadow-card">
                        {blogImages[blog.category] && (
                          <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                            <img src={blogImages[blog.category]} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <span className="absolute bottom-2 left-2 rounded-md bg-primary/90 px-2 py-0.5 text-[9px] font-semibold text-primary-foreground">{blog.category}</span>
                          </div>
                        )}
                        <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                        <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={10} /> {blog.readTime} min</span>
                          <span className="flex items-center gap-1"><Heart size={10} /> {blog.likes}</span>
                          <span className="flex items-center gap-1"><Eye size={10} /> {(blog.views / 1000).toFixed(1)}k</span>
                        </div>
                      </motion.div>
                    </Tilt>
                  </Link>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="border-t border-border py-16 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Want to <span className="text-shimmer">Contribute</span>?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Are you an educator or exam expert? Write for us and reach millions of aspirants.
              </p>
              <Link to="/contact">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                  <Mail size={16} /> Contact Us <ArrowRight size={14} />
                </motion.button>
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "ISHU Expert Blog",
          "description": "In-depth guides, preparation tips, and success stories for government exam aspirants.",
          "url": "https://ishu.fun/blog",
          "blogPost": blogs.slice(0, 5).map(b => ({
            "@type": "BlogPosting",
            "headline": b.title,
            "description": b.excerpt,
            "author": { "@type": "Person", "name": b.author },
            "datePublished": b.date
          }))
        })
      }} />
    </Layout>
  );
};

export default BlogPage;
