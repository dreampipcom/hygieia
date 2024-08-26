// @ts-nocheck
/* add ts later */
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { checkService } from "../helpers";

export const revalidate = 300;

export async function GET() {
	try {
	  const res = await checkService(`${process.env.API_URL || 'https://status.dreampip.com'}/api/cron`, { cron: true });
	  const json = await res.json();

	  return NextResponse.json(
	    { ok: true, status: json?.status },
	    {
	      status: 200,
	      headers: {
	        "Cache-Control": "public, max-age=0 s-maxage=300",
	        "CDN-Cache-Control": "public, max-age=0 s-maxage=300",
	        "Vercel-CDN-Cache-Control": "public, max-age=0 s-maxage=300",
	      },
	    },
	  );
	} catch(e) {
		return NextResponse.json(
	    { ok: false, status: {} },
	    {
	      status: 500,
	      headers: {
	        "Cache-Control": "public, max-age=0 s-maxage=300",
	        "CDN-Cache-Control": "public, max-age=0 s-maxage=300",
	        "Vercel-CDN-Cache-Control": "public, max-age=0 s-maxage=300",
	      },
	    },
	  );
	}
}
