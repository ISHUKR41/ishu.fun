/**
 * BlogPostPage.tsx - Individual Blog Post Page (410 lines)
 * 
 * Shows a full blog article with detailed content about exam preparation.
 * Uses the blog slug from the URL to find the matching post data.
 * 
 * Features:
 * - Full article content with formatted paragraphs and headings
 * - Author info card with bio
 * - Social sharing buttons (WhatsApp, Twitter, LinkedIn, Copy)
 * - Like/bookmark functionality
 * - Related posts section at bottom
 * - Tags display for SEO and navigation
 * - Reading time estimate
 * - Breadcrumb navigation
 */
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Clock, Heart, ArrowLeft, Share2, BookOpen, Calendar, User, ChevronRight, MessageCircle, Twitter, Linkedin, Copy, Check, Sparkles } from "lucide-react";

const blogData: Record<string, {
  title: string; excerpt: string; content: string[]; readTime: number; likes: number;
  category: string; date: string; author: string; authorBio: string;
  tags: string[]; related: string[];
}> = {
  "complete-upsc-cse-2026-preparation-strategy": {
    title: "Complete UPSC CSE 2026 Preparation Strategy",
    excerpt: "A comprehensive guide to cracking UPSC Civil Services with the right strategy, resources, and timeline.",
    content: [
      "The Union Public Service Commission (UPSC) Civil Services Examination is considered one of the toughest competitive exams in the world. Every year, lakhs of aspirants appear for this exam, but only a few hundred make it to the final list. This comprehensive guide will help you build a solid preparation strategy for UPSC CSE 2026.",
      "## Understanding the Exam Pattern\n\nThe UPSC CSE consists of three stages: Preliminary Examination (Objective), Main Examination (Written), and Personality Test (Interview). The Prelims has two papers — General Studies Paper I (100 questions, 200 marks) and CSAT Paper II (80 questions, 200 marks, qualifying).",
      "## Month-wise Preparation Timeline\n\n**Months 1-3: Foundation Building**\nStart with NCERT textbooks from Class 6 to 12 for History, Geography, Polity, Economics, and Science. This builds your fundamental understanding. Read 'Indian Polity' by M. Laxmikanth and 'Indian Economy' by Ramesh Singh simultaneously.",
      "## Subject-wise Strategy\n\n**History:** Cover ancient, medieval, and modern Indian history. Focus on art & culture for Prelims. For Mains, emphasize post-independence history and freedom movement.\n\n**Geography:** Physical geography from NCERT, then move to Indian geography. Maps are crucial — practice them daily.",
      "## Current Affairs Strategy\n\nRead 'The Hindu' or 'Indian Express' daily. Make monthly notes covering government schemes, international relations, economy, science & technology. Use Yojana and Kurukshetra magazines for specific topics.",
      "## Optional Subject Selection\n\nChoose based on: (1) Interest and aptitude, (2) Overlap with GS, (3) Availability of coaching/material, (4) Scoring trend. Popular optionals: Sociology, Geography, Public Administration, History, Political Science.",
      "## Answer Writing Practice\n\nStart answer writing from Day 1 of Mains preparation. Write at least 2 answers daily. Focus on: structure (intro-body-conclusion), diagrams, data points, and staying within word limits. Join a test series for evaluation.",
      "## Revision Strategy\n\nFollow the 1-3-7-21 revision cycle. Revise what you studied 1 day ago, 3 days ago, 7 days ago, and 21 days ago. Use mind maps and flowcharts for quick revision before the exam."
    ],
    readTime: 12, likes: 342, category: "UPSC", date: "Mar 8, 2026", author: "Ishu Kumar",
    authorBio: "Founder of ISHU (Indian StudentHub University). Passionate about making government exam preparation accessible to every student in India.",
    tags: ["UPSC", "IAS", "Civil Services", "Preparation Strategy", "2026"],
    related: ["top-10-mistakes-ssc-cgl-aspirants-make", "state-pcs-vs-upsc-which-one-should-you-choose"]
  },
  "top-10-mistakes-ssc-cgl-aspirants-make": {
    title: "Top 10 Mistakes SSC CGL Aspirants Make",
    excerpt: "Avoid these common pitfalls that most SSC CGL candidates fall into during their preparation journey.",
    content: [
      "SSC CGL is one of the most popular government exams in India, attracting millions of candidates every year. However, many aspirants make common mistakes that can be easily avoided with proper awareness and planning.",
      "## Mistake 1: Not Understanding the Exam Pattern\n\nMany candidates jump into preparation without fully understanding the four tiers of SSC CGL. Tier-I is online, Tier-II has multiple papers, and the pattern changes frequently. Always check the latest notification.",
      "## Mistake 2: Ignoring Mathematics\n\nMaths is the highest-scoring section in SSC CGL. Many graduates from non-math backgrounds avoid it, but with 3-4 months of dedicated practice, anyone can score 40+ in Quantitative Aptitude.",
      "## Mistake 3: Not Practicing Previous Year Papers\n\nPrevious year papers are the best resource for understanding question types, difficulty level, and time management. Solve at least 50 previous papers before the exam.",
      "## Mistake 4: Over-relying on Coaching\n\nCoaching can guide you, but self-study is essential. Spend at least 6-8 hours daily on self-study in addition to coaching classes.",
      "## Mistake 5: Neglecting English\n\nEnglish carries significant weightage in Tier-I and Tier-II. Focus on grammar rules, vocabulary, and reading comprehension. Read English newspapers daily.",
      "## Mistake 6: No Time Management Practice\n\nSSC CGL is all about speed and accuracy. Practice with timer from Day 1. In Tier-I, you get 60 minutes for 100 questions — that's 36 seconds per question.",
      "## Mistake 7: Ignoring General Awareness\n\nGA section has the highest weightage in Tier-I. Cover static GK (history, geography, science) and current affairs (last 6 months). This section can make or break your selection.",
      "## Mistake 8: Not Taking Mock Tests\n\nMock tests simulate exam conditions and help identify weak areas. Take at least 2 full-length mocks per week in the last 2 months.",
      "## Mistake 9: Studying Too Many Books\n\nStick to 1-2 standard books per subject. Quality of preparation matters more than quantity of resources. Revision of one good book is better than reading five books once.",
      "## Mistake 10: Giving Up Too Early\n\nSSC CGL preparation takes 8-12 months for most aspirants. Stay consistent, follow a schedule, and don't compare your progress with others."
    ],
    readTime: 8, likes: 256, category: "SSC", date: "Mar 7, 2026", author: "Content Team",
    authorBio: "The ISHU Content Team brings you expert insights and preparation strategies for all major government exams.",
    tags: ["SSC", "CGL", "Mistakes", "Preparation Tips"],
    related: ["complete-upsc-cse-2026-preparation-strategy", "how-to-crack-banking-exams-in-3-months"]
  },
  "how-to-crack-banking-exams-in-3-months": {
    title: "How to Crack Banking Exams in 3 Months",
    excerpt: "A proven 90-day plan for IBPS PO, SBI PO, and RBI exams with daily schedule and resource list.",
    content: [
      "Banking exams like IBPS PO, SBI PO, and RBI Grade B are among the most sought-after government job opportunities in India. With the right strategy, you can crack these exams in just 90 days of focused preparation.",
      "## Week 1-2: Foundation Phase\n\n**Quantitative Aptitude:** Master basic concepts — percentages, profit & loss, simple/compound interest, ratio & proportion. Practice 50 questions daily from Arun Sharma or RS Aggarwal.\n\n**Reasoning:** Start with coding-decoding, blood relations, direction sense, and syllogisms. These are easiest to score.",
      "## Week 3-4: Building Speed\n\n**English:** Focus on reading comprehension, cloze test, error spotting, and fill in the blanks. Read editorials from 'The Hindu' daily. Learn 20 new words every day.\n\n**General Awareness:** Start making monthly capsules of banking awareness, current affairs, and static GK.",
      "## Week 5-8: Advanced Problem Solving\n\n**Data Interpretation:** Master tables, bar graphs, pie charts, line graphs, and caselet DI. This is the highest-scoring area in banking exams. Practice sets from Arun Sharma's DI book.\n\n**Puzzles & Seating Arrangement:** These carry 15-20 marks in Prelims. Practice floor-based, linear, and circular seating arrangements.",
      "## Week 9-10: Mock Test Phase\n\n**Take 2 mocks daily** — one Prelims, one Mains pattern. Analyze every mock thoroughly:\n- Time spent per section\n- Accuracy percentage\n- Questions attempted vs total\n- Identify patterns of mistakes",
      "## Week 11-12: Revision & Exam Strategy\n\n**Revise all formulas and shortcuts.** Focus on your strong areas first in the exam. In Prelims, attempt qualifying sections (English) first, then move to scoring sections (Quant, Reasoning).\n\n**Important:** Never leave negative marking questions unanswered if you can eliminate 2 options. The probability favors attempting.",
      "## Daily Schedule Template\n\n**6:00 AM - 8:00 AM:** Quantitative Aptitude (2 hours)\n**8:30 AM - 10:30 AM:** Reasoning & Puzzles (2 hours)\n**11:00 AM - 12:30 PM:** English & Reading (1.5 hours)\n**2:00 PM - 3:30 PM:** General Awareness (1.5 hours)\n**4:00 PM - 6:00 PM:** Mock Test (2 hours)\n**6:30 PM - 8:00 PM:** Mock Analysis & Revision (1.5 hours)"
    ],
    readTime: 10, likes: 189, category: "Banking", date: "Mar 6, 2026", author: "Ishu Kumar",
    authorBio: "Founder of ISHU (Indian StudentHub University). Passionate about making government exam preparation accessible to every student in India.",
    tags: ["Banking", "IBPS PO", "SBI PO", "90-Day Plan", "Preparation"],
    related: ["complete-upsc-cse-2026-preparation-strategy", "top-10-mistakes-ssc-cgl-aspirants-make"]
  },
  "jee-main-vs-jee-advanced-key-differences": {
    title: "JEE Main vs JEE Advanced: Key Differences",
    excerpt: "Understanding the exam pattern, difficulty level, and preparation approach for both JEE exams.",
    content: [
      "JEE Main and JEE Advanced are India's most prestigious engineering entrance examinations. While both are conducted for engineering admissions, they differ significantly in pattern, difficulty, and purpose. This guide breaks down everything you need to know.",
      "## Conducting Body\n\n**JEE Main** is conducted by the National Testing Agency (NTA), while **JEE Advanced** is conducted by one of the seven IITs on a rotational basis. In 2026, IIT Bombay is the organizing institute.",
      "## Eligibility\n\n**JEE Main:** Students who have passed 12th with Physics, Chemistry, and Mathematics with at least 75% marks (65% for reserved categories). Maximum 3 attempts in consecutive years.\n\n**JEE Advanced:** Only the top 2,50,000 rank holders in JEE Main are eligible. Maximum 2 attempts in consecutive years. Must have been born on or after October 1, 2001.",
      "## Exam Pattern Comparison\n\n**JEE Main:**\n- 90 questions (30 per subject)\n- 300 marks total\n- 3-hour duration\n- MCQ + Numerical value type\n- Negative marking: -1 for wrong MCQ\n\n**JEE Advanced:**\n- Variable questions per year\n- Two papers (Paper 1 & Paper 2), each 3 hours\n- MCQ, numerical, matrix match, paragraph-based\n- Different marking schemes per section",
      "## Difficulty Level\n\n**JEE Main** tests conceptual understanding and application. Questions are moderate difficulty, designed to filter students for NITs, IIITs, and JEE Advanced eligibility.\n\n**JEE Advanced** tests deep analytical thinking and problem-solving. Questions often combine multiple concepts from different chapters. It's significantly harder than JEE Main.",
      "## Preparation Strategy\n\n**For JEE Main:**\n- Focus on NCERT thoroughly\n- Practice topic-wise questions from HC Verma, RD Sharma\n- Take full-length mocks regularly\n- Speed and accuracy are key\n\n**For JEE Advanced:**\n- Go beyond NCERT — study Irodov, Pathfinder, MS Chauhan\n- Focus on conceptual depth, not just formula application\n- Practice previous 20 years papers (PYQs are gold)\n- Join advanced-level test series",
      "## Which One Should You Focus On?\n\nIf your goal is IIT, prepare for JEE Advanced from the start. JEE Main preparation automatically gets covered. If your target is NIT or IIIT, focus primarily on JEE Main pattern and difficulty."
    ],
    readTime: 6, likes: 421, category: "NTA", date: "Mar 5, 2026", author: "Content Team",
    authorBio: "The ISHU Content Team brings you expert insights and preparation strategies for all major government exams.",
    tags: ["JEE Main", "JEE Advanced", "Engineering", "IIT", "NIT"],
    related: ["neet-ug-2026-complete-preparation-timeline", "complete-upsc-cse-2026-preparation-strategy"]
  },
  "best-free-pdf-tools-for-students-in-2026": {
    title: "Best Free PDF Tools for Students in 2026",
    excerpt: "How to use PDF tools effectively for organizing study materials, notes, and previous year papers.",
    content: [
      "As a student preparing for competitive exams, you deal with hundreds of PDFs — study materials, previous year papers, notes, admit cards, and notifications. Having the right PDF tools can save you hours of work and keep your preparation organized.",
      "## 1. Merge PDF — Combine Your Study Notes\n\nIf you have chapter-wise notes in separate PDFs, merge them into one comprehensive file. Our Merge PDF tool lets you combine unlimited PDFs in any order. Simply drag and drop your files, rearrange them, and download the merged document.",
      "## 2. Compress PDF — Save Storage Space\n\nScanned PDFs can be huge (50-100MB). Use Compress PDF to reduce file size by up to 90% without losing quality. Perfect for sharing notes on WhatsApp groups or uploading to cloud storage.",
      "## 3. PDF to Word — Edit Official Documents\n\nNeed to edit a notification or syllabus PDF? Convert it to Word format, make your changes, and convert back. Great for creating customized study plans from official syllabi.",
      "## 4. Split PDF — Extract Important Pages\n\nFrom a 200-page question paper PDF, extract only the topics you need. Split PDF lets you select specific page ranges and save them as separate files.",
      "## 5. OCR PDF — Make Scanned PDFs Searchable\n\nHandwritten notes scanned as PDFs aren't searchable. OCR (Optical Character Recognition) converts scanned images to searchable text. Now you can Ctrl+F through your handwritten notes!",
      "## 6. JPG to PDF — Organize Handwritten Notes\n\nTake photos of your handwritten notes and convert them to a organized PDF. Arrange multiple images in order and create a clean PDF document.",
      "## Pro Tips for Students\n\n**Tip 1:** Create subject-wise folders and merge all related PDFs into single files.\n**Tip 2:** Compress all PDFs before backing up to save cloud storage.\n**Tip 3:** Use watermark tool to add your name on shared notes.\n**Tip 4:** Convert important notifications to Word for offline highlighting and annotation.\n**Tip 5:** Use page numbers tool on merged PDFs for easy navigation during revision."
    ],
    readTime: 5, likes: 178, category: "Tools", date: "Mar 4, 2026", author: "Ishu Kumar",
    authorBio: "Founder of ISHU (Indian StudentHub University). Passionate about making government exam preparation accessible to every student in India.",
    tags: ["PDF Tools", "Study Tips", "Students", "Free Tools", "Productivity"],
    related: ["how-to-crack-banking-exams-in-3-months", "top-10-mistakes-ssc-cgl-aspirants-make"]
  },
  "state-pcs-vs-upsc-which-one-should-you-choose": {
    title: "State PCS vs UPSC: Which One Should You Choose?",
    excerpt: "A detailed comparison to help you decide the right path based on your goals and preparation level.",
    content: [
      "One of the most common dilemmas for civil services aspirants is choosing between UPSC (Union Public Service Commission) and State PCS (Provincial Civil Services). Both offer prestigious government positions, but they differ significantly in scope, difficulty, and career trajectory.",
      "## Understanding UPSC CSE\n\nUPSC Civil Services Examination recruits for All India Services (IAS, IPS, IFS) and Central Services. Officers posted across India with transfers between states. The exam is conducted in English/Hindi with optional regional languages for some papers.",
      "## Understanding State PCS\n\nState PCS exams (like UPPSC, BPSC, MPPSC, RPSC) recruit for state-level administrative services. Officers are posted within their respective states. Exams can be given in regional languages, making them more accessible for vernacular medium students.",
      "## Key Differences\n\n**Difficulty Level:** UPSC is significantly harder with 10 lakh+ applicants for ~1000 seats. State PCS has fewer applicants per seat but the competition is still fierce.\n\n**Syllabus:** UPSC covers national and international topics. State PCS has additional state-specific subjects (state history, geography, current affairs).\n\n**Career Growth:** IAS officers can become District Magistrate, Divisional Commissioner, Secretary to GoI. State PCS officers can become SDM, CDO, and state-level secretaries.",
      "## When to Choose UPSC\n\n- You have strong fundamentals across all subjects\n- You're comfortable with English medium\n- You want an All India Service career\n- You're willing to dedicate 2-3 years of focused preparation\n- Age is on your side (multiple attempts available)",
      "## When to Choose State PCS\n\n- You prefer working in your home state\n- You're more comfortable in regional language\n- You want to start as a government officer sooner\n- Your target state has relatively less competition\n- You have strong knowledge of state-specific topics",
      "## Can You Prepare for Both Simultaneously?\n\nYes! The core syllabus (History, Geography, Polity, Economy, Science) overlaps 60-70%. Many successful candidates prepare for UPSC as their primary target and appear for State PCS as a backup. The key is to add state-specific preparation 2-3 months before the State PCS exam.",
      "## Our Recommendation\n\nStart with UPSC-level preparation. It covers everything State PCS requires and more. Appear for both exams to maximize your chances. Remember — even if you don't crack UPSC, you can have a fulfilling career through State PCS."
    ],
    readTime: 9, likes: 267, category: "Career Guide", date: "Mar 3, 2026", author: "Content Team",
    authorBio: "The ISHU Content Team brings you expert insights and preparation strategies for all major government exams.",
    tags: ["UPSC", "State PCS", "Career Guide", "Civil Services", "Comparison"],
    related: ["complete-upsc-cse-2026-preparation-strategy", "from-village-to-ias-inspiring-success-stories"]
  },
  "from-village-to-ias-inspiring-success-stories": {
    title: "From Village to IAS: Inspiring Success Stories",
    excerpt: "Real stories of IAS officers who came from humble backgrounds and cracked the toughest exam in India.",
    content: [
      "The UPSC Civil Services Examination is often called the great equalizer — it doesn't matter where you come from, what matters is your determination and hard work. Here are inspiring stories of IAS officers who rose from humble beginnings to serve the nation.",
      "## Story 1: From a Small Village in Bihar to IAS\n\nA young aspirant from a remote village in Bihar's Gaya district, with no electricity and limited internet access, cracked UPSC in his third attempt. He studied under streetlights, used free YouTube lectures, and walked 5 km daily to reach the nearest library. Today, he serves as an IAS officer in his home state.",
      "## Story 2: Auto-Rickshaw Driver's Son Becomes IPS\n\nGrowing up watching his father drive an auto-rickshaw in Pune, this aspirant dreamed of wearing the khaki. Despite financial constraints, he secured a scholarship for his graduation and self-studied for UPSC. His father's auto-rickshaw had a small poster that read 'My son will be an IPS officer.' That dream came true in 2024.",
      "## Story 3: First-Generation Learner from Tribal Community\n\nComing from a tribal community in Odisha where going to college was unheard of, she became the first woman from her village to graduate. With the support of a local NGO that provided her free books and mentorship, she cracked UPSC in her very first attempt with an All India Rank under 100.",
      "## Story 4: From Night Watchman to IAS Officer\n\nWhile preparing for UPSC in Delhi, this aspirant worked as a night watchman to support himself. He studied during the day after his night shift, sleeping only 4-5 hours. After two failed attempts, he cleared the exam in his third attempt. Today, he's known for his work in rural development.",
      "## Common Lessons from These Stories\n\n**1. Background doesn't define destiny.** UPSC is merit-based — your knowledge and presentation matter, not your surname or wealth.\n\n**2. Consistency beats intensity.** Studying 6 hours daily for 18 months is better than studying 16 hours daily for 3 months and burning out.\n\n**3. Free resources are enough.** NCERT books, YouTube lectures, newspaper editorials, and PYQs — you don't need expensive coaching to crack UPSC.\n\n**4. Mental health matters.** All successful candidates emphasize the importance of breaks, exercise, and having a support system.",
      "## Your Turn\n\nIf these people from the most challenging circumstances could crack UPSC, so can you. Start today, stay consistent, and never give up. ISHU is here to provide you with every resource you need — results, notifications, PDF tools, and preparation guides — completely free."
    ],
    readTime: 15, likes: 534, category: "Success Stories", date: "Mar 2, 2026", author: "Ishu Kumar",
    authorBio: "Founder of ISHU (Indian StudentHub University). Passionate about making government exam preparation accessible to every student in India.",
    tags: ["IAS", "Success Stories", "Inspiration", "UPSC", "Motivation"],
    related: ["complete-upsc-cse-2026-preparation-strategy", "state-pcs-vs-upsc-which-one-should-you-choose"]
  },
  "neet-ug-2026-complete-preparation-timeline": {
    title: "NEET UG 2026: Complete Preparation Timeline",
    excerpt: "Month-by-month preparation strategy for NEET aspirants. Covers Physics, Chemistry & Biology with best books.",
    content: [
      "NEET UG is the single entrance exam for MBBS, BDS, AYUSH, and other medical courses across India. With over 20 lakh candidates appearing annually, a structured preparation timeline is crucial for success.",
      "## Phase 1: Foundation (Months 1-3)\n\n**Biology (2 hours/day):** Start with NCERT Class 11 — Cell Biology, Plant Morphology, Animal Physiology. NCERT is the BIBLE for NEET Biology. Read every line, diagram, and footnote.\n\n**Chemistry (1.5 hours/day):** Begin with Physical Chemistry basics — Mole concept, Atomic Structure, Chemical Bonding. Use NCERT + OP Tandon.\n\n**Physics (1.5 hours/day):** Start with Mechanics — Units, Motion, Laws of Motion. Use HC Verma for concepts and DC Pandey for practice.",
      "## Phase 2: Core Concepts (Months 4-6)\n\n**Biology:** Complete Class 12 NCERT — Genetics, Evolution, Ecology, Reproduction. Make comparative charts for different biological processes.\n\n**Chemistry:** Organic Chemistry fundamentals — GOC, Named Reactions, Mechanism. This is the most scoring part if basics are strong.\n\n**Physics:** Electrostatics, Current Electricity, Optics, Modern Physics. Focus on numerical problems — NEET Physics is becoming more numerical-based.",
      "## Phase 3: Advanced Practice (Months 7-9)\n\n**MTG Fingertips** for all three subjects. Solve topic-wise previous year questions (minimum 10 years). Take chapter tests after completing each chapter.\n\nFocus on high-weightage topics:\n- Biology: Genetics (8-10 Qs), Ecology (6-8 Qs), Plant Physiology (5-6 Qs)\n- Chemistry: Organic Chemistry (15-18 Qs), Coordination Chemistry (3-4 Qs)\n- Physics: Mechanics (8-10 Qs), Electrodynamics (6-8 Qs)",
      "## Phase 4: Mock Tests & Revision (Months 10-12)\n\n**Take 3 full-length mocks per week.** Analyze every mock — mark questions you got wrong and revise those topics.\n\n**Revision schedule:**\n- Day 1: Biology Class 11\n- Day 2: Chemistry Physical + Inorganic\n- Day 3: Physics Mechanics + Electrodynamics\n- Day 4: Biology Class 12\n- Day 5: Chemistry Organic\n- Day 6: Physics Optics + Modern\n- Day 7: Full mock test",
      "## Best Books for NEET 2026\n\n**Biology:** NCERT (mandatory), MTG Fingertips, Trueman's Biology\n**Chemistry:** NCERT, OP Tandon (Physical), MS Chauhan (Organic), VK Jaiswal (Inorganic)\n**Physics:** HC Verma, DC Pandey, NCERT\n**Practice:** Previous 15 years NEET papers, MTG chapter-wise",
      "## Exam Day Tips\n\n1. Attempt Biology first (highest scoring, boosts confidence)\n2. Then Chemistry (Organic + Inorganic first, Physical last)\n3. Physics last (most time-consuming)\n4. Don't spend more than 2 minutes on any single question\n5. Mark uncertain questions for review\n6. Never leave NCERT-based questions — they're gifts!"
    ],
    readTime: 14, likes: 389, category: "NTA", date: "Mar 1, 2026", author: "Content Team",
    authorBio: "The ISHU Content Team brings you expert insights and preparation strategies for all major government exams.",
    tags: ["NEET", "Medical", "Preparation", "Timeline", "MBBS"],
    related: ["jee-main-vs-jee-advanced-key-differences", "best-free-pdf-tools-for-students-in-2026"]
  },
  "railway-group-d-exam-everything-you-need-to-know": {
    title: "Railway Group D Exam: Everything You Need to Know",
    excerpt: "Complete guide covering eligibility, syllabus, previous papers, and preparation strategy for RRB Group D.",
    content: [
      "Railway Group D (Level 1) is one of the largest recruitment drives in India, with over 1 lakh vacancies in recent years. This guide covers everything from eligibility to exam strategy.",
      "## Eligibility\n\n**Age:** 18-33 years (relaxation for reserved categories)\n**Education:** 10th Pass + ITI in relevant trade OR National Apprenticeship Certificate\n**Nationality:** Indian citizen",
      "## Exam Pattern\n\n**Computer Based Test (CBT):**\n- 100 questions, 90 minutes\n- Mathematics: 25 Qs\n- General Intelligence & Reasoning: 30 Qs\n- General Science: 25 Qs\n- General Awareness & Current Affairs: 20 Qs\n- Negative marking: 1/3 per wrong answer",
      "## Subject-wise Preparation\n\n**Mathematics:** Focus on Number System, BODMAS, LCM/HCF, Percentage, Ratio, Average, Speed-Time-Distance, Simple/Compound Interest. Practice mental math shortcuts.\n\n**Reasoning:** Coding-Decoding, Blood Relations, Direction, Venn Diagrams, Puzzles, Analogies. This section is scoring with practice.\n\n**General Science:** Physics (Laws of Motion, Electricity), Chemistry (Acids-Bases, Metals), Biology (Human Body, Diseases, Nutrition) from NCERT Class 6-10.\n\n**Current Affairs:** Last 6 months news, government schemes, sports awards, national/international events.",
      "## Physical Efficiency Test (PET)\n\nAfter clearing CBT, candidates must pass PET:\n- **Male:** Carry 35 kg for 100m in 2 minutes, Run 1000m in 4 min 15 sec\n- **Female:** Carry 20 kg for 100m in 2 minutes, Run 1000m in 5 min 40 sec\n\nStart physical training alongside your study preparation!",
      "## Preparation Tips\n\n1. Solve previous 5 years papers (available free on ISHU)\n2. Take one mock test daily in the last month\n3. Focus on accuracy over speed — negative marking can hurt\n4. Read Lucent's GK for General Awareness\n5. Practice reasoning puzzles for 30 minutes daily"
    ],
    readTime: 7, likes: 212, category: "Railways", date: "Feb 28, 2026", author: "Ishu Kumar",
    authorBio: "Founder of ISHU (Indian StudentHub University). Passionate about making government exam preparation accessible to every student in India.",
    tags: ["Railway", "Group D", "RRB", "Level 1", "Exam Guide"],
    related: ["top-10-mistakes-ssc-cgl-aspirants-make", "how-to-crack-banking-exams-in-3-months"]
  },
  "how-whatsapp-alerts-can-help-your-exam-preparation": {
    title: "How WhatsApp Alerts Can Help Your Exam Preparation",
    excerpt: "Never miss an important notification — learn how to set up exam alerts on WhatsApp.",
    content: [
      "In the fast-paced world of government exams, missing a notification deadline can cost you an entire year of preparation. WhatsApp alerts ensure you never miss critical updates about form dates, admit cards, and results.",
      "## Why WhatsApp Alerts?\n\n**Speed:** WhatsApp messages are delivered instantly — faster than emails or website notifications.\n**Convenience:** You already check WhatsApp multiple times a day.\n**Reliability:** Unlike SMS, WhatsApp messages don't get lost or filtered as spam.\n**Rich Content:** We include links, key dates, and quick summaries in every alert.",
      "## What Alerts Do You Get?\n\n1. **New Vacancy Notifications** — When any government body releases a new recruitment\n2. **Application Deadline Reminders** — 7 days and 1 day before last date\n3. **Admit Card Releases** — Instant alert when hall tickets are available\n4. **Result Declarations** — Be the first to know when results are out\n5. **Answer Key Releases** — Check your answers immediately after exam",
      "## How to Subscribe\n\n1. Sign up on ISHU with your WhatsApp number\n2. Go to notification preferences\n3. Select your exam categories (UPSC, SSC, Banking, etc.)\n4. Select your states for state-level exam alerts\n5. That's it! You'll start receiving personalized alerts",
      "## Sample Alert Message\n\n🎯 NEW VACANCY ALERT\n📋 Post: SSC CGL 2026\n🏛️ Organization: Staff Selection Commission\n💼 Vacancies: 15,000+\n📅 Last Date: April 30, 2026\n📌 Category: SSC\n🎓 Qualification: Any Graduate\n👉 Apply: [link]\n\nThis format gives you all essential information at a glance without needing to visit any website.",
      "## Privacy & Control\n\nYour WhatsApp number is never shared with third parties. You can unsubscribe anytime by replying STOP or updating your preferences in your ISHU account settings. We send maximum 3-4 messages per day to avoid cluttering your inbox."
    ],
    readTime: 4, likes: 156, category: "Tips & Tricks", date: "Feb 27, 2026", author: "Content Team",
    authorBio: "The ISHU Content Team brings you expert insights and preparation strategies for all major government exams.",
    tags: ["WhatsApp", "Notifications", "Alerts", "Exam Tips", "Productivity"],
    related: ["best-free-pdf-tools-for-students-in-2026", "how-to-crack-banking-exams-in-3-months"]
  },
};

