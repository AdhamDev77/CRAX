import { CSSProperties } from "react";

// Helper function to convert pixel values to fluid values using min and max
const toFluidValue = (pixels: number, minScale: number = 0.5): string => {
  // Only start scaling below 1200px (typical laptop/desktop breakpoint)
  // Base calculation on 1200px as the reference point where scaling begins
  const breakpoint = 1200;
  const vwValue = (pixels / breakpoint) * 100;
  const minValue = Math.round(pixels * minScale);
  const maxValue = pixels;

  // This ensures:
  // 1. Above 1200px: stays at original size (maxValue)
  // 2. Between 1200px and minimum: scales fluidly
  // 3. Below minimum width: stays at minValue
  return `max(${minValue}px, min(${vwValue}vw, ${maxValue}px))`;
};

// Helper function to calculate fluid spacing values
export const getResponsiveSpacing = (value: string): string => {
  const match = value.match(/^(\d+)(px|rem|em|%)$/);
  if (!match) return value;

  const [_, amount, unit] = match;
  const numericValue = parseInt(amount, 10);

  // Adjusted minimum scales for desktop-first approach
  let minScale = 0.5; // default minimum scale
  if (numericValue > 100) minScale = 0.4;
  else if (numericValue > 60) minScale = 0.45;
  else if (numericValue > 40) minScale = 0.5;
  else if (numericValue > 20) minScale = 0.6;
  else minScale = 0.7;

  // Convert px values to fluid values
  if (unit === "px") {
    return toFluidValue(numericValue, minScale);
  }

  // For other units, maintain the original value
  return value;
};

// Rest of the utility functions remain the same
export const parseSpacing = (
  spacingStr: string
): { top: string; right: string; bottom: string; left: string } => {
  const values = spacingStr.split(" ").map((val) => val.trim());
  return {
    top: values[0],
    right: values[1] || values[0],
    bottom: values[2] || values[0],
    left: values[3] || values[1] || values[0],
  };
};

export const getResponsiveGap = (gap: string): string => {
  const match = gap.match(/^(\d+)(px|rem|em|%)$/);
  if (!match) return gap;

  const [_, amount, unit] = match;
  const numericValue = parseInt(amount, 10);

  if (unit === "px") {
    // Use a more conservative scale for gaps to maintain layout integrity
    const minScale = 0.6;
    return toFluidValue(numericValue, minScale);
  }

  return gap;
};

export const getResponsiveSpacingStyles = (
  padding: string,
  margin: string
): CSSProperties => {
  const paddingValues = parseSpacing(padding);
  const marginValues = parseSpacing(margin);

  const fluidPadding = `${getResponsiveSpacing(
    paddingValues.top
  )} ${getResponsiveSpacing(paddingValues.right)} ${getResponsiveSpacing(
    paddingValues.bottom
  )} ${getResponsiveSpacing(paddingValues.left)}`;
  const fluidMargin = `${getResponsiveSpacing(
    marginValues.top
  )} ${getResponsiveSpacing(marginValues.right)} ${getResponsiveSpacing(
    marginValues.bottom
  )} ${getResponsiveSpacing(marginValues.left)}`;

  return {
    padding: fluidPadding,
    margin: fluidMargin,
  } as CSSProperties;
};

export const getResponsiveFontSize = (
  fontSize: number,
  minScale: number = 0.75
): string => {
  return toFluidValue(fontSize, minScale);
};

export const getResponsiveLineHeight = (
  lineHeight: number,
  minScale: number = 0.75
): string => {
  return toFluidValue(lineHeight, minScale);
};

export const getResponsiveTypographyStyles = (
  fontSize: number,
  lineHeight: number,
  minScale: number = 0.75
): CSSProperties => {
  return {
    fontSize: getResponsiveFontSize(fontSize, minScale),
    lineHeight: getResponsiveLineHeight(lineHeight, minScale),
  } as CSSProperties;
};

export const getFluidStyles = (
  originalWidth: number,
  originalHeight: number,
  padding: string,
  margin: string
): CSSProperties => {
  const spacingStyles = getResponsiveSpacingStyles(padding, margin);

  return {
    ...spacingStyles,
    width: toFluidValue(originalWidth),
    height: toFluidValue(originalHeight),
  };
};