// communities.ts
import { faker } from '@faker-js/faker';
import { createMockUser } from './user.mts';
import { createMockListing } from './listings.mts';
import { createMockMessage } from './messages.mts';
import { createMockTerm } from './taxonomies.mts';
import { createMockRole } from './roles.mts';

export const createMockCommunity = (): any => {
  const id = faker.database.mongodbObjectId();

  return {
    id,
    name: 'My Community 1',
    description: 'My community 1 description',
    urls: ['https://mycommunity.com'],
    image: faker.image.avatar(),
    users: {
      create: [createMockUser(), createMockUser()],
    },
    status: 'ACTIVE',
    favorites: {
      create: [],
    },
    preferences: {
      create: [],
    },
    ownedListings: {
      create: [],
    },
    createdListings: {
      create: [],
    },
    ownedTaxonomies: {
      create: [],
    },
    createdTaxonomies: {
      create: [],
    },
    ownedMessages: {
      create: [],
    },
    createdMessages: {
      create: [],
    },
    roles: {
      create: [],
    },
    messagesSent: {
      create: [],
    },
    messagesReceived: {
      create: [],
    },
    userOwner: {
      create: createMockUser(),
    },
    userCreator: {
      create: createMockUser(),
    },
  };
};

export const mockCommunity = createMockCommunity();
export const mockCommunity2 = createMockCommunity();
export const mockCommunity3 = createMockCommunity();
