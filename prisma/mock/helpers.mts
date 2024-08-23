// helpers.ts
import type { ITenant } from './types';
import { createMockUser } from './user.mts';

export const HOMock = (data: Record<any, unknown>, { community, user }: ITenant) => {
  const response = { ...data };
  if (community) {
    response.communityOwner = {
      connect: { id: community },
    };
    response.communityCreator = {
      connect: { id: community },
    };
  }

  if (user) {
    response.userOwner = {
      connect: { id: user },
    };
    response.userCreator = {
      connect: { id: user },
    };
  }
  return response;
};
