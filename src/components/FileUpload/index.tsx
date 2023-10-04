'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import Image from 'next/image';
import '@uploadthing/react/styles.css';
import { File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
	endpoint: 'messageFile' | 'serverImage';
	onChange: (url?: string) => void;
	value: string;
	className?: string;
};
const FileUpload = ({ endpoint, onChange, value, className }: Props) => {
	//extract file type from value
	const fileType = value?.split('.').pop();
	//if file-type is image we need to render image
	if (value && fileType !== 'pdf') {
		return (
			<div className="relative w-24 h-24">
				<Image
					src={value}
					fill
					alt="upload-image"
					className={cn('rounded-full object-cover object-center', className)}
				/>
				<button
					onClick={() => onChange('')}
					type="button"
					className="absolute top-0 right-0 p-1 text-white rounded-full shadow-sm bg-rose-500">
					<X className="w-4 h-4" />
				</button>
			</div>
		);
	}

	if (value && fileType === 'pdf') {
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md ">
				<File className="w-10 h-10 stroke-indigo-400 fill-indigo-200" />
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
					{value}
				</a>
				<button
					onClick={() => onChange('')}
					type="button"
					className="absolute p-1 text-white rounded-full shadow-sm bg-rose-500 -top-2 -right-2">
					<X className="w-4 h-4" />
				</button>
			</div>
		);
	}
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={res => {
				onChange(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				console.log('Opps, failed to upload file: ', error.message);
			}}
		/>
	);
};

export default FileUpload
