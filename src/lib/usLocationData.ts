/**
 * Prototype-only US state/city data for the location picker. Real cities,
 * alphabetically sorted, but intentionally not exhaustive — five
 * well-known cities per state is enough for a convincing onboarding demo
 * without shipping a full geographic database.
 */
export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export type USState = (typeof US_STATES)[number];

export const CITIES_BY_STATE: Record<USState, string[]> = {
  Alabama: ["Birmingham", "Huntsville", "Mobile", "Montgomery", "Tuscaloosa"],
  Alaska: ["Anchorage", "Fairbanks", "Juneau", "Ketchikan", "Sitka"],
  Arizona: ["Chandler", "Mesa", "Phoenix", "Scottsdale", "Tucson"],
  Arkansas: ["Fayetteville", "Fort Smith", "Jonesboro", "Little Rock", "Springdale"],
  California: ["Fresno", "Los Angeles", "Sacramento", "San Diego", "San Francisco"],
  Colorado: ["Aurora", "Boulder", "Colorado Springs", "Denver", "Fort Collins"],
  Connecticut: ["Bridgeport", "Hartford", "New Haven", "Stamford", "Waterbury"],
  Delaware: ["Bear", "Dover", "Middletown", "Newark", "Wilmington"],
  "District of Columbia": ["Washington"],
  Florida: ["Jacksonville", "Miami", "Orlando", "Tallahassee", "Tampa"],
  Georgia: ["Athens", "Atlanta", "Augusta", "Columbus", "Savannah"],
  Hawaii: ["Hilo", "Honolulu", "Kailua", "Kaneohe", "Pearl City"],
  Idaho: ["Boise", "Idaho Falls", "Meridian", "Nampa", "Pocatello"],
  Illinois: ["Aurora", "Chicago", "Naperville", "Peoria", "Rockford"],
  Indiana: ["Carmel", "Evansville", "Fort Wayne", "Indianapolis", "South Bend"],
  Iowa: ["Cedar Rapids", "Davenport", "Des Moines", "Iowa City", "Sioux City"],
  Kansas: ["Kansas City", "Olathe", "Overland Park", "Topeka", "Wichita"],
  Kentucky: ["Bowling Green", "Frankfort", "Lexington", "Louisville", "Owensboro"],
  Louisiana: ["Baton Rouge", "Lafayette", "Lake Charles", "New Orleans", "Shreveport"],
  Maine: ["Augusta", "Bangor", "Lewiston", "Portland", "South Portland"],
  Maryland: ["Annapolis", "Baltimore", "Frederick", "Rockville", "Silver Spring"],
  Massachusetts: ["Boston", "Cambridge", "Lowell", "Springfield", "Worcester"],
  Michigan: ["Ann Arbor", "Detroit", "Grand Rapids", "Lansing", "Warren"],
  Minnesota: ["Bloomington", "Duluth", "Minneapolis", "Rochester", "Saint Paul"],
  Mississippi: ["Biloxi", "Gulfport", "Hattiesburg", "Jackson", "Southaven"],
  Missouri: ["Columbia", "Independence", "Kansas City", "Springfield", "St. Louis"],
  Montana: ["Billings", "Bozeman", "Great Falls", "Helena", "Missoula"],
  Nebraska: ["Bellevue", "Grand Island", "Kearney", "Lincoln", "Omaha"],
  Nevada: ["Henderson", "Las Vegas", "North Las Vegas", "Reno", "Sparks"],
  "New Hampshire": ["Concord", "Manchester", "Nashua", "Portsmouth", "Rochester"],
  "New Jersey": ["Elizabeth", "Jersey City", "Newark", "Paterson", "Trenton"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Roswell", "Santa Fe"],
  "New York": ["Albany", "Buffalo", "New York City", "Rochester", "Syracuse"],
  "North Carolina": ["Charlotte", "Durham", "Greensboro", "Raleigh", "Winston-Salem"],
  "North Dakota": ["Bismarck", "Fargo", "Grand Forks", "Minot", "West Fargo"],
  Ohio: ["Akron", "Cincinnati", "Cleveland", "Columbus", "Toledo"],
  Oklahoma: ["Broken Arrow", "Edmond", "Norman", "Oklahoma City", "Tulsa"],
  Oregon: ["Bend", "Eugene", "Gresham", "Portland", "Salem"],
  Pennsylvania: ["Allentown", "Erie", "Philadelphia", "Pittsburgh", "Scranton"],
  "Rhode Island": ["Cranston", "Pawtucket", "Providence", "Warwick", "Woonsocket"],
  "South Carolina": ["Charleston", "Columbia", "Greenville", "Mount Pleasant", "Rock Hill"],
  "South Dakota": ["Aberdeen", "Brookings", "Rapid City", "Sioux Falls", "Watertown"],
  Tennessee: ["Chattanooga", "Clarksville", "Knoxville", "Memphis", "Nashville"],
  Texas: ["Austin", "Dallas", "El Paso", "Houston", "San Antonio"],
  Utah: ["Ogden", "Orem", "Provo", "Salt Lake City", "West Valley City"],
  Vermont: ["Barre", "Burlington", "Montpelier", "Rutland", "South Burlington"],
  Virginia: ["Alexandria", "Chesapeake", "Norfolk", "Richmond", "Virginia Beach"],
  Washington: ["Bellevue", "Everett", "Seattle", "Spokane", "Tacoma"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
  Wisconsin: ["Green Bay", "Kenosha", "Madison", "Milwaukee", "Racine"],
  Wyoming: ["Casper", "Cheyenne", "Gillette", "Jackson", "Laramie"],
};

/**
 * Three fixed demo-parish templates shown for every city, per the current
 * prototype's scope — placeholders until a real parish directory covers
 * this location. City/state are filled in from the user's own onboarding
 * choice at selection time, not hardcoded here.
 */
export interface DemoParishTemplate {
  id: string;
  name: string;
  patronSaint: string;
  priestName: string;
}

export const DEMO_PARISH_TEMPLATES: DemoParishTemplate[] = [
  { id: "demo-holy-trinity", name: "Holy Trinity Romanian Orthodox Church", patronSaint: "Sfânta Treime", priestName: "Fr. Andrei Ionescu" },
  { id: "demo-st-mary", name: "St. Mary Romanian Orthodox Church", patronSaint: "Adormirea Maicii Domnului", priestName: "Fr. Mihail Rusu" },
  { id: "demo-annunciation", name: "Annunciation Romanian Orthodox Church", patronSaint: "Buna Vestire", priestName: "Fr. Ioan Dobre" },
];
