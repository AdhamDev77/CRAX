import { X } from "lucide-react";
import { Input } from "./ui/input";
import React, { useState, useEffect } from "react";

interface SpacingValue {
  top: number;
  right: number;
  bottom: number;
  left: number;
  all: number;
}

interface SpacingValues {
  padding: SpacingValue;
  margin: SpacingValue;
}

interface SpacingAdjustorProps {
  value: {
    padding: string;
    margin: string;
  };
  onChange: (value: { padding: string; margin: string }) => void;
  unit?: "px" | "%";
}

const SpacingAdjustor = ({
  value = {
    padding: "0px 0px 0px 0px",
    margin: "0px 0px 0px 0px",
  },
  onChange,
  unit = "px",
}: SpacingAdjustorProps) => {
  const [activeConfig, setActiveConfig] = useState<{
    side: "top" | "right" | "bottom" | "left" | "all" | null;
    type: "padding" | "margin" | null;
  }>({ side: null, type: null });

  const [spacingValues, setSpacingValues] = useState<SpacingValues>({
    padding: { top: 0, right: 0, bottom: 0, left: 0, all: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0, all: 0 },
  });

  useEffect(() => {
    const parseSpacingString = (str: string) => {
      const values = str.split(" ").map((v) => parseInt(v));
      return {
        top: values[0] || 0,
        right: values[1] || 0,
        bottom: values[2] || 0,
        left: values[3] || 0,
        all: values.every((v) => v === values[0]) ? values[0] : 0,
      };
    };

    setSpacingValues({
      padding: parseSpacingString(value.padding),
      margin: parseSpacingString(value.margin),
    });
  }, [value.padding, value.margin]);

  const handleInputChange = (
    type: "padding" | "margin",
    side: keyof SpacingValue,
    newValue: string
  ) => {
    const numValue = parseInt(newValue) || 0;
    let newSpacingValues = { ...spacingValues };

    if (side === "all") {
      newSpacingValues[type] = {
        top: numValue,
        right: numValue,
        bottom: numValue,
        left: numValue,
        all: numValue,
      };
    } else {
      newSpacingValues[type] = {
        ...newSpacingValues[type],
        [side]: numValue,
        all: 0,
      };
    }

    setSpacingValues(newSpacingValues);

    const cssValue = (values: SpacingValue) =>
      `${values.top}${unit} ${values.right}${unit} ${values.bottom}${unit} ${values.left}${unit}`;

    onChange({
      padding: cssValue(newSpacingValues.padding),
      margin: cssValue(newSpacingValues.margin),
    });
  };

  const getSideValue = (
    type: "padding" | "margin",
    side: keyof SpacingValue
  ) => {
    return spacingValues[type][side] || 0;
  };

  const getPositionClasses = (side: string, type: "padding" | "margin") => {
    const positions = {
      padding: {
        top: "top-2 left-1/2 -translate-x-1/2",
        right: "right-2 top-1/2 -translate-y-1/2",
        bottom: "bottom-2 left-1/2 -translate-x-1/2",
        left: "left-2 top-1/2 -translate-y-1/2",
      },
      margin: {
        top: "top-2 left-1/2 -translate-x-1/2",
        right: "right-2 top-1/2 -translate-y-1/2",
        bottom: "bottom-2 left-1/2 -translate-x-1/2",
        left: "left-2 top-1/2 -translate-y-1/2",
      },
    };

    return `absolute rounded-full ${positions[type][side]}`;
  };

  const SpacingBox = ({ type }: { type: "padding" | "margin" }) => (
    <div
      className={`
        w-full h-full rounded-lg relative
        ${type === "padding" ? "bg-blue-100" : "bg-purple-100"}
      `}
    >
      <div
        className={`absolute ${
          type === "padding"
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : "top-2 left-2"
        } text-xs font-medium capitalize ${
          type === "padding" ? "text-blue-600" : "text-purple-600"
        }`}
      >
        {type}
      </div>
      {["top", "right", "bottom", "left"].map((side) => (
        <button
          type="button"
          key={`${type}-${side}`}
          className={getPositionClasses(side, type)}
          onClick={() =>
            setActiveConfig({
              side: side as keyof SpacingValue,
              type: type,
            })
          }
        >
          <div
            className={`
              px-2 py-1 rounded-full text-xs font-medium transition-colors
              ${
                type === "padding"
                  ? "bg-blue-200 text-blue-700 hover:bg-blue-200"
                  : "bg-purple-200 text-purple-700 hover:bg-purple-200"
              }
            `}
          >
            {getSideValue(type, side as keyof SpacingValue)}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <h2 className="text-sm font-semibold text-gray-700">Spacing Adjustor</h2>

      <div className="aspect-square relative">
        <div className="absolute inset-2">
          {/* Margin Box */}
          <div className="w-full h-full">
            <SpacingBox type="margin" />
            {/* Padding Box */}
            <div className="absolute inset-10">
              <SpacingBox type="padding" />
            </div>
          </div>
        </div>

        {activeConfig.side &&
          activeConfig.side !== "all" &&
          activeConfig.type && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 z-50">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setActiveConfig({ side: null, type: null })}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <h3
                  className={`text-[12px] font-semibold ${
                    activeConfig.type === "padding"
                      ? "text-blue-600"
                      : "text-purple-600"
                  }`}
                >
                  {activeConfig.type} ({activeConfig.side})
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={getSideValue(activeConfig.type, activeConfig.side)}
                    onChange={(e) =>
                      handleInputChange(
                        activeConfig.type,
                        activeConfig.side,
                        e.target.value
                      )
                    }
                    className={`w-20 text-center ${
                      activeConfig.type === "padding"
                        ? "bg-blue-50 border-blue-200 focus:ring-blue-500"
                        : "bg-purple-50 border-purple-200 focus:ring-purple-500"
                    } border rounded-md focus:outline-none focus:ring-2 py-1`}
                    min="0"
                  />
                  <span className="text-gray-500">{unit}</span>
                </div>
              </div>
            </div>
          )}
      </div>
      <div className="flex gap-2 justify-center items-center w-full">
        <div className="space-y-1 w-1/2">
          <label className="block text-xs font-medium text-blue-600">
            All Padding
          </label>
          <Input
            type="number"
            value={getSideValue("padding", "all")}
            onChange={(e) =>
              handleInputChange("padding", "all", e.target.value)
            }
            className="w-full text-center bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 py-1"
            min="0"
          />
        </div>
        <div className="space-y-1 w-1/2">
          <label className="block text-xs font-medium text-purple-600">
            All Margin
          </label>
          <Input
            type="number"
            value={getSideValue("margin", "all")}
            onChange={(e) => handleInputChange("margin", "all", e.target.value)}
            className="w-full text-center bg-purple-50 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 py-1"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default SpacingAdjustor;
