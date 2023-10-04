import { createNextRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from '@/lib/uploadthing/core';

// Here is the uploadthing's own next.js route responsible for uploading files to uploadthing
export const { GET, POST } = createNextRouteHandler({
	router: ourFileRouter,
});
