/* eslint-disable no-constant-condition */
// @controller/update-private-user-favorite-listings.ts
import { whoAmI, canI } from '@controller';
import { PrivatePrisma } from '@model';

const updatePrivateUserFavoriteListings = async ({ upsert = true, user, listings = [], type = 'id' }: any) => {
  try {
    if (listings?.length === 0) return new Error('Code 002: Missing data (listings)');

    const loggedUser = user || (await whoAmI({}));

    console.log({ user, loggedUser });

    const delta = upsert ? listings.filter((listing: any) => !loggedUser?.favorites?.includes(listing)) : [];

    if ((await canI({ name: 'Ability 1', user: loggedUser })) && type === 'id') {
      const swapUserData = loggedUser.favorites.filter((listing: string) => !listings.includes(listing));
      const payload = upsert
        ? {
            favoritesIds: [...swapUserData, ...delta],
          }
        : {
            favoritesIds: listings,
          };
      const adaptQuery: any = {
        where: {
          email: loggedUser.email,
        },
        data: payload,
      };

      const response = await PrivatePrisma.user.update(adaptQuery);
      return response;
    } else if ((await canI({ name: 'Ability 1', user: loggedUser })) && type === 'string') {
      const userData = loggedUser?.favoritesStrings;
      const swapData = userData.filter((listing: string) => listings.includes(listing));
      const transaction = userData
        .filter((listing: string) => !swapData.includes(listing))
        .concat(delta.filter((listing: string) => !swapData.includes(listing)));
      const payload = upsert
        ? {
            favoritesStrings: [...transaction],
          }
        : {
            favoritesStrings: listings,
          };
      const adaptQuery: any = {
        where: {
          email: loggedUser.email,
        },
        data: payload,
      };

      const response = await PrivatePrisma.user.update(adaptQuery);
      return response;
    } else {
      throw new Error(`403: Not authorized.`);
    }
  } catch (e) {
    throw new Error(`Code 003: Missing results: ${e}`);
  }
};

export default updatePrivateUserFavoriteListings;
