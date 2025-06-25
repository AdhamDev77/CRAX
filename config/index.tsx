import { ComponentConfig, Config, Data, DropZone } from "../packages/core";
import { ButtonGroup, ButtonGroupProps } from "./blocks/ButtonGroup";
import { ModernButtonGroup, ModernButtonGroupProps } from "./blocks/ModernButtonGroup";
import { Card, CardProps } from "./blocks/Card";
import { Hero, HeroProps } from "./blocks/Hero";
import {
  HeroImagesSlider,
  HeroImagesSliderProps,
} from "./blocks/HeroImagesSlider";
import { Heading, HeadingProps } from "./blocks/Heading";
import { Flex, FlexProps } from "./blocks/Flex";
import { Grid, GridProps } from "./blocks/Grid";
import { Image, ImageProps } from "./blocks/Image";
import { Logos, LogosProps } from "./blocks/Logos";
import { Stats, StatsProps } from "./blocks/Stats";
import { Heading1, Heading1Props } from "./blocks/Text/Heading1";
import { Heading2, Heading2Props } from "./blocks/Text/Heading2";
import { VerticalSpace, VerticalSpaceProps } from "./blocks/VerticalSpace";
import { Seperator, SeperatorProps } from "./blocks/Seperator";
import { Announcement1, Announcement1Props } from "./blocks/Announcment1";
import { Navbar, NavbarProps } from "./blocks/ClassicNavbar";
import { ModernNavbar, ModernNavbarProps } from "./blocks/ModernNavbar";
import { VideoSecion, VideoSecionProps } from "./blocks/VideoSection";
import { MapLocation, MapLocationProps } from "./blocks/MapLocation";
import { Video, VideoProps } from "./blocks/Video";
import { FAQ, FAQProps } from "./blocks/FAQ";
import { HeroAgency, HeroAgencyProps } from "./blocks/HeroAgency";
import { PartnersAgency, PartnersAgencyProps } from "./blocks/PartnersAgency";
import { CardLink, CardLinkProps } from "./blocks/CardLink";
import { CardLink2, CardLink2Props } from "./blocks/CardLink2";
import { LensCard, LensProps } from "./blocks/LensCard";
import { Testimonials, TestimonialsProps } from "./blocks/Testimonals";
import { ContactForm, ContactFormProps } from "./blocks/ContactForm";
import { SocialPreview, SocialPreviewProps } from "./blocks/SocialmediaPost";
import { Timeline, TimelineProps } from "./blocks/Timeline";
import { SimpleCard, SimpleCardProps } from "./blocks/SimpleCard";
import { MasterComponent, MasterComponentProps } from "./blocks/MasterComponents";
import { Map, MapProps } from "./blocks/Map";
import { NestedContainer } from "./blocks/NestedComponent";

import Root, { RootProps } from "./root";

export type { RootProps } from "./root";


export type Props = {
  ButtonGroup: ButtonGroupProps;
  ModernButtonGroup: ModernButtonGroupProps;
  Card: CardProps;
  Hero: HeroProps;
  HeroImagesSlider: HeroImagesSliderProps;
  Heading: HeadingProps;
  Flex: FlexProps;
  Grid: GridProps;
  Logos: LogosProps;
  LensCard: LensProps;
  Stats: StatsProps;
  Heading1: Heading1Props;
  Heading2: Heading2Props;
  VerticalSpace: VerticalSpaceProps;
  Seperator: SeperatorProps;
  Announcement1: Announcement1Props;
  Navbar: NavbarProps;
  ModernNavbar: ModernNavbarProps;
  VideoSecion: VideoSecionProps;
  Video: VideoProps;
  MapLocation: MapLocationProps;
  Image: ImageProps;
  FAQ: FAQProps;
  HeroAgency: HeroAgencyProps;
  PartnersAgency: PartnersAgencyProps;
  CardLink: CardLinkProps;
  CardLink2: CardLink2Props;
  Testimonials: TestimonialsProps;
  ContactForm: ContactFormProps;
  SocialPreview: SocialPreviewProps;
  Timeline: TimelineProps;
  SimpleCard: SimpleCardProps;
  MasterComponent: MasterComponentProps;
  Map: MapProps;
  AdvancedProps: {
  name: string;
  content: any[];
  zones: Record<string, any[]>;
};

};

