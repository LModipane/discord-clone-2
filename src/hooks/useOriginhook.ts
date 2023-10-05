import { useEffect, useState } from 'react';

export const useOrigin = () => {
	const [isWindowMounted, setIsWindowMounted] = useState(false);

	useEffect(() => {
		setIsWindowMounted(true);
	}, []);

	const origin =
		typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

	if (!isWindowMounted) return '';

	return origin;
};
