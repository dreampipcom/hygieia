// public.ts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';

import { HOMock } from './helpers.mts';

const mockLocation = {
  name: 'Home',
  geo: {
    lat: 0.75,
    lng: 1.02,
    radius: 0.98,
  },
  address: {
    city: 'Lorem',
    province: 'Ipsum',
    country: 'Sit',
    zipCode: '000000',
  },
};

export const createMockPubListing = ({
  user,
  community,
  offers,
  audiences,
  model,
  taxonomies,
  ads,
  listingTaxonomies,
  reviews,
}: any): any => {
  const data = {
    userOwner: user,
    userCreator: user,
    communityCreator: community,
    communityOwner: community,
    title: {
      es: 'Lorem ipsum title',
    },
    description: {
      es: 'Lorem ipsum description',
    },
    status: 'ACTIVE',
    location: mockLocation,
    taxonomies,
  };

  return data;
};

export const mockPubListing = createMockPubListing({});
export const mockPubListing2 = createMockPubListing({});