export type UserConfig = any;

export type UserData = Data<Props, RootProps>;

export const conf: UserConfig = {
  root: {
    defaultProps: {
      title: "My Page",
    },
    render: Root,
  },
  categories: {
    layout: {
      title: "Layout",
      type: "elements",
      components: ["Flex", "Grid", "VerticalSpace", "Seperator"],
    },
    navigation: {
      title: "Navigation",
      type: "components",
      components: ["Navbar", "ModernNavbar"],
    },
    announcements: {
      title: "Announcements",
      type: "components",
      components: ["Announcement1"],
    },
    landing: {
      title: "Landing Sections",
      type: "sections",
      components: ["Hero", "HeroAgency", "HeroImagesSlider"],
    },
    media: {
      title: "Media",
      type: "elements",
      components: ["Image", "Video", "MapLocation", "Map"],
    },
    mediaComponents: {
      title: "Media",
      type: "components",
      components: ["VideoSecion", "SocialPreview"],
    },
    typography: {
      title: "Typography",
      type: "elements",
      components: ["Heading", "Heading1", "Heading2"],
    },
    cards: {
      title: "Cards",
      type: "components",
      components: [
        "Card",
        "CardLink",
        "CardLink2",
        "LensCard",
        "SimpleCard",
      ],
    },
    logos: {
      title: "Partners",
      type: "components",
      components: ["Logos", "PartnersAgency"],
    },
    logosSections: {
      title: "Partners",
      type: "sections",
      components: ["PartnersAgency"],
    },
    statistics: {
      title: "Social Proof",
      type: "sections",
      components: ["Stats", "Testimonials"],
    },
    forms: {
      title: "Forms",
      type: "components",
      components: ["ContactForm", "FAQ"],
    },
    buttons: {
      title: "Buttons",
      type: "elements",
      components: ["ButtonGroup", "ModernButtonGroup"],
    },
    timeline: {
      title: "Timelines",
      type: "sections",
      components: ["Timeline", "MasterComponent"],
    },
  },
  components: {
    ButtonGroup,
    ModernButtonGroup,
    Card,
    CardLink,
    CardLink2,
    Seperator,
    Heading1,
    Heading2,
    Hero,
    HeroImagesSlider,
    HeroAgency,
    PartnersAgency,
    VideoSecion,
    Video,
    MapLocation,
    Image,
    Heading,
    LensCard,
    Flex,
    Grid,
    Logos,
    Stats,
    VerticalSpace,
    Announcement1,
    Navbar,
    ModernNavbar,
    FAQ,
    Testimonials,
    ContactForm,
    SocialPreview,
    Timeline,
    SimpleCard,
    MasterComponent,
    Map,
    NestedContainer
  },
};

export const initialData: Record<string, UserData> = {
  "/": {
    content: [
      {
        type: "Hero",
        props: {
          title: "This page was built with Puck",
          description:
            "Puck is the self-hosted visual editor for React. Bring your own components and make site changes instantly, without a deploy.",
          buttons: [
            {
              label: "Visit GitHub",
              href: "https://github.com/measuredco/puck",
            },
            { label: "Edit this page", href: "/edit", variant: "secondary" },
          ],
          id: "Hero-1687283596554",
          image: {
            url: "https://images.unsplash.com/photo-1687204209659-3bded6aecd79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
            mode: "inline",
          },
          padding: "128px",
          align: "left",
        },
      },
    ],
    root: { props: { title: "Puck Example", bgColor: "#fff", font: "" } },
    },
  }


export default conf;
