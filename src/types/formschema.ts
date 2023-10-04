import * as z from 'zod';

const MINIMIUM_SERVER_NAME_LENGTH = 4;
const MINIMIUM_SERVER_IMAGE_URL_LENGTH = 1;

export const createServerFormSchema = z.object({
	name: z.string().min(MINIMIUM_SERVER_NAME_LENGTH, {
		message: `Please enter server name of length ${MINIMIUM_SERVER_NAME_LENGTH}`,
	}),
	imageUrl: z.string().min(MINIMIUM_SERVER_IMAGE_URL_LENGTH, {
		message: `Please enter server image`,
	}),
});
