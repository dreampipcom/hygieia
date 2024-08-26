//ts-nocheck
import { captureException } from "@sentry/nextjs";

export async function fetchWithTimeout(resource: string, options: any) {
  const { timeout = 20000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
    if (options?.isStream) {
      return { ok: true, status: 200 };
    }
  }, timeout);

  const promise = await fetch(resource, {
    ...options,
    signal: controller.signal,
    next: { revalidate: 0 },
  });

  const response = promise;
  clearTimeout(id);

  return response;
};

export const checkService = async (url: string, opts: any) => {
  try {
    const res = await fetchWithTimeout(url, opts || {});

    if (!res.ok || (res.status !== 200 && res.status !== 207)) {
      console.error("--- ERROR: ", {
        url,
        status: res.status,
        message: res.body,
      });
      return false;
    }

    if(opts?.cron) {
    	return res
    }
    return true;
  } catch (e) {
    if (!opts?.isStream) {
      captureException(e);
      console.error("--- ERROR: ", { url, status: 0, message: e });
      return false;
    }
    return true;
  }
};