'use client';
import { CreateServerModel, InvitePersonModel } from '@/components/Models';
import React from 'react';

const ModelProvider = () => {
	return (
		<>
			<CreateServerModel />
			<InvitePersonModel />
		</>
	);
};

export default ModelProvider;
