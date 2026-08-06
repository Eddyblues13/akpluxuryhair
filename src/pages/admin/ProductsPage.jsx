import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteProduct, fetchAdminProducts, toggleProduct } from "../../lib/adminApi";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatPrice } from "../../lib/format";
import {
  EmptyState,
  ErrorState,
  Pagination,
  Panel,
  Spinner,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "../../components/admin/ui";

export default function ProductsPage() {
  const [filters, setFilters] = useState({ search: "", category: "All", status: "", page: 1 });
  const [busySlug, setBusySlug] = useState(null);

  const fetcher = useCallback(
    (signal) =>
      fetchAdminProducts(
        {
          search: filters.search,
          category: filters.category,
          status: filters.status,
          page: filters.page,
        },
        signal
      ),
    [filters]
  );

  const { data, status, error, reload } = useAsyncData(fetcher);

  const setFilter = (patch) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));

  const onToggle = async (product) => {
    setBusySlug(product.slug);
    try {
      const updated = await toggleProduct(product.slug);
      toast.success(updated.data.is_active ? "Product is live." : "Product hidden from the shop.");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusySlug(null);
    }
  };

  const onDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setBusySlug(product.slug);
    try {
      const result = await deleteProduct(product.slug);
      toast.success(result.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusySlug(null);
    }
  };

  const categories = ["All", ...(data?.meta?.categories ?? [])];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl">Products</h1>
          <div className="hairline mt-4" />
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-light"
        >
          <Plus size={15} /> New product
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={filters.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          placeholder="Search name, slug or category"
          className="max-w-xs"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          className="max-w-[180px]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilter({ status: e.target.value })}
          className="max-w-[180px]"
        >
          <option value="">All statuses</option>
          <option value="active">Live</option>
          <option value="inactive">Hidden</option>
        </select>
      </div>

      <Panel>
        {status === "loading" && <Spinner label="Loading products" />}
        {status === "error" && <ErrorState message={error} onRetry={reload} />}

        {status === "ready" && data.data.length === 0 && (
          <EmptyState
            icon={Package}
            title="No products match"
            hint="Try clearing the filters, or add a new piece to the collection."
          />
        )}

        {status === "ready" && data.data.length > 0 && (
          <>
            <TableWrap>
              <thead className="border-b border-cream/10">
                <tr>
                  <Th>Product</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Sold</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {data.data.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-cream/5">
                    <Td>
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-9 shrink-0 border border-cream/10"
                          style={{
                            background: `linear-gradient(150deg, ${product.tone[0]}, ${product.tone[1]})`,
                          }}
                        />
                        <div className="min-w-0">
                          <p className="truncate">{product.name}</p>
                          <p className="truncate text-xs text-cream/30">{product.slug}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-cream/60">{product.category}</Td>
                    <Td className="text-gold">{formatPrice(product.price)}</Td>
                    <Td className="text-cream/60">{product.units_sold ?? 0}</Td>
                    <Td>
                      <StatusBadge status={product.is_active ? "active" : "inactive"} />
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.slug}/edit`}
                          className="p-2 text-cream/50 transition-colors hover:text-gold"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => onToggle(product)}
                          disabled={busySlug === product.slug}
                          className="p-2 text-cream/50 transition-colors hover:text-gold disabled:opacity-30"
                          aria-label={product.is_active ? "Hide product" : "Show product"}
                        >
                          {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          disabled={busySlug === product.slug}
                          className="p-2 text-cream/50 transition-colors hover:text-red-400 disabled:opacity-30"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
            <Pagination meta={data.meta} onPage={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Panel>

      {status === "ready" && (
        <p className="text-xs text-cream/30">
          Pieces that appear in past orders are hidden rather than deleted, so order history stays intact.
        </p>
      )}
    </div>
  );
}
