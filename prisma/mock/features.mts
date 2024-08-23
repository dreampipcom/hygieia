// features.mts
import type { ITenant } from './types';
import { faker } from '@faker-js/faker';
import { createMockUser, _mockUser, mockUser } from './user.mts';
import { createMockGroup, mockGroup } from './groups.mts';

import { mockListing, mockListing2 } from './listings.mts';
import { mockOrder } from './orders.mts';
import { mockTerm, mockTerm2 } from './taxonomies.mts';

import { HOMock } from './helpers.mts';

export const createMockFeature = ({ group, user, abilities, refUsers, refGroups }: any): any => {
  const data = {
    name: {
      es: 'Feature 1',
    },
    status: 'ACTIVE',
    type: 'INTERFACE',
    nature: 'LTS',
    abilities: {
      connect: abilities,
    },
  };
  return data;
};

export const mockFeature = createMockFeature({});
export const mockFeature2 = createMockFeature({});
