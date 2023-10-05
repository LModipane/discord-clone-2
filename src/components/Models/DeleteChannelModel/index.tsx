'use client';

import { Button } from '@/components/ui/button';
import qs from 'query-string';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { useModel } from '@/hooks/useModelhook';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

//this component is responsible for prompting the user create their own server with image and name
const DeleteChannelModel = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	//this hook is used to open the create server model
	const { isOpen, onClose, type, data, onOpen } = useModel();

	const { server, channel } = data;

	//we will need to open the model when the type of model is create model and when the model is open
	const isModelOpen = isOpen && type === 'delete-channel';

	const onDelete = async () => {
		try {
			setIsLoading(true);
			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}/delete`,
				query: {
					serverId: server?.id,
				},
			});
			await axios.delete(url);
			onClose();
			router.refresh();
			router.push(`/servers/${server?.id}`);
		} catch (error) {
			console.log('Failed to leave server', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Delete Channel</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 gap-x-1">
						Are You Sure You Want To Delete Channel
						<span className="font-bold text-indigo-500"> {server?.name}</span>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button
							disabled={isLoading}
							variant="primary"
							onClick={onDelete}
							className="bg-rose-500 hover:bg-rose-600">
							Delete
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteChannelModel;
