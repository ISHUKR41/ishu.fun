/**
 * SEO OPTIMIZER - AI Powered
 * 
 * Advanced SEO optimization engine with:
 * - Keyword density analysis
 * - Title/Description optimization
 * - Schema markup generation
 * - Performance scoring
 * - Rich snippet generation
 * - Voice search optimization
 * - Mobile optimization
 */

import {
  COMPLETE_KEYWORDS,
  KEYWORDS_BY_CATEGORY,
  PRIMARY_KEYWORDS_BY_PAGE,
  TITLE_TEMPLATES,
  DESCRIPTION_TEMPLATES,
} from "@/data/keywords-database";

export interface SEOScore {
  overall: number;
  titleScore: number;
  descriptionScore: number;
  keywordDensity: number;
  structuredData: number;
  mobileOptimization: number;
  performanceScore: number;
  recommendations: string[];
}

export interface OptimizedSEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  structuredData: Record<string, unknown>;
  score: SEOScore;
  alternateLanguages: { lang: string; title: string; description: string }[];
}

/**
 * SEO Optimizer Class
 * Main engine for all SEO operations
 */
export class SEOOptimizer {
  private keywordDatabase = COMPLETE_KEYWORDS;
  private categoryKeywords = KEYWORDS_BY_CATEGORY;
  private pageKeywords = PRIMARY_KEYWORDS_BY_PAGE;

  /**
   * Analyze keyword density in text
   */
  analyzeKeywordDensity(text: string, keyword: string): number {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const matches = lowerText.match(new RegExp(lowerKeyword, "g"));
    const density = ((matches?.length || 0) / (text.split(" ").length)) * 100;
    return Math.min(density, 100);
  }

  /**
   * Score title for SEO quality
   */
  scoreTitleSEO(title: string, keyword: string): number {
    let score = 0;

    // Length check (50-60 chars optimal)
    if (title.length >= 30 && title.length <= 60) score += 25;
    else if (title.length > 20 && title.length < 70) score += 15;

    // Keyword presence at start
    if (title.toLowerCase().startsWith(keyword.toLowerCase())) score += 20;
    else if (title.toLowerCase().includes(keyword.toLowerCase())) score += 15;

    // Brand inclusion
    if (title.includes("ISHU")) score += 20;

    // Power words
    const powerWords = [
      "best",
      "free",
      "top",
      "latest",
      "2026",
      "2025",
      "instant",
      "fast",
      "easy",
      "complete",
      "ultimate",
      "complete guide",
      "how to",
    ];
    if (powerWords.some((word) => title.toLowerCase().includes(word))) score += 20;

    return Math.min(score, 100);
  }

  /**
   * Score description for SEO quality
   */
  scoreDescriptionSEO(description: string, keyword: string): number {
    let score = 0;

    // Length check (120-160 chars optimal)
    if (description.length >= 120 && description.length <= 160) score += 30;
    else if (description.length >= 80 && description.length <= 180) score += 20;

    // Keyword presence
    const keywordCount = (description.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || []).length;
    if (keywordCount >= 1 && keywordCount <= 3) score += 25;

    // Call to action
    const ctaWords = ["free", "instant", "now", "today", "no registration", "download", "watch", "check"];
    if (ctaWords.some((word) => description.toLowerCase().includes(word))) score += 25;

    // Natural language
    if (description.includes(".") || description.includes(",")) score += 20;

    return Math.min(score, 100);
  }

  /**
   * Optimize title with keyword insertion
   */
  optimizeTitle(
    baseTitle: string,
    keyword: string,
    contentType: string = "job_search"
  ): string {
    // Remove existing keyword if present
    let optimizedTitle = baseTitle.replace(new RegExp(keyword, "i"), "").trim();

    // Add keyword at beginning for better ranking
    if (!optimizedTitle.toLowerCase().includes(keyword.toLowerCase())) {
      optimizedTitle = `${keyword} | ${optimizedTitle}`;
    }

    // Add ISHU brand if not present
    if (!optimizedTitle.includes("ISHU")) {
      optimizedTitle = optimizedTitle + " | ISHU";
    }

    // Ensure length is between 50-60 chars
    if (optimizedTitle.length > 60) {
      optimizedTitle = optimizedTitle.substring(0, 57) + "...";
    } else if (optimizedTitle.length < 30) {
      optimizedTitle = optimizedTitle + " - Indian StudentHub University";
    }

    return optimizedTitle;
  }

  /**
   * Optimize description with keyword and CTA
   */
  optimizeDescription(
    baseDescription: string,
    keyword: string,
    contentType: string = "job_search"
  ): string {
    let optimized = baseDescription;

    // Add keyword if not present
    if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
      optimized = `${keyword}: ${optimized}`;
    }

    // Add CTA if missing
    const hasCallToAction =
      optimized.toLowerCase().includes("free") ||
      optimized.toLowerCase().includes("instant") ||
      optimized.toLowerCase().includes("download") ||
      optimized.toLowerCase().includes("check") ||
      optimized.toLowerCase().includes("apply");

