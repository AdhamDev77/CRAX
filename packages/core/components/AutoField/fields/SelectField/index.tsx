"use client";

import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../../../../../lib/utils";
import { Button } from "../../../../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../../components/ui/popover";

interface SelectFieldProps {
  field: {
    type: string;
    options: { value: string | number; label: string }[];
  };
  onChange: (value: string | number | boolean) => void;
  label?: string;
  value: string | number;
  name: string;
  readOnly?: boolean;
  id?: string;
}

export const SelectField = ({
  field,
  onChange,
  label,
  value,
  name,
  readOnly,
  id,
}: SelectFieldProps) => {
  if (field.type !== "select" || !field.options) {
    return null;
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full px-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label || name}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={readOnly}
          >
            {value
              ? field.options.find((option) => option.value === value)?.label
              : "Select an option..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
          alignOffset={0}
          style={{ 
            maxHeight: '300px',
            overflow: 'hidden'
          }}
        >
          <Command className="max-h-[300px]">
            <CommandInput placeholder="Search options..." className="h-9" />
            <CommandList className="max-h-[250px] overflow-y-auto">
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {field.options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value.toString()}
                    onSelect={(currentValue) => {
                      const parsedValue =
                        typeof option.value === "boolean"
                          ? option.value
                          : option.value;
                      onChange(parsedValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mx-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};