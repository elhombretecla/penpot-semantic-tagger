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
  // Dimensions and positioning
  width?: string;
  height?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: string;
  
  // Colors and backgrounds
  backgroundColor?: string;
  backgroundImage?: string;
  background?: string;
  color?: string;
  
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  textTransform?: string;
  direction?: string;
  
  // Text behavior and layout
  whiteSpace?: string;
  overflowWrap?: string;
  webkitBackgroundClip?: string;
  webkitTextFillColor?: string;
  backgroundClip?: string;
  
  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  
  // Flexbox and layout
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  alignSelf?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  
  // Borders and effects
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  boxSizing?: string;
  
  // Transform and visual effects
  transform?: string;
  opacity?: string;
  visibility?: string;
  overflow?: string;
  filter?: string;
  mixBlendMode?: string;
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