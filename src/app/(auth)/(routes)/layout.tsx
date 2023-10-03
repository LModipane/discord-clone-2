import React from 'react';

type Props = {
	children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
	return <div className="flex min-h-screen justify-center items-center">{children}</div>;
}
