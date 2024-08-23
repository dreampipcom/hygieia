// roles.ts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser, _mockUser, mockUser } from './user.mts';
import { createMockCommunity, mockCommunity } from './communities.mts';

import { mockListing, mockListing2 } from './listings.mts';
import { mockOrder } from './orders.mts';
import { mockTerm, mockTerm2 } from './taxonomies.mts';

import { HOMock } from './helpers.mts';

export const createMockRole = ({ community, user, refUsers, refCommunities }: any): any => {
  const data = {
    name: {
      es: 'Role 1',
    },
    status: 'ACTIVE',
    type: 'PROVIDER',
    nature: 'INTERNAL',
    users: {
      connect: refUsers,
    },
    communities: {
      connect: refCommunities,
    },
  };
  return data;
};

export const mockRole = createMockRole({});
export const mockRole2 = createMockRole({});
