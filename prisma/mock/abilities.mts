// abilities.mts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser, _mockUser, mockUser } from './user.mts';
import { createMockGroup, mockGroup } from './communities.mts';

import { mockListing, mockListing2 } from './listings.mts';
import { mockOrder } from './orders.mts';
import { mockTerm, mockTerm2 } from './taxonomies.mts';

import { HOMock } from './helpers.mts';

export const createMockAbility = ({ community, user, roles, refUsers, refCommunities }: any): any => {
  const data = {
    name: {
      es: 'Ability 1',
    },
    status: 'ACTIVE',
    type: 'R',
    nature: 'COMMON',
    roles: {
      connect: roles,
    },
    users: {
      connect: refUsers,
    },
    communities: {
      connect: refCommunities,
    },
  };
  return data;
};

export const mockAbility = createMockAbility({});
export const mockAbility2 = createMockAbility({});
