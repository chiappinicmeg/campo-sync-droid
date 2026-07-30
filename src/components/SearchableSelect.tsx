import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}

export function SearchableSelect({ value, onValueChange, options, placeholder = 'Selecione...' }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return [...options];
    const lower = search.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(lower));
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-auto min-h-10 whitespace-normal text-left"
        >
          <span className="truncate flex-1 text-sm">
            {value || <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="border-0 p-0 h-8 shadow-none focus-visible:ring-0"
          />
        </div>
        <ScrollArea className="max-h-[250px]">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Nenhum resultado encontrado.</p>
          ) : (
            <div className="p-1">
              {filtered.map((option) => (
                <button
                  key={option}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                    value === option && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => {
                    onValueChange(option);
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4 shrink-0', value === option ? 'opacity-100' : 'opacity-0')} />
                  <span className="text-left leading-snug">{option}</span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
