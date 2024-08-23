// @ts-nocheck
/* add ts later */
import { NextResponse } from "next/server";

async function fetchWithTimeout(resource: string, options: any) {
  const { timeout = 3000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const promise = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });

  const response = promise;
  clearTimeout(id);

  return response;
}

export async function GET() {
  const checkService = async (url: string, opts: any) => {
    try {
      const res = await fetchWithTimeout(url, opts || {});

      if (!res.ok || res.status !== 200) {
        console.error("--- ERROR: ", {
          url,
          status: res.status,
          message: res.body,
        });
        return false;
      }

      return true;
    } catch (e) {
      console.error("--- ERROR: ", { url, status: 0, message: e });
      return false;
    }
  };

  const status = {
    hypnos: {
      auth: "",
      private: "",
      public: "",
    },
    nyx: {
      homepage: "",
    },
    morpheus: {
      cms: "",
      homepage: "",
    },
    euterpe: {
      audio: "",
    },
    external: {
      rickmorty: "",
    },
  };

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
              method: "HEAD",
              headers: {
                range: "bytes=0-1",
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

  for (const service of Object.keys(promises)) {
    let count = 0;
    for (const microservice of promises[service]) {
      const names = Object.keys(services[service]);
      const serviceStatus = await microservice;
      status[service][names[count]] = serviceStatus ? "normal" : "degraded";
      count++;
    }
  }

  return NextResponse.json({ ok: true, status });
}
