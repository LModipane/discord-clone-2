import {
	ThemeProviders,
	ModelProvider,
	SocketProvider,
	QueryProvider,
} from '@/components/Providers';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<Providers>
					<body
						className={cn(
							inter.className,
							'dark:bg-[#313338] dark:text-white bg-white text-black',
						)}>
						{children}
					</body>
				</Providers>
			</html>
		</ClerkProvider>
	);
}

type ProviderProps = {
	children: React.ReactNode;
};

const Providers = ({ children }: ProviderProps) => {
	return (
		<>
			<ThemeProviders
				attribute="class"
				defaultTheme=""
				storageKey="discord-theme"
				enableSystem={false}
				disableTransitionOnChange>
				<SocketProvider>
					<QueryProvider>
						<ModelProvider />
						{children}
					</QueryProvider>
				</SocketProvider>
			</ThemeProviders>
		</>
	);
};
