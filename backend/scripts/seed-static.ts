import { prisma } from "../src/singletonPC";

/**
 * Static Seed: Fixed, deterministic data
 * Creates practices, persons, animals with constant data
 * Idempotent: skips if already exists
 * Run once per fresh DB, data persists across restarts
 *
 * Data volumes:
 * - 15 practices (fixed, exact)
 * - 6 test accounts (fixed)
 * - 24 animals (1 per race, good variation across all 7 animal types)
 * - ~40 veterinarians (2-3 per practice with varied specializations)
 */

// ============================
// FIXED DATA DEFINITIONS
// ============================

const FIXED_PRACTICES = [
  { email: "kontakt@berlinvet.de", name: "Tierarztpraxis Berlin Mitte", city: "Berlin", cityCode: "10115", phone: "+49 30 123456", latitude: 52.52, longitude: 13.405 },
  { email: "kontakt@alstertier.de", name: "Alstertal Tierklinik Hamburg", city: "Hamburg", cityCode: "20095", phone: "+49 40 987654", latitude: 53.55, longitude: 10.0 },
  { email: "kontakt@muenchen-tier.de", name: "Tierarztpraxis München", city: "München", cityCode: "80331", phone: "+49 89 123456", latitude: 48.1374, longitude: 11.5755 },
  { email: "kontakt@koeln-vet.de", name: "Tierarztpraxis Köln", city: "Köln", cityCode: "50667", phone: "+49 221 123456", latitude: 50.9375, longitude: 6.9603 },
  { email: "kontakt@frankfurt-vet.de", name: "Tierarztpraxis Frankfurt", city: "Frankfurt am Main", cityCode: "60311", phone: "+49 69 123456", latitude: 50.1109, longitude: 8.6821 },
  { email: "kontakt@stuttgart-vet.de", name: "Tierarztpraxis Stuttgart", city: "Stuttgart", cityCode: "70173", phone: "+49 711 123456", latitude: 48.7758, longitude: 9.1829 },
  { email: "kontakt@duesseldorf-vet.de", name: "Tierarztpraxis Düsseldorf", city: "Düsseldorf", cityCode: "40210", phone: "+49 211 123456", latitude: 51.2277, longitude: 6.7735 },
  { email: "kontakt@leipzig-vet.de", name: "Tierarztpraxis Leipzig", city: "Leipzig", cityCode: "04103", phone: "+49 341 123456", latitude: 51.3397, longitude: 12.3731 },
  { email: "kontakt@dresden-vet.de", name: "Tierarztpraxis Dresden", city: "Dresden", cityCode: "01067", phone: "+49 351 123456", latitude: 51.0504, longitude: 13.7372 },
  { email: "kontakt@hannover-vet.de", name: "Tierarztpraxis Hannover", city: "Hannover", cityCode: "30159", phone: "+49 511 123456", latitude: 52.3759, longitude: 9.732 },
  { email: "kontakt@nuernberg-vet.de", name: "Tierarztpraxis Nürnberg", city: "Nürnberg", cityCode: "90402", phone: "+49 911 123456", latitude: 49.4521, longitude: 11.0767 },
  { email: "kontakt@bremen-vet.de", name: "Tierarztpraxis Bremen", city: "Bremen", cityCode: "28195", phone: "+49 421 123456", latitude: 53.0793, longitude: 8.8017 },
  { email: "kontakt@essen-vet.de", name: "Tierarztpraxis Essen", city: "Essen", cityCode: "45127", phone: "+49 201 123456", latitude: 51.4556, longitude: 7.0116 },
  { email: "kontakt@dortmund-vet.de", name: "Tierarztpraxis Dortmund", city: "Dortmund", cityCode: "44135", phone: "+49 231 123456", latitude: 51.5136, longitude: 7.4653 },
  { email: "kontakt@bonn-vet.de", name: "Tierarztpraxis Bonn", city: "Bonn", cityCode: "53111", phone: "+49 228 123456", latitude: 50.7374, longitude: 7.0982 },
];

const FIXED_PERSONS = [
  { email: "joe@doe.de", firstName: "Joe", lastName: "Doe", city: "Berlin", cityCode: "10115" },
  { email: "daniel@daniel.de", firstName: "Daniel", lastName: "Müller", city: "Berlin", cityCode: "10115" },
  { email: "james@jay.de", firstName: "James", lastName: "Jayjay", city: "Hamburg", cityCode: "20095" },
  { email: "m@m.de", firstName: "Maria", lastName: "May", city: "Köln", cityCode: "50667" },
  { email: "joey@doey.de", firstName: "Denis", lastName: "Deniz", city: "Frankfurt am Main", cityCode: "60311" },
  { email: "aziz@erol.de", firstName: "Aziz", lastName: "Erol", city: "Frankfurt am Main", cityCode: "60311" },
];

