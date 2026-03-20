/**
 * StateResultPage.tsx - Individual State Results Page (189 lines)
 * 
 * Shows exam results and vacancies for a specific Indian state/UT.
 * The state slug from URL is matched against the allStates data array.
 * 
 * Data includes all 28 states and 8 union territories with:
 * - State name, code, capital, region, language
 * - Active status (whether we have live data for that state)
 * - Exam bodies specific to that state (e.g., BPSC for Bihar, MPSC for Maharashtra)
 * 
 * Features:
 * - State info header (name, capital, region, language)
 * - Exam bodies list for the state
 * - Active states show exam data
 * - Inactive states show "Coming Soon" message
 * - Back to results navigation
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import { motion, useScroll, useTransform } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, FileText, Rocket, Sparkles } from "lucide-react";

const allStates = [
  { name: "Andhra Pradesh", slug: "andhra-pradesh", code: "AP", capital: "Amaravati", region: "South India", language: "Telugu", active: true, examBodies: ["APPSC", "AP Police", "AP TET"] },
  { name: "Arunachal Pradesh", slug: "arunachal-pradesh", code: "AR", capital: "Itanagar", region: "Northeast", language: "English", active: false, examBodies: ["APPSC"] },
  { name: "Assam", slug: "assam", code: "AS", capital: "Dispur", region: "Northeast", language: "Assamese", active: false, examBodies: ["APSC"] },
  { name: "Bihar", slug: "bihar", code: "BR", capital: "Patna", region: "East India", language: "Hindi", active: true, examBodies: ["BPSC", "Bihar Police", "Bihar TET", "BSSC"] },
  { name: "Chhattisgarh", slug: "chhattisgarh", code: "CG", capital: "Raipur", region: "Central India", language: "Hindi", active: true, examBodies: ["CGPSC", "CG Police", "CG Vyapam"] },
  { name: "Goa", slug: "goa", code: "GA", capital: "Panaji", region: "West India", language: "Konkani", active: false, examBodies: ["Goa PSC"] },
  { name: "Gujarat", slug: "gujarat", code: "GJ", capital: "Gandhinagar", region: "West India", language: "Gujarati", active: true, examBodies: ["GPSC", "Gujarat Police", "GSSSB"] },
  { name: "Haryana", slug: "haryana", code: "HR", capital: "Chandigarh", region: "North India", language: "Hindi", active: true, examBodies: ["HPSC", "HSSC", "Haryana Police"] },
  { name: "Himachal Pradesh", slug: "himachal-pradesh", code: "HP", capital: "Shimla", region: "North India", language: "Hindi", active: false, examBodies: ["HPPSC"] },
  { name: "Jharkhand", slug: "jharkhand", code: "JH", capital: "Ranchi", region: "East India", language: "Hindi", active: true, examBodies: ["JPSC", "JSSC", "Jharkhand Police"] },
  { name: "Karnataka", slug: "karnataka", code: "KA", capital: "Bengaluru", region: "South India", language: "Kannada", active: true, examBodies: ["KPSC", "KEA", "Karnataka Police"] },
  { name: "Kerala", slug: "kerala", code: "KL", capital: "Thiruvananthapuram", region: "South India", language: "Malayalam", active: true, examBodies: ["Kerala PSC", "Kerala Police"] },
  { name: "Madhya Pradesh", slug: "madhya-pradesh", code: "MP", capital: "Bhopal", region: "Central India", language: "Hindi", active: true, examBodies: ["MPPSC", "MPPEB", "MP Police"] },
  { name: "Maharashtra", slug: "maharashtra", code: "MH", capital: "Mumbai", region: "West India", language: "Marathi", active: true, examBodies: ["MPSC", "Maharashtra Police", "MHADA"] },
  { name: "Manipur", slug: "manipur", code: "MN", capital: "Imphal", region: "Northeast", language: "Manipuri", active: false, examBodies: ["Manipur PSC"] },
  { name: "Meghalaya", slug: "meghalaya", code: "ML", capital: "Shillong", region: "Northeast", language: "Khasi/English", active: false, examBodies: ["Meghalaya PSC"] },
  { name: "Mizoram", slug: "mizoram", code: "MZ", capital: "Aizawl", region: "Northeast", language: "Mizo", active: false, examBodies: ["Mizoram PSC"] },
  { name: "Nagaland", slug: "nagaland", code: "NL", capital: "Kohima", region: "Northeast", language: "English", active: false, examBodies: ["NPSC"] },
  { name: "Odisha", slug: "odisha", code: "OD", capital: "Bhubaneswar", region: "East India", language: "Odia", active: true, examBodies: ["OPSC", "OSSSC", "Odisha Police"] },
  { name: "Punjab", slug: "punjab", code: "PB", capital: "Chandigarh", region: "North India", language: "Punjabi", active: true, examBodies: ["PPSC", "Punjab Police", "PSSSB"] },
  { name: "Rajasthan", slug: "rajasthan", code: "RJ", capital: "Jaipur", region: "West India", language: "Hindi", active: true, examBodies: ["RPSC", "RSMSSB", "Rajasthan Police"] },
  { name: "Sikkim", slug: "sikkim", code: "SK", capital: "Gangtok", region: "Northeast", language: "Nepali", active: false, examBodies: ["SPSC"] },
  { name: "Tamil Nadu", slug: "tamil-nadu", code: "TN", capital: "Chennai", region: "South India", language: "Tamil", active: true, examBodies: ["TNPSC", "TN Police", "TRB"] },
  { name: "Telangana", slug: "telangana", code: "TS", capital: "Hyderabad", region: "South India", language: "Telugu", active: true, examBodies: ["TSPSC", "TS Police"] },
  { name: "Tripura", slug: "tripura", code: "TR", capital: "Agartala", region: "Northeast", language: "Bengali", active: false, examBodies: ["TPSC"] },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", code: "UP", capital: "Lucknow", region: "North India", language: "Hindi", active: true, examBodies: ["UPPSC", "UPSSSC", "UP Police", "UPSEE"] },
  { name: "Uttarakhand", slug: "uttarakhand", code: "UK", capital: "Dehradun", region: "North India", language: "Hindi", active: true, examBodies: ["UKPSC", "UKSSSC"] },
  { name: "West Bengal", slug: "west-bengal", code: "WB", capital: "Kolkata", region: "East India", language: "Bengali", active: true, examBodies: ["WBPSC", "WBSSC", "WB Police"] },
  { name: "Andaman & Nicobar", slug: "andaman-nicobar", code: "AN", capital: "Port Blair", region: "Islands", language: "Hindi", active: false, examBodies: [] },
  { name: "Chandigarh", slug: "chandigarh", code: "CH", capital: "Chandigarh", region: "North India", language: "Hindi/Punjabi", active: false, examBodies: [] },
  { name: "Dadra & N. Haveli", slug: "dadra-nagar-haveli", code: "DN", capital: "Silvassa", region: "West India", language: "Gujarati", active: false, examBodies: [] },
  { name: "Daman & Diu", slug: "daman-diu", code: "DD", capital: "Daman", region: "West India", language: "Gujarati", active: false, examBodies: [] },
  { name: "Delhi", slug: "delhi", code: "DL", capital: "New Delhi", region: "North India", language: "Hindi", active: true, examBodies: ["DSSSB", "Delhi Police"] },
  { name: "Jammu & Kashmir", slug: "jammu-kashmir", code: "JK", capital: "Srinagar", region: "North India", language: "Urdu/Hindi", active: false, examBodies: ["JKPSC", "JKSSB"] },
  { name: "Ladakh", slug: "ladakh", code: "LA", capital: "Leh", region: "North India", language: "Ladakhi", active: false, examBodies: [] },
  { name: "Lakshadweep", slug: "lakshadweep", code: "LD", capital: "Kavaratti", region: "Islands", language: "Malayalam", active: false, examBodies: [] },
  { name: "Puducherry", slug: "puducherry", code: "PY", capital: "Puducherry", region: "South India", language: "Tamil", active: false, examBodies: [] },
];

const StateResultPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const state = allStates.find((s) => s.slug === stateSlug);

  if (!state) {
    return (
      <Layout>
        {/* Dynamic Background Image */}
        <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524803764836-e04eab2d2ef4?auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: bgY
        }} />

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">State Not Found</h1>
            <Link to="/results" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
              <ArrowLeft size={14} /> Back to Results
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!state.active) {
    return (
      <Layout>
        {/* Dynamic Background Image */}
        <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524803764836-e04eab2d2ef4?auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: bgY
        }} />

        <section className="relative flex min-h-[70vh] items-center bg-gradient-hero">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" />
          <div className="container relative text-center">
            <FadeInView>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
              >
                <Rocket size={48} className="text-primary" />
              </motion.div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 font-display text-2xl font-bold text-primary">
                {state.code}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground md:text-5xl">
              </h1>
              <h2 className="mt-4 font-display text-2xl text-gradient">Coming Soon</h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                We're working on bringing {state.name} exam results, vacancies, and notifications to this page. Stay tuned!
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="rounded-lg border border-border bg-card px-4 py-2">🏙️ Capital: {state.capital}</span>
                <span className="rounded-lg border border-border bg-card px-4 py-2">🌍 Region: {state.region}</span>
                <span className="rounded-lg border border-border bg-card px-4 py-2">🗣️ Language: {state.language}</span>
              </div>
              <Link to="/results" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                <ArrowLeft size={14} /> Back to Results
              </Link>
            </FadeInView>
          </div>
        </section>
      </Layout>
    );
  }

  // Active state page
  return (
    <Layout>
      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1524803764836-e04eab2d2ef4?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      <section className="bg-gradient-hero pt-8 pb-14">
        <div className="container">
          <FadeInView>
            <Link to="/results" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft size={14} /> Back to All Results
            </Link>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground ml-4">
              <Sparkles size={14} className="text-primary" />
              <span className="font-medium"><strong className="text-foreground">ISHU</strong> — Indian StudentHub University</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 font-display text-2xl font-bold text-primary">
                {state.code}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  {state.name} <span className="text-gradient">Results</span>
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {state.capital} • {state.region} • {state.language}
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Exam Bodies */}
      <section className="py-12">
        <div className="container">
          <FadeInView>
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              <span className="text-primary">●</span> State Exam Bodies
            </h2>
            <div className="flex flex-wrap gap-3">
              {state.examBodies.map((body) => (
                <div key={body} className="rounded-xl border border-border bg-card px-5 py-3 font-display text-sm font-semibold text-foreground">
                  {body}
                </div>
              ))}
            </div>
          </FadeInView>

          {/* Sample Results */}
          <FadeInView delay={0.1}>
            <h2 className="mt-12 font-display text-xl font-bold text-foreground mb-6">
              <span className="text-primary">●</span> Latest {state.name} Vacancies
            </h2>
            <div className="space-y-3">
              {[
                { title: `${state.examBodies[0] || state.code} Clerk Recruitment 2026`, type: "Vacancy", vacancies: 2500, lastDate: "30 Apr 2026", status: "active" },
                { title: `${state.name} Police Constable 2026`, type: "Vacancy", vacancies: 5000, lastDate: "15 May 2026", status: "active" },
                { title: `${state.name} Teacher Recruitment (TET)`, type: "Vacancy", vacancies: 8000, lastDate: "20 Mar 2026", status: "upcoming" },
              ].map((result, i) => (
                <motion.div
                  key={result.title}
                  whileHover={{ x: 4 }}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">{state.code}</span>
                      <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground">{result.type}</span>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                        result.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}>
                        {result.status === "active" ? "Active" : "Upcoming"}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-semibold text-foreground">{result.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users size={14} /> {result.vacancies.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {result.lastDate}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>
    </Layout>
  );
};

export default StateResultPage;
