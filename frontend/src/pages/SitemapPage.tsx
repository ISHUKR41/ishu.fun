import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import SitemapViewer from "@/components/seo/SitemapViewer";
import { Link } from "react-router-dom";
import { FileText, ExternalLink } from "lucide-react";

const SitemapPage = () => {
  const xmlSitemaps = [
    { name: "Main Sitemap", url: "/sitemap.xml", desc: "All core pages" },
    { name: "Sitemap Index", url: "/sitemap-index.xml", desc: "Index of all sitemaps" },
    { name: "Expanded Sitemap", url: "/sitemap-expanded.xml", desc: "All tool & result pages" },
    { name: "Jobs Sitemap", url: "/sitemap-jobs.xml", desc: "All government job pages" },
    { name: "Tools Sitemap", url: "/sitemap-tools.xml", desc: "All PDF & utility tools" },
    { name: "Image Sitemap", url: "/sitemap-image.xml", desc: "All image resources" },
    { name: "Video Sitemap", url: "/sitemap-video.xml", desc: "All video content" },
  ];

  return (
    <Layout>
      <SEOHead
        title="Sitemap — All Pages | ISHU Indian StudentHub University"
        description="Complete sitemap of ISHU — Indian StudentHub University. Browse all pages including government exam results, sarkari jobs, PDF tools, live TV channels, news, and more."
        keywords="ISHU sitemap, site map, all pages, ISHU pages, government exam results pages, PDF tools pages, live TV pages, news pages"
        canonical="/sitemap"
        breadcrumbs={[
          { name: "Home", url: "https://ishu.fun/" },
          { name: "Sitemap", url: "https://ishu.fun/sitemap" },
        ]}
      />
      <div className="container py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Site Map
          </h1>
          <p className="mt-3 text-muted-foreground">
            Browse all pages on ISHU — India's #1 student portal
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {xmlSitemaps.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <FileText size={14} className="text-primary" />
                {s.name}
                <ExternalLink size={12} className="text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        <SitemapViewer />

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>
            Looking for a specific page?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            or use the search in the navigation bar.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SitemapPage;
