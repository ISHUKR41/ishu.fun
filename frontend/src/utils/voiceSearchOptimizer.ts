/**
 * VOICE SEARCH & FEATURED SNIPPET OPTIMIZER
 * 
 * Optimizes content for:
 * ✓ Google Assistant
 * ✓ Amazon Alexa
 * ✓ Apple Siri
 * ✓ Microsoft Cortana
 * ✓ Featured Snippets (Position 0)
 * ✓ Knowledge Panels
 * ✓ Answer Cards
 * ✓ Listicles
 * ✓ FAQ Schema
 */

export interface VoiceQueryOptimization {
  conversationalKeywords: string[];
  questionFormat: string;
  answerFormat: string;
  characterLimit: number;
}

export interface FeaturedSnippetOptimization {
  type: 'paragraph' | 'list' | 'table' | 'definition';
  content: string;
  targetLength: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE SEARCH OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Common voice search patterns and their optimizations
 */
export const VOICE_SEARCH_PATTERNS = {
  HOW_TO: {
    pattern: 'how to [action]',
    examples: [
      'how to download youtube videos',
      'how to convert pdf to word',
      'how to find government jobs',
      'how to prepare for ssc exam',
      'how to apply for government job',
    ],
    optimize: (topic: string) => `
Step-by-step guide: How to ${topic}
1. Start with clear, direct answer
2. Use numbered steps (1, 2, 3...)
3. Keep each step under 20 words
4. Include practical examples
5. Add estimated time needed`,
  },

  WHAT_IS: {
    pattern: 'what is [noun]',
    examples: [
      'what is sarkari result',
      'what is ssc exam',
      'what is government job',
      'what is pdf converter',
    ],
    optimize: (topic: string) => `
Definition-based answer for: What is ${topic}
1. Provide clear definition (1-2 sentences)
2. Explain key components
3. Give real-world example
4. Mention benefits/uses
5. Link to related topics`,
  },

  WHERE_TO: {
    pattern: 'where to [action/find]',
    examples: [
      'where to find government jobs',
      'where to download admit card',
      'where to check exam result',
    ],
    optimize: (topic: string) => `
Location-based answer for: Where to ${topic}
1. List official websites first
2. Provide direct links
3. Mention alternative sources
4. Include access instructions
5. Add mobile-friendly note`,
  },

  WHEN_WILL: {
    pattern: 'when will [event]',
    examples: [
      'when will government announce jobs',
      'when will admit card release',
      'when will result be declared',
    ],
    optimize: (event: string) => `
Time-based answer for: When will ${event}
1. Provide expected date/timeframe
2. Link to official notification
3. Mention last year's timeline
4. Suggest how to get notifications
5. Add calendar entry option`,
  },

  WHY_SHOULD: {
    pattern: 'why should i [action]',
    examples: [
      'why should i apply for government job',
      'why should i use this platform',
      'why should i learn this skill',
    ],
    optimize: (action: string) => `
Benefit-based answer for: Why should I ${action}
1. List top 3-5 main benefits
2. Provide statistics if available
3. Include success stories
4. Compare with alternatives
5. Add call-to-action`,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURED SNIPPET OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Optimize content for featured snippets
 */
export const optimizeForFeaturedSnippet = (
  question: string,
  answer: string,
  type: 'paragraph' | 'list' | 'table' | 'definition' = 'paragraph'
): FeaturedSnippetOptimization => {
  const optimizations: Record<string, FeaturedSnippetOptimization> = {
    paragraph: {
      type: 'paragraph',
      content: `
        <h3>${question}</h3>
        <p>${answer}</p>
        <!-- Keep under 58 words for snippet display -->
      `,
      targetLength: 58,
    },
    list: {
      type: 'list',
      content: `
        <h3>${question}</h3>
        <ol>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
          <li>Fourth item</li>
        </ol>
      `,
      targetLength: 60,
    },
    table: {
      type: 'table',
      content: `
        <h3>${question}</h3>
        <table>
          <tr><th>Column 1</th><th>Column 2</th></tr>
          <tr><td>Data 1</td><td>Data 2</td></tr>
        </table>
      `,
      targetLength: 100,
    },
    definition: {
      type: 'definition',
      content: `
        <h3>${question}</h3>
        <p><strong>Definition:</strong> ${answer}</p>
      `,
      targetLength: 50,
    },
  };

  return optimizations[type];
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA FOR VOICE SEARCH & FEATURED SNIPPETS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate FAQ schema for voice search
 */
export const generateVoiceSearchFAQSchema = (faqs: Array<{
  question: string;
  answer: string;
}>): any => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer,
    },
  })),
});

/**
 * Generate HowTo schema for voice search
 */
