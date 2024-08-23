/* eslint-disable no-constant-condition */
// @controller/update-private-user-services.ts
import { whoAmI } from '@controller';
import { PrivatePrisma } from '@model';

const updatePrivateUserServices = async ({ upsert = false, user, services }: any) => {
  try {
    // to-do: move this will be a middleware
    if (services?.length === 0) return new Error('Code 002: Missing data (services)');

    const loggedUser = user || (await whoAmI({}));

    const payload = upsert
      ? {
          servicesIds: [...loggedUser.services, ...services],
        }
      : {
          servicesIds: services,
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

export default updatePrivateUserServices;
