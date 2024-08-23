// @controller/get-private-common-services.ts
import { PrivatePrisma } from '@model';

const PAGE_SIZE = 100;

const getPrivateCommonServices = async ({ page = 0, offset = 0, limit = PAGE_SIZE, filters = [] }: any) => {
  // to-do: move, this will be a middleware
  const adaptQuery: any = {
    where: {
      nature: 'COMMON',
    },
    skip: page * (limit + offset),
    take: limit,
    cacheStrategy: { ttl: 90 },
  };

  if (filters?.length) {
    try {
      const supportedQueries: Record<string, any> = {
        // user: {
        //   query: {
        //     OR: [{ id: { in: loggedUser?.servicesIds }, name: { [locale]: name } }, { userOwner: loggedUser?.id }],
        //   },
        // },
        // group: {
        //   query: {
        //     OR: [
        //       { id, name, groupOwner: session?.user?.id },
        //     ],
        //   },
        // },
      };

      const query: any = filters?.reduce((acc: any, filter: string) => {
        if (!acc.OR) acc.OR = [];
        acc.OR.push(supportedQueries[filter].query);
        return acc;
      }, {});

      adaptQuery.where = {
        ...adaptQuery.where,
        ...query,
      };
    } catch (e) {
      throw new Error('Code 001: Wrong filter');
    }
  }

  const response = await PrivatePrisma.services.findMany(adaptQuery);

  return response;
};

export default getPrivateCommonServices;
