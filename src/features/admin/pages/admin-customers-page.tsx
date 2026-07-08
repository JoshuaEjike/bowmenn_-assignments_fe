import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/forms/search-input";
import { CustomerTable } from "@/components/tables/customer-table";
import { Pagination } from "@/components/tables/pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { useAdminCustomers } from "@/features/admin/hooks/use-admin";
import { useDebouncedCallback } from "use-debounce";

export function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const customers = useAdminCustomers({ page, pageSize: 10, search });

  const debounced = useDebouncedCallback(async (_) => {
    customers.refetch();
  }, 1000);

  return (
    <div>
      <PageHeader title="Customers" description="Everyone who books shipments through Bowmenn." />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="max-w-xs">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);

                if (value) {
                  debounced(value);
                }
              }}
              placeholder="Search by name, email, company…"
            />
          </div>
        </CardContent>
        <div className="border-t border-border">
          {customers.isError ? (
            <ErrorState message="Couldn't load customers." onRetry={() => customers.refetch()} />
          ) : (
            <>
              <CustomerTable customers={customers.data?.items ?? []} isLoading={customers.isLoading} />
              {customers.data && customers.data.totalItems > 0 && (
                <Pagination
                  page={customers.data.page}
                  totalPages={customers.data.totalPages}
                  totalItems={customers.data.totalItems}
                  pageSize={customers.data.pageSize}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
