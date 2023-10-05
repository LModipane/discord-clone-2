import { NavigationSidebar } from '@/components';
import ServerSidebar from '@/components/ServerSidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

type Props = {
	serverId: string;
};

const MobileToggle = ({ serverId }: Props) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="md:hidden" variant="ghost" size="icon">
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex gap-0 p-0">
				<div className="w-[72px]">
					<NavigationSidebar />
				</div>
				<ServerSidebar serverId={serverId} />
			</SheetContent>
		</Sheet>
	);
};
export default MobileToggle;
