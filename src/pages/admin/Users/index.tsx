import React, { useEffect, useMemo, useState } from "react";
import type { AdminUser } from "../../../types";
import { getAllUsers, deleteUser } from "../../../services/admin.service";
import { getErrorMessage } from "../../../services/apiClient";
import { Button } from "../../../components/Button";
import { SearchInput } from "../../../components/ui/SearchInput";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Users, Trash2, Mail, Phone } from "lucide-react";
import { cn } from "../../../utils/cn";

const formatDate = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const emptyMessage = "Could not load the customer list. Please try again.";

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { users: list } = await getAllUsers();
        if (!alive) return;
        setUsers(list);
        setError(null);
      } catch (err) {
        if (!alive) return;
        setError(getErrorMessage(err, emptyMessage));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const retry = () => {
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const { users: list } = await getAllUsers();
        setUsers(list);
      } catch (err) {
        setError(getErrorMessage(err, emptyMessage));
      } finally {
        setLoading(false);
      }
    })();
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.phone].some((field) => field?.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Remove ${user.name}'s account? This cannot be undone.`)) return;
    setDeletingId(user.id);
    setFeedback(null);
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setFeedback(`${user.name}'s account has been removed.`);
    } catch (err) {
      setFeedback(getErrorMessage(err, "Could not remove this account. Please try again."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif">
            Customers
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
            {users.length} Registered Accounts
          </p>
        </div>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by name, email or phone..."
        ariaLabel="Filter customers"
        className="w-full max-w-md"
      />

      {feedback && (
        <p className="text-xs text-gold bg-gold/10 border border-gold/30 rounded-lg px-3 py-2">
          {feedback}
        </p>
      )}

      {error && (
        <div className="relative overflow-hidden rounded-xl surface-glass-strong p-6 text-center py-12 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
          <p className="relative text-sm text-black/45 dark:text-white/45 mb-4">{error}</p>
          <Button type="button" variant="primary" size="md" onClick={retry}>
            Try Again
          </Button>
        </div>
      )}

      {!error && loading && users.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl surface-glass-strong p-5 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-center gap-3">
                <Skeleton circle width={44} height={44} />
                <div className="space-y-2 flex-1">
                  <Skeleton width="55%" height={14} />
                  <Skeleton width="35%" height={12} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton width="80%" height={12} />
                <Skeleton width="65%" height={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!error && !loading && filteredUsers.length === 0 && (
        <div className="relative overflow-hidden rounded-xl surface-glass-strong p-6 text-center py-16 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
          <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
          <p className="relative text-sm text-black/45 dark:text-white/45">
            {searchQuery
              ? `No accounts matching "${searchQuery}".`
              : "No customer accounts yet."}
          </p>
        </div>
      )}

      {!error && !loading && filteredUsers.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          data-tour="admin-users"
        >
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="relative overflow-hidden rounded-xl surface-glass-strong p-5 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]"
            >
              <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-gold text-black flex items-center justify-center font-bold text-base rounded-xl shrink-0">
                    {user.name.charAt(0).toUpperCase() || "·"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-black dark:text-white truncate">
                      {user.name}
                    </h3>
                    <span
                      className={cn(
                        "inline-block mt-1 rounded-full text-[9px] uppercase tracking-widest font-bold px-2 py-0.5",
                        user.role === "ADMIN"
                          ? "bg-gold/15 text-gold border border-gold/40"
                          : "bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/50 border border-black/10 dark:border-white/15"
                      )}
                    >
                      {user.role === "ADMIN" ? "Admin" : "Customer"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleDelete(user)}
                  disabled={deletingId === user.id || user.role === "ADMIN"}
                  aria-label={`Remove ${user.name}`}
                  className={cn(
                    "rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                    user.role === "ADMIN"
                      ? "text-black/25 dark:text-white/25 cursor-not-allowed"
                      : "text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative mt-4 space-y-2 text-xs text-black/55 dark:text-white/55 min-w-0">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="truncate">{user.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="truncate">{user.phone || "No phone"}</span>
                </div>
                <div className="pt-1 text-xs flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};