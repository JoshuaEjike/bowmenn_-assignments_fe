import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search…" }: SearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      leadingIcon={<Search />}
      trailingIcon={
        value ? (
          <Button
            variant="ghost"
            size="icon"
            className="pointer-events-auto h-6 w-6"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        ) : undefined
      }
    />
  );
}
