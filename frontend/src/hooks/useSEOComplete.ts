/**
 * useSEOComplete HOOK - React Hook for Comprehensive SEO Implementation
 * Easy integration of all SEO features in React components
 */

import { useEffect } from 'react';
import { metaTagsGenerator } from '@/utils/meta-tags-generator';
import { SchemaGenerator, MetadataGenerator } from '@/utils/seo-ai-integration';
import type { PageMetadata } from '@/utils/meta-tags-generator';

export function useSEOComplete(metadata: PageMetadata) {
  useEffect(() => {
    // Generate and apply all meta tags
    const { metaTags } = metaTagsGenerator.generateComplete(metadata);

    // Remove old meta tags
    document.querySelectorAll(
      'meta[name^="description"], meta[property^="og:"], meta[name^="twitter:"]'
    ).forEach(el => el.remove());

    // Apply new meta tags
    metaTags.forEach(tag => {
      const parser = new DOMParser();
      const el = parser.parseFromString(tag, 'text/html').body.firstElementChild;
      if (el) {
        document.head.appendChild(el);
      }
    });

    // Update title
    if (metadata.title) {
      document.title = metadata.title;
    }

    // Update canonical URL
    if (metadata.canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = metadata.canonicalUrl;
    }

    // Add JSON-LD schema
    const schema = SchemaGenerator.generateOrganizationSchema();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
  }, [metadata]);
}

/**
 * usePageSEO - Simplified page SEO hook
 */
export function usePageSEO(
  title: string,
  description: string,
  keywords: string[] = [],
  canonicalUrl?: string
) {
  useSEOComplete({
    title,
    description,
    keywords,
    canonicalUrl,
  });
}

/**
 * useSEOMonitoring - Monitor SEO issues on page
 */
export function useSEOMonitoring() {
  useEffect(() => {
    const issues: string[] = [];

    const title = document.title;
    if (!title || title.length < 30) issues.push('⚠️ Title too short');
    if (title && title.length > 60) issues.push('⚠️ Title too long');

    const description = document.querySelector('meta[name="description"]');
    if (!description) issues.push('⚠️ Missing description');

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) issues.push('⚠️ Missing OG image');

    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) issues.push('⚠️ Missing canonical');

    const schema = document.querySelector('script[type="application/ld+json"]');
    if (!schema) issues.push('⚠️ Missing schema');

    if (issues.length > 0) {
      console.log('📊 SEO Issues:', issues);
    } else {
      console.log('✅ SEO looks good!');
    }
  }, []);
}

console.log('✅ SEO Complete Hooks Loaded');
