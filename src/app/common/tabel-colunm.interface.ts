export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'picture' | 'button' | 'checkbox';
  visible?: boolean;
  cssClasses?: string[];
}