const BlogPostPage = () => {
  const { blogSlug } = useParams<{ blogSlug: string }>();
  const post = blogSlug ? blogData[blogSlug] : null;
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  const toc = post?.content
    .filter((p) => p.startsWith("## "))
    .map((p) => p.replace("## ", "").split("\n")[0]) || [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Post Not Found</h1>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Reading Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-16 left-0 right-0 z-50 h-1 origin-left bg-primary"
      />

      {/* Breadcrumb + Meta */}
      <section className="bg-gradient-hero pt-6 pb-10">
        <div className="container">
          <FadeInView>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground">
              <Sparkles size={14} className="text-primary" />
              <span className="font-medium"><strong className="text-foreground">ISHU</strong> — Indian StudentHub University</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight size={14} />
              <Link to="/blog" className="hover:text-foreground">Blog</Link>
              <ChevronRight size={14} />
              <span className="text-foreground">{post.category}</span>
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
              <span className="flex items-center gap-1"><Heart size={14} /> {post.likes + (liked ? 1 : 0)}</span>
              <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{post.category}</span>
            </div>
          </FadeInView>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-4">
            {/* Sticky TOC Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="font-display text-sm font-bold text-foreground">Table of Contents</h3>
                <nav className="mt-4 space-y-2">
                  {toc.map((heading, i) => (
                    <p key={i} className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-primary">
                      {heading}
                    </p>
                  ))}
                </nav>

                {/* Share */}
                <div className="mt-8">
                  <h3 className="font-display text-sm font-bold text-foreground">Share</h3>
                  <div className="mt-3 flex gap-2">
                    <a href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + window.location.href)}`} target="_blank" rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground hover:text-green-400 hover:border-green-400/30">
                      <MessageCircle size={16} />
                    </a>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground hover:text-sky-400 hover:border-sky-400/30">
                      <Twitter size={16} />
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground hover:text-blue-400 hover:border-blue-400/30">
                      <Linkedin size={16} />
                    </a>
                    <button onClick={handleCopyLink}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-primary/30">
                      {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose-custom space-y-6">
                {post.content.map((paragraph, i) => (
                  <FadeInView key={i} delay={Math.min(i * 0.05, 0.3)}>
                    {paragraph.startsWith("## ") ? (
                      <div>
                        <h2 className="mt-8 font-display text-xl font-bold text-foreground md:text-2xl">
                          {paragraph.split("\n")[0].replace("## ", "")}
                        </h2>
                        {paragraph.split("\n").slice(1).filter(Boolean).map((line, j) => (
                          <p key={j} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {line.startsWith("**") ? (
                              <span>
                                <strong className="text-foreground">{line.match(/\*\*(.*?)\*\*/)?.[1]}</strong>
                                {line.replace(/\*\*.*?\*\*/, "")}
                              </span>
                            ) : line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
                    )}
                  </FadeInView>
                ))}
              </article>

              {/* Like + Tags */}
              <div className="mt-12 border-t border-border pt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                      liked ? "bg-destructive/10 text-destructive" : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    {liked ? "Liked" : "Like"} ({post.likes + (liked ? 1 : 0)})
                  </button>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-foreground">{post.author}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{post.authorBio}</p>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              <div className="mt-12">
                <h3 className="font-display text-xl font-bold text-foreground">Related Articles</h3>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {post.related.map((slug) => {
                    const related = blogData[slug];
                    if (!related) return null;
                    return (
                      <Link key={slug} to={`/blog/${slug}`}>
                        <motion.div whileHover={{ y: -4 }}
                          className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-card">
                          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground">{related.category}</span>
                          <h4 className="mt-3 font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{related.title}</h4>
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{related.excerpt}</p>
                          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock size={12} /> {related.readTime} min</span>
                            <span className="flex items-center gap-1"><Heart size={12} /> {related.likes}</span>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            author: { "@type": "Person", name: post.author },
            datePublished: post.date,
            publisher: {
              "@type": "Organization",
              name: "ISHU — Indian StudentHub University",
            },
          }),
        }}
      />
    </Layout>
  );
};

export default BlogPostPage;
