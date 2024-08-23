// taxonomies.ts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser, _mockUser, mockUser, mockUser2 } from './user.mts';
import { mockCommunity } from './communities.mts';
import { createMockListing, mockListing, mockListing2 } from './listings.mts';

import { HOMock } from './helpers.mts';

export const createMockTerm = ({
  user,
  community,
  targetCommunities,
  targetAudiences,
  targetUser,
  listings,
  models,
}: any): any => {
  const data = {
    name: {
      es: 'Taxonomy Term 1',
    },
    description: {
      es: 'Lorem ipsum dolor sit amet consectetur',
    },
    status: 'ACTIVE',
    type: 'TAG',
    nature: 'SEGMENTED',
    targetUser: {
      connect: targetUser,
    },
    targetCommunities: {
      connect: targetCommunities,
    },
    listings: {
      connect: listings,
    },
  };

  return HOMock(data, { community, user });
};

export const mockTerm = createMockTerm({});
export const mockTerm2 = createMockTerm({});
