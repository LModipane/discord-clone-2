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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FileUploader } from '@/components';
import { Input } from '@/components/ui/input';

import { createServerFormSchema } from '@/types/formschema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const InitialModel = () => {
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			imageUrl: '',
			name: '',
		},
		resolver: zodResolver(createServerFormSchema),
	});

	const onSubmit = async (value: z.infer<typeof createServerFormSchema>) => {
		try {
			//post form data to api route that handles creating a new server
			await axios.post('/api/create-servers', value);
			//let reset the form, refresh page and refreash window so that we end back to the setup page
			form.reset();
			router.refresh();
			window.location.reload();
		} catch (error) {
			console.log('Opps, failed to submit server!!!');
		}
	};
	return (
		<Dialog open>
			<DialogContent className="p-0 overflow-hidden text-black bg-white">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-2xl font-bold text-center">Create Your Server</DialogTitle>
					<DialogDescription>
						Give your server a personalist with a name and image. YOu can always change it later
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="px-6 space-y-8">
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
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
											Server Name
										</FormLabel>
										<FormControl>
											<Input
												disabled={form.formState.isSubmitting}
												className="text-black border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="enter server name"
												{...field} //this lind adds the onChange, onFocus and onBlur event handlers
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="px-6 py-4 bg-gray-100">
							<Button variant={'primary'} disabled={form.formState.isSubmitting} type="button">
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default InitialModel;
