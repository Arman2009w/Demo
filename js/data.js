/**
 * ClubSphere — Registered School Directory
 * This is the "registered list" of schools stored locally in the front end.
 * Each school entry includes its location metadata and full club catalog.
 */

const SCHOOL_REGISTRY = [
  {
    id: "us-lincoln-hs",
    name: "Lincoln High School",
    city: "Austin",
    country: "United States",
    continent: "North America",
    flag: "🇺🇸",
    students: 1840,
    founded: 1962,
    description: "A public magnet high school known for its award-winning robotics program and strong performing arts tradition.",
    clubs: [
      { name: "Robotics Club", category: "STEM", icon: "🤖", meets: "Tue & Thu, 4:00 PM", description: "Designs and builds competition robots for FIRST Robotics regionals." },
      { name: "Debate Society", category: "Academic", icon: "🗣️", meets: "Mon, 3:30 PM", description: "Competitive policy and Lincoln-Douglas debate training." },
      { name: "Drama & Theatre Troupe", category: "Arts", icon: "🎭", meets: "Wed & Fri, 4:00 PM", description: "Stages two full productions per year, from auditions to set design." },
      { name: "Environmental Action Club", category: "Community Service", icon: "🌱", meets: "Thu, 3:30 PM", description: "Campus sustainability projects and local river clean-ups." },
      { name: "Varsity Esports", category: "Sports", icon: "🎮", meets: "Mon–Wed, 5:00 PM", description: "Competes in regional Rocket League and Valorant leagues." }
    ]
  },
  {
    id: "uk-kings-college",
    name: "King's College School",
    city: "London",
    country: "United Kingdom",
    continent: "Europe",
    flag: "🇬🇧",
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
    id: "jp-sakura-academy",
    name: "Sakura Gakuen Academy",
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    flag: "🇯🇵",
    students: 980,
    founded: 1978,
    description: "A private secondary academy renowned for its robotics engineering track and calligraphy program.",
    clubs: [
      { name: "Robotics & AI Lab", category: "STEM", icon: "🤖", meets: "Tue & Fri, 4:30 PM", description: "Builds autonomous robots for the All-Japan High School Robot competition." },
      { name: "Calligraphy Club (Shodo)", category: "Arts", icon: "🖌️", meets: "Mon, 3:45 PM", description: "Traditional brush calligraphy practice and exhibitions." },
      { name: "Kendo Club", category: "Sports", icon: "🥋", meets: "Mon, Wed, Fri, 5:00 PM", description: "Japanese swordsmanship training and inter-school tournaments." },
      { name: "Manga & Animation Club", category: "Arts", icon: "🎨", meets: "Thu, 4:00 PM", description: "Collaborative comic creation and animation basics." },
      { name: "English Speaking Society", category: "Language & Culture", icon: "🌐", meets: "Wed, 4:00 PM", description: "Conversational practice and international pen-pal exchanges." }
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
    id: "de-goethe-gymnasium",
    name: "Goethe Gymnasium",
    city: "Berlin",
    country: "Germany",
    continent: "Europe",
    flag: "🇩🇪",
    students: 760,
    founded: 1901,
    description: "A gymnasium with strong engineering and environmental science programs.",
    clubs: [
      { name: "Renewable Energy Club", category: "STEM", icon: "⚡", meets: "Wed, 3:30 PM", description: "Builds solar and wind demonstration projects for regional science fairs." },
      { name: "Jazz Band", category: "Arts", icon: "🎷", meets: "Tue & Fri, 4:00 PM", description: "Student jazz ensemble performing at city youth festivals." },
      { name: "Debate Club (Jugend debattiert)", category: "Academic", icon: "🗣️", meets: "Mon, 4:00 PM", description: "Trains for Germany's national youth debating competition." },
      { name: "Model Railway Society", category: "STEM", icon: "🚂", meets: "Thu, 4:00 PM", description: "Designs and engineers scale model railway systems." },
      { name: "Table Tennis Club", category: "Sports", icon: "🏓", meets: "Mon & Wed, 5:00 PM", description: "Casual and competitive play with regional league entries." }
    ]
  },
  {
    id: "br-santos-colegio",
    name: "Colégio Santos Dumont",
    city: "São Paulo",
    country: "Brazil",
    continent: "South America",
    flag: "🇧🇷",
    students: 1560,
    founded: 1965,
    description: "A college-preparatory school celebrated for its capoeira program and youth entrepreneurship incubator.",
    clubs: [
      { name: "Capoeira Roda", category: "Sports", icon: "🤸", meets: "Tue & Thu, 5:00 PM", description: "Afro-Brazilian martial art, music, and dance tradition." },
      { name: "Young Entrepreneurs Club", category: "Business & Leadership", icon: "💼", meets: "Fri, 3:30 PM", description: "Student-run micro-businesses and a year-end pitch competition." },
      { name: "Samba & Percussion Ensemble", category: "Arts", icon: "🥁", meets: "Wed, 4:00 PM", description: "Live percussion group performing at school and community events." },
      { name: "Environmental Guardians", category: "Community Service", icon: "🌳", meets: "Sat, 9:00 AM", description: "Amazon reforestation partnerships and campus recycling programs." },
      { name: "Futsal Club", category: "Sports", icon: "⚽", meets: "Daily, 4:30 PM", description: "Indoor football training and regional tournaments." }
    ]
  },
  {
    id: "za-cape-academy",
    name: "Cape Town International Academy",
    city: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    flag: "🇿🇦",
    students: 890,
    founded: 1991,
    description: "An IB World School with a marine science focus, thanks to its coastal campus.",
    clubs: [
      { name: "Marine Biology Society", category: "STEM", icon: "🐠", meets: "Thu, 3:30 PM", description: "Tidal pool research and partnership dives with local conservation groups." },
      { name: "A Cappella Group", category: "Arts", icon: "🎤", meets: "Mon, 4:00 PM", description: "Vocal harmony group performing at community events." },
      { name: "Model UN & Debate", category: "Academic", icon: "🏛️", meets: "Wed, 4:00 PM", description: "Represents the school at Southern Africa MUN conferences." },
      { name: "Rugby Club", category: "Sports", icon: "🏉", meets: "Tue, Thu, Sat", description: "School's flagship team with a century-long rivalry tradition." },
      { name: "Community Outreach Society", category: "Community Service", icon: "🤝", meets: "Sat, 8:30 AM", description: "Tutoring and food-security projects in nearby townships." }
    ]
  },
  {
    id: "ke-nairobi-academy",
    name: "Nairobi Green Academy",
    city: "Nairobi",
    country: "Kenya",
    continent: "Africa",
    flag: "🇰🇪",
    students: 1120,
    founded: 1985,
    description: "A day and boarding school known for its long-distance running program and strong debate tradition.",
    clubs: [
      { name: "Athletics & Distance Running", category: "Sports", icon: "🏃", meets: "Daily, 6:00 AM", description: "Elite middle- and long-distance training squad with national-level runners." },
      { name: "Debate Club", category: "Academic", icon: "🗣️", meets: "Tue, 3:30 PM", description: "Competes in the East Africa Schools Debating Championship." },
      { name: "Wildlife Conservation Club", category: "Community Service", icon: "🦒", meets: "Fri, 3:30 PM", description: "Partners with local conservancies on habitat monitoring projects." },
      { name: "Traditional Dance & Drumming", category: "Arts", icon: "🥁", meets: "Wed, 4:00 PM", description: "Celebrates Kenya's diverse cultural dance heritage." },
      { name: "Young Coders Club", category: "STEM", icon: "💻", meets: "Mon & Thu, 4:00 PM", description: "Introductory programming and mobile app development." }
    ]
  },
  {
    id: "ae-dubai-intl",
    name: "Dubai International School",
    city: "Dubai",
    country: "United Arab Emirates",
    continent: "Asia",
    flag: "🇦🇪",
    students: 2100,
    founded: 2003,
    description: "A multicultural K-12 campus serving students from over 80 nationalities, with a strong innovation lab.",
    clubs: [
      { name: "Innovation & Robotics Lab", category: "STEM", icon: "🤖", meets: "Sun & Tue, 3:30 PM", description: "3D printing, drone building, and VEX Robotics competitions." },
      { name: "Model Arab League", category: "Academic", icon: "🏛️", meets: "Mon, 4:00 PM", description: "Simulates the Arab League's diplomatic proceedings." },
      { name: "International Culture Club", category: "Language & Culture", icon: "🌍", meets: "Wed, 3:30 PM", description: "Celebrates the school's 80+ nationalities through food and festivals." },
      { name: "Swimming Club", category: "Sports", icon: "🏊", meets: "Daily, 4:00 PM", description: "Competitive swim team training in the campus aquatic center." },
      { name: "Young Journalists Club", category: "Media & Publishing", icon: "📰", meets: "Thu, 3:30 PM", description: "Publishes the school's monthly digital newspaper." }
    ]
  },
  {
    id: "sg-raffles-institution",
    name: "Raffles Institution",
    city: "Singapore",
    country: "Singapore",
    continent: "Asia",
    flag: "🇸🇬",
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
    id: "mx-benito-juarez",
    name: "Instituto Benito Juárez",
    city: "Mexico City",
    country: "Mexico",
    continent: "North America",
    flag: "🇲🇽",
    students: 1340,
    founded: 1958,
    description: "A bilingual college-prep school with a celebrated mariachi program and civic engagement focus.",
    clubs: [
      { name: "Mariachi Ensemble", category: "Arts", icon: "🎺", meets: "Tue & Thu, 4:00 PM", description: "Traditional mariachi band performing at civic events." },
      { name: "Student Government & Civics", category: "Business & Leadership", icon: "🏛️", meets: "Mon, 3:30 PM", description: "Runs school elections and community civic initiatives." },
      { name: "Folkloric Dance Club", category: "Arts", icon: "💃", meets: "Wed, 4:00 PM", description: "Regional Mexican folk dance troupe and costume design." },
      { name: "Robotics Club", category: "STEM", icon: "🤖", meets: "Fri, 3:30 PM", description: "Competes in the national VEX Robotics Mexico circuit." },
      { name: "Basketball Club", category: "Sports", icon: "🏀", meets: "Daily, 5:00 PM", description: "Boys' and girls' teams competing in the city league." }
    ]
  },
  {
    id: "es-liceo-cervantes",
    name: "Liceo Cervantes",
    city: "Madrid",
    country: "Spain",
    continent: "Europe",
    flag: "🇪🇸",
    students: 1050,
    founded: 1940,
    description: "A liceo with deep roots in literature and flamenco, alongside a growing esports scene.",
    clubs: [
      { name: "Flamenco Club", category: "Arts", icon: "💃", meets: "Thu, 4:00 PM", description: "Traditional flamenco dance and guitar accompaniment." },
      { name: "Literary Society", category: "Media & Publishing", icon: "📚", meets: "Tue, 3:30 PM", description: "Publishes an annual student literary magazine, El Faro." },
      { name: "Esports Club", category: "Sports", icon: "🎮", meets: "Mon & Wed, 5:00 PM", description: "Competitive FIFA and League of Legends teams." },
      { name: "Football (Soccer) Club", category: "Sports", icon: "⚽", meets: "Daily, 5:00 PM", description: "School's most popular team sport with multiple age divisions." },
      { name: "Culinary Arts Club", category: "Arts", icon: "🍳", meets: "Fri, 4:00 PM", description: "Explores Spanish regional cuisine and hosts termly tasting events." }
    ]
  },
  {
    id: "it-liceo-dante",
    name: "Liceo Dante Alighieri",
    city: "Florence",
    country: "Italy",
    continent: "Europe",
    flag: "🇮🇹",
    students: 720,
    founded: 1875,
    description: "A humanities-focused liceo housed in a historic building, with a renowned fresco restoration club.",
    clubs: [
      { name: "Art Restoration Society", category: "Arts", icon: "🖼️", meets: "Wed, 3:30 PM", description: "Studies and assists with local fresco and sculpture preservation." },
      { name: "Opera & Vocal Ensemble", category: "Arts", icon: "🎭", meets: "Mon & Thu, 4:00 PM", description: "Stages excerpts from Italian opera classics each spring." },
      { name: "Philosophy Club", category: "Academic", icon: "📖", meets: "Tue, 4:00 PM", description: "Weekly discussions on classical and modern philosophy." },
      { name: "Cycling Club", category: "Sports", icon: "🚴", meets: "Sat, 8:00 AM", description: "Weekend rides through the Tuscan countryside." },
      { name: "Culinary Heritage Club", category: "Arts", icon: "🍝", meets: "Fri, 3:30 PM", description: "Documents and recreates regional Italian family recipes." }
    ]
  },
  {
    id: "se-stockholm-gymnasium",
    name: "Stockholm International Gymnasium",
    city: "Stockholm",
    country: "Sweden",
    continent: "Europe",
    flag: "🇸🇪",
    students: 640,
    founded: 1996,
    description: "A tech-forward gymnasium with strong ties to Stockholm's startup ecosystem.",
    clubs: [
      { name: "Startup & Innovation Club", category: "Business & Leadership", icon: "🚀", meets: "Tue, 3:30 PM", description: "Student teams build and pitch startup concepts to local investors." },
      { name: "Game Development Club", category: "STEM", icon: "🕹️", meets: "Thu, 3:30 PM", description: "Builds indie games in Unity, showcased at a year-end demo night." },
      { name: "Sustainability Council", category: "Community Service", icon: "♻️", meets: "Mon, 4:00 PM", description: "Leads the school's zero-waste and green-energy initiatives." },
      { name: "Floorball Club", category: "Sports", icon: "🏑", meets: "Wed & Fri, 5:00 PM", description: "Sweden's favorite indoor sport, with a competitive school team." },
      { name: "Choir & Music Production", category: "Arts", icon: "🎧", meets: "Mon, 4:00 PM", description: "Blends choral singing with electronic music production." }
    ]
  },
  {
    id: "nz-auckland-grammar",
    name: "Auckland Grammar School",
    city: "Auckland",
    country: "New Zealand",
    continent: "Oceania",
    flag: "🇳🇿",
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
    id: "eg-cairo-modern",
    name: "Cairo Modern Academy",
    city: "Cairo",
    country: "Egypt",
    continent: "Africa",
    flag: "🇪🇬",
    students: 1480,
    founded: 1972,
    description: "A bilingual academy with a strong archaeology club that partners with local museums.",
    clubs: [
      { name: "Young Archaeologists Club", category: "Academic", icon: "🏺", meets: "Wed, 3:30 PM", description: "Museum partnerships and guided site studies of ancient Egypt." },
      { name: "Robotics & Coding Club", category: "STEM", icon: "🤖", meets: "Mon & Thu, 4:00 PM", description: "Builds bots for the Egypt National Robotics Challenge." },
      { name: "Arabic Calligraphy Club", category: "Arts", icon: "🖋️", meets: "Sun, 3:30 PM", description: "Traditional and modern Arabic script art." },
      { name: "Handball Club", category: "Sports", icon: "🤾", meets: "Daily, 4:30 PM", description: "One of Egypt's most popular school team sports." },
      { name: "Model UN Society", category: "Academic", icon: "🏛️", meets: "Tue, 4:00 PM", description: "Represents the school at Cairo regional MUN conferences." }
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
    id: "th-bangkok-prep",
    name: "Bangkok Preparatory School",
    city: "Bangkok",
    country: "Thailand",
    continent: "Asia",
    flag: "🇹🇭",
    students: 890,
    founded: 1998,
    description: "An international school blending Thai heritage with a global curriculum.",
    clubs: [
      { name: "Muay Thai Club", category: "Sports", icon: "🥊", meets: "Tue & Thu, 4:00 PM", description: "Traditional Thai boxing taught by certified instructors." },
      { name: "Thai Classical Dance Club", category: "Arts", icon: "💃", meets: "Wed, 3:30 PM", description: "Ornate classical dance forms performed at cultural festivals." },
      { name: "Marine Conservation Club", category: "Community Service", icon: "🐢", meets: "Sat, 8:00 AM", description: "Beach clean-ups and coral reef monitoring trips to the Gulf of Thailand." },
      { name: "Robotics Club", category: "STEM", icon: "🤖", meets: "Mon, 3:30 PM", description: "Builds bots for the Thailand robotics championship circuit." },
      { name: "Culinary Club", category: "Arts", icon: "🍜", meets: "Fri, 3:30 PM", description: "Explores regional Thai cuisine with a hands-on cooking studio." }
    ]
  },
  {
    id: "in-doon-school",
    name: "The Doon School",
    city: "Dehradun",
    country: "India",
    continent: "Asia",
    flag: "🇮🇳",
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