// 24 animals: 1 per race + variation across all 7 animal types
const FIXED_ANIMALS = [
  // Hund (4 races, 1 per race)
  { name: "Rex", ownerEmail: "joe@doe.de", animalTypeName: "Hund", raceName: "Labrador" },
  { name: "Buddy", ownerEmail: "daniel@daniel.de", animalTypeName: "Hund", raceName: "Pudel" },
  { name: "Charlie", ownerEmail: "james@jay.de", animalTypeName: "Hund", raceName: "Schäferhund" },
  { name: "Duke", ownerEmail: "m@m.de", animalTypeName: "Hund", raceName: "Pitbull" },

  // Katze (1 race, 2 animals for Aziz ONLY)
  { name: "Bambi", ownerEmail: "aziz@erol.de", animalTypeName: "Katze", raceName: "Britisch Kurzhaar" },
  { name: "Maya", ownerEmail: "aziz@erol.de", animalTypeName: "Katze", raceName: "Britisch Kurzhaar" },

  // Kleintier (3 races, 1 per race)
  { name: "Hoppy", ownerEmail: "joe@doe.de", animalTypeName: "Kleintier", raceName: "Kaninchen" },
  { name: "Whiskers", ownerEmail: "daniel@daniel.de", animalTypeName: "Kleintier", raceName: "Meerschweinchen" },
  { name: "Nibbles", ownerEmail: "james@jay.de", animalTypeName: "Kleintier", raceName: "Hamster" },

  // Vogel (6 races, 1 per race)
  { name: "Polly", ownerEmail: "m@m.de", animalTypeName: "Vogel", raceName: "Papagei" },
  { name: "Tweety", ownerEmail: "joey@doey.de", animalTypeName: "Vogel", raceName: "Wellensittich" },
  { name: "Taube1", ownerEmail: "joe@doe.de", animalTypeName: "Vogel", raceName: "Taube" },
  { name: "Falky", ownerEmail: "daniel@daniel.de", animalTypeName: "Vogel", raceName: "Falke" },
  { name: "Krähe1", ownerEmail: "james@jay.de", animalTypeName: "Vogel", raceName: "Krähe" },
  { name: "Raven", ownerEmail: "joey@doey.de", animalTypeName: "Vogel", raceName: "Rabe" },
  { name: "Geier1", ownerEmail: "joe@doe.de", animalTypeName: "Vogel", raceName: "Aasgeier" },

  // Reptil (2 races, 1 per race)
  { name: "Lizzy", ownerEmail: "m@m.de", animalTypeName: "Reptil", raceName: "Eidechse" },
  { name: "Slinky", ownerEmail: "joey@doey.de", animalTypeName: "Reptil", raceName: "Schlange" },

  // Pferd (2 races, 1 per race)
  { name: "Pegasus", ownerEmail: "james@jay.de", animalTypeName: "Pferd", raceName: "Pegasus" },
  { name: "Pony1", ownerEmail: "daniel@daniel.de", animalTypeName: "Pferd", raceName: "Pony" },

  // Nutztier (4 races, 1 per race)
  { name: "Huhn1", ownerEmail: "m@m.de", animalTypeName: "Nutztier", raceName: "Huhn" },
  { name: "Schaf1", ownerEmail: "james@jay.de", animalTypeName: "Nutztier", raceName: "Schaf" },
  { name: "Cow1", ownerEmail: "joey@doey.de", animalTypeName: "Nutztier", raceName: "Kuh" },
  { name: "Bull1", ownerEmail: "daniel@daniel.de", animalTypeName: "Nutztier", raceName: "Rind" },
];

