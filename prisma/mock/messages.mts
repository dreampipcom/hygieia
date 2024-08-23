// messages.ts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser, _mockUser, mockUser, mockUser2 } from './user.mts';
import { mockCommunity, mockCommunity2, mockCommunity3 } from './communities.mts';
import { mockListing, mockListing2 } from './listings.mts';
import { createMockReview } from './reviews.mts';

import { HOMock } from './helpers.mts';

export const createMockMessage = ({
  community,
  user,
  fromUser,
  fromCommunity,
  toUser,
  toCommunities,
  toListings,
  toAudiences,
  campaigns,
  review,
}: any): any => {
  const data: any = {
    name: {
      es: 'INTERNAL aud',
    },
    description: {
      es: 'Lorem ipsum dolor sit amet consectetur',
    },
    status: 'SCHEDULED',
    type: 'ANNOUNCEMENT',
    nature: 'SEMI_PRIVATE',
    title: {
      es: 'Lorem',
    },
    body: {
      es: 'Ipsum',
    },
    queuedOn: new Date(),
    scheduledOn: new Date(),
    sentOn: new Date(),
    toUser: {
      connect: toUser,
    },
    toCommunities: {
      connect: toCommunities,
    },
    toListings: {
      connect: toListings,
    },
  };

  if (fromUser) {
    data.fromUser = {
      connect: fromUser,
    };
  }

  if (fromCommunity) {
    data.fromCommunity = {
      connect: fromCommunity,
    };
  }

  return HOMock(data, { community, user });
};

export const mockMessage = createMockMessage({});
export const mockMessage2 = createMockMessage({});
export const mockMessage3 = createMockMessage({});
