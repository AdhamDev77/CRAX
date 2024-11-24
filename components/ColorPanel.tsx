import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Palette } from "lucide-react";
import ColorPickerComponent from "./ColorPicker";

const ColorPanel = ({ name, value = "#ffffff", onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("solid");
  const [selectedColor, setSelectedColor] = useState(value);
  const [tempColor, setTempColor] = useState(value);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGradientCustomizer, setShowGradientCustomizer] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [recentGradients, setRecentGradients] = useState([]);
  const [customGradient, setCustomGradient] = useState({
    colors: ["#6366f1", "#a855f7"],
    angle: "90deg",
  });
  const [tempGradient, setTempGradient] = useState({
    colors: ["#6366f1", "#a855f7"],
    angle: "90deg",
  });

  const suggestedColors = [
    // Grays
    { name: "slate", color: "#64748b" },
    { name: "gray", color: "#6b7280" },
    { name: "zinc", color: "#71717a" },
    { name: "stone", color: "#78716c" },
    // Reds
    { name: "red", color: "#ef4444" },
    { name: "rose", color: "#f43f5e" },
    { name: "pink", color: "#ec4899" },
    { name: "fuchsia", color: "#d946ef" },
    // Oranges & Yellows
    { name: "orange", color: "#f97316" },
    { name: "amber", color: "#f59e0b" },
    { name: "yellow", color: "#eab308" },
    { name: "lime", color: "#84cc16" },
    // Greens
    { name: "green", color: "#22c55e" },
    { name: "emerald", color: "#10b981" },
    { name: "teal", color: "#14b8a6" },
    { name: "cyan", color: "#06b6d4" },
    // Blues & Purples
    { name: "sky", color: "#0ea5e9" },
    { name: "blue", color: "#3b82f6" },
    { name: "indigo", color: "#6366f1" },
    { name: "violet", color: "#8b5cf6" },
    { name: "purple", color: "#a855f7" },
    { name: "blue-gray", color: "#64748b" },
    { name: "cool-gray", color: "#4b5563" },
    { name: "true-gray", color: "#525252" },
  ];

  const gradientSuggestions = [
    {
      value: "linear-gradient(90deg, #6366f1, #a855f7)",
      name: "Indigo to Purple",
    },
    {
      value: "linear-gradient(90deg, #3b82f6, #10b981)",
      name: "Blue to Emerald",
    },
    {
      value: "linear-gradient(45deg, #f59e0b, #ef4444)",
      name: "Amber to Red",
    },
    {
      value: "linear-gradient(90deg, #ec4899, #6366f1)",
      name: "Pink to Indigo",
    },
    {
      value: "linear-gradient(45deg, #10b981, #3b82f6)",
      name: "Emerald to Blue",
    },
    {
      value: "linear-gradient(90deg, #64748b, #1e293b)",
      name: "Slate to Dark",
    },
    {
      value: "linear-gradient(45deg, #f43f5e, #f97316)",
      name: "Rose to Orange",
    },
    {
      value: "linear-gradient(90deg, #8b5cf6, #d946ef)",
      name: "Violet to Fuchsia",
    },
    {
      value: "linear-gradient(45deg, #06b6d4, #0ea5e9)",
      name: "Cyan to Sky",
    },
    {
      value: "linear-gradient(90deg, #84cc16, #22c55e)",
      name: "Lime to Green",
    },
    {
      value: "linear-gradient(45deg, #14b8a6, #0ea5e9)",
      name: "Teal to Sky",
    },
    {
      value: "linear-gradient(90deg, #6366f1, #ec4899)",
      name: "Indigo to Pink",
    },
  ];

  const gradientDirections = [
    { angle: "90deg", preview: true },
    { angle: "270deg", preview: true },
    { angle: "0deg", preview: true },
    { angle: "180deg", preview: true },
    { angle: "45deg", preview: true },
    { angle: "135deg", preview: true },
    { angle: "225deg", preview: true },
    { angle: "315deg", preview: true },
  ];

  useEffect(() => {
    try {
      const savedColors = localStorage.getItem("recentColors");
      const savedGradients = localStorage.getItem("recentGradients");
      if (savedColors) {
        const colors = JSON.parse(savedColors);
        setRecentColors(colors);
        if (colors.length > 0) setSelectedColor(colors[0]);
      }
      if (savedGradients) {
        const gradients = JSON.parse(savedGradients);
        setRecentGradients(gradients);
        if (gradients.length > 0) {
          const lastGradient = gradients[0];
          if (!selectedColor.includes("linear-gradient")) {
            setSelectedColor(lastGradient);
          }
          const match = lastGradient.match(
            /linear-gradient\((\d+)deg,\s*([^)]+)\)/
          );
          if (match) {
            const [, angle, colorString] = match;
            const colors = colorString.split(",").map((c) => c.trim());
            setCustomGradient({ angle: `${angle}deg`, colors });
            setTempGradient({ angle: `${angle}deg`, colors });
          }
        }
      }
    } catch (error) {
      console.error("Error loading recent colors:", error);
    }
  }, []);

  const handleSheetChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setShowGradientCustomizer(false);
      setShowColorPicker(false);
    }
  };

  const addToRecents = (color) => {
    if (color.includes("linear-gradient")) {
      if (!recentGradients.includes(color)) {
        const newGradients = [color, ...recentGradients.slice(0, 5)];
        setRecentGradients(newGradients);
        localStorage.setItem("recentGradients", JSON.stringify(newGradients));
      }
    } else {
      if (!recentColors.includes(color)) {
        const newColors = [color, ...recentColors.slice(0, 23)];
        setRecentColors(newColors);
        localStorage.setItem("recentColors", JSON.stringify(newColors));
      }
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    addToRecents(color);
    onChange?.(color);
  };

  const handleColorPickerOpen = () => {
    setTempColor(selectedColor);
    setShowColorPicker(true);
  };

  const handleColorPickerConfirm = () => {
    handleColorSelect(tempColor);
    setSelectedColor(tempColor);
    setShowColorPicker(false);
  };

  const handleGradientCustomizerOpen = () => {
    if (selectedColor.includes("linear-gradient")) {
      const match = selectedColor.match(
        /linear-gradient\((\d+)deg,\s*([^)]+)\)/
      );
      if (match) {
        const [, angle, colorString] = match;
        const colors = colorString.split(",").map((c) => c.trim());
        setTempGradient({ angle: `${angle}deg`, colors });
      }
    }
    setShowGradientCustomizer(true);
  };

  const handleGradientConfirm = () => {
    const gradientValue = `linear-gradient(${
      tempGradient.angle
    }, ${tempGradient.colors.join(", ")})`;
    handleColorSelect(gradientValue);
    setSelectedColor(gradientValue);
    setShowGradientCustomizer(false);
  };

  const GradientCustomizer = () => (
    <Dialog
      open={showGradientCustomizer}
      onOpenChange={setShowGradientCustomizer}
    >
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">

        <div className="space-y-4">
          <div className="space-y-2">
          <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Custom Gradient</DialogTitle>
        </DialogHeader>
            <div
              className="h-24 rounded-lg transition-all"
              style={{
                background: `linear-gradient(${
                  tempGradient.angle
                }, ${tempGradient.colors.join(", ")})`,
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Colors</h4>
              <div className="grid gap-3">
                {tempGradient.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <ColorPickerComponent
                        value={color}
                        onChange={(newColor) => {
                          const newColors = [...tempGradient.colors];
                          newColors[index] = newColor;
                          setTempGradient({
                            ...tempGradient,
                            colors: newColors,
                          });
                        }}
                        name={`Gradient Color ${index + 1}`}
                      />
                    </div>
                    {tempGradient.colors.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        onClick={() => {
                          const newColors = tempGradient.colors.filter(
                            (_, i) => i !== index
                          );
                          setTempGradient({
                            ...tempGradient,
                            colors: newColors,
                          });
                        }}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {tempGradient.colors.length < 3 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const newColors = [...tempGradient.colors, "#ffffff"];
                      setTempGradient({ ...tempGradient, colors: newColors });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Color
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Direction</h4>
              <div className="grid grid-cols-4 gap-2">
                {gradientDirections.map(({ angle }) => (
                  <button
                    key={angle}
                    className={`relative w-full aspect-square rounded-lg transition-all ${
                      tempGradient.angle === angle
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : "hover:ring-2 hover:ring-offset-2 hover:ring-blue-500"
                    }`}
                    style={{
                      background: `linear-gradient(${angle}, ${tempGradient.colors.join(
                        ", "
                      )})`,
                    }}
                    onClick={() => setTempGradient({ ...tempGradient, angle })}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGradientConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const SelectionEffect = ({ isSelected }) =>
    isSelected && (
      <div className="absolute inset-0 ring-2 ring-green-500 ring-offset-2 rounded-lg pointer-events-none" />
    );

    const displayName =
    name === "bgColor"
      ? "Background Color"
      : name === "fontColor"
      ? "Font Color"
      : name;

  return (
    <>
    <h1 className="text-sm mb-2 font-semibold flex gap-2 items-center"><Palette className="w-4 h-4" /> {displayName}</h1>
      <Sheet open={isOpen} onOpenChange={handleSheetChange}>
        <SheetTrigger asChild>
          <button
            className="w-full h-10 rounded-lg border transition-all"
            style={{ background: value }}
          />
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <Tabs
            defaultValue="solid"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="solid" className="w-full">
                Solid
              </TabsTrigger>
              <TabsTrigger value="gradient" className="w-full">
                Gradient
              </TabsTrigger>
            </TabsList>

            <TabsContent value="solid" className="space-y-4">
              <div className="grid grid-cols-8 gap-1.5">
                {suggestedColors.map(({ name, color }) => (
                  <button
                    key={name}
                    className="relative w-full aspect-square rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"
                    style={{ background: color }}
                    onClick={() => handleColorSelect(color)}
                  >
                    <SelectionEffect isSelected={selectedColor === color} />
                  </button>
                ))}
              </div>

              {recentColors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent</h3>
                  <div className="grid grid-cols-8 gap-1">
                    {recentColors.map((color, index) => (
                      <button
                        key={index}
                        className="relative w-full aspect-square rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"
                        style={{ background: color }}
                        onClick={() => handleColorSelect(color)}
                      >
                        <SelectionEffect isSelected={selectedColor === color} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!showColorPicker ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleColorPickerOpen}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Custom Color
                </Button>
              ) : (
                <div className="space-y-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleColorPickerConfirm}
                  >
                    Confirm
                  </Button>
                  <ColorPickerComponent
                    value={tempColor}
                    onChange={setTempColor}
                    name={name}
                    forColorPanel={true}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="gradient" className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {gradientSuggestions.map(({ value: gradientValue, name }) => (
                  <button
                    key={name}
                    className="relative w-full aspect-square rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"
                    style={{ background: gradientValue }}
                    onClick={() => handleColorSelect(gradientValue)}
                  >
                    <SelectionEffect
                      isSelected={selectedColor === gradientValue}
                    />
                  </button>
                ))}
              </div>

              {recentGradients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {recentGradients.map((gradient, index) => (
                      <button
                        key={index}
                        className="relative w-full aspect-square rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all"
                        style={{ background: gradient }}
                        onClick={() => handleColorSelect(gradient)}
                      >
                        <SelectionEffect
                          isSelected={selectedColor === gradient}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGradientCustomizerOpen}
              >
                <Plus className="w-4 h-4 mr-2" />
                Custom Gradient
              </Button>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <GradientCustomizer />
    </>
  );
};

export default ColorPanel;
