'use client';
import { type Server } from '@prisma/client';
import { Check, Copy, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useModel } from '@/hooks/useModelhook';
import { useOrigin } from '@/hooks/useOriginhook';
import axios from 'axios';
import { useState } from 'react';

//this component is responsible for prompting the user create their own server with image and name
const InvitePeopleModal = () => {
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	//this hook is used to open the create server model
	const { isOpen, onClose, type, data, onOpen } = useModel();

	const { server } = data;
	//this hook is used to return the url of application
	const origin = useOrigin();
	//we will need to open the model when the type of model is create model and when the model is open
	const isModelOpen = isOpen && type === 'invite-person';

	const iniviteUrl = `${origin}/invite/${server?.inviteCode}`;

	//this function is responsible for saving the inivite url
	const onCopy = () => {
		navigator.clipboard.writeText(iniviteUrl);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 5000);
	};

	const handleNewLink = async () => {
		try {
			setIsLoading(true);
			const res: { data: Server } = await axios.patch(`/api/invite-code/${server?.id}`);
			onOpen('invite-person', { server: res.data });
		} catch (error) {
			console.log('Failed to generate new link', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Invite Your Friends</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
						Server Invite Link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							disabled={isLoading}
							className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
							value={iniviteUrl}
						/>
						<Button size="icon" onClick={onCopy} disabled={isLoading}>
							{isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
						</Button>
					</div>
					<Button
						onClick={handleNewLink}
						variant="link"
						size="sm"
						className="text-xs text-zinc-500 mt-4"
						disabled={isLoading}>
						Generate a new Link
						<RefreshCcw className="w-4 h-4 ml-2 " />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default InvitePeopleModal;
