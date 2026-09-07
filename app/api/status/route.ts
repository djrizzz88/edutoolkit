import {env} from 'cloudflare:workers';
export async function GET(){const c=env as unknown as Record<string,string>;return Response.json({screenshot:!!(c.SCREENSHOT_API_URL&&c.SCREENSHOT_API_TOKEN),downloader:!!(c.DOWNLOADER_API_URL&&c.DOWNLOADER_API_TOKEN)},{headers:{'Cache-Control':'no-store'}})}
