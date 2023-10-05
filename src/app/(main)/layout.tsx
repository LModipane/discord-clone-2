import React from 'react';
import { NavigationSidebar, ThemeToggle } from '@/components';

type MainLayoutProps = {
	children: React.ReactNode;
};
//this la
export default function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className="h-full">
			<div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed insert-y-0">
				<NavigationSidebar />
			</div>
			<main className="md:pl-[72px] h-full">{children}</main>
		</div>
	);
}
