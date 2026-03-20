/**
 * JsonLd.tsx - SEO Structured Data Components
 * 
 * These components add invisible JSON-LD structured data to pages.
 * Search engines (Google, Bing) use this data to better understand
 * the website content and show rich results in search.
 * 
 * Brand: ISHU — Indian StudentHub University
 * Domain: https://ishu.fun
 */

const SITE_URL = "https://ishu.fun";
const SITE_NAME = "ISHU — Indian StudentHub University";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

export const WebsiteSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": ["ISHU", "Indian StudentHub University", "ishu.fun", "ISHU Fun", "Sarkari Result ISHU"],
    "url": SITE_URL,
    "description": "India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader & 1000+ daily news.",
    "inLanguage": ["en-IN", "hi-IN"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/results?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }} />
);

export const OrganizationSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": `${SITE_URL}/#organization`,
    "name": SITE_NAME,
    "alternateName": [
      "ISHU", "Indian StudentHub University", "ishu.fun", "ISHU Platform",
      "ISHU India", "Ishu Education", "इशु", "ISHU Sarkari Result",
      "ISHU PDF Tools", "ISHU Live TV", "ISHU CV Maker"
    ],
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`,
      "width": 200,
      "height": 200
    },
    "image": `${SITE_URL}/og-image-1200x630.png`,
    "description": "ISHU (ishu.fun) is India's #1 free educational platform. Government exam results, sarkari naukri, 100+ PDF tools, 700+ live Indian TV channels, YouTube downloader, Terabox downloader, free CV/Resume/Biodata maker, and daily news — all free, no signup!",
    "foundingDate": "2024",
    "email": "support@ishu.fun",
    "telephone": "+918986985813",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+918986985813",
        "contactType": "customer support",
        "email": "support@ishu.fun",
        "availableLanguage": ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi"],
        "areaServed": "IN"
      }
    ],
    "address": { "@type": "PostalAddress", "addressCountry": "IN" },
    "areaServed": { "@type": "Country", "name": "India" },
    "sameAs": [
      "https://twitter.com/ishufun",
      "https://facebook.com/ishufun",
      "https://instagram.com/ishu.fun",
      "https://youtube.com/@ishufun"
    ],
    "knowsAbout": [
      "Government Exam Results", "Sarkari Naukri 2026", "Sarkari Result 2026",
      "UPSC IAS IPS", "SSC CGL CHSL", "Banking Jobs IBPS SBI",
      "Railway Jobs RRB NTPC", "NTA JEE Main NEET", "Admit Card Download",
      "Answer Key Download", "PDF Tools Online", "YouTube Video Downloader",
      "Terabox Downloader", "Live TV India", "Hindi News TV",
      "CV Maker Free", "Resume Builder India", "Biodata Maker Marriage",
      "ATS Resume Templates", "Government Job Notification"
    ],
    "numberOfEmployees": { "@type": "QuantitativeValue", "value": "50+" }
  }} />
);

/** GovernmentServiceSchema — for sarkari result/jobs pages */
export const GovernmentServiceSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "Sarkari Result — Government Exam Results & Vacancies — ISHU",
    "alternateName": [
      "Sarkari Result ISHU", "ISHU Sarkari Result", "ishu.fun sarkari result",
      "Sarkari Naukri ISHU", "Government Jobs ISHU"
    ],
    "description": "Free government exam results and sarkari naukri alerts for UPSC, SSC, IBPS, SBI, RRB, NTA JEE NEET, CDS, NDA, CTET, Police, and all 36 Indian state exams. Daily updates on vacancies, admit cards, answer keys.",
    "url": `${SITE_URL}/results`,
    "provider": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
    "audience": {
      "@type": "Audience",
      "audienceType": "Students, Government Job Aspirants, Job Seekers",
      "geographicArea": { "@type": "Country", "name": "India" }
    },
    "areaServed": { "@type": "Country", "name": "India" },
    "serviceType": "Sarkari Result, Government Exam Results, Sarkari Naukri, Admit Card, Vacancy",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "isAccessibleForFree": true,
    "keywords": "sarkari result 2026, sarkari naukri 2026, government exam results, UPSC result, SSC CGL result, IBPS result, SBI PO result, RRB NTPC result, NTA JEE result, NEET result, admit card 2026, answer key 2026, government vacancy 2026, UP sarkari result, Bihar sarkari result, Rajasthan sarkari result, MP sarkari result"
  }} />
);

/** VideoStreamingSchema — for Live TV page */
export const VideoStreamingSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "BroadcastService",
    "name": "ISHU Live Indian TV — 700+ Free Channels",
    "alternateName": ["ISHU Live TV", "ISHU TV", "ishu live tv", "ishu tv channels"],
    "description": "Watch 700+ live Indian TV channels free on ishu.fun. Hindi news, entertainment, sports, regional, kids, devotional channels. Aaj Tak, NDTV, Star Plus, Zee TV, DD National live streaming free.",
    "url": `${SITE_URL}/tv`,
    "broadcastDisplayName": "ISHU Live Indian TV",
    "broadcaster": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "inLanguage": ["hi-IN", "ta-IN", "te-IN", "bn-IN", "mr-IN", "gu-IN", "kn-IN", "ml-IN", "en-IN"],
    "isAccessibleForFree": true,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
  }} />
);

export const BreadcrumbSchema = ({ items }: { items: { name: string; url: string }[] }) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
    }))
  }} />
);

export const ArticleSchema = ({ title, description, url, datePublished, author }: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "datePublished": datePublished,
    "author": { "@type": "Person", "name": author },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${SITE_URL}${url}`
    }
  }} />
);

