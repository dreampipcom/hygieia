/* eslint-disable no-constant-condition */
// @controller/update-private-user-services.ts
import { whoAmI } from '@controller';
import { PrivatePrisma } from '@model';

const updatePrivateUserAbilities = async ({ upsert = false, user, abilities }: any) => {
  try {
    // to-do: move this will be a middleware
    if (abilities?.length === 0) return new Error('Code 002: Missing data (abilities)');

    const loggedUser = user || (await whoAmI({}));

    const payload = upsert
      ? {
          abilitiesIds: [...loggedUser.abilities, ...abilities],
        }
      : {
          abilitiesIds: abilities,
        };

    const adaptQuery: any = {
      where: {
        email: loggedUser.email,
      },
      data: payload,
    };

    const response = await PrivatePrisma.user.update(adaptQuery);

    return response;
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};

export default updatePrivateUserAbilities;