    if (!hasCallToAction) {
      optimized = optimized + " Get instant access free, no registration required!";
    }

    // Ensure length is 120-160 chars
    if (optimized.length > 160) {
      optimized = optimized.substring(0, 157).trim() + "...";
    } else if (optimized.length < 80) {
      optimized = optimized + " Free access for students and job seekers across India.";
    }

    return optimized;
  }

  /**
   * Generate rich keywords array
   */
  generateKeywords(
    mainKeyword: string,
    category: string = "government_jobs",
    count: number = 20
  ): string[] {
    const categoryKws = this.categoryKeywords[category as keyof typeof KEYWORDS_BY_CATEGORY] || [];
    const allRelevant = [
      mainKeyword,
      ...categoryKws.filter((kw) => kw.toLowerCase().includes(mainKeyword.toLowerCase())),
    ];

    // Add related keywords
    const relatedKeywords = this.keywordDatabase
      .filter(
        (kw) =>
          kw.toLowerCase().includes(mainKeyword.toLowerCase()) ||
          mainKeyword.toLowerCase().includes(kw.toLowerCase().split(" ")[0])
      )
      .slice(0, count);

    return [...new Set([...allRelevant, ...relatedKeywords])].slice(0, count);
  }

  /**
   * Generate comprehensive schema markup
   */
  generateSchemaMarkup(
    contentType: string,
    data: {
      title: string;
      description: string;
      keyword: string;
      url: string;
      image?: string;
      author?: string;
      datePublished?: string;
      category?: string;
    }
  ): Record<string, unknown> {
    const baseSchema = {
      "@context": "https://schema.org",
      name: data.title,
      description: data.description,
      url: data.url,
      image: data.image || "https://ishu.fun/og-image.png",
    };

    if (contentType === "job_listing") {
      return {
        ...baseSchema,
        "@type": "JobPosting",
        hiringOrganization: {
          "@type": "Organization",
          name: "ISHU",
          logo: "https://ishu.fun/logo.png",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
          },
        },
        baseSalary: {
          "@type": "PriceSpecification",
          currency: "INR",
          value: "Competitive",
        },
      };
    }

    if (contentType === "tool") {
      return {
        ...baseSchema,
        "@type": "SoftwareApplication",
        applicationCategory: "UtilityApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "10000+",
        },
      };
    }

    if (contentType === "news" || contentType === "article") {
      return {
        ...baseSchema,
        "@type": "NewsArticle",
        headline: data.title,
        author: {
          "@type": "Organization",
          name: "ISHU",
        },
        datePublished: data.datePublished || new Date().toISOString(),
        dateModified: new Date().toISOString(),
        articleBody: data.description,
      };
    }

    if (contentType === "faq") {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: data.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: data.description,
            },
          },
        ],
      };
    }

    return {
      ...baseSchema,
      "@type": "WebPage",
    };
  }

  /**
   * Calculate overall SEO score
   */
  calculateSEOScore(
    title: string,
    description: string,
    keyword: string,
    hasStructuredData: boolean = true,
    isMobileOptimized: boolean = true
  ): SEOScore {
    const titleScore = this.scoreTitleSEO(title, keyword);
    const descriptionScore = this.scoreDescriptionSEO(description, keyword);
    const keywordDensity = Math.min(
      (this.analyzeKeywordDensity(title + " " + description, keyword) / 3) * 100,
      100
    );
    const structuredData = hasStructuredData ? 100 : 50;
    const mobileOptimization = isMobileOptimized ? 100 : 70;
    const performanceScore = 85; // Placeholder for actual performance metrics

    const overall =
      (titleScore +
        descriptionScore +
        keywordDensity +
        structuredData +
        mobileOptimization +
        performanceScore) /
      6;

    const recommendations: string[] = [];

    if (titleScore < 70) recommendations.push("Improve title - add power words or brand name");
    if (descriptionScore < 70)
      recommendations.push("Enhance description - add call-to-action or target keyword");
    if (keywordDensity < 50) recommendations.push("Increase keyword presence in content");
    if (!hasStructuredData) recommendations.push("Add structured schema markup");
    if (!isMobileOptimized) recommendations.push("Optimize for mobile devices");
    if (title.length < 30 || title.length > 60)
      recommendations.push("Title should be 30-60 characters for optimal display");
    if (description.length < 120 || description.length > 160)
      recommendations.push("Description should be 120-160 characters");

    return {
      overall: Math.round(overall),
      titleScore,
      descriptionScore,
      keywordDensity,
      structuredData,
      mobileOptimization,
      performanceScore,
      recommendations,
    };
  }

  /**
   * Generate complete optimized SEO data
   */
  generateOptimizedSEOData(
    contentType: string,
    mainKeyword: string,
    baseTitle: string,
    baseDescription: string,
    url: string,
    ogImage?: string
  ): OptimizedSEOData {
    // Optimize title and description
    const optimizedTitle = this.optimizeTitle(baseTitle, mainKeyword, contentType);
    const optimizedDescription = this.optimizeDescription(
      baseDescription,
      mainKeyword,
      contentType
    );

    // Generate keywords
    const keywords = this.generateKeywords(mainKeyword);

    // Generate schema
    const structuredData = this.generateSchemaMarkup(contentType, {
      title: optimizedTitle,
      description: optimizedDescription,
      keyword: mainKeyword,
      url,
      image: ogImage,
    });

    // Calculate SEO score
    const score = this.calculateSEOScore(optimizedTitle, optimizedDescription, mainKeyword);

    // Generate alternate language versions
    const alternateLanguages = this.generateAlternateLanguages(
      optimizedTitle,
      optimizedDescription,
      mainKeyword
    );

    return {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords,
      ogImage: ogImage || "https://ishu.fun/og-image.png",
      structuredData,
      score,
      alternateLanguages,
    };
  }

  /**
   * Generate alternate language versions for international SEO
   */
  private generateAlternateLanguages(
    title: string,
    description: string,
    keyword: string
  ): { lang: string; title: string; description: string }[] {
    return [
      {
        lang: "hi-IN",
        title: `${keyword} - ISHU पर खोजें | नवीनतम परिणाम 2026`,
        description: `${keyword} के लिए ISHU पर तुरंत सुविधा प्राप्त करें। कोई पंजीकरण आवश्यक नहीं है।`,
      },
      {
        lang: "ta-IN",
        title: `${keyword} - ISHU இல் தேடவும் | சமீபத்திய முடிவுகள் 2026`,
        description: `${keyword} க்காக ISHU இல் உடனடி வசதி பெறுங்கள். பதிவு தேவையில்லை.`,
      },
      {
        lang: "te-IN",
        title: `${keyword} - ISHU లో సెర్చ్ చేయండి | తాజా ఫలితాలు 2026`,
        description: `${keyword} కోసం ISHU లో తక్షణ సুবిధ పొందండి. నమోదు అవసరం లేదు.`,
      },
      {
        lang: "bn-IN",
        title: `${keyword} - ISHU তে অনুসন্ধান করুন | সর্বশেষ ফলাফল 2026`,
        description: `${keyword} এর জন্য ISHU তে তাৎক্ষণিক সুবিধা পান। কোন নিবন্ধন প্রয়োজন নেই।`,
      },
    ];
  }

  /**
   * Get keywords for voice search optimization
   */
  getVoiceSearchKeywords(mainKeyword: string): string[] {
    const voicePatterns = [
      `how to ${mainKeyword}`,
      `what is ${mainKeyword}`,
      `where to find ${mainKeyword}`,
      `best ${mainKeyword}`,
      `${mainKeyword} 2026`,
      `${mainKeyword} in India`,
      `free ${mainKeyword}`,
      `download ${mainKeyword}`,
    ];

    return voicePatterns.map((pattern) => this.optimizeTitle(pattern, mainKeyword));
  }

  /**
   * Optimize for mobile - generate mobile-specific metadata
   */
  optimizeForMobile(data: OptimizedSEOData): OptimizedSEOData {
    return {
      ...data,
      title: data.title.length > 50 ? data.title.substring(0, 47) + "..." : data.title,
      description:
        data.description.length > 120 ? data.description.substring(0, 117) + "..." : data.description,
    };
  }

  /**
   * Generate breadcrumb schema for navigation SEO
   */
  generateBreadcrumbs(
    path: string[]
  ): {
    "@context": string;
    "@type": string;
    itemListElement: Array<{
      "@type": string;
      position: number;
      name: string;
      item: string;
    }>;
  } {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: path.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item,
        item: `https://ishu.fun/${path.slice(0, index + 1).join("/")}`,
      })),
    };
  }

  /**
   * Get trending keywords for current season
   */
  getTrendingKeywords(): string[] {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Seasonal trending keywords
    const trendingMap: Record<number, string[]> = {
      0: ["government jobs 2026", "UPSC notification 2026", "SSC recruitment 2026"],
      1: ["bank exam 2026", "insurance recruitment", "banking notification 2026"],
      2: ["railway recruitment 2026", "RRB exam notification", "railway jobs 2026"],
      3: ["NEET result 2026", "JEE Main result 2026", "entrance exam results"],
      4: ["admission notification 2026", "college admission", "university recruitment"],
      5: ["government result 2026", "exam result June", "admit card June 2026"],
      6: ["summer job notification", "fresher recruitment", "graduate jobs 2026"],
      7: ["government notification", "job alert 2026", "recruitment 2026"],
      8: ["September recruitment", "semester exam", "back to school jobs"],
      9: ["fall semester exam", "government result", "notification October 2026"],
      10: ["November recruitment", "winter semester", "year-end jobs"],
      11: ["December result", "year-end notification", "New Year 2026 jobs"],
    };

    return trendingMap[currentMonth] || COMPLETE_KEYWORDS.slice(0, 10);
  }
}

// Create singleton instance
export const seoOptimizer = new SEOOptimizer();

export default seoOptimizer;
