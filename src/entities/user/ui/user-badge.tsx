// entities/user/ui/user-badge.tsx
import type { User } from "../model/types";

function getInitials(user: User) {
  return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
}

export function UserBadge({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rufo-primary text-sm font-semibold text-white">
        {getInitials(user)}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-rufo-text">{user.firstName} {user.lastName}</span>
        <span className="text-xs text-rufo-text-muted">{user.email}</span>
      </div>
    </div>
  );
}
