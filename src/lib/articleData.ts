export type ArticleCategory = "roea" | "parishes" | "youth" | "culture" | "history" | "spiritual" | "america";

export const ARTICLE_CATEGORY_ACCENT: Record<ArticleCategory, string> = {
  roea: "burgundy",
  parishes: "slate",
  youth: "forest",
  culture: "violet",
  history: "clay",
  spiritual: "teal",
  america: "plum",
};

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  category: ArticleCategory;
  title: string;
  subtitle?: string;
  author?: string;
  /** Where this piece comes from — used instead of a possibly-false byline when no individual author was given. */
  publication: string;
  date?: string;
  excerpt: string;
  body: ArticleSection[];
}

/**
 * Real Orthodox catechetical content supplied directly by the user (the
 * "Treasures of Orthodoxy" pamphlet series and related diocesan pieces),
 * transcribed as given. Nothing here is generated — titles, authorship,
 * and text are exactly as provided. Articles render in English only; the
 * body text is not machine-translated into Romanian, the same policy
 * already used for Scripture readings.
 */
export const ARTICLES: Article[] = [
  {
    id: "house-of-god",
    category: "spiritual",
    title: "House of God: What's Inside an Orthodox Church?",
    author: "Rev. Fr. Thomas FitzGerald, ThD",
    publication: "Treasures of Orthodoxy series, Holy Cross Greek Orthodox School of Theology",
    excerpt:
      "The rich color, distinctive iconography, and beauty of the interior of an Orthodox church create a whole new world of color and light — and embody many of Orthodoxy's fundamental beliefs.",
    body: [
      {
        paragraphs: [
          "The visitor to an Orthodox church is usually impressed by the unique features and the external differences between this place of worship and those of the various traditions of Western Christianity. The rich color, distinctive iconography, and beauty of the interior of an Orthodox church are in sharp contrast to what one often finds in many Roman Catholic and Protestant churches. When one enters an Orthodox church it is like stepping into a whole new world of color and light. The art and design of the church not only create a distinctive atmosphere of worship, but also reflect and embody many of the fundamental beliefs of Orthodoxy.",
        ],
      },
      {
        heading: "Beauty and Symbols",
        paragraphs: [
          "The Orthodox Church believes that God is the Creator of heaven and earth. The Creator is present through His handiwork. This means that the material world, being valuable and good (Genesis 1:31), is an important means through which God shows His love for us.",
          "The Orthodox Church affirms these convictions through her extensive use of material creation, not only for the embellishment of her places of worship but also in the Holy Eucharist and the other sacraments and prayer services. For example, when the bread and wine — \"the first fruits of creation\" (Romans 11:16) — are offered in the Holy Eucharist, they are also a symbolic offering of all creation to God its Creator. The Holy Eucharist, known as the Divine Liturgy, is the Church's great action and prayer of thanksgiving.",
          "Using the gifts of creation, the interior of an Orthodox church is a place of beauty. Designed to create an atmosphere which is special, the building expresses a sense of joy and an appreciation of God's blessings. Orthodoxy recognizes that beauty is an important dimension of human life. Through iconography and church appointments, the beauty of creation becomes a very important means of praising the Triune God. The divine gifts of the material world are shaped and fashioned by human hands into an expression of beauty which glorifies the Creator. As the pious woman in the Gospel story poured her precious oil on the feet of our Lord (Luke 8:38), Orthodoxy seeks always to offer back to God our gifts of beauty and praise.",
        ],
      },
      {
        heading: "Sacred Space",
        paragraphs: [
          "The church interior is both the background and the setting for Orthodox worship. The art and architecture are designed to contribute to the total experience of worship, which involves one's mind, feelings, and senses. The Holy Eucharist and the other sacraments take place in God's midst, and they bear witness to His presence and actions. In the Orthodox tradition there is a very strong feeling that the church is the \"House of God\" and \"the place where His glory dwells.\" God is present everywhere. And we can turn to Him in prayer in all places and circumstances. Yet, the interior of the church is designed to enable us to lift our hearts up in song and prayer. For this reason, all Orthodox churches are blessed, consecrated, and set aside as sacred spaces designed for worship. The whole church bears witness to God's dwelling among His people.",
          "Ideally, an Orthodox church building is relatively small in size to emphasize and enhance the sense of community in worship. The church is generally constructed in the form of a cross and divided into three areas: the narthex, the nave, and the sanctuary. The narthex is the entrance area where the faithful make an offering, receive a candle, and place it before an icon. Here, the faithful offer a personal prayer before entering the nave and joining the congregation.",
          "The nave is the large center area of the church where the faithful gather for worship as members of the community of faith. Although most Orthodox churches in this country have pews, some follow the custom of having an open nave with few seats. On the right-hand side of the nave is often the bishop's chair from which he presides as a living icon of Christ among his people. Even in the bishop's absence, the chair reminds all that the parish is not an isolated entity but rather is part of a metropolis or diocese which the bishop heads. On the left-hand side of the nave is the pulpit where the Gospel is proclaimed and the sermon is preached. Often the baptismal font is also placed in this area. The choir and the cantors frequently occupy spaces at the far sides of the nave.",
          "The sanctuary is the most sacred part of the church, and the area reserved for clergy and their assistants. The sanctuary contains the Holy Altar and is separated from the nave by the Iconostasion.",
        ],
      },
      {
        heading: "The Altar",
        paragraphs: [
          "The Altar or Holy Table is the heart and focal point of the Orthodox church. As God's people, we gather before the Altar. There, the Eucharistic gifts of bread and wine are offered to God the Father as Christ commanded us to do at the Last Supper (Luke 23:20). The Altar, which is usually square in shape, stands away from the wall and is covered with a cloth. A tabernacle containing Holy Communion reserved for the sick or dying is set upon the Altar together with candles. When the Divine Liturgy is not being celebrated, the Book of Gospels is always placed in the center of the Altar. Behind the Altar is a large cross with the painted figure of the crucified Christ. Often the chair of the bishop is also located behind the Altar.",
        ],
      },
      {
        heading: "Iconostasion",
        paragraphs: [
          "The iconostasis is the panel of icons which separates the sanctuary from the nave. Its origin is in the ancient custom of placing icons on a low wall before the sanctuary. In the course of time, the icons became fixed on a standing wall. In contemporary practice, the iconostasis may be very elaborate and conceal most of the sanctuary. Or, it may be very simple and open in accordance with more ancient custom.",
          "The iconostasis has three entrances which are used during worship. There is a Deacon Door on either side. The center entrance is known as the Royal Door. A curtain or door usually conceals the Altar when services are not being celebrated. In current practice, the icons of Christ and St. John the Baptist are on the right side of the Iconostasis. The icons of Mary, the Mother of God (the Theotokos) and the patron saint or event to which the church is dedicated are on the left side. In addition to these icons, others may be added depending upon custom and space.",
        ],
      },
      {
        heading: "Icons",
        paragraphs: [
          "An icon is a holy image which is the distinctive art form of the Orthodox Church. An icon may be a painting on wood or canvas, a mosaic, or a fresco. Occupying a very prominent place in Orthodox worship and theology, icons depict Christ our Lord, Mary the Theotokos, the saints and angels. They may also portray events from the Scriptures or the history of the Church, such as the Birth of Christ, the Resurrection, or Pentecost.",
          "The icon is not simply decorative, inspirational, or educational. Most importantly, it signifies the presence of the person depicted. The icon is like a window linking heaven and earth. When we worship, we do so as part of the Church which includes the living and the departed. We never lose contact with those who are with the Lord in glory. This belief is expressed every time one venerates an icon or places a candle before it. Orthodox churches have icons not only on the iconostasis but also on the walls, ceilings, and in arches. Above the sanctuary in the apse, there is very frequently a large icon of Mary the Theotokos and the Christ Child. The Orthodox Church believes that Mary is the human being closest to God. This very prominent icon recalls her important role in the Incarnation of Jesus Christ. The icon is also an image of the Church. It reminds us of our responsibility to give birth to Christ's presence in our lives.",
          "The icon of Christ the Almighty, the Pantocrator, is on the ceiling or in the dome. This icon portrays the Triumphant Christ who reigns as Lord of heaven and earth. Looking downward, it appears as though the whole church and all of creation comes from Him. Looking upward, there is the sense that all things direct us to Christ the Lord. He is the \"Alpha and the Omega\" (Rev. 22:13), the beginning and the end of all. This is the message of Orthodoxy.",
        ],
      },
      {
        heading: "About This Series",
        paragraphs: [
          "Treasures of Orthodoxy is a series of pamphlets written for the non-Orthodox, especially those who are considering becoming members of the Orthodox Church and who wish to deepen their appreciation of her faith, worship, and traditions, authored by Fr. Thomas FitzGerald of Hellenic College–Holy Cross School of Theology. The series includes: Introduction, House of God, Worship, Liturgy, Sacraments, Special Services and Blessings, Teachings, Spirituality, History, and The Church.",
        ],
      },
    ],
  },
  {
    id: "preach-the-gospel",
    category: "america",
    title: "How Should Orthodox Christians Preach the Gospel?",
    subtitle: "\"Go therefore and make disciples of all the nations...\" (Matthew 28:19-20)",
    publication: "Diocesan resource",
    excerpt:
      "Orthodox Christianity is perhaps the best-kept secret in America. Why — and how can we help share the Good News?",
    body: [
      {
        paragraphs: [
          "\"Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age.\" (Matthew 28:19-20)",
          "Orthodox Christianity is perhaps the best-kept secret in America. Why? And how can we help share the Good News?",
          "We'll change the way we think about evangelism and learn two principles that should shape the way we introduce other people to Jesus Christ.",
          "Because there's a close connection between being the Lord's witnesses and being close to the Lord.",
        ],
      },
    ],
  },
  {
    id: "holy-relics-consecration",
    category: "spiritual",
    title: "Holy Relics and the Consecration of a Church",
    publication: "Diocesan resource",
    date: "2017-05-12",
    excerpt:
      "The veneration of Holy Relics by the faithful originated from the Martyrs' imitation of Christ's death, suffering, and sacrifice — and their Relics remain the visible, concrete sign of it in every consecrated altar.",
    body: [
      {
        paragraphs: [
          "The veneration of Holy Relics by the faithful originated from the Martyrs' imitation of Christ's death, suffering, and sacrifice; their passage to heaven, call for a better and more spiritual life, change from corruptibility to incorruptibility and spiritual marriage to Christ, the Master. The Martyrs became a channel for the power of God and an intercessor between God and man and their Holy Relics serve as the visible and concrete manifestation of this.",
          "\"Blow the trumpet in Zion, declare a holy fast, call a sacred assembly. Gather the people, consecrate the assembly; bring together the elders, gather the children.\" Joel 2:15-16",
          "The words of the Prophet Joel indicate that human beings and the site where they gather to worship God must be consecrated. Consecration brings salvation, which is union with Christ, and bears complex and rich definition. Consecration means to be sanctified, anointed, ordained, set apart, and made fit and Holy for God's sacred use. It means to be devoted and dedicated to Him, to be perfected and renewed.",
          "The ritual of Consecrating a Church dates back to the 4th Century A.D. when the persecution against Christianity ended by the decree of Emperor Constantine the Great, legally recognizing the Christian Church. During his reign, Constantine consecrated the Church of the Holy Sepulcher of Our Lord and Savior and the Church of the Resurrection, both in Jerusalem. The Church officially canonized the universal tradition of Consecrating Churches with the Holy Relics of Martyrs at the Seventh Ecumenical Council held in Nicaea in 787 A.D. At that time, the Consecration of a Church without relics was officially considered heretical (against the belief or doctrine of the Church).",
          "Central in the Life in Christ for an Orthodox Christian are the Sacraments which take place on the Holy Altar Table. For this reason, the Service of Consecration centers on the Holy Altar Table. The Holy Relics of three Holy Martyrs are deposited and sealed for all time in the Holy Altar Table, consecrating the Holy Altar and the entire Church.",
        ],
      },
    ],
  },
  {
    id: "what-to-expect-visiting",
    category: "parishes",
    title: "What to Expect When Visiting an Orthodox Christian Church",
    publication: "Diocesan resource",
    excerpt:
      "A practical guide for first-time visitors — what the space means, how the service unfolds, and what to know before approaching Holy Communion.",
    body: [
      {
        paragraphs: [
          "The visitor to an Orthodox church is usually impressed by the unique features and the external differences between this place of worship and those of the various traditions of Western Christianity. The rich color, distinctive iconography and beauty of the interior of an Orthodox church are in sharp contrast to what one often finds in many Roman Catholic and Protestant churches. When one enters the interior of the Orthodox Church it is like stepping into a whole new world of color and light. The art and design of the church not only create a distinctive atmosphere of worship, but also reflect and embody many of the fundamental beliefs of Orthodoxy.",
        ],
      },
      {
        heading: "Beauty and Symbols",
        paragraphs: [
          "The Orthodox Church believes that God is the Creator of heaven and earth. The Creator is present through His handiwork. This means that the material world, being valuable and good (Genesis 1:31), is an important means through which God shows His love for us.",
          "The Orthodox Church affirms these convictions through her extensive use of material creation not only for the embellishment of her places of worship, but also in the Holy Eucharist (Communion), the sacraments and other prayer services. For example, when the bread and wine - \"the first fruits of creation\" (Romans 11:16) - are offered in the Holy Eucharist, they are also a symbolic offering of all creation to God its Creator. The Holy Eucharist, known as the Divine Liturgy, is the Church's great action and prayer of thanksgiving.",
        ],
      },
      {
        heading: "Sacred Space",
        paragraphs: [
          "The church interior is both the background and the setting for Orthodox worship. In the Orthodox tradition there is a very strong feeling that the church is the 'House of God' and the 'place where His glory dwells.' God is present everywhere, and we can turn to Him in prayer in all places and circumstances — yet the interior of the church is designed to enable us to lift our hearts up in song and prayer.",
          "Ideally, an Orthodox Church building is relatively small in size to emphasize and enhance the sense of community in worship, generally constructed in the form of a cross and divided into three areas: the narthex, the nave, and the sanctuary. The sanctuary is the most sacred part of the church, reserved for clergy and their assistants, and contains the Holy Altar, separated from the nave by the Iconostasis.",
        ],
      },
      {
        heading: "Icons",
        paragraphs: [
          "An icon is a holy image which is the distinctive art form of the Orthodox Church. Occupying a very prominent place in Orthodox worship and theology, icons depict Christ Our Lord, Mary the Theotokos, the saints and angels — and may also portray events from Scripture or the history of the Church.",
          "The icon is not simply decorative, inspirational, or educational. Most importantly, it signifies the presence of the person depicted — a window linking heaven and earth. When we worship we do so as part of the Church which includes the living and the departed; we never lose contact with those who are with the Lord in glory.",
        ],
      },
      {
        heading: "Holy Communion",
        paragraphs: [
          "When you visit, please keep in mind that the Orthodox Church practices closed communion. This is not for triumphalistic reasons, but for very important theological reasons — in doing so we follow the practice of the ancient Church. \"Open communion\" is a relatively recent innovation and was not the practice of the Church beginning in the New Testament period.",
          "All are welcome to come forward at the conclusion of the Divine Liturgy to share in the antidoron — the blessed bread — which is offered to all.",
          "We look forward to having you join us.",
        ],
      },
    ],
  },
];

export function getArticle(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}

export function getRelatedArticles(id: string, count = 3): Article[] {
  const current = getArticle(id);
  if (!current) return [];
  return ARTICLES.filter((a) => a.id !== id)
    .sort((a, b) => (a.category === current.category ? -1 : 0) - (b.category === current.category ? -1 : 0))
    .slice(0, count);
}
