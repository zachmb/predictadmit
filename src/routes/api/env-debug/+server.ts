// src/routes/api/env-debug/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
  // Log to server console
  console.log('env.OCR_API_KEY:', env.OCR_API_KEY);
  console.log('env.DEEPSEEK_API_KEY:', env.DEEPSEEK_API_KEY);

  return json({
    hasOCR: !!env.OCR_API_KEY,
    hasDeepseek: !!env.DEEPSEEK_API_KEY
    // not returning the actual keys for safety
  });
};
