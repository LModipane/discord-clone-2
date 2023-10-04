import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs';

//this function is responsible for loading file to upload thing
const f = createUploadthing();

const handleAuth = () => {
	const { userId } = auth();
	if (!userId) throw new Error('Unauthenticated');
	return { userId: userId };
};

// this object is responsible for defining the different routes to load file to upload thing. For now, we just need to create routes for image upload and file upload
export const ourFileRouter = {
	serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		//This callback is responsible for running the middleware before the image is loaded on uploadthing. For now we need run the authentication function before we upload load.
		.middleware(() => handleAuth())
		// This callback is responsible for running code when the server image is saved successfully on uploadthing. For now just do nothing
		.onUploadComplete(() => {}),
	messageFile: f(['image', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
