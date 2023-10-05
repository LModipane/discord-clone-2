import { Member, Profile, Server } from '@prisma/client';

export type ServerWithMembersWithProfile = Server & { members: MemberWithProfile[] };
export type MemberWithProfile = Member & { profile: Profile };