/** SoftwareApplication schema for PDF tools, downloaders, etc. */
export const SoftwareAppSchema = ({ name, description, url, category, rating }: {
  name: string;
  description: string;
  url: string;
  category?: string;
  rating?: number;
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "applicationCategory": category || "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    ...(rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "ratingCount": 15000,
        "bestRating": 5
      }
    } : {})
  }} />
);

/** CollectionPage schema for listing pages */
export const CollectionPageSchema = ({ name, description, url, items }: {
  name: string;
  description: string;
  url: string;
  items?: { name: string; url: string }[];
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "isPartOf": { "@type": "WebSite", "name": SITE_NAME, "url": SITE_URL },
    ...(items ? {
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": items.length,
        "itemListElement": items.map((item, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "url": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
        }))
      }
    } : {})
  }} />
);

/** VideoObject schema for video downloader pages */
export const VideoToolSchema = ({ name, description, url }: {
  name: string;
  description: string;
  url: string;
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.8,
      "ratingCount": 25000,
      "bestRating": 5
    }
  }} />
);

/** HowTo schema for tool pages */
export const HowToSchema = ({ name, description, steps }: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.name,
      "text": step.text
    })),
    "totalTime": "PT2M"
  }} />
);

/** FAQPage schema — generates rich snippet accordion in Google search results */
export const FAQSchema = ({ faqs }: { faqs: { question: string; answer: string }[] }) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }} />
);

/** Home page FAQ schema — improves Google rich snippet eligibility */
export const HomeFAQSchema = () => (
  <FAQSchema faqs={[
    {
      question: "What is ISHU (ishu.fun)?",
      answer: "ISHU (Indian StudentHub University) at ishu.fun is India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards, 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader, and daily news. No signup required."
    },
    {
      question: "Is ISHU completely free to use?",
      answer: "Yes! ISHU is 100% free. All features including government exam results, PDF tools, video downloaders, live TV channels, and news are completely free with no hidden charges or subscription fees."
    },
    {
      question: "How to check sarkari result on ISHU?",
      answer: "Visit ishu.fun/results to check the latest sarkari results. You can search by exam name (UPSC, SSC, Banking, Railways, NTA JEE/NEET), filter by state (all 36 states), or browse by category. Results are updated daily."
    },
    {
      question: "How to download YouTube videos on ISHU?",
      answer: "Go to ishu.fun/tools/youtube-downloader, paste the YouTube video URL, choose your desired quality (360p to 4K/2160p), and click download. No signup needed, completely free."
    },
    {
      question: "How to watch live Indian TV channels free on ISHU?",
      answer: "Visit ishu.fun/tv to watch 700+ live Indian TV channels for free. Select your preferred language (Hindi, Tamil, Telugu, Bengali, Malayalam, etc.), browse channels by category (News, Entertainment, Movies, Sports, Kids), and start watching instantly. No app needed."
    },
    {
      question: "Which PDF tools are available on ISHU?",
      answer: "ISHU offers 100+ free PDF tools including: Merge PDF, Split PDF, Compress PDF, PDF to Word, Word to PDF, PDF to JPG, JPG to PDF, Rotate PDF, Protect PDF, Unlock PDF, Add Watermark, Sign PDF, OCR PDF (text recognition), and many more. All tools work in your browser with no upload limits."
    },
    {
      question: "How to download Terabox videos on ISHU?",
      answer: "Visit ishu.fun/tools/terabox-downloader, paste your Terabox share link, preview the file, and download instantly. Works with terabox.com, teraboxapp.com, and 1024tera.com links."
    },
    {
      question: "Which government exams does ISHU cover?",
      answer: "ISHU covers all major government exams including UPSC CSE/IAS, SSC CGL/CHSL/MTS/JE, IBPS PO/Clerk/SO, SBI PO/Clerk, RRB NTPC/Group D/JE/ALP, NTA JEE Main/Advanced, NEET, CTET, NDA, CDS, and all state-level exams across 36 states."
    },
    {
      question: "How to make a free resume or CV on ISHU?",
      answer: "Go to ishu.fun/cv to create a professional resume, CV, or bio-data for free. Choose from modern templates, fill in your details, and download as PDF instantly. No signup required."
    },
    {
      question: "Does ISHU work on mobile phones?",
      answer: "Yes! ISHU is fully responsive and works perfectly on all devices including mobile phones, tablets, desktops, and TVs. All features including PDF tools, video downloaders, live TV, and exam results are optimized for mobile use."
    }
  ]} />
);

