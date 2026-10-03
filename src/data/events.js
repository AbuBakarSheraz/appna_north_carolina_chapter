export const events = [
  {
    title: "APPNA NC Annual Banquet, Entertainment & CME 2026",
    date: "Saturday, October 10, 2026",
    href: "/upcoming_events/annual_banquet",
    location: "North Carolina",
    image: "/future_events/Annual_Banquet.png",
    images: [
      { src: "/annual_banquet.png", alt: "APPNA NC Annual Banquet, Entertainment & CME 2026 flyer" },
      { src: "/concert.jpg", alt: "Amanat Ali concert image for the APPNA NC Annual Banquet" },
      { src: "/bazar.jpg", alt: "APPNA NC Bazaar image for the Annual Banquet" },
    ],
    description: "A festive evening celebration with families and community members, promoting unity, cultural connection, and shared values.",
    featured: true,
  },
  {
    title: "Winter GTG",
    date: "soon...",
    href: "/upcoming_events/winter_gtg",
    location: "North Carolina",
    image: "/future_events/winter.png",
    description: "An elegant winter evening focused on professional networking, reflection on the year’s achievements, and future planning.",
    featured: false,
  },
];

export const featuredEvent = events.find((event) => event.featured);
