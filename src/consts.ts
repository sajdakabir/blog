import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "oliursahin.com",
  EMAIL: "oliursahin@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "sahin",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/oliursahin",
  },
  { 
    NAME: "twitter",
    HREF: "https://twitter.com/oliursahin",
  },
];
