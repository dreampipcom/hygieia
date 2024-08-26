// @ts-nocheck
/* add ts later */
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { checkService } from "../helpers";

export const revalidate = 60;

export async function GET() {
  const { captureMessage, captureException, setTag, setContext } = Sentry;
  if(!process.env.NEXUS_KEEPALIVE) {
    return NextResponse.json(
    { ok: true, status: response },
    {
      status: 403,
      headers: {
        "Cache-Control": "public, max-age=0 s-maxage=3600",
        "CDN-Cache-Control": "public, max-age=0 s-maxage=3600",
        "Vercel-CDN-Cache-Control": "public, max-age=0 s-maxage=3600",
      },
    })
  }

  const services = {
    hypnos: {
      auth: [
        {
          url: "https://www.dreampip.com/api/v1/auth/session",
          check: checkService,
        },
      ],
      private: [
        {
          url: "https://www.dreampip.com/api/v1/user",
          check: (url) => {
            return checkService(url, {
              method: "POST",
              headers: {
                "x-dp-keepalive": process.env.NEXUS_KEEPALIVE,
              },
            });
          },
        },
      ],
      public: [
        {
          url: "https://www.dreampip.com/api/v1/public",
          check: checkService,
        },
      ],
    },
    nyx: {
      homepage: [
        {
          url: "https://www.dreampip.com/dash/signin",
          check: checkService,
        },
      ],
    },
    morpheus: {
      cms: [
        {
          url: "https://www.dreampip.com/episodes",
          check: checkService,
        },
      ],
      homepage: [
        {
          url: "https://www.dreampip.com/",
          check: checkService,
        },
      ],
    },
    euterpe: {
      audio: [
        {
          url: "https://www.dreampip.com/api/nexus/audio",
          check: (url) => {
            return checkService(url, {
              method: "GET",
              headers: {
                range: "bytes=0-1",
              },
              isStream: true,
              timeout: 3000,
            });
          },
        },
      ],
    },
    external: {
      rickmorty: [
        {
          url: "https://rickandmortyapi.com/graphql",
          check: (url) => {
            const CHARS = `
              query {
                characters() {
                  info {
                    count
                  }
                  results {
                    id
                    name
                    status
                    origin {
                      name
                    }
                    location {
                      name
                    }
                    image
                  }
                }
              }
              `;
            return checkService(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query: CHARS }),
            });
          },
        },
      ],
    },
  };

  const deepWalk = (parent: any): any => {
    return Object.keys(parent).flatMap((child: any) => {
      if (Array.isArray(parent[child]) && typeof parent[child] === "object") {
        return parent[child];
      }

      return deepWalk(parent[child]);
    });
  };

  const promises = Object.keys(services).reduce(
    (statusLog: any, service: any) => {
      const microservice = services[service] as unknown as any;

      let iteree;

      if (!Array.isArray(microservice)) {
        iteree = deepWalk(microservice);
      } else {
        iteree = microservice;
      }

      statusLog[service] = [];

      iteree.forEach((promise: any, index: number) => {
        statusLog[service][index] = promise.check(promise.url);
      });

      return statusLog;
    },
    {},
  );

  let degraded;
  let degradedNames = [];
  let flatServices = []
  for (const service of Object.keys(promises)) {
    let count = 0;
    for (const microservice of promises[service]) {
      const names = Object.keys(services[service]);
      const serviceName = `${service}-${names[count]}`;
      flatServices.push({ promise: microservice, serviceName })
      count++;
    }
  }

  const allPromises = [];
  for (const service of flatServices) {
    allPromises.push(await service.promise)
  }
  
  const response = {}
  await Promise.allSettled(allPromises).then((statuses) => {
    statuses.forEach((statusObj, count) => {
      const serviceStatus = statusObj.value;
      const statusMessage = serviceStatus ? "normal" : "degraded";
      const serviceName = flatServices[count].serviceName;
      response[serviceName] = statusMessage;
      setTag(serviceName, statusMessage);
      if (statusMessage !== "normal") {
        degraded = true;
        degradedNames.push(serviceName);
      }
    })
  });

  setContext({ name: "DreamPip Status", status: response });
  captureMessage("Status: All systems normal.");
  const degradedServices = degradedNames.join(", ");
  if (degraded) captureException(`Status degraded: ${degradedServices}`);
  return NextResponse.json(
    { ok: true, status: response },
    {
      status: 207,
      headers: {
        "Cache-Control": "public, max-age=0 s-maxage=60",
        "CDN-Cache-Control": "public, max-age=0 s-maxage=60",
        "Vercel-CDN-Cache-Control": "public, max-age=0 s-maxage=60",
      },
    },
  );
}
