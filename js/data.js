/**
 * Knot — Registered School Directory
 * This is the "registered list" of schools stored locally in the front end.
 * Each school entry includes its location metadata and full club catalog.
 */

const SCHOOL_REGISTRY = [
  {
    id: "us-booker-t-washington",
    name: "Booker T. Washington High School for the Performing and Visual Arts",
    city: "Dallas",
    country: "United States",
    continent: "North America",
    flag: "🇺🇸",
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Dallas_Booker_T_Washington_High_School.jpg",
    students: 970,
    founded: 1976,
    description: "A highly selective Dallas arts magnet in the city's Arts District, with alumni including Erykah Badu and Norah Jones.",
    clubs: [
      { name: "Theatre Guild", category: "Arts", icon: "🎭", meets: "Mon & Wed, 4:00 PM", description: "Student-run drama productions staged across the school year." },
      { name: "Jazz Ensemble", category: "Arts", icon: "🎷", meets: "Tue & Thu, 4:00 PM", description: "Big-band and combo jazz performance, from standards to original charts." },
      { name: "Visual Arts Society", category: "Arts", icon: "🎨", meets: "Wed, 3:30 PM", description: "Studio critique sessions and an annual student gallery show." },
      { name: "Dance Company", category: "Arts", icon: "💃", meets: "Mon & Fri, 4:00 PM", description: "Contemporary and classical repertoire performed each semester." },
      { name: "Vocal Music Ensemble", category: "Arts", icon: "🎤", meets: "Thu, 3:30 PM", description: "Choral and solo vocal training culminating in a spring recital." }
    ]
  },
  {
    id: "uk-kings-college",
    name: "King's College School",
    city: "London",
    country: "United Kingdom",
    continent: "Europe",
    flag: "🇬🇧",
    photo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/King's_College_School,_Wimbledon.jpg",
    students: 1420,
    founded: 1829,
    description: "A historic independent school with a strong focus on classical academics and rowing.",
    clubs: [
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Wed, 4:00 PM", description: "Delegates represent nations at regional and national MUN conferences." },
      { name: "Rowing Club", category: "Sports", icon: "🚣", meets: "Daily, 6:30 AM", description: "Trains on the Thames; competes at Henley Royal Regatta." },
      { name: "Chess Society", category: "Academic", icon: "♟️", meets: "Fri, 1:00 PM", description: "Weekly ladder tournaments and inter-school matches." },
      { name: "Classics & Philosophy Circle", category: "Academic", icon: "📜", meets: "Tue, 4:00 PM", description: "Reading group covering Latin, Greek texts, and philosophical debate." },
      { name: "School Orchestra", category: "Arts", icon: "🎻", meets: "Mon & Thu, 4:15 PM", description: "Full symphonic orchestra performing termly concerts." }
    ]
  },
  {
    id: "jp-hibiya-high-school",
    name: "Tokyo Metropolitan Hibiya High School",
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    flag: "🇯🇵",
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Tokyo_Metropolitan_Hibiya_High_School_2.jpg",
    students: 950,
    founded: 1878,
    description: "A public high school in Chiyoda historically famous for sending more graduates to the University of Tokyo than any other school.",
    clubs: [
      { name: "Debate Club", category: "Academic", icon: "🗣️", meets: "Tue & Fri, 4:00 PM", description: "Competitive debate training for national high school tournaments." },
      { name: "Quiz Bowl Circle", category: "Academic", icon: "🧠", meets: "Wed, 3:45 PM", description: "Fast-paced academic quiz competitions across subjects." },
      { name: "Kendo Club", category: "Sports", icon: "🥋", meets: "Mon, Wed, Fri, 5:00 PM", description: "Traditional Japanese swordsmanship training and tournaments." },
      { name: "Brass Band", category: "Arts", icon: "🎺", meets: "Tue & Thu, 4:00 PM", description: "Wind ensemble performing at school festivals and civic events." },
      { name: "Newspaper Committee", category: "Media & Publishing", icon: "📰", meets: "Thu, 3:45 PM", description: "Reports on school life for the student newspaper." }
    ]
  },
  {
    id: "in-delhi-public",
    name: "Delhi Public School",
    city: "New Delhi",
    country: "India",
    continent: "Asia",
    flag: "🇮🇳",
    students: 3200,
    founded: 1949,
    description: "One of India's largest school networks, with strong STEM olympiad and classical dance traditions.",
    clubs: [
      { name: "Coding & AI Club", category: "STEM", icon: "💻", meets: "Tue & Thu, 3:30 PM", description: "Competitive programming, hackathons, and machine learning workshops." },
      { name: "Bharatanatyam Dance Troupe", category: "Arts", icon: "💃", meets: "Sat, 10:00 AM", description: "Classical South Indian dance training and annual showcase." },
      { name: "Math Olympiad Circle", category: "Academic", icon: "🔢", meets: "Mon & Wed, 4:00 PM", description: "Prepares students for RMO, INMO, and international olympiads." },
      { name: "National Cadet Corps", category: "Community Service", icon: "🎖️", meets: "Sat, 7:00 AM", description: "Discipline, leadership, and community service training." },
      { name: "Cricket Club", category: "Sports", icon: "🏏", meets: "Daily, 4:00 PM", description: "Inter-school league team with dedicated coaching staff." }
    ]
  },
  {
    id: "de-franzoesisches-gymnasium",
    name: "Französisches Gymnasium Berlin",
    city: "Berlin",
    country: "Germany",
    continent: "Europe",
    flag: "🇩🇪",
    photo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/TiergartenDerfflingerstraßeFranzösischesGymnasium.jpg",
    students: 810,
    founded: 1689,
    description: "Berlin's oldest public school, founded for Huguenot refugee families and still teaching a bilingual French-German curriculum.",
    clubs: [
      { name: "Théâtre Français", category: "Arts", icon: "🎭", meets: "Wed, 4:00 PM", description: "French-language drama club staging an annual production." },
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Mon, 4:00 PM", description: "Bilingual delegation preparing for Franco-German MUN conferences." },
      { name: "Débat & Debating Society", category: "Academic", icon: "🗣️", meets: "Tue, 3:30 PM", description: "Formal debate practiced in both French and German." },
      { name: "Orchestre", category: "Arts", icon: "🎻", meets: "Thu, 4:00 PM", description: "School orchestra performing at the annual Franco-German exchange concert." },
      { name: "Franco-German Exchange Committee", category: "Language & Culture", icon: "🌍", meets: "Fri, 3:30 PM", description: "Organizes student exchanges with partner schools in France." }
    ]
  },
  {
    id: "br-colegio-mackenzie",
    name: "Colégio Presbiteriano Mackenzie",
    city: "São Paulo",
    country: "Brazil",
    continent: "South America",
    flag: "🇧🇷",
    photo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Instituto_Presbiteriano_Mackenzie_-_São_Paulo_-_20240919200309.png",
    students: 1800,
    founded: 1870,
    description: "One of Brazil's oldest private schools, on a landmark heritage campus in São Paulo's Higienópolis district.",
    clubs: [
      { name: "Oratory & Debate Club", category: "Academic", icon: "🗣️", meets: "Wed, 3:30 PM", description: "Public speaking and competitive debate training." },
      { name: "Robotics Team", category: "STEM", icon: "🤖", meets: "Tue & Thu, 4:00 PM", description: "Builds robots for Brazilian national robotics competitions." },
      { name: "Choir", category: "Arts", icon: "🎶", meets: "Mon, 4:00 PM", description: "Choral ensemble performing at campus events." },
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Fri, 3:30 PM", description: "Delegates prepare for regional MUN conferences." },
      { name: "Volleyball Club", category: "Sports", icon: "🏐", meets: "Daily, 4:30 PM", description: "Boys' and girls' teams in the São Paulo school league." }
    ]
  },
  {
    id: "za-bishops-diocesan",
    name: "Diocesan College (Bishops)",
    city: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    flag: "🇿🇦",
    photo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/BishopsDiocesanCollege.jpg",
    students: 800,
    founded: 1849,
    description: "A historic Anglican boys' school in Rondebosch, one of South Africa's oldest and most prominent private schools.",
    clubs: [
      { name: "Rowing Club", category: "Sports", icon: "🚣", meets: "Daily, 5:30 AM", description: "Trains for South African schools regattas." },
      { name: "Debating Society", category: "Academic", icon: "🗣️", meets: "Wed, 4:00 PM", description: "Competes in Western Cape schools debating leagues." },
      { name: "Cadet Corps", category: "Community Service", icon: "🎖️", meets: "Fri, 3:30 PM", description: "Leadership and discipline training, a century-old school tradition." },
      { name: "Choir", category: "Arts", icon: "🎶", meets: "Tue, 4:00 PM", description: "Chapel choir performing at services and school events." },
      { name: "Chess Club", category: "Academic", icon: "♟️", meets: "Thu, 1:00 PM", description: "Weekly matches and coaching for all skill levels." }
    ]
  },
  {
    id: "ke-alliance-high-school",
    name: "Alliance High School",
    city: "Kikuyu",
    country: "Kenya",
    continent: "Africa",
    flag: "🇰🇪",
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Alliance_High_School_(Kenya),_AdminBlock.jpg",
    students: 850,
    founded: 1926,
    description: "The first school in Kenya to offer secondary education to Africans; alumni include multiple Kenyan presidents.",
    clubs: [
      { name: "Scouts", category: "Community Service", icon: "🏕️", meets: "Sat, 8:00 AM", description: "Outdoor skills, service projects, and leadership badges." },
      { name: "Drama Club", category: "Arts", icon: "🎭", meets: "Wed, 4:00 PM", description: "Stages productions for the Kenya Schools Drama Festival." },
      { name: "Debating Society", category: "Academic", icon: "🗣️", meets: "Tue, 3:30 PM", description: "Competes in the East Africa Schools Debating Championship." },
      { name: "Choir", category: "Arts", icon: "🎶", meets: "Mon, 4:00 PM", description: "Choral ensemble performing at national music festivals." },
      { name: "Athletics Club", category: "Sports", icon: "🏃", meets: "Daily, 6:00 AM", description: "Middle- and long-distance training squad." }
    ]
  },
  {
    id: "ae-dubai-college",
    name: "Dubai College",
    city: "Dubai",
    country: "United Arab Emirates",
    continent: "Asia",
    flag: "🇦🇪",
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Dubai_College_01.jpg",
    students: 1085,
    founded: 1978,
    description: "A selective British-curriculum secondary school in Al Sufouh, founded on land offered by Sheikh Rashid bin Saeed Al Maktoum.",
    clubs: [
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Mon, 4:00 PM", description: "Delegates compete at Gulf-region MUN conferences." },
      { name: "Duke of Edinburgh's Award", category: "Community Service", icon: "🥾", meets: "Sat, 8:00 AM", description: "Expedition, skill, and service work toward Bronze through Gold awards." },
      { name: "Rugby Club", category: "Sports", icon: "🏉", meets: "Tue & Thu, 4:00 PM", description: "Junior and senior teams competing across the UAE." },
      { name: "Debating Society", category: "Academic", icon: "🗣️", meets: "Wed, 3:30 PM", description: "Weekly practice ahead of regional schools debating competitions." },
      { name: "Robotics Club", category: "STEM", icon: "🤖", meets: "Sun, 3:30 PM", description: "Builds competition robots for VEX Robotics events." }
    ]
  },
  {
    id: "sg-raffles-institution",
    name: "Raffles Institution",
    city: "Singapore",
    country: "Singapore",
    continent: "Asia",
    flag: "🇸🇬",
    photo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Raffles_Institution_Clocktower.jpg",
    students: 1680,
    founded: 1823,
    description: "One of Asia's oldest schools, with a formidable record in science olympiads and choir competitions.",
    clubs: [
      { name: "Science Research Programme", category: "STEM", icon: "🔬", meets: "Wed, 3:30 PM", description: "Independent research projects mentored by university partners." },
      { name: "Choir", category: "Arts", icon: "🎶", meets: "Tue & Fri, 4:00 PM", description: "Multi-award-winning choir performing at national competitions." },
      { name: "Dragon Boat Club", category: "Sports", icon: "🚣", meets: "Sat, 7:00 AM", description: "Trains on the Kallang river for national schools regatta." },
      { name: "Investment & Finance Club", category: "Business & Leadership", icon: "📈", meets: "Thu, 3:30 PM", description: "Runs a simulated stock portfolio and hosts industry speaker talks." },
      { name: "Robotics Club", category: "STEM", icon: "🤖", meets: "Mon & Thu, 4:00 PM", description: "Builds competitive bots for FIRST Tech Challenge Asia-Pacific." }
    ]
  },
  {
    id: "kr-seoul-science-hs",
    name: "Seoul Science High School",
    city: "Seoul",
    country: "South Korea",
    continent: "Asia",
    flag: "🇰🇷",
    students: 480,
    founded: 1989,
    description: "An elite science-specialized school producing top performers in international science olympiads.",
    clubs: [
      { name: "Physics Olympiad Team", category: "STEM", icon: "⚛️", meets: "Daily, 4:00 PM", description: "Trains competitors for the International Physics Olympiad." },
      { name: "Astronomy Club", category: "STEM", icon: "🔭", meets: "Fri, 7:00 PM", description: "Night observation sessions using the school's rooftop observatory." },
      { name: "K-Pop Dance Crew", category: "Arts", icon: "💃", meets: "Wed, 4:00 PM", description: "Choreography and performance at school festivals." },
      { name: "Taekwondo Club", category: "Sports", icon: "🥋", meets: "Mon & Thu, 5:00 PM", description: "Korea's national martial art, from forms to sparring." },
      { name: "Biotech Research Club", category: "STEM", icon: "🧬", meets: "Tue, 3:30 PM", description: "Lab-based research on genetics and synthetic biology." }
    ]
  },
  {
    id: "mx-american-school-foundation",
    name: "The American School Foundation",
    city: "Mexico City",
    country: "Mexico",
    continent: "North America",
    flag: "🇲🇽",
    students: 2400,
    founded: 1888,
    description: "The oldest continuously operating accredited American school outside the United States, on a 14.6-acre campus.",
    clubs: [
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Mon, 4:00 PM", description: "Delegates compete at Model UN conferences across Latin America." },
      { name: "National Honor Society", category: "Academic", icon: "🎓", meets: "Thu, 3:30 PM", description: "Academic honor society running peer-tutoring programs." },
      { name: "Robotics Team", category: "STEM", icon: "🤖", meets: "Tue & Fri, 4:00 PM", description: "Builds and competes with robots in FIRST Robotics events." },
      { name: "Community Service Club", category: "Community Service", icon: "🤝", meets: "Wed, 3:30 PM", description: "Coordinates volunteer projects across Mexico City." },
      { name: "Varsity Basketball", category: "Sports", icon: "🏀", meets: "Daily, 4:30 PM", description: "Competes in the Mexico City international schools league." }
    ]
  },
  {
    id: "es-colegio-pilar",
    name: "Colegio Nuestra Señora del Pilar",
    city: "Madrid",
    country: "Spain",
    continent: "Europe",
    flag: "🇪🇸",
    students: 1400,
    founded: 1907,
    description: "A Marianist Catholic school on Calle de Castelló in a landmark early-20th-century building; alumni include King Felipe VI.",
    clubs: [
      { name: "Debate Club", category: "Academic", icon: "🗣️", meets: "Wed, 4:00 PM", description: "Competitive debate training for regional tournaments." },
      { name: "Robotics Club", category: "STEM", icon: "🤖", meets: "Tue & Thu, 4:00 PM", description: "Builds robots for Spanish national robotics competitions." },
      { name: "Choir", category: "Arts", icon: "🎶", meets: "Mon, 4:00 PM", description: "Choral ensemble performing at school and diocesan events." },
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Fri, 3:30 PM", description: "Delegates prepare for Madrid-region MUN conferences." },
      { name: "Basketball Club", category: "Sports", icon: "🏀", meets: "Daily, 5:00 PM", description: "Boys' and girls' teams in the Madrid school league." }
    ]
  },
  {
    id: "it-liceo-galileo",
    name: "Liceo Classico Statale Galileo",
    city: "Florence",
    country: "Italy",
    continent: "Europe",
    flag: "🇮🇹",
    students: 750,
    founded: 1878,
    description: "One of Italy's oldest classical liceos, housed in a former monastic building in central Florence.",
    clubs: [
      { name: "Certamen (Classics Competition)", category: "Academic", icon: "📜", meets: "Tue, 4:00 PM", description: "Trains for Latin and Greek translation competitions." },
      { name: "Debate Club", category: "Academic", icon: "🗣️", meets: "Wed, 3:30 PM", description: "Weekly practice ahead of national debating tournaments." },
      { name: "Theatre Group", category: "Arts", icon: "🎭", meets: "Mon & Thu, 4:00 PM", description: "Stages classical and modern plays each spring." },
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Fri, 3:30 PM", description: "Delegates prepare for Italian schools MUN conferences." },
      { name: "Choir", category: "Arts", icon: "🎶", meets: "Tue, 4:00 PM", description: "Choral ensemble performing at school assemblies." }
    ]
  },
  {
    id: "se-norra-real",
    name: "Norra Real",
    city: "Stockholm",
    country: "Sweden",
    continent: "Europe",
    flag: "🇸🇪",
    photo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Norra_Reals_gymnasium.jpg",
    students: 1000,
    founded: 1876,
    description: "An upper-secondary school on Roslagsgatan known for its National Romantic-style tower building.",
    clubs: [
      { name: "Debate Society", category: "Academic", icon: "🗣️", meets: "Wed, 3:30 PM", description: "Weekly practice for Swedish national school debating." },
      { name: "Student Newspaper", category: "Media & Publishing", icon: "📰", meets: "Thu, 3:30 PM", description: "Reports on school life and student affairs." },
      { name: "Choir", category: "Arts", icon: "🎶", meets: "Mon, 4:00 PM", description: "Choral ensemble performing at school concerts." },
      { name: "Chess Club", category: "Academic", icon: "♟️", meets: "Tue, 1:00 PM", description: "Weekly matches open to all skill levels." },
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Fri, 3:30 PM", description: "Delegates prepare for Nordic schools MUN conferences." }
    ]
  },
  {
    id: "nz-auckland-grammar",
    name: "Auckland Grammar School",
    city: "Auckland",
    country: "New Zealand",
    continent: "Oceania",
    flag: "🇳🇿",
    photo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Auckland_Grammar_School,_East_Part.jpg",
    students: 2560,
    founded: 1869,
    description: "A historic boys' school with an outsized reputation in rowing and rugby.",
    clubs: [
      { name: "Rowing Club", category: "Sports", icon: "🚣", meets: "Daily, 5:30 AM", description: "One of the most decorated school rowing programs in the country." },
      { name: "Rugby Club", category: "Sports", icon: "🏉", meets: "Tue, Thu, Sat", description: "Multiple senior and junior teams competing regionally." },
      { name: "Kapa Haka Group", category: "Language & Culture", icon: "🪶", meets: "Wed, 3:30 PM", description: "Traditional Māori performing arts group." },
      { name: "Debating Society", category: "Academic", icon: "🗣️", meets: "Mon, 3:30 PM", description: "Competes in national secondary schools debating championships." },
      { name: "Marine & Environmental Science Club", category: "STEM", icon: "🐠", meets: "Fri, 3:30 PM", description: "Coastal ecology fieldwork around Auckland's harbours." }
    ]
  },
  {
    id: "au-sydney-grammar",
    name: "Sydney Grammar School",
    city: "Sydney",
    country: "Australia",
    continent: "Oceania",
    flag: "🇦🇺",
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Sydney_Grammar_School_Big_School.jpg",
    students: 1920,
    founded: 1857,
    description: "A prestigious independent school with strong sailing, chess, and classics programs.",
    clubs: [
      { name: "Sailing Club", category: "Sports", icon: "⛵", meets: "Sat, 9:00 AM", description: "Trains on Sydney Harbour, competing in interschool regattas." },
      { name: "Chess Club", category: "Academic", icon: "♟️", meets: "Thu, 1:00 PM", description: "Weekly tournaments and coaching for all skill levels." },
      { name: "Surf Life Saving Club", category: "Sports", icon: "🏄", meets: "Sun, 8:00 AM", description: "Beach patrol training and lifesaving certification." },
      { name: "Classics Society", category: "Academic", icon: "🏺", meets: "Tue, 4:00 PM", description: "Latin and Ancient Greek reading and quiz competitions." },
      { name: "Photography Club", category: "Media & Publishing", icon: "📷", meets: "Wed, 3:30 PM", description: "Darkroom and digital photography, with an annual exhibition." }
    ]
  },
  {
    id: "eg-cairo-american-college",
    name: "Cairo American College",
    city: "Cairo",
    country: "Egypt",
    continent: "Africa",
    flag: "🇪🇬",
    students: 960,
    founded: 1945,
    description: "An independent, coeducational day school on an 11-acre campus in Maadi, serving international families since the postwar period.",
    clubs: [
      { name: "Model United Nations", category: "Academic", icon: "🏛️", meets: "Mon, 4:00 PM", description: "Delegates compete at Model UN conferences across the region." },
      { name: "National Honor Society", category: "Academic", icon: "🎓", meets: "Thu, 3:30 PM", description: "Academic honor society running peer-tutoring programs." },
      { name: "Robotics Club", category: "STEM", icon: "🤖", meets: "Tue & Fri, 4:00 PM", description: "Builds bots for the Egypt National Robotics Challenge." },
      { name: "Community Service Club", category: "Community Service", icon: "🤝", meets: "Wed, 3:30 PM", description: "Coordinates volunteer projects across Cairo." },
      { name: "Varsity Soccer", category: "Sports", icon: "⚽", meets: "Daily, 4:30 PM", description: "Competes in Cairo's international schools league." }
    ]
  },
  {
    id: "ca-westview-secondary",
    name: "Westview Secondary School",
    city: "Vancouver",
    country: "Canada",
    continent: "North America",
    flag: "🇨🇦",
    students: 1310,
    founded: 1958,
    description: "A public secondary school with strong outdoor education and film production programs.",
    clubs: [
      { name: "Film Production Club", category: "Media & Publishing", icon: "🎬", meets: "Tue & Fri, 3:30 PM", description: "Writes, shoots, and edits short films screened at a year-end festival." },
      { name: "Outdoor Adventure Club", category: "Community Service", icon: "🏔️", meets: "Sat, 8:00 AM", description: "Hiking, kayaking, and wilderness-skills trips around British Columbia." },
      { name: "Ice Hockey Club", category: "Sports", icon: "🏒", meets: "Mon, Wed, Fri, 6:00 AM", description: "Early-morning ice time with a competitive league schedule." },
      { name: "Coding Club", category: "STEM", icon: "💻", meets: "Thu, 3:30 PM", description: "Web development and game jams for beginners and experts alike." },
      { name: "Indigenous Culture Club", category: "Language & Culture", icon: "🪶", meets: "Wed, 3:30 PM", description: "Celebrates and shares local First Nations history and traditions." }
    ]
  },
  {
    id: "th-suankularb-wittayalai",
    name: "Suankularb Wittayalai School",
    city: "Bangkok",
    country: "Thailand",
    continent: "Asia",
    flag: "🇹🇭",
    photo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Suankularb_Wittayalai_Building_(100_Year_Building).jpg",
    students: 3600,
    founded: 1882,
    description: "Thailand's oldest public secondary school, founded by King Chulalongkorn; alumni include eight Thai prime ministers.",
    clubs: [
      { name: "Football Club", category: "Sports", icon: "⚽", meets: "Daily, 4:00 PM", description: "Home of Suankularb's century-old football rivalry with Debsirin." },
      { name: "Scouts", category: "Community Service", icon: "🏕️", meets: "Sat, 8:00 AM", description: "Outdoor skills, service projects, and leadership training." },
      { name: "Student Newspaper (Pimsuan)", category: "Media & Publishing", icon: "📰", meets: "Thu, 3:30 PM", description: "Publishes the school's long-running student newspaper." },
      { name: "Yearbook Committee (Samarnmitr)", category: "Media & Publishing", icon: "📖", meets: "Wed, 3:30 PM", description: "Produces the school's annual yearbook." },
      { name: "Chorus", category: "Arts", icon: "🎶", meets: "Mon, 4:00 PM", description: "Choral ensemble performing at school ceremonies." }
    ]
  },
  {
    id: "in-doon-school",
    name: "The Doon School",
    city: "Dehradun",
    country: "India",
    continent: "Asia",
    flag: "🇮🇳",
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/The_Doon_School.jpg",
    students: 550,
    founded: 1935,
    description: "India's most storied boarding school, known for its sprawling Himalayan-foothill campus and a famously wide-ranging 'hobbies' program.",
    clubs: [
      { name: "Doon School Weekly", category: "Media & Publishing", icon: "📰", meets: "Fri, 4:00 PM", description: "One of India's oldest student-run newspapers, published continuously since 1936." },
      { name: "Photographic Society", category: "Arts", icon: "📷", meets: "Wed, 3:30 PM", description: "Darkroom and digital photography, with prints exhibited each term." },
      { name: "Astronomical Society", category: "STEM", icon: "🔭", meets: "Fri, 8:00 PM", description: "Night-sky observation sessions using the school's telescope." },
      { name: "Riding Club", category: "Sports", icon: "🐎", meets: "Tue & Sat, 6:30 AM", description: "Equestrian training on the school's own stables and riding ground." },
      { name: "Doon Global Naturalists Network", category: "Community Service", icon: "🌿", meets: "Monthly, online", description: "A citizen-science chapter running bird counts and habitat journaling with student naturalists everywhere.", openMembership: true, joinNote: "Open to students at any school, anywhere — join the monthly virtual bird count and habitat-journaling sessions." }
    ]
  },
  {
    id: "in-mayo-college",
    name: "Mayo College",
    city: "Ajmer",
    country: "India",
    continent: "Asia",
    flag: "🇮🇳",
    students: 900,
    founded: 1875,
    description: "Once founded for the sons of Rajput nobility, now a leading co-ed boarding school famed for its palatial campus and equestrian tradition.",
    clubs: [
      { name: "Polo & Equestrian Club", category: "Sports", icon: "🐎", meets: "Daily, 6:00 AM", description: "One of the school's oldest traditions, training on its own polo grounds." },
      { name: "Heritage Conservation Society", category: "Community Service", icon: "🏛️", meets: "Sat, 10:00 AM", description: "Documents and helps preserve Ajmer's historic monuments." },
      { name: "Robotics & Electronics Club", category: "STEM", icon: "🤖", meets: "Tue & Thu, 4:00 PM", description: "Circuit-building and competitive robotics projects." },
      { name: "Western & Classical Music Society", category: "Arts", icon: "🎻", meets: "Mon, 4:00 PM", description: "Orchestral and classical Indian music ensembles performing each term." },
      { name: "Young Diplomats Circle", category: "Academic", icon: "🕊️", meets: "Monthly, online", description: "A virtual Model UN chapter hosting monthly video-conference sessions.", openMembership: true, joinNote: "A virtual Model UN chapter — open to student delegates from any school worldwide for monthly online conferences." }
    ]
  },
  {
    id: "in-scindia-school",
    name: "The Scindia School",
    city: "Gwalior",
    country: "India",
    continent: "Asia",
    flag: "🇮🇳",
    photo: "https://upload.wikimedia.org/wikipedia/commons/6/69/The_Scindia_School.jpg",
    students: 600,
    founded: 1897,
    description: "A boys' boarding school set inside the historic Gwalior Fort, known for its adventure sports and pioneering aeromodelling program.",
    clubs: [
      { name: "Aeromodelling Club", category: "STEM", icon: "✈️", meets: "Wed, 4:00 PM", description: "Designs and flies scale model aircraft, a decades-old Scindia tradition." },
      { name: "Mountaineering & Adventure Club", category: "Sports", icon: "🧗", meets: "Sat, 6:00 AM", description: "Rock-climbing and trekking expeditions in the surrounding hills." },
      { name: "Fort Heritage Trust", category: "Community Service", icon: "🏰", meets: "Sun, 10:00 AM", description: "Student-led conservation and guided-tour project for the school's fort campus." },
      { name: "Western Classical Orchestra", category: "Arts", icon: "🎻", meets: "Tue, 4:00 PM", description: "Full orchestral ensemble performing at the school's annual founder's day." },
      { name: "Coders' Guild", category: "STEM", icon: "💻", meets: "Weekly, online", description: "An open-source coding collective running remote hackathons.", openMembership: true, joinNote: "Runs virtual hackathons and open-source projects anyone can join remotely, no matter what school you attend." }
    ]
  },
  {
    id: "in-la-martiniere",
    name: "La Martiniere College",
    city: "Lucknow",
    country: "India",
    continent: "Asia",
    flag: "🇮🇳",
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/26/La_Martiniere_College_Lucknow.jpg",
    students: 1100,
    founded: 1845,
    description: "One of India's oldest English-medium schools, housed in a striking Gothic building and known for its disciplined tradition and debate culture.",
    clubs: [
      { name: "National Cadet Corps", category: "Community Service", icon: "🎖️", meets: "Sat, 7:00 AM", description: "Discipline, drill, and leadership training with a century-long school tradition." },
      { name: "Martinian Debating Union", category: "Academic", icon: "🗣️", meets: "Wed, 4:00 PM", description: "Competitive debate training for state and national tournaments." },
      { name: "Heritage Architecture Society", category: "Arts", icon: "🏛️", meets: "Fri, 3:30 PM", description: "Studies and documents the school's landmark 19th-century architecture." },
      { name: "Cricket Club", category: "Sports", icon: "🏏", meets: "Daily, 4:00 PM", description: "One of Lucknow's oldest school cricket programs." },
      { name: "Global Debate Exchange", category: "Academic", icon: "🌐", meets: "Monthly, online", description: "A virtual debate circuit connecting Martinian debaters with teams abroad.", openMembership: true, joinNote: "Monthly video-conference debate rounds open to student teams from any country." }
    ]
  },
  {
    id: "us-phillips-exeter",
    name: "Phillips Exeter Academy",
    city: "Exeter",
    country: "United States",
    continent: "North America",
    flag: "🇺🇸",
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Phillips_Exeter_Academy_building.jpg",
    students: 1090,
    founded: 1781,
    description: "An elite boarding school famous for the Harkness table discussion method and a globally diverse student body.",
    clubs: [
      { name: "Exeter Robotics Club", category: "STEM", icon: "🤖", meets: "Tue & Thu, 4:00 PM", description: "Builds competition robots for FIRST Robotics regionals." },
      { name: "The Exonian", category: "Media & Publishing", icon: "📰", meets: "Sun, 6:00 PM", description: "The oldest continuously-published prep school newspaper in the country." },
      { name: "A Cappella Ensemble", category: "Arts", icon: "🎤", meets: "Mon & Wed, 4:00 PM", description: "Student vocal group performing at campus events and off-campus festivals." },
      { name: "Crew", category: "Sports", icon: "🚣", meets: "Daily, 3:30 PM", description: "Rowing on the Squamscott River, with a full spring regatta season." },
      { name: "Harkness Discussion Exchange", category: "Academic", icon: "🌐", meets: "Biweekly, online", description: "Open virtual seminars using the Harkness discussion method.", openMembership: true, joinNote: "Free virtual Harkness-style seminars on global issues — open to students at any school." }
    ]
  },
  {
    id: "us-phillips-andover",
    name: "Phillips Academy Andover",
    city: "Andover",
    country: "United States",
    continent: "North America",
    flag: "🇺🇸",
    photo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Phillips_Academy,_Andover,_MA_-_Samuel_Phillips_Hall.JPG",
    students: 1150,
    founded: 1778,
    description: "One of America's oldest secondary schools, known for need-blind admissions and a strong tradition of civic engagement.",
    clubs: [
      { name: "Andover Robotics", category: "STEM", icon: "🤖", meets: "Mon & Thu, 4:00 PM", description: "Designs and builds robots for regional and national competitions." },
      { name: "Philomathean Society", category: "Academic", icon: "📚", meets: "Wed, 4:00 PM", description: "The school's historic literary and debate society, founded in 1811." },
      { name: "Astronomy Club", category: "STEM", icon: "🔭", meets: "Fri, 8:00 PM", description: "Observatory nights and telescope-building workshops." },
      { name: "Ultimate Frisbee Club", category: "Sports", icon: "🥏", meets: "Tue & Sat, 3:30 PM", description: "Casual and competitive play with a spring tournament circuit." },
      { name: "Andover Coding Collective", category: "STEM", icon: "💻", meets: "Weekly, online", description: "A student-led open-source group running public coding workshops.", openMembership: true, joinNote: "Public coding workshops and open-source projects — anyone, anywhere, can join in online." }
    ]
  },
  {
    id: "us-stuyvesant",
    name: "Stuyvesant High School",
    city: "New York City",
    country: "United States",
    continent: "North America",
    flag: "🇺🇸",
    photo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Stuyvesant_High_School_main_entrance_on_Chambers_Street.jpg",
    students: 3300,
    founded: 1904,
    description: "A specialized public STEM high school in Manhattan known for its rigorous admissions exam and powerhouse robotics and debate teams.",
    clubs: [
      { name: "StuyPulse Robotics", category: "STEM", icon: "🤖", meets: "Daily, 3:30 PM", description: "Stuyvesant's FIRST Robotics Competition team, a fixture of the NYC regional." },
      { name: "Speech & Debate Team", category: "Academic", icon: "🗣️", meets: "Tue & Thu, 4:00 PM", description: "Competes across national circuit tournaments in multiple debate formats." },
      { name: "The Spectator", category: "Media & Publishing", icon: "📰", meets: "Mon, 4:00 PM", description: "Stuyvesant's student newspaper, published since 1915." },
      { name: "Big Sibs Program", category: "Community Service", icon: "🤝", meets: "Ongoing", description: "Pairs upperclassmen with incoming freshmen for mentorship and orientation." },
      { name: "Global Speech Exchange", category: "Academic", icon: "🌐", meets: "Monthly, online", description: "Online debate scrimmages with student speakers from other countries.", openMembership: true, joinNote: "Monthly online debate scrimmages open to student speakers from any country." }
    ]
  },
  {
    id: "us-tjhsst",
    name: "Thomas Jefferson High School for Science and Technology",
    city: "Alexandria",
    country: "United States",
    continent: "North America",
    flag: "🇺🇸",
    students: 1850,
    founded: 1985,
    description: "A magnet school for science and technology with student research labs spanning neuroscience, robotics, and quantum computing.",
    clubs: [
      { name: "TJ Robotics", category: "STEM", icon: "🤖", meets: "Tue & Thu, 4:00 PM", description: "Builds and competes with robots across multiple FIRST leagues." },
      { name: "Science Research Symposium", category: "STEM", icon: "🔬", meets: "Wed, 3:30 PM", description: "Showcases student-led original research across every science discipline." },
      { name: "Model UN", category: "Academic", icon: "🏛️", meets: "Mon, 4:00 PM", description: "Competes at Model UN conferences up and down the East Coast." },
      { name: "Science Bowl Team", category: "Academic", icon: "🧠", meets: "Fri, 3:30 PM", description: "Fast-paced academic quiz competition covering all of STEM." },
      { name: "Open Research Mentorship Network", category: "STEM", icon: "🌐", meets: "Ongoing, online", description: "Pairs TJ researchers with student scientists elsewhere for virtual mentorship.", openMembership: true, joinNote: "Virtual mentorship pairing TJ student researchers with student scientists anywhere in the world." }
    ]
  }
];

// Convenience export for other scripts (kept as a plain global for zero-build simplicity)
if (typeof window !== "undefined") {
  window.SCHOOL_REGISTRY = SCHOOL_REGISTRY;
}
