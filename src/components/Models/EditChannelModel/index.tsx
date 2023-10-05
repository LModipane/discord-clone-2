'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useModel } from '@/hooks/useModelhook';
import { createChannelFormSchema } from '@/types/formschema';
import { ChannelType } from '@prisma/client';
import { useEffect } from 'react';

//this component is responsible for prompting the user create their own server with image and name
const EditChannelModel = () => {
	const router = useRouter();
	const params = useParams();
	//this hook is used to open the create server model
	const { isOpen, onClose, type, data } = useModel();
	//we will need to open the model when the type of model is create model and when the model is open
	const isModelOpen = isOpen && type === 'edit-channel';

	const { channel } = data;

	//this hook is responsible for validating/securing  the form
	const form = useForm({
		resolver: zodResolver(createChannelFormSchema),
		defaultValues: {
			name: '',
			type: channel?.type || ChannelType.TEXT,
		},
	});

	useEffect(() => {
		form.setValue('name', channel?.name || '');
		form.setValue('type', channel?.type || ChannelType.TEXT);
	}, [channel, form]);

	//this function is responsible for creating the server instance
	const onSubmit = async (value: z.infer<typeof createChannelFormSchema>) => {
		try {
			//post form data to api route that handles creating a new server
			const url = qs.stringifyUrl({
				url: `/api/edit-channel/${channel?.id}`,
				query: {
					serverId: params?.serverId,
				},
			});

			await axios.patch(url, value);
			//let reset the form, refresh page and refreash window so that we end back to the setup page
			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log('Opps, failed to submit server!!!', error);
		}
	};
	//this function is responsible for closing the model properly
	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModelOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">Edit Channel</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Channel Name
										</FormLabel>
										<FormControl>
											<Input
												disabled={form.formState.isSubmitting}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
												placeholder="enter channel name"
												{...field} //this lind adds the onChange, onFocus and onBlur event handlers
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
										<Select
											defaultValue={field.value}
											disabled={form.formState.isLoading}
											onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-zinc-500 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Select channel type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChannelType).map(type => (
													<SelectItem key={type} value={type} className="capitalize cursor-pointer">
														{type.toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant={'primary'} disabled={form.formState.isSubmitting} type="submit">
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditChannelModel;
