'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Plus, Send, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import qs from 'query-string';
import axios from 'axios';
import { useModel } from '@/hooks/useModelhook';
import { EmojiePicker } from '@/components';

type Props = {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
	type: 'channel' | 'conversation';
};

const formSchema = z.object({
	content: z.string().min(1),
});

const ChatInput = ({ apiUrl, name, query, type }: Props) => {
	const { onOpen } = useModel();

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			content: '',
		},
		resolver: zodResolver(formSchema),
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl,
				query,
			});
			const res = await axios.post(url, values);
			form.reset();
		} catch (error) {
			console.log('failed to send message', error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative p-4 pb-6 mr-14">
									<button
										onClick={() => onOpen('message-file', { apiUrl, query })}
										type="button"
										className="absolute top-7 bottom-0 left-8 h-[24px] w-[24px] bg-zinc-500 dark:zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
										<Plus className="text-white dark:text-[#31338]" />
									</button>
									<Input
										{...field}
										placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
										disabled={isLoading}
										className="py-6 border-none px-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
									/>
									<div className="absolute top-7 right-8">
										<EmojiePicker
											onChange={(emojie: string) => field.onChange(`${field.value} ${emojie}`)}
										/>
									</div>
									<div className="absolute flex items-center justify-center p-3 transition rounded-full -right-10 top-5 bg-zinc-500 dark:zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-400 dark:hover:text-white">
										<Send className="w-6 h-6 " />
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default ChatInput;
