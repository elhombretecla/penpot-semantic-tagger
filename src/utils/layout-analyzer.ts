import { LayoutData, PositionData } from '../types';
import { ALIGNMENT_THRESHOLD, SPACING_THRESHOLD } from '../core/constants';

/**
 * Analyze layout properties of a group/frame (legacy version)
 */
export function analyzeLayout(element: any): LayoutData {
  const layout: LayoutData = {};

  try {
    // Check if element has children
    if (!element?.children || !Array.isArray(element.children) || element.children.length === 0) {
      return layout;
    }

    const children = element.children;
    
    // Analyze children positioning to infer layout
    if (children.length > 1) {
      // Check if children are arranged horizontally or vertically
      const positions = children
        .filter((child: any) => child && typeof child.x === 'number' && typeof child.y === 'number' && typeof child.width === 'number' && typeof child.height === 'number')
        .map((child: any) => ({ 
          x: child.x, 
          y: child.y, 
          width: child.width, 
          height: child.height 
        }));
      
      if (positions.length < 2) {
        return layout;
      }
      
      // Sort by position to analyze arrangement
      const sortedByX = [...positions].sort((a, b) => a.x - b.x);
      const sortedByY = [...positions].sort((a, b) => a.y - b.y);
      
      // Check for horizontal arrangement (similar Y positions)
      const yValues = positions.map((p: any) => p.y);
      const xValues = positions.map((p: any) => p.x);
      const yVariance = Math.max(...yValues) - Math.min(...yValues);
      const xVariance = Math.max(...xValues) - Math.min(...xValues);
      
      if (yVariance < 20 && xVariance > 50) {
        // Likely horizontal arrangement
        layout.display = "flex";
        layout.flexDirection = "row";
        
        // Analyze spacing
        if (sortedByX.length > 1) {
          const gaps = [];
          for (let i = 1; i < sortedByX.length; i++) {
            const gap = sortedByX[i].x - (sortedByX[i-1].x + sortedByX[i-1].width);
            if (gap > 0) gaps.push(gap);
          }
          if (gaps.length > 0) {
            const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
            layout.gap = `${Math.round(avgGap)}px`;
          }
        }
        
      } else if (xVariance < 20 && yVariance > 50) {
        // Likely vertical arrangement
        layout.display = "flex";
        layout.flexDirection = "column";
        
        // Analyze spacing
        if (sortedByY.length > 1) {
          const gaps = [];
          for (let i = 1; i < sortedByY.length; i++) {
            const gap = sortedByY[i].y - (sortedByY[i-1].y + sortedByY[i-1].height);
            if (gap > 0) gaps.push(gap);
          }
          if (gaps.length > 0) {
            const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
            layout.gap = `${Math.round(avgGap)}px`;
          }
        }
      }
      
      // Analyze alignment
      if (layout.display === "flex" && positions.length > 0) {
        // Check horizontal alignment for vertical layouts
        if (layout.flexDirection === "column") {
          const leftAligned = positions.every((p: any) => Math.abs(p.x - positions[0].x) < 10);
          const centerAligned = positions.every((p: any) => Math.abs((p.x + p.width/2) - (positions[0].x + positions[0].width/2)) < 10);
          
          if (leftAligned) layout.alignItems = "flex-start";
          else if (centerAligned) layout.alignItems = "center";
          else layout.alignItems = "flex-start";
        }
        
        // Check vertical alignment for horizontal layouts
        if (layout.flexDirection === "row") {
          const topAligned = positions.every((p: any) => Math.abs(p.y - positions[0].y) < 10);
          const centerAligned = positions.every((p: any) => Math.abs((p.y + p.height/2) - (positions[0].y + positions[0].height/2)) < 10);
          
          if (topAligned) layout.alignItems = "flex-start";
          else if (centerAligned) layout.alignItems = "center";
          else layout.alignItems = "flex-start";
        }
      }
    }
  } catch (error) {
    console.warn("Error analyzing layout:", error);
  }

  return layout;
}

/**
 * Analyze layout properties by examining children positioning and arrangement
 * @param shape Penpot shape object
 * @returns Layout object with flex properties if layout is detected
 */
