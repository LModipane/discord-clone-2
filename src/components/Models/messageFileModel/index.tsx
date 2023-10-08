'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { FileUploader } from '@/components';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { useModel } from '@/hooks/useModelhook';
import { fileUrlFormSchema } from '@/types/formschema';
import qs from 'query-string';
import * as z from 'zod';
import axios from 'axios';

//this component is responsible for prompting the user create their own server with image and name
const MessageFileModel = () => {
	const router = useRouter();
	const { data, isOpen, onClose, type } = useModel();
	const { apiUrl, query } = data;

	const isModelOpen = isOpen && type === 'message-file';

	//this hook is responsible for validating/securing   form
	const form = useForm({
		resolver: zodResolver(fileUrlFormSchema),
		defaultValues: {
			fileUrl: '',
		},
	});
	//this function is responsible for creating the server instance

	const onSubmit = async (value: z.infer<typeof fileUrlFormSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || '',
				query,
			});

			await axios.post(url, {
				...value,
				content: value.fileUrl,
			});
			handleClose();
		} catch (error) {
			console.log('failed to send file', error);
		}
	};
	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={handleClose}>
			<DialogContent className="p-0 overflow-hidden text-black bg-white">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-2xl font-bold text-center">Add An Attachment</DialogTitle>
					<DialogDescription>Send a file as a message</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="px-6 space-y-8">
							<div className="flex items-center justify-center ">
								<FormField
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUploader
													className="rounded-sm"
													value={field.value}
													endpoint="messageFile"
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="px-6 py-4 bg-gray-100">
							<Button
								type="submit"
								variant={'primary'}
								disabled={form.formState.isSubmitting}
								className="w-full text-xl">
								send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default MessageFileModel;