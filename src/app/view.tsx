//@ts-nocheck
// status view
'use client';
import { useMemo } from 'react';
import { Globals, Logo, AudioPlayer, EGridVariant, Grid as DPGrid, EBleedVariant, Typography as DPTypo, TypographyVariant } from "@dreampipcom/oneiros";
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const View = () => {
	const { data, error, isLoading } = useSWR('/api/cron', fetcher, { refreshInterval: 1000 })
	const parsedData = useMemo(() => {
		const services = data?.status;
		if (!services) return [];
		const status = [];
		for (const service of Object.keys(services)) {
	    for (const microservice of Object.keys(services[service])) {
	      const serviceStatus = services[service][microservice];
	      status.push({ name: microservice, value: serviceStatus, parent: service })
	    }
	  }
		return status
	}, [data])
  return (
  	<Globals theme="dark">
  		<DPGrid full>
		  	<main style={{width:"100vh", height:"100vw"}}>
			    <DPGrid variant={EGridVariant.TWELVE_COLUMNS} bleed={EBleedVariant.RESPONSIVE} theme="dark">
			      <Logo className="col-span-3 col-start-0" />
			      <div className="col-span-4 col-start-0">
			        	{error ? (<DPTypo>failed to load</DPTypo>) : undefined }
								{isLoading ? (<DPTypo>loading...</DPTypo>) : undefined }
								{data ? (<div>{parsedData.map((service, i) => <div key={`service--${service.name}-${i}`}><DPTypo variant={TypographyVariant.SMALL}>{service.parent} ({service.name}): {service.value}</DPTypo></div>)}</div>) : undefined }
			      </div>
			      <DPGrid full bleed={EBleedVariant.ZERO} variant={EGridVariant.TWELVE_COLUMNS} className="col-span-12 col-start-0 md:justify-self-end md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
			        <div className="flex w-full">
			          <AudioPlayer prompt="" theme="dark" />
			        </div>
			      </DPGrid>
			    </DPGrid>
		    </main>
	    </DPGrid>
    </Globals>
  );
};
