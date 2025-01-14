import React, { useState, useMemo, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  Plus,
  Download,
  Mail,
  Eye,
  Filter,
  ArrowUpDown,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import LoaderComponent from "@/components/loader";
import Image from "next/image";

type DataItem = Record<string, string | number | boolean | Date>;

type ColumnType =
  | "text"
  | "number"
  | "range"
  | "email"
  | "longText"
  | "boolean"
  | "date";

type Column = {
  key: string;
  label: string;
  type: ColumnType;
};

type FilterConfig = {
  type: ColumnType;
  value: any;
};

const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value).replace(/"/g, '""'); // Escape double quotes for CSV
};

// Helper function to create CSV content
const createCSV = (data: DataItem[], columns: Column[]): string => {
  // Add ID column to the headers
  const headers = ['ID', ...columns.map(col => col.label)];
  
  // Create CSV rows with escaped values
  const rows = data.map((item, index) => {
    const id = index + 1;
    const values = [
      id.toString(),
      ...columns.map(col => formatCellValue(item[col.key]))
    ];
    return values.map(value => `"${value}"`).join(',');
  });
  
  // Combine headers and rows
  return [headers.map(header => `"${header}"`).join(','), ...rows].join('\n');
};

// Helper function to download CSV
const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const LeadsManagement = ({ leads }: { leads: any }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Record<string, FilterConfig>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Generate CSV content
      const csvContent = createCSV(filteredAndSortedLeads, columns);
      
      // Generate timestamp for filename
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `leads-export-${timestamp}.csv`;
      
      // Download the file
      downloadCSV(csvContent, fileName);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };



  // Enhanced column type detection with boolean columns sorted to the end
  const columns = useMemo(() => {
    if (leads.length === 0) return [];

    const columnEntries = Object.entries(leads[0]).map(([key, value]) => {
      let type: ColumnType = "text";

      if (typeof value === "number") {
        type = "number";
      } else if (typeof value === "boolean") {
        type = "boolean";
      } else if (value instanceof Date) {
        type = "date";
      } else if (typeof value === "string") {
        if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          type = "email";
        } else if (value.length > 50) {
          type = "longText";
        }
      }

      return {
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        type,
      };
    });

    // Sort columns so boolean types appear last
    return columnEntries.sort((a, b) => {
      if (a.type === "boolean" && b.type !== "boolean") return 1;
      if (a.type !== "boolean" && b.type === "boolean") return -1;
      return 0;
    });
  }, [leads]);

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Enhanced filtering for all types
    result = result.filter((item) => {
      return Object.entries(filters).every(([key, filter]) => {
        const value = item[key];

        switch (filter.type) {
          case "text":
          case "email":
          case "longText":
            return String(value)
              .toLowerCase()
              .includes(filter.value.toLowerCase());
          case "number":
            return value >= filter.value[0] && value <= filter.value[1];
          case "boolean":
            return value === filter.value;
          case "date":
            const itemDate = value instanceof Date ? value : new Date(value as string);
            const filterDate = new Date(filter.value);
            return itemDate.toDateString() === filterDate.toDateString();
          default:
            return true;
        }
      });
    });

    // Enhanced sorting for all types
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortConfig.direction === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        const comparison = String(aValue).localeCompare(String(bValue));
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [leads, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleFilter = (key: string, type: ColumnType) => {
    setFilters((current) => {
      const newFilters = { ...current };
      if (newFilters[key]) {
        delete newFilters[key];
      } else {
        newFilters[key] = {
          type,
          value:
            type === "number"
              ? [0, 100]
              : type === "boolean"
              ? true
              : type === "date"
              ? new Date()
              : "",
        };
      }
      return newFilters;
    });
  };

  const updateFilter = (key: string, value: any) => {
    setFilters((current) => ({
      ...current,
      [key]: {
        ...current[key],
        value,
      },
    }));
  };

  const renderFilterInput = (
    key: string,
    type: ColumnType,
    currentFilter: FilterConfig
  ) => {
    switch (type) {
      case "boolean":
        return (
          <div className="flex items-center justify-between">
            <span>Status</span>
            <Switch
              checked={currentFilter.value}
              onCheckedChange={(checked) => updateFilter(key, checked)}
            />
          </div>
        );
      case "date":
        return (
          <Calendar
            mode="single"
            selected={new Date(currentFilter.value)}
            onSelect={(date) => updateFilter(key, date)}
            className="rounded-md border"
          />
        );
      case "number":
        return (
          <div className="px-2">
            <Range
              values={currentFilter.value}
              step={1}
              min={0}
              max={100}
              onChange={(values) => updateFilter(key, values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="h-3 w-full rounded-full bg-gray-200"
                  style={{
                    background: getTrackBackground({
                      values: currentFilter.value,
                      colors: ["#e2e8f0", "#3b82f6", "#e2e8f0"],
                      min: 0,
                      max: 100,
                    }),
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="h-5 w-5 rounded-full bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            />
            <div className="text-sm text-gray-600 mt-1 text-center">
              {`${currentFilter.value[0]} - ${currentFilter.value[1]}`}
            </div>
          </div>
        );
      default:
        return (
          <Input
            placeholder={`Filter by ${key.toLowerCase()}...`}
            value={currentFilter.value}
            onChange={(e) => updateFilter(key, e.target.value)}
          />
        );
    }
  };

  const renderCell = (item: DataItem, key: string, type: ColumnType) => {
    const value = item[key];

    switch (type) {
      case "email":
        return (
          <a
            href={`mailto:${value}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Mail className="mr-2 h-4 w-4" />
            {String(value)}
          </a>
        );
      case "longText":
        return (
          <Button
            variant="ghost"
            onClick={() => alert(value)}
            className="p-0 px-2"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        );
      case "boolean":
        return value ? (
          <Check className="mr-1 h-5 w-5" />
        ) : (
          <X className="mr-1 h-5 w-5" />
        );
      case "date":
        return value instanceof Date
          ? value.toLocaleDateString()
          : new Date(value as string).toLocaleDateString();
      default:
        return String(value);
    }
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <>
    {loading ? (
      <>
        {leads.length > 0 ? (
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Leads Management</h1>
              <div className="flex gap-2">
                <Dialog
                  open={isFilterDialogOpen}
                  onOpenChange={setIsFilterDialogOpen}
                >
                  {/* ... (Dialog content remains the same) ... */}
                </Dialog>

                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Lead
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                  disabled={isExporting || filteredAndSortedLeads.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map(({ key, label }) => (
                        <TableHead key={key} className="whitespace-nowrap">
                          <Button
                            variant="ghost"
                            className="h-8 p-0 hover:bg-transparent"
                            onClick={() => handleSort(key)}
                          >
                            {label}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedLeads.map((item, index) => (
                      <TableRow key={index}>
                        {columns.map(({ key, type }) => (
                          <TableCell key={key}>
                            {renderCell(item, key, type)}
                          </TableCell>
                        ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8 w-full h-full items-center my-12">
              <h1 className="uppercase text-5xl font-bold">Want to start generating leads?</h1>
              <Image
                src="https://res.cloudinary.com/launchlist/image/upload/v1661111849/images/help/docs/wix-create-form.gif"
                alt="Form add tutorial"
                width={750}
                height={750}
                placeholder="blur"
                className="h-auto max-w-6xl mx-auto rounded-2xl shadow-lg"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <LoaderComponent />
        </>
      )}
    </>
  );
};

export default LeadsManagement