export const generateVoiceHowToSchema = (data: {
  name: string;
  description: string;
  steps: Array<{ name: string; description: string }>;
}): any => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  'name': data.name,
  'description': data.description,
  'step': data.steps.map((step, index) => ({
    '@type': 'HowToStep',
    'position': index + 1,
    'name': step.name,
    'itemListElement': {
      '@type': 'HowToDirection',
      'text': step.description,
    },
  })),
});

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE SEARCH CONTENT TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const VoiceSearchTemplates = {
  /**
   * Question & Answer format
   */
  QA: (question: string, answer: string) =>
    `<div class="voice-search-qa">
      <h2>${question}</h2>
      <p>${answer}</p>
    </div>`,

  /**
   * Numbered steps format
   */
  STEPS: (title: string, steps: string[]) =>
    `<div class="voice-search-steps">
      <h2>${title}</h2>
      <ol>
        ${steps.map(step => `<li>${step}</li>`).join('\n')}
      </ol>
    </div>`,

  /**
   * Comparison format
   */
  COMPARISON: (
    title: string,
    items: Array<{ name: string; description: string }>
  ) =>
    `<div class="voice-search-comparison">
      <h2>${title}</h2>
      ${items.map(item => `<h3>${item.name}</h3><p>${item.description}</p>`).join('\n')}
    </div>`,

  /**
   * Definition format
   */
  DEFINITION: (term: string, definition: string, example?: string) =>
    `<div class="voice-search-definition">
      <h2>${term}</h2>
      <p><strong>Definition:</strong> ${definition}</p>
      ${example ? `<p><strong>Example:</strong> ${example}</p>` : ''}
    </div>`,

  /**
   * Timeline format
   */
  TIMELINE: (title: string, events: Array<{ date: string; event: string }>) =>
    `<div class="voice-search-timeline">
      <h2>${title}</h2>
      <ul>
        ${events.map(e => `<li><strong>${e.date}:</strong> ${e.event}</li>`).join('\n')}
      </ul>
    </div>`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE SEARCH OPTIMIZATION CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════════

export const VOICE_SEARCH_OPTIMIZATION_CHECKLIST = [
  '✓ Use conversational keywords (natural language)',
  '✓ Answer short questions (under 30 words)',
  '✓ Use clear, concise HTML structure',
  '✓ Implement FAQ schema markup',
  '✓ Optimize for long-tail keywords',
  '✓ Use question-based headings (H2, H3)',
  '✓ Add structured data markup',
  '✓ Create featured snippet-worthy content',
  '✓ Use numbered lists for steps',
  '✓ Include definitions for terms',
  '✓ Add local business information',
  '✓ Use natural speech patterns',
  '✓ Include question words in content',
  '✓ Create concise answer summaries',
  '✓ Optimize for mobile devices',
  '✓ Use schema.org markup',
  '✓ Create FAQ pages',
  '✓ Use descriptive headings',
  '✓ Include knowledge panel optimization',
  '✓ Add local SEO elements',
];

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE SEARCH ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════

export class VoiceSearchOptimizer {
  private content: string = '';
  private keywords: string[] = [];

  constructor(content: string, keywords: string[] = []) {
    this.content = content;
    this.keywords = keywords;
  }

  /**
   * Check if content is optimized for voice search
   */
  isVoiceSearchOptimized(): boolean {
    const checks = {
      hasConversationalKeywords: this.detectConversationalKeywords(),
      hasConciseAnswers: this.checkAnswerConciseness(),
      hasFAQSchema: this.checkFAQSchema(),
      hasGoodReadability: this.checkReadability(),
    };

    return Object.values(checks).filter(Boolean).length >= 3;
  }

  /**
   * Detect conversational keywords
   */
  private detectConversationalKeywords(): boolean {
    const patterns = [
      /how to/gi,
      /what is/gi,
      /where to/gi,
      /when will/gi,
      /why should/gi,
      /can i/gi,
      /is it/gi,
    ];

    return patterns.some(pattern => pattern.test(this.content));
  }

  /**
   * Check if answers are concise
   */
  private checkAnswerConciseness(): boolean {
    const paragraphs = this.content.split('\n');
    const conciseParagraphs = paragraphs.filter(p => p.split(' ').length < 50);
    return conciseParagraphs.length / paragraphs.length > 0.5;
  }

  /**
   * Check for FAQ schema
   */
  private checkFAQSchema(): boolean {
    return /FAQPage|schema\.org.*FAQ/i.test(this.content);
  }

  /**
   * Check readability
   */
  private checkReadability(): boolean {
    const avgWordLength = this.content.split(' ').reduce((acc, word) => acc + word.length, 0) / this.content.split(' ').length;
    return avgWordLength < 6; // Average word length less than 6 characters for easy reading
  }

  /**
   * Get optimization score
   */
  getOptimizationScore(): number {
    const maxScore = 100;
    let score = 0;

    if (this.detectConversationalKeywords()) score += 25;
    if (this.checkAnswerConciseness()) score += 25;
    if (this.checkFAQSchema()) score += 25;
    if (this.checkReadability()) score += 25;

    return Math.min(score, maxScore);
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (!this.detectConversationalKeywords()) {
      recommendations.push('Add more conversational keywords (how to, what is, where to, etc.)');
    }

    if (!this.checkAnswerConciseness()) {
      recommendations.push('Make your answers more concise (keep under 50 words per sentence)');
    }

    if (!this.checkFAQSchema()) {
      recommendations.push('Add FAQ schema markup for better voice search visibility');
    }

    if (!this.checkReadability()) {
      recommendations.push('Use simpler, shorter words for better voice search understanding');
    }

    return recommendations;
  }
}
