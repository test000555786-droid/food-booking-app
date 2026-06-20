"use client";

import { StaffUser, StaffRole } from "@/types";
import { formatDate } from "@/lib/formatters";

interface StaffUserTableProps {
  users: StaffUser[];
  onToggleActive: (userId: string, isActive: boolean) => void;
}

const roleColors: Record<StaffRole, string> = {
  [StaffRole.ADMIN]: "bg-purple-100 text-purple-700",
  [StaffRole.MANAGER]: "bg-blue-100 text-blue-700",
  [StaffRole.STAFF]: "bg-gray-100 text-gray-600",
};

export function StaffUserTable({ users, onToggleActive }: StaffUserTableProps) {
  if (users.length === 0) {
    return <div className="text-center py-8 text-text-muted text-sm">No staff members</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Name</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Email</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Role</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Status</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Joined</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-bg/50">
              <td className="px-3 py-3 text-sm font-medium text-text">{user.name}</td>
              <td className="px-3 py-3 text-sm text-text-muted">{user.email}</td>
              <td className="px-3 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${roleColors[user.role]}`}>{user.role}</span></td>
              <td className="px-3 py-3"><span className={`text-xs font-medium ${user.isActive ? "text-success" : "text-danger"}`}>{user.isActive ? "Active" : "Inactive"}</span></td>
              <td className="px-3 py-3 text-xs text-text-muted">{formatDate(user.createdAt)}</td>
              <td className="px-3 py-3">
                <button onClick={() => onToggleActive(user.id, !user.isActive)} className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