export function analyzeLayoutProperties(shape: any): Record<string, string> {
  const layout: Record<string, string> = {};

  try {
    // Only analyze layout for elements with children
    if (!shape?.children || !Array.isArray(shape.children) || shape.children.length < 2) {
      return layout;
    }

    const children = shape.children.filter((child: any) => 
      child && 
      typeof child.x === 'number' && 
      typeof child.y === 'number' && 
      typeof child.width === 'number' && 
      typeof child.height === 'number'
    );

    if (children.length < 2) return layout;

    // Calculate positions and dimensions
    const positions: PositionData[] = children.map((child: any) => ({
      x: child.x,
      y: child.y,
      width: child.width,
      height: child.height,
      centerX: child.x + child.width / 2,
      centerY: child.y + child.height / 2
    }));

    // Sort positions for analysis
    const sortedByX = [...positions].sort((a, b) => a.x - b.x);
    const sortedByY = [...positions].sort((a, b) => a.y - b.y);

    // Calculate variance in positions
    const yPositions = positions.map((p: PositionData) => p.y);
    const xPositions = positions.map((p: PositionData) => p.x);
    const yVariance = Math.max(...yPositions) - Math.min(...yPositions);
    const xVariance = Math.max(...xPositions) - Math.min(...xPositions);

    if (yVariance < ALIGNMENT_THRESHOLD && xVariance > SPACING_THRESHOLD) {
      // Horizontal layout detected
      layout.display = "flex";
      layout.flexDirection = "row";

      // Calculate gaps between elements
      const gaps: number[] = [];
      for (let i = 1; i < sortedByX.length; i++) {
        const gap = sortedByX[i].x - (sortedByX[i-1].x + sortedByX[i-1].width);
        if (gap >= 0) gaps.push(gap);
      }

      if (gaps.length > 0) {
        const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
        if (avgGap > 0) {
          layout.gap = `${Math.round(avgGap)}px`;
        }
      }

      // Determine horizontal justification
      const containerWidth = shape.width || 0;
      const totalChildrenWidth = positions.reduce((sum: number, pos: PositionData) => sum + pos.width, 0);
      const totalGaps = gaps.reduce((sum: number, gap: number) => sum + gap, 0);
      const remainingSpace = containerWidth - totalChildrenWidth - totalGaps;

      if (remainingSpace > 20) {
        // Check if elements are distributed
        const firstX = sortedByX[0].x;
        const lastX = sortedByX[sortedByX.length - 1].x + sortedByX[sortedByX.length - 1].width;
        const usedWidth = lastX - firstX;
        
        if (usedWidth > containerWidth * 0.8) {
          layout.justifyContent = "space-between";
        } else if (firstX > containerWidth * 0.1) {
          layout.justifyContent = "center";
        }
      }

      // Determine vertical alignment
      const centerYs = positions.map((p: PositionData) => p.centerY);
      const centerYVariance = Math.max(...centerYs) - Math.min(...centerYs);
      
      if (centerYVariance < ALIGNMENT_THRESHOLD) {
        layout.alignItems = "center";
      } else {
        const topYs = positions.map((p: PositionData) => p.y);
        const topYVariance = Math.max(...topYs) - Math.min(...topYs);
        if (topYVariance < ALIGNMENT_THRESHOLD) {
          layout.alignItems = "flex-start";
        }
      }

    } else if (xVariance < ALIGNMENT_THRESHOLD && yVariance > SPACING_THRESHOLD) {
      // Vertical layout detected
      layout.display = "flex";
      layout.flexDirection = "column";

      // Calculate gaps between elements
      const gaps: number[] = [];
      for (let i = 1; i < sortedByY.length; i++) {
        const gap = sortedByY[i].y - (sortedByY[i-1].y + sortedByY[i-1].height);
        if (gap >= 0) gaps.push(gap);
      }

      if (gaps.length > 0) {
        const avgGap = gaps.reduce((sum: number, gap: number) => sum + gap, 0) / gaps.length;
        if (avgGap > 0) {
          layout.gap = `${Math.round(avgGap)}px`;
        }
      }

      // Determine horizontal alignment
      const centerXs = positions.map((p: PositionData) => p.centerX);
      const centerXVariance = Math.max(...centerXs) - Math.min(...centerXs);
      
      if (centerXVariance < ALIGNMENT_THRESHOLD) {
        layout.alignItems = "center";
      } else {
        const leftXs = positions.map((p: PositionData) => p.x);
        const leftXVariance = Math.max(...leftXs) - Math.min(...leftXs);
        if (leftXVariance < ALIGNMENT_THRESHOLD) {
          layout.alignItems = "flex-start";
        }
      }

      // Determine vertical justification
      const containerHeight = shape.height || 0;
      const totalChildrenHeight = positions.reduce((sum: number, pos: PositionData) => sum + pos.height, 0);
      const totalGaps = gaps.reduce((sum: number, gap: number) => sum + gap, 0);
      const remainingSpace = containerHeight - totalChildrenHeight - totalGaps;

      if (remainingSpace > 20) {
        const firstY = sortedByY[0].y;
        const lastY = sortedByY[sortedByY.length - 1].y + sortedByY[sortedByY.length - 1].height;
        const usedHeight = lastY - firstY;
        
        if (usedHeight > containerHeight * 0.8) {
          layout.justifyContent = "space-between";
        } else if (firstY > containerHeight * 0.1) {
          layout.justifyContent = "center";
        }
      }
    }

  } catch (error) {
    console.warn("Error analyzing layout properties:", error);
  }

  return layout;
}