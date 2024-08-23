// types.d.ts
export interface ILocaleString {
  es: string;
  ca: string;
  ga: string;
  eu: string;
  en: string;
  cy: string;
  mt: string;
  is: string;
  it: string;
  pt: string;
  de: string;
  fr: string;
  pl: string;
  et: string;
  cz: string;
  sv: string;
  da: string;
  nl: string;
  nb: string;
  nn: string;
  ro: string;
  sr: string;
  sl: string;
  lv: string;
  lt: string;
  hr: string;
  el: string;
  hu: string;
  bg: string;
  bs: string;
  sq: string;
}

export enum ECurrency {
  EUR,
  NOK,
  SEK,
  CHF,
  GBP,
  CZK,
  PLZ,
  USD,
}

// pvt:offers

export interface ITaxesAndFees {
  taxes: number;
  fees: number;
  shipping: number;
}

export interface ITenant {
  community?: string;
  user?: string;
}

export enum ECampaignStatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

// pvt:taxonomies

export enum ETaxonomyStatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export enum ETaxonomyType {
  TAG,
  ANOTHER_TAG,
}

export enum ETaxonomyNature {
  SEGMENTED,
  PUBLIC,
}

export interface ITaxonomiesFacade {
  id: string;
  name: ILocaleString;
  description: ILocaleString;
  status: ETaxonomyStatus;
  type: ETaxonomyType;
  nature: ETaxonomyNature;
}

// pvt:messages
export enum EMessageType {
  ANNOUNCEMENT,
  CAMPAIGN,
  REVIEW,
  CHAT,
  SUPPORT,
}

export enum EMessageStatus {
  SCHEDULED,
  PENDING,
  DELIVERED,
  VIEWED,
}

export enum EMessageNature {
  PRIVATE,
  SEMI_PRIVATE,
  PUBLIC,
}

export interface IMessageFacade {
  id: string;
  name: ILocaleString;
  description: ILocaleString;
  type: EMessageType;
  status: EMessageStatus;
  nature: EMessageNature;
  title: ILocaleString;
  body: ILocaleString;
  queuedOn: Date;
  scheduledOn: Date;
  sentOn: Date;
}

// pvt:users
export interface IUserFacade {
  id: string;
  image: string;
  firstName: string;
}

// pvt:communities
export enum ECommunitiestatus {
  ACTIVE,
  PENDING,
  INACTIVE,
  DELETED,
}

export interface ICommunityFacade {
  id: string;
  image: string;
  name: string;
  urls: string[];
  status: ECommunitiestatus;
}

export enum EImpression {
  POSITIVE,
  NEGATIVE,
  NEUTRAL,
}

// public_listings

export enum EListingStatus {
  PENDING,
  ACTIVE,
  INACTIVE,
  DELETED,
}

export interface IPosix {
  lat: number;
  lng: number;
  radius: number;
}

export interface IRedactedAddress {
  city: string;
  province: string;
  country: string;
  zipCode: string;
}

export interface ILocation {
  geo: IPosix;
  address: IRedactedAddress;
  name: string;
}
