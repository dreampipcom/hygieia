// @ts-nocheck
// status view
'use client';
import { useMemo } from 'react';
import { Globals, Logo, AudioPlayer, Grid as DPGrid, Typography as DPTypo, TypographyVariant } from "@dreampipcom/oneiros";
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export const View = () => {
	const { data, error, isLoading } = useSWR('/api/cron', fetcher, { refreshInterval: 1000 })
	const parsedData = useMemo(() => {
		if (!data) return []
		return Object.keys(data?.status).map((_status) => {
			const service = _status?.split('-');
			if(service.length !== 2) return { name: _status, parent: 'other', value: data[_status] };
			return { name: service[1], parent: service[0], value: data?.status[_status] }
		});
	}, [data])
  return (
  	<Globals theme="dark">
  		<DPGrid full>
		  	<main style={{minWidth:"100vw", minHeight:"100vh", padding: '32px'}}>
			    <div style={{ display: 'flex' }}>
			      <Logo />
			      <AudioPlayer prompt="" theme="dark" />
			   </div>
		     <DPGrid full>
		        	{error ? (<DPTypo>failed to load</DPTypo>) : undefined }
							{isLoading ? (<DPTypo>loading...</DPTypo>) : undefined }
							{data ? (<div>{parsedData?.map((service, i) => <div key={`service--${service.name}-${i}`}><DPTypo variant={TypographyVariant.SMALL}>{service.parent} ({service.name}): {service.value}</DPTypo></div>)}</div>) : undefined }
		     </DPGrid>
		    </main>
	    </DPGrid>
    </Globals>
  );
};
