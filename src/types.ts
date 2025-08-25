export interface IconProps {
  /**
   * Icon size (width and height)
   * @default 24
   */
  size?: number | string
  
  /**
   * Icon color
   * @default 'currentColor'
   */
  color?: string
  
  /**
   * Additional CSS class names
   */
  className?: string
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties | Record<string, any> | string
  
  /**
   * Additional SVG attributes
   */
  [key: string]: any
}

export interface IconComponent {
  (props: IconProps): any
  displayName?: string
}

export interface IconData {
  name: string
  content: string
  viewBox?: string
  width?: number
  height?: number
}

export type IconRegistry = Record<string, IconData>
