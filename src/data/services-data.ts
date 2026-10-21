export interface ServiceDetail {
  id: number;
  slug: string;
  title: string;
  navLabel: string;
  badge: string;
  tagline: string;
  heroTitle: string;
  description: string;
  longDescription: string;
  icon: string;
  metrics: { label: string; value: string; desc: string }[];
  includes: string[];
  customerServices: { title: string; description: string }[];
  deliverables: string[];
  faq: { q: string; a: string }[];
}

export const SERVICES_LIST: ServiceDetail[] = [
  {
    id: 1,
    slug: "google-pay-per-click-ads",
    title: "Google Pay per click Ads",
    navLabel: "GOOGLE PAY PER CLICK ADS",
    badge: "High-ROI PPC",
    tagline: "Maximize ROAS with High-Converting PPC Campaigns",
    heroTitle: "High-Impact Google PPC Ads",
    description:
      "Our Google PPC advertising services are designed to put your business in front of customers who are actively searching for what you offer. We focus on intent-driven keywords that generate real leads and sales.",
    longDescription:
      "From campaign setup to continuous optimization, we manage every aspect to ensure maximum ROI, lower cost-per-click, and consistent performance. Our Google PPC Advertising services are built to maximize return on ad spend through smart bidding and optimization. We manage keywords, budgets, and ad creatives with a performance-first approach. Each campaign is carefully monitored to improve efficiency and lower cost per click. Conversion tracking helps us understand what drives real results. Ongoing testing ensures continuous improvement. PPC is perfect for scaling traffic and sales quickly.",
    icon: "Target",
    metrics: [
      { label: "Avg. ROAS", value: "3.4x", desc: "Across active PPC client accounts" },
      { label: "CPA Reduction", value: "-34%", desc: "Lower cost per acquired customer" },
      { label: "Search Impression", value: "92%", desc: "Top of page impression share" },
    ],
    includes: [
      "Keyword research & high-intent targeting",
      "Ad copy creation & systematic A/B testing",
      "Smart bid & daily budget optimization",
      "Conversion tracking & multi-touch reporting",
      "Negative keyword harvesting & wasted spend elimination",
      "Performance Max & Google Shopping feed optimization",
    ],
    customerServices: [
      {
        title: "Data-Driven Insights",
        description:
          "We analyze keyword performance, search query trends, and user behavior to improve results continuously.",
      },
      {
        title: "Customized Strategies",
        description:
          "Each campaign is tailored to your unique business goals, competitive landscape, and target CPA.",
      },
      {
        title: "Conversion Optimization",
        description:
          "We align ad messaging with high-converting landing page elements to turn clicks into profitable customers.",
      },
      {
        title: "Performance Monitoring",
        description:
          "Real-time tracking, live dashboard access, and transparent weekly reporting to scale what works.",
      },
    ],
    deliverables: [
      "Dedicated Senior Google Ads Strategist",
      "Custom Campaign Structure Architecture",
      "Weekly Bid Adjustments & Search Query Mining",
      "Live 24/7 Performance Dashboard Access",
      "Monthly Strategic Scaling Roadmaps",
    ],
    faq: [
      {
        q: "How fast can we see results with Google PPC Ads?",
        a: "Google PPC campaigns go live within 3–5 business days after strategy approval. You can start seeing qualified clicks and inbound leads within the very first 24–48 hours of launch.",
      },
      {
        q: "What monthly ad budget do you recommend for Google PPC?",
        a: "We recommend a minimum starting ad spend of $1,500/month to allow Google's machine learning algorithms to exit the learning phase quickly and gather sufficient conversion data.",
      },
      {
        q: "How do you avoid wasted budget on irrelevant clicks?",
        a: "We implement exhaustive negative keyword lists, tight phrase/exact match types, and daily search term audits to guarantee every dollar goes toward high-intent buyers.",
      },
    ],
  },
  {
    id: 2,
    slug: "google-search-ads",
    title: "Google Search Ads",
    navLabel: "GOOGLE SEARCH ADS",
    badge: "Buyer Intent",
    tagline: "Capture High-Intent Customers at the Exact Moment They Search",
    heroTitle: "Precision Google Search Ad Campaigns",
    description:
      "Reach high-intent customers searching for your products or services and turn clicks into qualified leads. We capture ready-to-buy search traffic and scale your inbound pipeline.",
    longDescription:
      "Google Search is where consumers go with immediate purchase intent. Our precision search campaigns target commercial-intent search terms while aggressively filtering out unqualified tire-kickers. We craft responsive search ads that outrank competitors, improve your Quality Score, and drive down your average cost per lead. By continuously optimizing ad copy, landing page alignment, and bidding algorithms, we turn Google Search into your company's most predictable growth channel.",
    icon: "Search",
    metrics: [
      { label: "Click-Through Rate", value: "8.2%", desc: "Well above industry average of 3.1%" },
      { label: "Lead Conversion Rate", value: "14.6%", desc: "From click to completed consultation" },
      { label: "Quality Score", value: "8.9/10", desc: "Lowering average cost per click" },
    ],
    includes: [
      "Commercial-intent search query targeting",
      "Responsive Search Ads (RSA) persuasive copywriting",
      "Quality Score optimization to lower cost-per-click",
      "Competitor conquesting & brand protection campaigns",
      "Geo-fencing, audience demographics & dayparting",
      "Call tracking and CRM lead auto-sync integration",
    ],
    customerServices: [
      {
        title: "Intent-Based Bidding",
        description:
          "Target searchers at the bottom of the funnel who have intent to buy or book right now.",
      },
      {
        title: "Quality Score Maximization",
        description:
          "Higher ad relevance and landing page experience lower your cost-per-click by up to 30%.",
      },
      {
        title: "Competitor Conquesting",
        description:
          "Position your brand directly above competitors when prospects search for alternatives.",
      },
      {
        title: "End-to-End Tracking",
        description:
          "Track phone calls, form submissions, and offline CRM conversions back to exact keywords.",
      },
    ],
    deliverables: [
      "Full Keyword Matrix & Negative Keyword Architecture",
      "Custom RSA Headlines & Description Variations",
      "Site Links, Callouts & Structured Snippet Extensions",
      "Bi-Weekly Strategic Account Optimization",
      "Direct Slack/Email Communication with Account Manager",
    ],
    faq: [
      {
        q: "What is the difference between PPC and Search Ads?",
        a: "Google Search Ads appear specifically on Google's search results page when users query keywords. PPC (Pay-Per-Click) is the umbrella pricing model which also includes Shopping, Display, and Performance Max.",
      },
      {
        q: "How do you improve Google Ads Quality Score?",
        a: "By aligning ad copy keywords precisely with landing page headlines, boosting expected click-through rate with strong copy, and ensuring lightning-fast mobile page speed.",
      },
    ],
  },
  {
    id: 3,
    slug: "meta-ads",
    title: "Meta Ads (Facebook & Instagram)",
    navLabel: "META ADS",
    badge: "Scale & Creative",
    tagline: "Target Hyper-Specific Audiences Across Facebook and Instagram",
    heroTitle: "Scale Predictably with Meta Ads",
    description:
      "Target the right people with high-converting ads across Facebook and Instagram. Scroll-stopping creatives and precision audience targeting to turn social into predictable revenue.",
    longDescription:
      "Meta remains the world's most powerful demand-generation platform. With over 3 billion daily active users, Facebook and Instagram allow you to create demand where none existed before. We engineer full-funnel Meta advertising campaigns using Advantage+ machine learning, user-generated content (UGC), dynamic product ads, and Conversions API (CAPI) server tracking to deliver sustainable customer acquisition at scale.",
    icon: "Instagram",
    metrics: [
      { label: "Average ROAS", value: "3.8x", desc: "Across e-commerce & lead gen brands" },
      { label: "CPA Reduction", value: "-41%", desc: "With Meta Advantage+ bidding" },
      { label: "Ad Retention", value: "2.4x", desc: "Longer video watch time on Reels" },
    ],
    includes: [
      "Advantage+ Shopping & Lead Generation campaigns",
      "High-converting UGC video, carousel & graphic creative frameworks",
      "First-party data Lookalike audiences & custom segmentation",
      "Meta Conversions API (CAPI) server-side tracking setup",
      "Full-funnel dynamic retargeting & cart recovery",
      "Continuous creative fatigue monitoring and weekly refreshes",
    ],
    customerServices: [
      {
        title: "Creative Strategy & Hooks",
        description:
          "Develop 3-second visual hooks that stop users from scrolling and inspire immediate action.",
      },
      {
        title: "Algorithmic Advantage+",
        description:
          "Harness Meta's AI to find high-value buyers across Facebook Feed, Stories, and Reels.",
      },
      {
        title: "First-Party Data Integration",
        description:
          "Server-side CAPI bypasses iOS 14.5 cookie limitations for 99%+ accurate conversion attribution.",
      },
      {
        title: "Omnichannel Funnel Design",
        description:
          "Warm cold audiences with educational video content before driving bottom-funnel offers.",
      },
    ],
    deliverables: [
      "Custom Creative Briefs & Angle Ideation",
      "Full Graphic & Short-Form Video Editing",
      "Weekly Ad Spend Reallocation to Winning Creatives",
      "Server-Side Pixel & Event Tracking Audit",
      "Monthly Creative Performance Teardown",
    ],
    faq: [
      {
        q: "Do you create the ad graphics and videos for Meta Ads?",
        a: "Yes! We provide creative direction, scripts, video editing for UGC/Reels, graphic design, and copywriting tailored specifically for Meta's high-performing formats.",
      },
      {
        q: "How do you handle iOS tracking changes on Meta?",
        a: "We implement Meta Conversions API (CAPI) server-to-server tracking alongside offline conversion uploads so Meta's algorithm receives 100% accurate purchase and lead signals.",
      },
    ],
  },
  {
    id: 4,
    slug: "tiktok-ads",
    title: "TikTok Ads",
    navLabel: "TIKTOK ADS",
    badge: "Viral Growth",
    tagline: "Create Scroll-Stopping Ads That Boost Visibility, Engagement & Fast Growth",
    heroTitle: "High-Converting TikTok Ad Campaigns",
    description:
      "Create scroll-stopping ads that boost visibility, engagement, and fast growth. Tap into native creator trends and algorithms designed to convert Gen Z and Millennial audiences.",
    longDescription:
      "TikTok has revolutionized digital marketing with an unmatched algorithmic discovery engine. The secret to winning on TikTok is 'Don't make ads, make TikToks.' Our agency produces native, trend-aligned Spark Ads and In-Feed video creatives that feel like organic entertainment while driving explosive ROAS and customer acquisition.",
    icon: "Music2",
    metrics: [
      { label: "Lower CPMs", value: "-45%", desc: "Compared to traditional social ad channels" },
      { label: "Engagement Rate", value: "6.8%", desc: "Average video interaction rate" },
      { label: "Viral Reach", value: "4.2M+", desc: "Impressions generated for client campaigns" },
    ],
    includes: [
      "Native Spark Ads & In-Feed video advertising",
      "TikTok Shop & Instant Form lead integration",
      "Trending audio, voiceover & hook research",
      "Creator partnership management & whitelisting",
      "TikTok Pixel & Events API setup",
      "Fast-cycle creative testing (5+ new hooks weekly)",
    ],
    customerServices: [
      {
        title: "Trendjacking & Hooks",
        description:
          "Capitalize on emerging viral cultural trends and sounds before your competitors do.",
      },
      {
        title: "Authentic Creator Formats",
        description:
          "High-converting user-generated content that bypasses ad skepticism and builds trust.",
      },
      {
        title: "Lower Acquisition Costs",
        description:
          "Benefit from TikTok's competitive CPM rates to capture massive market share affordably.",
      },
      {
        title: "Direct Shopping Integration",
        description:
          "Drive friction-free in-app sales through TikTok Shop and direct landing page clickouts.",
      },
    ],
    deliverables: [
      "Weekly TikTok Hook & Script Development",
      "Native In-App Style Video Editing & Subtitling",
      "Audience Targeting & Interest Cluster Optimization",
      "Spark Ad Code Whitelisting Setup",
      "Weekly Performance & ROAS Reports",
    ],
    faq: [
      {
        q: "Is TikTok Ads only for teenagers?",
        a: "Not at all. Over 65% of TikTok users are over the age of 24, with high disposable income. Brands in B2C, e-commerce, home services, and even B2B software achieve incredible ROAS on TikTok.",
      },
    ],
  },
  {
    id: 5,
    slug: "youtube-ads",
    title: "YouTube Ads",
    navLabel: "YOUTUBE ADS",
    badge: "Video Authority",
    tagline: "Engage Audiences with Impactful Video Ads That Build Trust & Drive Action",
    heroTitle: "Engaging YouTube Video Ad Strategies",
    description:
      "Engage your audience with impactful video ads that build trust and drive action. Capture the massive audience on the world's second-largest search engine.",
    longDescription:
      "YouTube is where consumers go to learn, be entertained, and research before buying. High-performing YouTube Ads combine the storytelling power of television with the precision targeting of Google's search intent data. We target users based on recent Google searches, competitor channel placements, and in-market affinities to deliver video campaigns that scale revenue.",
    icon: "Youtube",
    metrics: [
      { label: "View Rate", value: "42%", desc: "Average 30-second view completion rate" },
      { label: "Brand Recall", value: "+84%", desc: "Lift in unaided customer brand awareness" },
      { label: "Video ROAS", value: "3.2x", desc: "Measured direct & view-through return" },
    ],
    includes: [
      "Skippable in-stream, non-skippable & bumper ads",
      "YouTube Shorts vertical video campaigns",
      "Demand Gen & Video Action Campaigns (VAC)",
      "Custom scriptwriting & 5-second hook engineering",
      "Placement exclusion lists to protect brand safety",
      "Connected TV (CTV) & big-screen living room targeting",
    ],
    customerServices: [
      {
        title: "Hook Mastery",
        description:
          "Hook viewers in the first 5 seconds to eliminate wasted budget on disinterested users.",
      },
      {
        title: "Search-Powered Audiences",
        description:
          "Show video ads to people who literally just searched for your competitors on Google.",
      },
      {
        title: "Brand Authority Building",
        description:
          "Establish your brand as the premier industry leader with high-production video authority.",
      },
      {
        title: "Living Room CTV Reach",
        description:
          "Reach affluent consumers watching YouTube on smart TVs in their living rooms.",
      },
    ],
    deliverables: [
      "YouTube Video Strategy & Scriptwriting Frameworks",
      "Video Editing, Motion Graphics & Sound Design",
      "Custom Intent & In-Market Audience Setup",
      "Negative Placement Scrubbing",
      "Bi-Weekly Video Action Optimization",
    ],
    faq: [
      {
        q: "Do I pay if someone skips my YouTube ad?",
        a: "No! With skippable in-stream ads, you only pay if a viewer watches at least 30 seconds of your video (or the full video if shorter) or interacts with your ad.",
      },
    ],
  },
  {
    id: 6,
    slug: "linkden-ads",
    title: "Linkden Ads (LinkedIn Ads)",
    navLabel: "LINKDEN ADS",
    badge: "B2B Enterprise",
    tagline: "Reach Key B2B Decision-Makers & C-Suite Executives With Precision",
    heroTitle: "B2B Enterprise Growth with LinkedIn Ads",
    description:
      "B2B lead generation campaigns that put your brand directly in front of C-suite executives, VPs, and qualified business decision-makers.",
    longDescription:
      "LinkedIn is the undisputed headquarters of professional decision-makers. When your deal sizes are large and you need to reach specific job titles, seniority levels, or target company lists (ABM), LinkedIn advertising delivers unparalleled precision. We build high-converting Thought Leader ads, Document ads, and Lead Gen forms that build enterprise pipeline and shorten B2B sales cycles.",
    icon: "Linkedin",
    metrics: [
      { label: "Qualified Lead Rate", value: "88%", desc: "Leads matching ideal customer profile" },
      { label: "Pipeline Generated", value: "$4.8M+", desc: "Verified B2B pipeline for clients" },
      { label: "Form Completion", value: "26%", desc: "Using native 1-click pre-filled forms" },
    ],
    includes: [
      "Account-Based Marketing (ABM) target company lists",
      "Job function, seniority & company size precision targeting",
      "Sponsored Content, Carousel & Document thought leadership ads",
      "In-platform Lead Gen Forms with CRM auto-sync (HubSpot, Salesforce)",
      "Retargeting website visitors with matched audiences",
      "Cost-per-qualified-lead (CPQL) optimization",
    ],
    customerServices: [
      {
        title: "Zero Waste Targeting",
        description:
          "Ensure every ad dollar reaches verified decision-makers who control corporate budgets.",
      },
      {
        title: "Shortened Sales Cycles",
        description:
          "Warm up enterprise buying committees with multi-touch content before your sales reps call.",
      },
      {
        title: "Frictionless 1-Click Forms",
        description:
          "Pre-populated contact information delivers conversion rates up to 4x higher than landing pages.",
      },
      {
        title: "Founder Thought Leadership",
        description:
          "Promote content directly from executives' personal profiles for 2x higher engagement.",
      },
    ],
    deliverables: [
      "Target Account List (ABM) Enrichment & Setup",
      "Thought Leadership Content & Lead Magnet Creative",
      "CRM & Zapier Webhook Lead Integration",
      "Bi-Weekly Frequency & Audience Fatigue Tuning",
      "Monthly Pipeline Value Analysis",
    ],
    faq: [
      {
        q: "Why is LinkedIn Ads more expensive per click than Facebook?",
        a: "While cost-per-click is higher, lead quality is dramatically superior. One closed enterprise contract often pays for an entire year of LinkedIn advertising spend.",
      },
    ],
  },
  {
    id: 7,
    slug: "search-engine-optimization",
    title: "Search Engine Optimization",
    navLabel: "SEARCH ENGINE OPTIMIZATION",
    badge: "Organic Compound",
    tagline: "Increase Organic Traffic, Improve Rankings & Grow Long-Term Visibility",
    heroTitle: "Long-Term Organic Growth & Technical SEO",
    description:
      "Increase organic traffic, improve search rankings, and grow long-term online visibility. We combine technical SEO architecture, on-page optimization, and authority building to secure top rankings.",
    longDescription:
      "Paid ads provide immediate acceleration, but SEO builds permanent digital equity. Our comprehensive Search Engine Optimization services combine technical site health, keyword clustering, on-page content architecture, Webmaster tool configuration, and white-hat link acquisition to ensure your brand dominates organic search engine results pages (SERPs) for the most lucrative keywords in your niche.",
    icon: "Globe",
    metrics: [
      { label: "Organic Traffic Lift", value: "+210%", desc: "Average increase within 6 months" },
      { label: "Page 1 Keywords", value: "340+", desc: "Top search ranking positions achieved" },
      { label: "Domain Authority", value: "+18 pts", desc: "Average increase in DR / DA score" },
    ],
    includes: [
      "Full technical SEO & Core Web Vitals audit",
      "On-page keyword optimization & semantic schema markup",
      "Google Search Console & Bing Webmaster Tools setup",
      "Keyword gap analysis against top 5 competitors",
      "High-authority white-hat backlink acquisition",
      "Monthly keyword ranking & organic traffic reporting",
    ],
    customerServices: [
      {
        title: "Compounding Traffic",
        description:
          "Traffic that continues growing month after month without paying for individual clicks.",
      },
      {
        title: "Technical Excellence",
        description:
          "Clean crawlability, mobile responsiveness, fast load speeds, and structured schema data.",
      },
      {
        title: "Commercial Keyword Focus",
        description:
          "We prioritize keywords with high purchase intent over useless vanity search volume.",
      },
      {
        title: "Transparent Search Console Data",
        description:
          "Real data directly from Google Search Console showing exact clicks and impressions.",
      },
    ],
    deliverables: [
      "Initial 40-Point Technical SEO Audit",
      "Monthly On-Page Content Optimization Roadmap",
      "Google Search Console & Sitemap Configuration",
      "Link Acquisition & Outreach Campaign Management",
      "Monthly Keyword Ranking Progress Reports",
    ],
    faq: [
      {
        q: "How long does SEO take to produce results?",
        a: "Technical fixes and on-page optimization typically show measurable ranking movement in 60–90 days. Significant compounding organic traffic gains usually materialize within 4–6 months.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  // Support aliases like 'linkedin-ads' for 'linkden-ads'
  const normalizedSlug = slug.toLowerCase().trim();
  if (normalizedSlug === "linkedin-ads") {
    return SERVICES_LIST.find((s) => s.slug === "linkden-ads");
  }
  return SERVICES_LIST.find(
    (s) => s.slug.toLowerCase() === normalizedSlug,
  );
}

export function getAllServiceSlugs(): string[] {
  return SERVICES_LIST.map((s) => s.slug);
}
