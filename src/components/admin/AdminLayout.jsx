import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  ReceiptText,
  Store,
  UserCog,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ReceiptText },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/team", label: "Team", icon: Users, ownerOnly: true },
  { to: "/admin/account", label: "Account", icon: UserCog },
];

export default function AdminLayout() {
  const { admin, isOwner, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = NAV.filter((link) => !link.ownerOnly || isOwner);

  const signOut = async () => {
    await logout();
    toast.success("Signed out.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Mobile backdrop */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-cream/10 bg-onyx transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-cream/10 px-5 py-5">
          <Link to="/admin" className="font-display text-lg">
            AKP <span className="gold-text italic">Admin</span>
          </Link>
          <button className="p-1 text-cream/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive ? "bg-gold/10 text-gold" : "text-cream/60 hover:bg-cream/5 hover:text-cream"
                }`
              }
            >
              <link.icon size={17} strokeWidth={1.5} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-cream/10 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-cream/50 transition-colors hover:text-gold"
          >
            <Store size={17} strokeWidth={1.5} /> View storefront
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-cream/50 transition-colors hover:text-red-400"
          >
            <LogOut size={17} strokeWidth={1.5} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-cream/10 bg-ink/90 px-5 py-4 backdrop-blur-md">
          <button className="p-1 text-cream/70 lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <div className="ml-auto text-right">
            <p className="text-sm">{admin?.name}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">{admin?.role}</p>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