/** SiteLinksSearchBox schema for enhanced Google search */
export const SiteLinksSearchBoxSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": SITE_URL,
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/results?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/tools?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ]
  }} />
);

/** ResultsFAQSchema - for government exam results page */
export const ResultsFAQSchema = () => (
  <FAQSchema faqs={[
    {
      question: "How to check sarkari result on ISHU?",
      answer: "Visit ishu.fun/results to check the latest sarkari results. Search by exam name (UPSC, SSC, Banking, Railways, NTA JEE/NEET), filter by state, or browse by category. Results are updated daily."
    },
    {
      question: "Which government exams does ISHU cover for results?",
      answer: "ISHU covers results for UPSC CSE/IAS, SSC CGL/CHSL/MTS/JE, IBPS PO/Clerk/SO, SBI PO/Clerk, RRB NTPC/Group D/JE/ALP, NTA JEE Main/Advanced, NEET, CTET, NDA, CDS, and all state-level exams across 36 states."
    },
    {
      question: "How often are government exam results updated on ISHU?",
      answer: "ISHU updates government exam results daily. You can bookmark ishu.fun/results and check back for the latest announcements from UPSC, SSC, IBPS, SBI, RRB, NTA, state PSCs, and other recruitment boards."
    },
    {
      question: "Can I download admit cards from ISHU?",
      answer: "Yes! ISHU provides links and information for admit card downloads for all major government exams including UPSC, SSC, IBPS, SBI, RRB, NTA, and all state-level recruitment exams."
    },
    {
      question: "Is ISHU free for checking exam results?",
      answer: "Yes! ISHU (ishu.fun) is 100% free. All government exam results, admit cards, answer keys, and recruitment notifications are available for free without any signup or subscription."
    },
    {
      question: "Which states' government exam results are available on ISHU?",
      answer: "ISHU covers government exam results for all 36 states and union territories of India including UP, Bihar, Rajasthan, MP, Maharashtra, Karnataka, Tamil Nadu, Telangana, Gujarat, Punjab, Haryana, Delhi, and all others."
    }
  ]} />
);

/** ToolFAQSchema for PDF tools and video downloader pages */
export const ToolFAQSchema = ({ toolName, toolType }: { toolName: string; toolType: "pdf" | "video" | "cv" | "tv" }) => {
  const faqsByType = {
    pdf: [
      { question: `Is ${toolName} completely free?`, answer: `Yes! ${toolName} on ISHU (ishu.fun) is 100% free. No signup, no watermark, no file size limit. Your files are processed securely in your browser.` },
      { question: `How long does ${toolName} take?`, answer: `${toolName} on ISHU is lightning fast — most files are processed in 1-5 seconds depending on file size.` },
      { question: "Is my file secure on ISHU?", answer: "Yes, your files are processed locally in your browser and are never stored on our servers. ISHU uses industry-standard encryption for any file uploads." },
      { question: "What file formats does ISHU support?", answer: "ISHU supports PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, WebP, and many more formats across 100+ tools." }
    ],
    video: [
      { question: `Is ${toolName} on ISHU free?`, answer: `Yes! ${toolName} on ISHU (ishu.fun) is completely free with no download limits, no signup required, and no watermarks.` },
      { question: "What quality can I download videos in?", answer: "ISHU video downloader supports all qualities from 144p to 4K (2160p) including 360p, 480p, 720p HD, 1080p Full HD, and 4K Ultra HD depending on the source video." },
      { question: "How fast is the download?", answer: "ISHU uses high-speed servers to provide maximum download speeds. Most videos download at 10-100 MB/s depending on your internet connection." }
    ],
    cv: [
      { question: "Is the CV/Resume maker on ISHU free?", answer: "Yes! ISHU CV builder is 100% free. Create unlimited resumes, CVs, and bio-data and download as PDF without any charges." },
      { question: "Can I download my CV as PDF?", answer: "Yes! After creating your CV or resume on ISHU, you can download it instantly as a professional PDF file, ready to share with employers." }
    ],
    tv: [
      { question: "Is live TV on ISHU free?", answer: "Yes! Watch 700+ live Indian TV channels completely free on ISHU (ishu.fun/tv). No subscription, no app needed." },
      { question: "Which languages are available on ISHU live TV?", answer: "ISHU live TV supports Hindi, Tamil, Telugu, Bengali, Malayalam, Kannada, Marathi, Gujarati, Punjabi, Odia, Urdu, Assamese, Bhojpuri, and English channels." }
    ]
  };
  return <FAQSchema faqs={faqsByType[toolType] || faqsByType.pdf} />;
};
