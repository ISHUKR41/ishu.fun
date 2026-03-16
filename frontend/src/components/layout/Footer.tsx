/**
 * Footer.tsx - Website Footer
 * 
 * The footer appears at the bottom of every page and contains:
 * 1. Newsletter/WhatsApp CTA strip - encourages users to subscribe
 * 2. App highlights strip - key stats (36 states, 100% verified, etc.)
 * 3. Brand section with logo, description, contact info, social links
 * 4. Link columns: Platform, Exam Categories, Popular Tools, Top States
 * 5. Bottom bar with copyright, legal links, and "Made with ❤️" message
 * 
 * All links use React Router's <Link> for client-side navigation.
 * Social links and contact links open in new tabs.
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Twitter, Youtube, Instagram, Linkedin, ArrowUpRight, Heart, Sparkles, Globe, Shield, Zap } from "lucide-react";

// Footer navigation links organized by category
const footerLinks = {
  Platform: [
  { label: "Results", href: "/results" },
  { label: "PDF Tools", href: "/tools" },
  { label: "News", href: "/news" },
  { label: "Blog", href: "/blog" },
  { label: "Test Series", href: "/test" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" }],

  "Exam Categories": [
  { label: "UPSC", href: "/results?category=upsc" },
  { label: "SSC", href: "/results?category=ssc" },
  { label: "Banking", href: "/results?category=banking" },
  { label: "Railways", href: "/results?category=railways" },
  { label: "NTA (JEE/NEET)", href: "/results?category=nta" },
  { label: "Defence", href: "/results?category=defence" },
  { label: "Teaching", href: "/results?category=teaching" },
  { label: "PSU", href: "/results?category=psu" }],

  "Popular Tools": [
  { label: "Merge PDF", href: "/tools/merge-pdf" },
  { label: "Compress PDF", href: "/tools/compress-pdf" },
  { label: "PDF to Word", href: "/tools/pdf-to-word" },
  { label: "Word to PDF", href: "/tools/word-to-pdf" },
  { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
  { label: "Split PDF", href: "/tools/split-pdf" },
  { label: "All 100+ Tools →", href: "/tools" }],

  "Top States": [
  { label: "Uttar Pradesh", href: "/results/state/uttar-pradesh" },
  { label: "Bihar", href: "/results/state/bihar" },
  { label: "Rajasthan", href: "/results/state/rajasthan" },
  { label: "Madhya Pradesh", href: "/results/state/madhya-pradesh" },
  { label: "Maharashtra", href: "/results/state/maharashtra" },
  { label: "Delhi", href: "/results/state/delhi" },
  { label: "All 36 States →", href: "/results" }]

};

// Social media links with icons
const socialLinks = [
{ icon: Twitter, label: "Twitter", href: "#" },
{ icon: Youtube, label: "YouTube", href: "#" },
{ icon: Instagram, label: "Instagram", href: "#" },
{ icon: Linkedin, label: "LinkedIn", href: "#" }];


// Quick feature badges shown in footer
const footerFeatures = [
{ icon: Globe, label: "36 States Coverage" },
{ icon: Shield, label: "Verified Sources" },
{ icon: Zap, label: "Instant Alerts" }];


const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-card overflow-hidden">
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-primary/3 blur-[100px]" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-48 w-48 rounded-full bg-[hsl(260,100%,66%,0.02)] blur-[80px]" />

      {/* ====== Newsletter / WhatsApp CTA Strip ====== */}
      <div className="border-b border-border">
        <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
          <div className="flex items-center gap-4">
            {/* Animated sparkle icon */}
            





            
            <div>
              <p className="font-display text-base font-bold text-foreground">Never Miss an Update</p>
              <p className="text-sm text-muted-foreground">Get instant WhatsApp alerts for results, vacancies & admit cards</p>
            </div>
          </div>
          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link to="/contact"
            className="group flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
              <MessageCircle size={16} />
              Subscribe on WhatsApp
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link to="/blog"
            className="hidden items-center gap-2 rounded-xl border border-border glass px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/30 md:flex">
              Read Blog
            </Link>
          </div>
        </div>
      </div>

      {/* ====== App Highlights Strip ====== */}
      <div className="border-b border-border bg-card/50">
        <div className="container py-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
            {[
            { icon: Globe, value: "36", label: "States & UTs", desc: "Complete pan-India coverage" },
            { icon: Shield, value: "100%", label: "Verified", desc: "Official sources only" },
            { icon: Zap, value: "24/7", label: "Real-time", desc: "Instant notifications" },
            { icon: Heart, value: "Free", label: "Forever", desc: "No hidden charges" }].
            map((item) =>
            <motion.div key={item.label} whileHover={{ y: -2 }}
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4 transition-all hover:border-primary/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-foreground">{item.value} <span className="font-normal text-muted-foreground">{item.label}</span></p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ====== Main Footer Content ====== */}
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column (takes 2 columns on large screens) */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-glow transition-transform group-hover:scale-110">
                <span className="text-xs font-bold text-primary-foreground">ISHU</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-foreground">
                  <span className="text-gradient">ISHU</span>
                </span>
                <span className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground">Indian StudentHub University</span>
              </div>
            </Link>
            
            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              ISHU (Indian StudentHub University) — India's #1 platform for government exam results, vacancies, 
              100+ free PDF tools, and 1000+ daily news articles across 22 languages. Built for India's aspirants.
            </p>

            {/* Feature badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {footerFeatures.map((f) =>
              <div key={f.label} className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground">
                  <f.icon size={10} className="text-primary" />
                  {f.label}
                </div>
              )}
            </div>

            {/* Contact links */}
            <div className="mt-6 flex flex-col gap-3">
              <a href="mailto:ishukryk@gmail.com" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Mail size={12} />
                </div>
                ishukryk@gmail.com
              </a>
              <a href="tel:8986985813" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Phone size={12} />
                </div>
                +91 8986985813
              </a>
              <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-all">
                  <MessageCircle size={12} />
                </div>
                WhatsApp Chat
              </a>
            </div>

            {/* Social media links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((s) =>
              <motion.a key={s.label} href={s.href} title={s.label} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:shadow-glow">
                  <s.icon size={16} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Navigation link columns */}
          {Object.entries(footerLinks).map(([title, links]) =>
          <div key={title}>
              <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
              <div className="mt-2 h-0.5 w-8 rounded-full bg-primary/40" />
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) =>
              <li key={link.label}>
                    <Link to={link.href}
                className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 transition-transform">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
                      {link.label}
                      {link.label.includes("→") && <ArrowUpRight size={10} className="opacity-0 transition-opacity group-hover:opacity-100 text-primary" />}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        {/* ====== Bottom Bar ====== */}
        <div className="mt-14 rounded-2xl border border-border bg-secondary/30 px-8 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>. All rights reserved.
            </p>
            {/* Legal links */}
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">About Us</Link>
            </div>
            {/* Made with love message */}
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Made with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><Heart size={14} className="text-destructive fill-destructive" /></motion.span> for India's students
            </p>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;