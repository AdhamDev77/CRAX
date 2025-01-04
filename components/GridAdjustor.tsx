import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  LayoutGrid, 
  Columns, 
  Rows, 
  Wand2 
} from 'lucide-react';

interface GridAdjustorProps {
  onChange: (gridConfig: GridConfig) => void;
  value?: GridConfig;
  maxColumns?: number;
  maxRows?: number;
}

interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  columnWidth?: string;
  rowHeight?: string;
  overflow?: 'auto' | 'hidden' | 'scroll';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
}

const GridAdjustor: React.FC<GridAdjustorProps> = ({ 
  onChange, 
  value, 
  maxColumns = 20, 
  maxRows = 20 
}) => {
  const [gridConfig, setGridConfig] = useState<GridConfig>(value || {
    columns: 2,
    rows: 2,
    gap: 16,
    columnWidth: 'auto',
    rowHeight: 'auto',
    overflow: 'auto',
    justifyContent: 'start',
    alignItems: 'stretch'
  });

  const updateGridConfig = useCallback((updates: Partial<GridConfig>) => {
    const newConfig = { ...gridConfig, ...updates };
    setGridConfig(newConfig);
    onChange(newConfig);
  }, [gridConfig, onChange]);

  const renderGridPreview = () => {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: gridConfig.columnWidth === 'auto' 
        ? `repeat(${gridConfig.columns}, 1fr)` 
        : `repeat(${gridConfig.columns}, ${gridConfig.columnWidth})`,
      gridTemplateRows: gridConfig.rowHeight === 'auto'
        ? `repeat(${gridConfig.rows}, 1fr)`
        : `repeat(${gridConfig.rows}, ${gridConfig.rowHeight})`,
      gap: `${gridConfig.gap}px`,
      overflow: gridConfig.overflow,
      justifyContent: gridConfig.justifyContent,
      alignItems: gridConfig.alignItems,
      maxHeight: '400px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px'
    };

    return (
      <div style={gridStyle}>
        {[...Array(gridConfig.columns * gridConfig.rows)].map((_, index) => (
          <div 
            key={index} 
            className={`
              bg-gray-200
              transition-all duration-300 
              hover:scale-105 
              flex items-center justify-center 
              text-gray-700 font-bold rounded-lg
              shadow-md cursor-pointer
            `}
            style={{
              minHeight: '80px',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            Item {index + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gray-100 hover:bg-gray-200">
          <LayoutGrid className="mr-2"/> Customize Grid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2 text-gray-600"/> Grid Layout Studio
          </DialogTitle>
          <DialogDescription>
            Create your perfect grid layout with precise controls
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="basic">
              <Columns className="mr-2"/> Basic
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Rows className="mr-2"/> Advanced
            </TabsTrigger>
          </TabsList>

          {/* Basic Configuration Tab */}
          <TabsContent value="basic">
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Columns</Label>
                <Slider
                  defaultValue={[gridConfig.columns]}
                  max={maxColumns}
                  min={1}
                  step={1}
                  onValueChange={(val) => updateGridConfig({ columns: val[0] })}
                  className="col-span-2"
                />
                <span className="text-gray-600 font-bold">{gridConfig.columns}</span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Rows</Label>
                <Slider
                  defaultValue={[gridConfig.rows]}
                  max={maxRows}
                  min={1}
                  step={1}
                  onValueChange={(val) => updateGridConfig({ rows: val[0] })}
                  className="col-span-2"
                />
                <span className="text-gray-600 font-bold">{gridConfig.rows}</span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Gap</Label>
                <Slider
                  defaultValue={[gridConfig.gap]}
                  max={50}
                  min={0}
                  step={2}
                  onValueChange={(val) => updateGridConfig({ gap: val[0] })}
                  className="col-span-2"
                />
                <span className="text-gray-500 font-bold">{gridConfig.gap}px</span>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Configuration Tab */}
          <TabsContent value="advanced">
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Column Width</Label>
                <Input
                  value={gridConfig.columnWidth}
                  onChange={(e) => updateGridConfig({ columnWidth: e.target.value })}
                  placeholder="auto or 100px"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Row Height</Label>
                <Input
                  value={gridConfig.rowHeight}
                  onChange={(e) => updateGridConfig({ rowHeight: e.target.value })}
                  placeholder="auto or 100px"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Overflow</Label>
                <Select 
                  onValueChange={(val) => updateGridConfig({ overflow: val as GridConfig['overflow'] })}
                  value={gridConfig.overflow}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Overflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="scroll">Scroll</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Justify Content</Label>
                <Select 
                  onValueChange={(val) => updateGridConfig({ justifyContent: val as GridConfig['justifyContent'] })}
                  value={gridConfig.justifyContent}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Justify Content" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Align Items</Label>
                <Select 
                  onValueChange={(val) => updateGridConfig({ alignItems: val as GridConfig['alignItems'] })}
                  value={gridConfig.alignItems}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Align Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dynamic Grid Preview */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold flex items-center">
            <LayoutGrid className="mr-2 text-gray-600"/> Grid Preview
          </h4>
          {renderGridPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GridAdjustor;