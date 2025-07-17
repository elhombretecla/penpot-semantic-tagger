// Interfaces for the tagging system
export interface TagData {
  tag: string;
  properties: Record<string, string>;
  elementId: string;
  elementName: string;
  elementType?: string;
  content?: string;
  imageUrl?: string;
  styles?: StylesData;
  layout?: LayoutData;
  children?: TagData[];
}

export interface StylesData {
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: string;
  width?: string;
  height?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  margin?: string;
  padding?: string;
}

export interface LayoutData {
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
}

export interface PluginMessage {
  type: string;
  data?: any;
}

export interface PositionData {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface ExportMetadata {
  pluginName: string;
  version: string;
  exportDate: string;
  fileName: string;
  pageName: string;
}

export interface ExportData {
  metadata: ExportMetadata;
  tree: any[];
}