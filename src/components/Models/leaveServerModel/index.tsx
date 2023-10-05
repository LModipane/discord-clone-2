'use client';

import { Button } from '@/components/ui/button';
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
const LeaveServerModel = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	//this hook is used to open the create server model
	const { isOpen, onClose, type, data, onOpen } = useModel();

	const { server } = data;

	//we will need to open the model when the type of model is create model and when the model is open
	const isModelOpen = isOpen && type === 'leave-server';

	const onLeave = async () => {
		try {
			setIsLoading(true);
			await axios.patch(`/api/leave-server/${server?.id}`);
			router.refresh();
			router.push('/');
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
					<DialogTitle className="text-2xl text-center font-bold">Leave Server</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 gap-x-1">
						Are You Sure You Want To Leave
						<span className="font-bold text-indigo-500"> {server?.name}</span>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button disabled={isLoading} variant="primary" onClick={onLeave}>
							Leave
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LeaveServerModel;
