'use client';
import z from 'zod';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	FormLabel,
} from '@/components/ui/form';
import {
	DialogTitle,
	DialogHeader,
	DialogFooter,
	DialogDescription,
	DialogContent,
	Dialog,
} from '@/components/ui/dialog';

import { createServerFormSchema } from '@/types/formschema';
import { useModel } from '@/hooks/useModelhook';

//this component is responsible for prompting the user create their own server with image and name
const EditServerModel = () => {
	const router = useRouter();
	//this hook is used to open the create server model
	const { isOpen, onClose, type, data } = useModel();

	const { server } = data;
	//we will need to open the model when the type of model is create model and when the model is open
	const isModelOpen = isOpen && type === 'edit-server';

	//this hook is responsible for validating/securing  the form
	const form = useForm({
		resolver: zodResolver(createServerFormSchema),
		defaultValues: {
			name: '',
			imageUrl: '',
		},
	});

	useEffect(() => {
		if (server) {
			form.setValue('name', server.name);
			form.setValue('imageUrl', server.imageUrl);
		}
	}, [server, form]);
	//this function is responsible for creating the server instance
	const onSubmit = async (value: z.infer<typeof createServerFormSchema>) => {
		try {
			//post form data to api route that handles creating a new server
			await axios.patch(`/api/edit-server/${server?.id}`, value);
			//let reset the form, refresh page and refreash window so that we end back to the setup page
			handleClose();
		} catch (error) {
			console.log('Opps, failed to submit server!!!');
		}
	};
	//this function is responsible for closing the model properly
	const handleClose = () => {
		form.reset();
		router.refresh();
		onClose();
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Edit Server</DialogTitle>
					<DialogDescription>
						Give your server a personalist with a name and image. YOu can always change it later
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center ">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUploader
													value={field.value}
													endpoint="serverImage"
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Server Name
										</FormLabel>
										<FormControl>
											<Input
												disabled={form.formState.isSubmitting}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="enter server name"
												{...field} //this lind adds the onChange, onFocus and onBlur event handlers
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant={'primary'} disabled={form.formState.isSubmitting} type="submit">
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditServerModel;
