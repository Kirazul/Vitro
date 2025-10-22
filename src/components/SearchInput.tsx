import { Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { forwardRef } from 'react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={ref}
          type="text"
          className={cn(
            "w-full pl-12 pr-4 py-4 rounded-2xl",
            "glass",
            "border-2 border-white/30",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20",
            "transition-all duration-300",
            "text-base font-medium",
            "hover:border-white/40",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
