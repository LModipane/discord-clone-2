import db from '@/lib/db';

const findConversation = async (memberOneId: string, memberTwoId: string) => {
	try {
		return await db.conversation.findFirst({
			where: {
				AND: [{ memberOneId }, { memberTwoId }],
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		});
	} catch (error) {
		console.log('failed to return conversation');
		return null;
	}
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
	try {
		return await db.conversation.create({
			data: {
				memberOneId,
				memberTwoId,
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		});
	} catch (error) {
		console.log('failed to return conversation with members profile');
		return null;
	}
};

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
	try {
		let conversation =
			(await findConversation(memberOneId, memberTwoId)) ||
			(await findConversation(memberTwoId, memberOneId));

		if (!conversation) {
			conversation = await createConversation(memberOneId, memberTwoId);
		}

		return conversation;
	} catch (error) {
		console.log('Failed to get or create conversations!!!', error);
		return null;
	}
};
