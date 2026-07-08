import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/forms/search-input";
import { DriverTable } from "@/components/tables/driver-table";
import { Pagination } from "@/components/tables/pagination";
import { ErrorState } from "@/components/feedback/error-state";
import { useAdminDrivers } from "@/features/admin/hooks/use-admin";

export function AdminDriversPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const drivers = useAdminDrivers({ page, pageSize: 10, search });

  return (
    <div>
      <PageHeader title="Drivers" description="Your fleet and partner drivers." />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="max-w-xs">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by name, email, plate…"
            />
          </div>
        </CardContent>
        <div className="border-t border-border">
          {drivers.isError ? (
            <ErrorState message="Couldn't load drivers." onRetry={() => drivers.refetch()} />
          ) : (
            <>
              <DriverTable drivers={drivers.data?.items ?? []} isLoading={drivers.isLoading} />
              {drivers.data && drivers.data.totalItems > 0 && (
                <Pagination
                  page={drivers.data.page}
                  totalPages={drivers.data.totalPages}
                  totalItems={drivers.data.totalItems}
                  pageSize={drivers.data.pageSize}
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
