import { NextResponse } from 'next/server';

export async function GET() {
  const checkGetService = async (url, opts) => {
    const res = await fetch(url, opts)

    if(!res.ok) return false
    if(!res.status == 200) return false

    return true
  };

  const status = {
    hypnos: {
      auth: "",
      private: "",
      public: "",
    },
    nyx: {
      render: "",
    },
    morpheus: {
      cms: "",
      render: "",
    },
    euterpe: {
      audio: "",
    },
    external: {
      rickmorty: "",
    }
  };

  const services = {
    hypnos: {
      auth: [{
        url: "https://www.dreampip.com/api/auth/session",
        check: checkGetService,
      }],
      private: [{
        url: "https://www.dreampip.com/api/v1/user",
        check: checkGetService,
      }],
      public: [{
        url: "https://www.dreampip.com/api/v1/public",
        check: checkGetService,
      }],
    },
    nyx: {
      homepage: [{
        url: "https://www.dreampip.com/dash/signin",
        check: checkGetService,
      }]
    },
    morpheus: {
      cms: [{
        url: "https://www.dreampip.com/episodes",
        check: checkGetService,
      }],
      homepage: [{
        url: "https://www.dreampip.com/",
        check: checkGetService,
      }],
    },
    euterpe: {
      audio: [{
        url: "https://www.dreampip.com/api/nexus",
        check: checkGetService,
      }],
    },
    external: {
      rickmorty: [{
        url: "https://rickandmortyapi.com/graphql",
        check: checkGetService,
      }],
    }
  }

  const deepWalk = (parent) => {
      return Object.keys(parent).flatMap((child) => {
        if(Array.isArray(parent[child]) && typeof parent[child] === 'object') {
          console.log("array", { childe: parent[child] })
          return parent[child]
        }

        return deepWalk(parent[child])
      })
  }
  
  const promises = Object.keys(services).reduce((statusLog, service) => {
    const microservice = services[service]

    let iteree

    if(!Array.isArray(microservice)) {
      iteree = deepWalk(microservice)
    } else {
      iteree = microservice
    }

    statusLog[service] = []

    iteree.forEach((promise, index) => {
      statusLog[service][index] = promise.check(promise.url)
    })

    return statusLog
  }, {});

  for(const service of Object.keys(promises)) {
    console.log({ service })
    let count = 0
    for(const microservice of promises[service]) {
      const names = Object.keys(services[service])
      console.log({ promises, microservice, names })
      const serviceStatus = await microservice
      console.log({ serviceStatus })
      status[service][names[count]] = serviceStatus ? 'normal' : 'degraded';
      count++
    }
  }

  return NextResponse.json({ ok: true, status });
}