// Generate 2-3 vets per practice (total ~40 vets)
function generateVets() {
  const vets = [];
  const firstNames = ["Maria", "Daniel", "Joe", "Anna", "Klaus", "Sarah", "Michael", "Lisa", "Thomas", "Julia", "Alexander", "Jennifer", "Peter", "Christina", "Andreas"];
  const lastNames = ["Schmidt", "Fischer", "Wagner", "Mueller", "Bauer", "Weber", "Meyer", "Schneider", "Hoffmann", "Koenig", "Roth", "Richter", "Keller", "Berg", "Lange"];

  for (let i = 0; i < FIXED_PRACTICES.length; i++) {
    const practice = FIXED_PRACTICES[i];
    const vetCountForPractice = Math.random() > 0.4 ? 3 : 2; // 60% have 3 vets, 40% have 2

    for (let j = 0; j < vetCountForPractice; j++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}-${j}@vetclinic.de`;

      vets.push({
        email,
        firstName,
        lastName,
        practiceEmail: practice.email,
        city: practice.city,
        cityCode: practice.cityCode,
      });
    }
  }
  return vets;
}

const FIXED_VETS = generateVets();

// ============================
// SEEDING FUNCTION
// ============================

async function seedStatic() {
  console.log("🌱 Seeding static data (practices, persons, animals)...");

  try {
    // Seed countries if not present (init.sql only runs in Docker, not on Railway)
    const countryCount = await prisma.countries.count();
    if (countryCount === 0) {
      await prisma.countries.createMany({
        data: [
          { code: "AFG", name: "Afghanistan" },
          { code: "EGY", name: "Ägypten" },
          { code: "ALA", name: "Aland" },
          { code: "ALB", name: "Albanien" },
          { code: "DZA", name: "Algerien" },
          { code: "ASM", name: "Samoa Amerikanisch" },
          { code: "VIR", name: "Jungferninseln Amerikanische" },
          { code: "AND", name: "Andorra" },
          { code: "AGO", name: "Angola" },
          { code: "AIA", name: "Anguilla" },
          { code: "ATA", name: "Guam" },
          { code: "ATG", name: "Antigua und Barbuda" },
          { code: "GNQ", name: "Äquatorialguinea" },
          { code: "ARG", name: "Argentinien" },
          { code: "ARM", name: "Armenien" },
          { code: "ABW", name: "Aruba" },
          { code: "ASC", name: "Ascension" },
          { code: "AZE", name: "Aserbaidschan" },
          { code: "ETH", name: "Athiopien" },
          { code: "AUS", name: "Australien" },
          { code: "BHS", name: "Bahamas" },
          { code: "BHR", name: "Bahrain" },
          { code: "BGD", name: "Bangladesch" },
          { code: "BRB", name: "Barbados" },
          { code: "BLR", name: "Belarus" },
          { code: "BEL", name: "Belgien" },
          { code: "BLZ", name: "Belize" },
          { code: "BEN", name: "Benin" },
          { code: "BMU", name: "Bermuda" },
          { code: "BTN", name: "Bhutan" },
          { code: "BOL", name: "Bolivien" },
          { code: "BES", name: "Bonaire" },
          { code: "BIH", name: "Bosnien und Herzegowina" },
          { code: "BWA", name: "Botswana" },
          { code: "BVT", name: "Norwegen" },
          { code: "BRA", name: "Brasilien" },
          { code: "VGB", name: "Jungferninseln Britische" },
          { code: "IOT", name: "Britisches Territorium im Indischen Ozean" },
          { code: "BRN", name: "Brunei" },
          { code: "BGR", name: "Bulgarien" },
          { code: "BFA", name: "Burkina Faso" },
          { code: "BUR", name: "Burma" },
          { code: "BDI", name: "Burundi" },
          { code: "CHL", name: "Chile" },
          { code: "CHN", name: "China Volksrepublik" },
          { code: "CPT", name: "Clipperton" },
          { code: "COK", name: "Cookinseln" },
          { code: "CRI", name: "Costa Rica" },
          { code: "CUW", name: "Curaçao" },
          { code: "DNK", name: "Danemark" },
          { code: "DEU", name: "Deutschland" },
          { code: "DGA", name: "Diego Garcia" },
          { code: "DMA", name: "Dominica" },
          { code: "DOM", name: "Dominikanische Republik" },
          { code: "DJI", name: "Dschibuti" },
          { code: "ECU", name: "Ecuador" },
          { code: "CIV", name: "Elfenbeinküste" },
          { code: "SLV", name: "El Salvador" },
          { code: "ERI", name: "Eritrea" },
          { code: "EST", name: "Estland" },
          { code: "SWZ", name: "Eswatini" },
          { code: "FLK", name: "Falklandinseln" },
          { code: "FRO", name: "Faroer" },
          { code: "FJI", name: "Fidschi" },
          { code: "FIN", name: "Finnland" },
          { code: "FRA", name: "Frankreich" },
          { code: "FXX", name: "Frankreich" },
          { code: "GUF", name: "Franzosisch-Guayana" },
          { code: "PYF", name: "Franzosisch-Polynesien" },
          { code: "ATF", name: "Französische Süd- und Antarktisgebiete" },
          { code: "GAB", name: "Gabun" },
          { code: "GMB", name: "Gambia" },
          { code: "GEO", name: "Georgien" },
          { code: "GHA", name: "Ghana" },
          { code: "GIB", name: "Gibraltar" },
          { code: "GRD", name: "Grenada" },
          { code: "GRC", name: "Griechenland" },
          { code: "GRL", name: "Gronland" },
          { code: "GLP", name: "Guadeloupe" },
          { code: "GUM", name: "Guam" },
          { code: "GTM", name: "Guatemala" },
          { code: "GGY", name: "Bailiwick of Guernsey" },
          { code: "GIN", name: "Guinea-a" },
          { code: "GNB", name: "Guinea-Bissau" },
          { code: "GUY", name: "Guyana" },
          { code: "HTI", name: "Haiti" },
          { code: "HMD", name: "Australien" },
          { code: "HND", name: "Honduras" },
          { code: "HKG", name: "Hongkong" },
          { code: "IND", name: "Indien" },
          { code: "IDN", name: "Indonesien" },
          { code: "IMN", name: "Isle of Man" },
          { code: "IRQ", name: "Irak" },
          { code: "IRN", name: "Iran" },
          { code: "IRL", name: "Irland" },
          { code: "ISL", name: "Island" },
          { code: "ISR", name: "Israel" },
          { code: "ITA", name: "Italien" },
          { code: "JAM", name: "Jamaika" },
          { code: "JPN", name: "Japan" },
          { code: "YEM", name: "Jemen" },
          { code: "JEY", name: "Bailiwick of Jersey" },
          { code: "JOR", name: "Jordanien" },
          { code: "YUG", name: "Jugoslawien" },
          { code: "CYM", name: "Cayman Islands" },
          { code: "KHM", name: "Kambodscha" },
          { code: "CMR", name: "Kamerun" },
          { code: "CAN", name: "Kanada" },
          { code: "IC", name: "Kanarische Inseln" },
          { code: "CPV", name: "Kap Verde" },
          { code: "KAZ", name: "Kasachstan" },
          { code: "QAT", name: "Katar" },
          { code: "KEN", name: "Kenia" },
          { code: "KGZ", name: "Kirgisistan" },
          { code: "KIR", name: "Kiribati" },
          { code: "CCK", name: "Kokosinseln" },
          { code: "COL", name: "Kolumbien" },
          { code: "COM", name: "Komoren" },
          { code: "COD", name: "Kongo Demokratische Republik" },
          { code: "COG", name: "Kongo Republik" },
          { code: "PRK", name: "Korea Nord" },
          { code: "KOR", name: "Korea Sud" },
          { code: "HRV", name: "Kroatien" },
          { code: "CUB", name: "Kuba" },
          { code: "KWT", name: "Kuwait" },
          { code: "LAO", name: "Laos" },
          { code: "LSO", name: "Lesotho" },
          { code: "LVA", name: "Lettland" },
          { code: "LBN", name: "Libanon" },
          { code: "LBR", name: "Liberia" },
          { code: "LBY", name: "Libyen" },
          { code: "LIE", name: "Liechtenstein" },
          { code: "LTU", name: "Litauen" },
          { code: "LUX", name: "Luxemburg" },
          { code: "MAC", name: "Macau" },
          { code: "MDG", name: "Madagaskar" },
          { code: "MWI", name: "Malawi" },
          { code: "MYS", name: "Malaysia" },
          { code: "MDV", name: "Malediven" },
          { code: "MLI", name: "Mali" },
          { code: "MLT", name: "Malta" },
          { code: "MAR", name: "Marokko" },
          { code: "MHL", name: "Marshallinseln" },
          { code: "MTQ", name: "Martinique" },
          { code: "MRT", name: "Mauretanien" },
          { code: "MUS", name: "Mauritius" },
          { code: "MYT", name: "Mayotte" },
          { code: "MEX", name: "Mexiko" },
          { code: "FSM", name: "Mikronesien Foderierte Staaten" },
          { code: "MDA", name: "Moldau Republik" },
          { code: "MCO", name: "Monaco" },
          { code: "MNG", name: "Mongolei" },
          { code: "MNE", name: "Montenegro" },
          { code: "MSR", name: "Montserrat" },
          { code: "MOZ", name: "Mosambik" },
          { code: "MMR", name: "Myanmar" },
          { code: "NAM", name: "Namibia" },
          { code: "NRU", name: "Nauru" },
          { code: "NPL", name: "Nepal" },
          { code: "NCL", name: "Neukaledonien" },
          { code: "NZL", name: "Neuseeland" },
          { code: "NIC", name: "Nicaragua" },
          { code: "NLD", name: "Niederlande" },
          { code: "ANT", name: "Niederlandische Antillen" },
          { code: "NER", name: "Niger" },
          { code: "NGA", name: "Nigeria" },
          { code: "NIU", name: "Niue" },
          { code: "MNP", name: "Marianen Nordliche" },
          { code: "MKD", name: "Nordmazedonien" },
          { code: "NFK", name: "Norfolkinsel" },
          { code: "NOR", name: "Norwegen" },
          { code: "OMN", name: "Oman" },
          { code: "AUT", name: "Österreich" },
          { code: "TLS", name: "Osttimor" },
          { code: "PAK", name: "Pakistan" },
          { code: "PSE", name: "Palästina" },
          { code: "PLW", name: "Palau" },
          { code: "PAN", name: "Panama" },
          { code: "PNG", name: "Papua-Neuguinea" },
          { code: "PRY", name: "Paraguay" },
          { code: "PER", name: "Peru" },
          { code: "PHL", name: "Philippinen" },
          { code: "PCN", name: "Pitcairninseln" },
          { code: "POL", name: "Polen" },
          { code: "PRT", name: "Portugal" },
          { code: "PRI", name: "Puerto Rico" },
          { code: "REU", name: "Reunion" },
          { code: "RWA", name: "Ruanda" },
          { code: "ROU", name: "Rumänien" },
          { code: "RUS", name: "Russland" },
          { code: "SLB", name: "Salomonen" },
          { code: "BLM", name: "Saintbarthelemy" },
          { code: "MAF", name: "Saint-Martin" },
          { code: "ZMB", name: "Sambia" },
          { code: "WSM", name: "Samoa" },
          { code: "SMR", name: "San Marino" },
          { code: "STP", name: "Sao Tome und Principe" },
          { code: "SAU", name: "Saudi-Arabien" },
          { code: "SWE", name: "Schweden" },
          { code: "CHE", name: "Schweiz" },
          { code: "SEN", name: "Senegal" },
          { code: "SRB", name: "Serbien" },
          { code: "SCG", name: "Serbien und Montenegro" },
          { code: "SYC", name: "Seychellen" },
          { code: "SLE", name: "Sierra Leone" },
          { code: "ZWE", name: "Simbabwe" },
          { code: "SGP", name: "Singapur" },
          { code: "SXM", name: "Sint Maarten" },
          { code: "SVK", name: "Slowakei" },
          { code: "SVN", name: "Slowenien" },
          { code: "SOM", name: "Somalia" },
          { code: "SUN", name: "Sowjetunion" },
          { code: "ESP", name: "Spanien" },
          { code: "LKA", name: "Sri Lanka" },
          { code: "SHN", name: "St. Helena, Ascension und Tristan da Cunha" },
          { code: "KNA", name: "Saint Kitts Nevis" },
          { code: "LCA", name: "Saint Lucia" },
          { code: "SPM", name: "Saint-Pierre und Miquelon" },
          { code: "VCT", name: "Saint Vincent Grenadinen" },
          { code: "ZAF", name: "Sudafrika" },
          { code: "SDN", name: "Sudan" },
          { code: "SGS", name: "Sudgeorgien Sandwichinseln" },
          { code: "SSD", name: "Sudsudan" },
          { code: "SUR", name: "Suriname" },
          { code: "SJM", name: "Norwegen" },
          { code: "SYR", name: "Syrien" },
          { code: "TJK", name: "Tadschikistan" },
          { code: "TWN", name: "Taiwan" },
          { code: "TZA", name: "Tansania" },
          { code: "THA", name: "Thailand" },
          { code: "TGO", name: "Togo" },
          { code: "TKL", name: "Tokelau" },
          { code: "TON", name: "Tonga" },
          { code: "TTO", name: "Trinidad und Tobago" },
          { code: "TAA", name: "Tristan da Cunha" },
          { code: "TCD", name: "Tschad" },
          { code: "CZE", name: "Tschechien" },
          { code: "CSK", name: "Tschechoslowakei" },
          { code: "TUN", name: "Tunesien" },
          { code: "TUR", name: "Türkei" },
          { code: "TKM", name: "Turkmenistan" },
          { code: "TCA", name: "Turksinseln und Caicosinseln" },
          { code: "TUV", name: "Tuvalu" },
          { code: "UGA", name: "Uganda" },
          { code: "UKR", name: "Ukraine" },
          { code: "HUN", name: "Ungarn" },
          { code: "URY", name: "Uruguay" },
          { code: "UZB", name: "Usbekistan" },
          { code: "VUT", name: "Vanuatu" },
          { code: "VAT", name: "Vatikanstadt" },
          { code: "VEN", name: "Venezuela" },
          { code: "ARE", name: "Vereinigte Arabische Emirate" },
          { code: "USA", name: "Vereinigte Staaten" },
          { code: "GBR", name: "Vereinigtes Königreich" },
          { code: "VNM", name: "Vietnam" },
          { code: "WLF", name: "Wallis Futuna" },
          { code: "CXR", name: "Weihnachtsinsel" },
          { code: "ESH", name: "Westsahara" },
          { code: "ZAR", name: "Zaire" },
          { code: "CAF", name: "Zentralafrikanische Republik" },
          { code: "CYP", name: "Zypern Republik" },
        ],
        skipDuplicates: true,
      });
      console.log("✓ Seeded countries");
    }

    const germany = await prisma.countries.findFirst({
      where: { name: "Deutschland" },
    });
    if (!germany) {
      throw new Error("Germany not found");
    }

    // ============================
    // Phase 1: Foundation (services, animal types)
    // ============================
    console.log("📋 Setting up foundation data...");

    const existingServices = await prisma.service.count();
    if (existingServices > 0) {
      console.log("✓ Services already exist");
    } else {
      await prisma.service.createMany({
        data: [
          { name: "Allgemeine Untersuchung" },
          { name: "Röntgen" },
          { name: "Impfung" },
          { name: "Entwurmung" },
          { name: "Blutuntersuchung" },
          { name: "Kastration" },
          { name: "Untersuchung" },
          { name: "Zahnextraktion" },
          { name: "Zahnkontrolle" },
          { name: "Physiotherapie" },
          { name: "Notfalltermin" },
        ],
      });
      console.log("✓ Created services");
    }

    const existingTypes = await prisma.animalType.count();
    if (existingTypes > 0) {
      console.log("✓ Animal types already exist");
    } else {
      await prisma.animalType.createMany({
        data: [
          { name: "Hund" },
          { name: "Katze" },
          { name: "Kleintier" },
          { name: "Vogel" },
          { name: "Reptil" },
          { name: "Pferd" },
          { name: "Nutztier" },
        ],
      });
      console.log("✓ Created animal types");
    }

    const existingRaces = await prisma.animalRace.count();
    if (existingRaces > 0) {
      console.log("✓ Animal races already exist");
    } else {
      const types = await prisma.animalType.findMany({ select: { id: true, name: true } });
      const typeByName = Object.fromEntries(types.map((t) => [t.name, t.id]));

      await prisma.animalRace.createMany({
        data: [
          { name: "Labrador", animalTypeId: typeByName["Hund"] },
          { name: "Pudel", animalTypeId: typeByName["Hund"] },
          { name: "Schäferhund", animalTypeId: typeByName["Hund"] },
          { name: "Pitbull", animalTypeId: typeByName["Hund"] },
          { name: "Britisch Kurzhaar", animalTypeId: typeByName["Katze"] },
          { name: "Kaninchen", animalTypeId: typeByName["Kleintier"] },
          { name: "Meerschweinchen", animalTypeId: typeByName["Kleintier"] },
          { name: "Hamster", animalTypeId: typeByName["Kleintier"] },
          { name: "Papagei", animalTypeId: typeByName["Vogel"] },
          { name: "Wellensittich", animalTypeId: typeByName["Vogel"] },
          { name: "Taube", animalTypeId: typeByName["Vogel"] },
          { name: "Falke", animalTypeId: typeByName["Vogel"] },
          { name: "Krähe", animalTypeId: typeByName["Vogel"] },
          { name: "Rabe", animalTypeId: typeByName["Vogel"] },
          { name: "Aasgeier", animalTypeId: typeByName["Vogel"] },
          { name: "Eidechse", animalTypeId: typeByName["Reptil"] },
          { name: "Schlange", animalTypeId: typeByName["Reptil"] },
          { name: "Pegasus", animalTypeId: typeByName["Pferd"] },
          { name: "Pony", animalTypeId: typeByName["Pferd"] },
          { name: "Huhn", animalTypeId: typeByName["Nutztier"] },
          { name: "Schaf", animalTypeId: typeByName["Nutztier"] },
          { name: "Kuh", animalTypeId: typeByName["Nutztier"] },
          { name: "Rind", animalTypeId: typeByName["Nutztier"] },
        ],
      });
      console.log("✓ Created animal races");
    }

    const services = await prisma.service.findMany({ select: { id: true } });
    const animalTypes = await prisma.animalType.findMany({ select: { id: true } });

    // ============================
    // Phase 2: 15 Practices
    // ============================
    console.log("🏥 Creating 15 veterinary practices...");

    let practicesCreated = 0;
    const practiceMap = new Map<string, { id: number; email: string }>();

    for (const practiceData of FIXED_PRACTICES) {
      const existing = await prisma.veterinaryPractice.findUnique({
        where: { email: practiceData.email },
        select: { id: true },
      });

      if (existing) {
        practiceMap.set(practiceData.email, { id: existing.id, email: practiceData.email });
        continue;
      }

      const practice = await prisma.veterinaryPractice.create({
        data: {
          name: practiceData.name,
          phone: practiceData.phone,
          infoEmail: `info-${practiceData.email}`,
          email: practiceData.email,
          password: "Petappoint123!",
          website: `https://www.tierarzt-${practiceData.city.toLowerCase().replace(/\s/g, "-")}.de`,
          info: "Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.",
          address: {
            create: {
              street: `Hauptstraße 1`,
              cityCode: practiceData.cityCode,
              city: practiceData.city,
              fk_country: germany.id,
              longitude: practiceData.longitude,
              latitude: practiceData.latitude,
            },
          },
        },
      });

      await prisma.veterinarypractices_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date(),
          verified: true,
          fk_veterinarypracticeid: practice.id,
        },
      });

      practiceMap.set(practiceData.email, { id: practice.id, email: practiceData.email });
      practicesCreated++;
    }

    console.log(`✅ ${practicesCreated} practices created`);

    // ============================
    // Phase 3: 6 Fixed Test Accounts
    // ============================
    console.log("👥 Creating 6 fixed persons...");

    let personsCreated = 0;
    const personMap = new Map<string, number>();

    for (const personData of FIXED_PERSONS) {
      const existing = await prisma.person.findUnique({
        where: { email: personData.email },
        select: { id: true },
      });

      if (existing) {
        personMap.set(personData.email, existing.id);
        continue;
      }

      const person = await prisma.person.create({
        data: {
          firstName: personData.firstName,
          lastName: personData.lastName,
          sex: "male",
          dateOfBirth: new Date("1990-01-01"),
          phone: "+49 30 000000",
          email: personData.email,
          password: "Petappoint123!",
          address: {
            create: {
              street: `Hauptstraße 1`,
              cityCode: personData.cityCode,
              city: personData.city,
              fk_country: germany.id,
              longitude: 13.0,
              latitude: 52.0,
            },
          },
        },
      });

      await prisma.person_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date().toISOString(),
          verified: true,
          fk_personid: person.id,
        },
      });

      personMap.set(personData.email, person.id);
      personsCreated++;
    }

    console.log(`✅ ${personsCreated} persons created`);

    // ============================
    // Phase 4: ~40 Veterinarians (2-3 per practice)
    // ============================
    console.log(`👨‍⚕️ Creating ${FIXED_VETS.length} veterinarians (~2-3 per practice)...`);

    let vetsCreated = 0;

    for (const vetData of FIXED_VETS) {
      const existing = await prisma.person.findUnique({
        where: { email: vetData.email },
        select: { id: true },
      });

      if (existing) {
        continue;
      }

      const practice = practiceMap.get(vetData.practiceEmail);
      if (!practice) {
        console.log(`⚠️  Practice ${vetData.practiceEmail} not found`);
        continue;
      }

      const person = await prisma.person.create({
        data: {
          firstName: vetData.firstName,
          lastName: vetData.lastName,
          sex: "male",
          dateOfBirth: new Date("1985-01-01"),
          phone: "+49 30 111111",
          email: vetData.email,
          password: "Petappoint123!",
          address: {
            create: {
              street: `Hauptstraße 1`,
              cityCode: vetData.cityCode,
              city: vetData.city,
              fk_country: germany.id,
              longitude: 13.0,
              latitude: 52.0,
            },
          },
        },
      });

      await prisma.veterinarian.create({
        data: {
          id: person.id,
          infoEmail: vetData.email,
          fk_veterinarypracticeid: practice.id,
        },
      });

      await prisma.person_has_confirmation_code.create({
        data: {
          code: "222222",
          dateofcreation: new Date().toISOString(),
          verified: true,
          fk_personid: person.id,
        },
      });

      vetsCreated++;
    }

    console.log(`✅ ${vetsCreated} veterinarians created`);

    // ============================
    // Phase 5: 24 Fixed Animals (1 per race + variation)
    // ============================
    console.log("🐾 Creating 24 fixed animals...");

    let animalsCreated = 0;

    const animalTypeList = await prisma.animalType.findMany({ select: { id: true, name: true } });
    const animalTypeByName = Object.fromEntries(animalTypeList.map((t) => [t.name, t.id]));

    const animalRaces = await prisma.animalRace.findMany({ select: { id: true, name: true } });
    const raceByName = Object.fromEntries(animalRaces.map((r) => [r.name, r.id]));

    for (const animalData of FIXED_ANIMALS) {
      const ownerPersonId = personMap.get(animalData.ownerEmail);
      if (!ownerPersonId) {
        console.log(`⚠️  Owner ${animalData.ownerEmail} not found, skipping animal ${animalData.name}`);
        continue;
      }

      const existingAnimal = await prisma.animal.findFirst({
        where: {
          name: animalData.name,
          personHasAnimals: {
            some: { personId: ownerPersonId },
          },
        },
      });

      if (existingAnimal) {
        continue;
      }

      const animal = await prisma.animal.create({
        data: {
          name: animalData.name,
          dateOfBirth: new Date("2021-01-13"),
          dateOfBirthIsExact: true,
          weightInGram: 4000,
          isCastrated: true,
          lifestyle: "indoor",
          sex: "female",
          animalTypeId: animalTypeByName[animalData.animalTypeName],
        },
      });

      await prisma.personHasAnimal.create({
        data: {
          personId: ownerPersonId,
          animalId: animal.id,
        },
      });

      animalsCreated++;
    }

    console.log(`✅ ${animalsCreated} animals created`);

    // ============================
    // Phase 6: Link Veterinarians to Services & Animal Types
    // ============================
    console.log("🔗 Linking veterinarians to services and animal types...");

    const allVets = await prisma.veterinarian.findMany({ select: { id: true } });

    for (const vet of allVets) {
      const existingServices = await prisma.veterinaryHasService.findFirst({
        where: { veterinaryId: vet.id },
      });

      if (!existingServices && services.length > 0) {
        // Each vet gets 3-5 random services (varied specializations)
        const serviceCount = Math.floor(Math.random() * 3) + 3; // 3-5 services
        const shuffledServices = [...services].sort(() => Math.random() - 0.5);
        const selectedServices = shuffledServices.slice(0, serviceCount);

        await prisma.veterinaryHasService.createMany({
          data: selectedServices.map((service) => ({
            veterinaryId: vet.id,
            serviceId: service.id,
          })),
          skipDuplicates: true,
        });
      }

      const existingTypes = await prisma.veterinaryCanTreatAnimalType.findFirst({
        where: { veterinaryId: vet.id },
      });

      if (!existingTypes && animalTypes.length > 0) {
        // Each vet can treat 2-4 random animal types (varied specializations)
        const typeCount = Math.floor(Math.random() * 3) + 2; // 2-4 animal types
        const shuffledTypes = [...animalTypes].sort(() => Math.random() - 0.5);
        const selectedTypes = shuffledTypes.slice(0, typeCount);

        await prisma.veterinaryCanTreatAnimalType.createMany({
          data: selectedTypes.map((type) => ({
            veterinaryId: vet.id,
            animalTypeId: type.id,
          })),
          skipDuplicates: true,
        });
      }
    }

    console.log("✓ Linked veterinarians");

    // ============================
    // Summary
    // ============================
    const totalPractices = await prisma.veterinaryPractice.count();
    const totalPersons = await prisma.person.count();
    const totalAnimals = await prisma.animal.count();
    const totalVets = await prisma.veterinarian.count();

    console.log("\n✅ Static seeding complete!");
    console.log(`   🏥 Total Practices: ${totalPractices}`);
    console.log(`   👨‍⚕️ Total Veterinarians: ${totalVets}`);
    console.log(`   👥 Total Persons: ${totalPersons}`);
    console.log(`   🐾 Total Animals: ${totalAnimals}`);
  } catch (error) {
    console.error("❌ Error seeding static data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedStatic();
