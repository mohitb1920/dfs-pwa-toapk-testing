const ASSETS_SECTION_ROUTES = [
  { title: "Storage", state: { cat: 1, catId: 20 } },
  { title: "Office", state: { cat: 3, catId: 1 } },
  { title: "Education", state: { cat: 2, catId: 17 } },
  { title: "Bazaar", state: { cat: 4, catId: 16 } },
  { title: "OtherAssets", state: { cat: 5, catId: 2 } },
].map(({ title, state }) => ({ title, url: "assets-section", state }));

const CATEGORY_SPECIFIC_SECTIONS = {
  Storage: [
    { title: "Cold_Storage", state: { cat: 1, catId: 20 } },
    { title: "PACS", state: { cat: 1, catId: 3 } },
    { title: "Agri_Godowns", state: { cat: 1, catId: 8 } },
  ],
  Office: [
    { title: "Panchayat_Office", state: { cat: 3, catId: 1 } },
    { title: "e-Kisan_Bhavan", state: { cat: 3, catId: 6 } },
    { title: "DAO_Office", state: { cat: 3, catId: 18 } },
  ],
  Education: [
    { title: "KVK", state: { cat: 2, catId: 17 } },
    { title: "Agriculture_College", state: { cat: 2, catId: 19 } },
  ],
  Bazaar: [
    { title: "Pashu_Bazaar", state: { cat: 4, catId: 16 } },
    { title: "Market_Nodes", state: { cat: 4, catId: 24 } },
  ],
  OtherAssets: [
    { title: "Agri_Input_Shops", state: { cat: 5, catId: 2 } },
    { title: "Agriculture_Farms", state: { cat: 5, catId: 9 } },
    { title: "Rice_Mill", state: { cat: 5, catId: 11 } },
    { title: "Custom_Hiring_Center", state: { cat: 5, catId: 12 } },
    { title: "Traders", state: { cat: 5, catId: 22 } },
    { title: "Fpo-Farmers_Producers_Services", state: { cat: 5, catId: 21 } },
  ],
};

const agentSpecific = [
  { title: "Farmer-passbook", url: "agent-access" },
  { title: "DFSWEB_DFS_REGISTRATION", url: "registration" },
  { title: "DFSWEB_GRM", url: "grm-create" },
  { title: "DFSWEB_TRACK", url: "track" },
  { title: "DFSWEB_HISTORY", url: "history" },
];

const openAndAgentSpecific = [
  { title: "DFSWEB_ASSETS", url: "assets-section" },
  { title: "DFSWEB_SCHEMES", url: "schemes" },
  { title: "DFSWEB_MANDIPRICE", url: "mandi" },
];

const openAndKccSpecific = [
  { title: "DFSWEB_ASSETS", url: "assets-section" },
  { title: "DFSWEB_MANDIPRICE", url: "mandi" },
];

export const siteMapData = ({
  isAgent,
  isLoggedIn,
  isGrmEmployee,
  isAncEmployee,
  isKccUser,
  isDashboardAdmin,
}) => [
  {
    sectionHeader: "landingPage",
    sectionRoutes: [
      { title: "DFSWEB_HOME", url: "home" },
      ...(!isLoggedIn ? [{ title: "DFSWEB_About", url: "about-section" }] : []),
      ...(!isLoggedIn || isAgent ? openAndAgentSpecific : []),
      ...(isAgent ? agentSpecific : isKccUser ? openAndKccSpecific : []),
      ...(isGrmEmployee ? [{ title: "DFSWEB_GRM", url: "grm/inbox" }] : []),
      ...(isDashboardAdmin
        ? [{ title: "DFSWEB_DASHBOARD", url: "dashboards/farmersDashboard" }]
        : []),
      ...(isAncEmployee
        ? [{ title: "DFSWEB_CAROUSEL", url: "carousel-management" }]
        : []),
      ...(!isLoggedIn ? [{ title: "DFSWEB_FAQs", url: "faq" }] : []),
      ...(!isLoggedIn || isAgent || isKccUser
        ? [{ title: "DFSWEB_HELP", url: "help" }]
        : []),
    ],
  },
  ...(isAgent || !isLoggedIn || isKccUser
    ? [
        {
          sectionHeader: "DFSWEB_ASSETS",
          sectionRoutes: ASSETS_SECTION_ROUTES,
        },
        ...Object.entries(CATEGORY_SPECIFIC_SECTIONS).map(
          ([header, routes]) => ({
            sectionHeader: header,
            sectionRoutes: routes.map(({ title, state }) => ({
              title,
              url: "assets-section",
              state,
            })),
          })
        ),
        {
          sectionHeader: "DFSWEB_MANDIPRICE",
          sectionRoutes: [{ title: "Commodity_Price", url: "mandi" }],
        },
      ]
    : []),
  ...(!isLoggedIn || isAgent || isKccUser
    ? [
        {
          sectionHeader: "appBar.aboutUs",
          sectionRoutes: [
            { title: "DFSWEB_About_Bihar", url: "about-section" },
          ],
        },
        {
          sectionHeader: "Contact_US",
          sectionRoutes: [{ title: "AllContacts", url: "key-contacts" }],
        },
      ]
    : []),
  {
    sectionHeader: "Footer",
    sectionRoutes: [
      { title: "ImportantLinks", url: "sitemap" },
      { title: "OtherImportantLinks", url: "sitemap" },
      { title: "ContactInformation", url: "sitemap" },
    ],
  },
  {
    sectionHeader: "ImportantLinks",
    sectionRoutes: [
      ...(!isLoggedIn || isAgent ? openAndAgentSpecific : []),
      ...(isAgent ? agentSpecific : isKccUser ? openAndKccSpecific : []),
      ...(isGrmEmployee ? [{ title: "DFSWEB_GRM", url: "grm/inbox" }] : []),
      ...(isDashboardAdmin
        ? [{ title: "DFSWEB_DASHBOARD", url: "dashboards/farmersDashboard" }]
        : []),
      ...(isAncEmployee
        ? [{ title: "DFSWEB_CAROUSEL", url: "carousel-management" }]
        : []),
      ...(!isLoggedIn || isAgent || isKccUser
        ? [{ title: "DFSWEB_HELP", url: "help" }]
        : []),
      { title: "Privacy_policy", url: "privacypolicy" },
    ],
  },
  {
    sectionHeader: "OtherImportantLinks",
    sectionRoutes: [
      {
        title: "DBTPortal",
        link: `https://dbtagriculture.bihar.gov.in/`,
      },
      {
        title: "BiharSeedCertificationAgency",
        link: `https://bssca.co.in/`,
      },
      { title: "BAVAS", link: `https://bavas.bihar.gov.in/` },
      {
        title: "DirectorateofHorticulture",
        link: `https://bavas.bihar.gov.in/`,
      },
      {
        title: "KisanCallCentrePortal",
        link: `https://www.manage.gov.in/kcc/kcc.asp#:~:text=1800%2D180%2D1551)`,
      },
    ],
  },
  {
    sectionHeader: "ContactInformation",
    sectionRoutes: [
      { title: "BiharKrishiSupport", url: "sitemap" },
      { title: "KisanCallCentre", url: "sitemap" },
    ],
  },
];
