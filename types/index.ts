export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  SERVED = "SERVED",
  CANCELLED = "CANCELLED"
}

export enum CallType {
  WAITER = "WAITER",
  BILL = "BILL"
}

export enum StaffRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF"
}

// ===== Core Data Models =====

export interface Restaurant {
  id: string;
  name: string;
  tagline: string | null;
  logoUrl: string | null;
  address: string | null;
  phone: string | null;
  createdAt: Date;
}

export interface Table {
  id: string;
  restaurantId: string;
  tableNumber: number;
  label: string | null;
  qrCodeUrl: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface TableSession {
  id: string;
  tableId: string;
  startedAt: Date;
  endedAt: Date | null;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  emoji: string | null;
  sortOrder: number;
  isVisible: boolean;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  isBestseller: boolean;
  isSpicy: boolean;
  sortOrder: number;
  category?: Category;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  sessionId: string;
  orderNumber: number;
  status: OrderStatus;
  specialRequest: string | null;
  createdAt: Date;
  updatedAt: Date;
  table?: Table;
  items?: OrderItemWithMenuItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  note: string | null;
}

export interface OrderItemWithMenuItem extends OrderItem {
  menuItem: MenuItem;
}

export interface WaiterCall {
  id: string;
  tableId: string;
  type: CallType;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt: Date | null;
  table?: Table;
}

export interface Review {
  id: string;
  restaurantId: string;
  tableId: string;
  sessionId: string;
  rating: number;
  comment: string | null;
  isVisible: boolean;
  createdAt: Date;
}

export interface StaffUser {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: Date;
}

// ===== Cart Types =====

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note: string;
  imageUrl: string | null;
  isVeg: boolean;
}

export interface CartState {
  items: CartItem[];
  tableId: string | null;
  sessionId: string | null;
}

// ===== API Request/Response Types =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
  };
}

export interface PlaceOrderRequest {
  tableId: string;
  sessionId: string;
  items: {
    menuItemId: string;
    quantity: number;
    note?: string;
  }[];
  specialRequest?: string;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  isVeg?: boolean;
  isAvailable?: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  imageUrl?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CreateReviewRequest {
  restaurantId: string;
  tableId: string;
  sessionId: string;
  rating: number;
  comment?: string;
}

export interface WaiterCallRequest {
  tableId: string;
  type: CallType;
}

export interface DailyReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface PopularItem {
  menuItemId: string;
  name: string;
  count: number;
  revenue: number;
}

// ===== Auth Types =====

export interface JWTPayload {
  userId: string;
  role: StaffRole;
  restaurantId: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  restaurantId: string;
}

// ===== Component Prop Types =====

export interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export interface QRCodeDisplayProps {
  tableId: string;
  tableNumber: number;
  downloadUrl: string;
}

export interface ReviewCardProps {
  review: Review;
  onToggleVisibility: (reviewId: string, isVisible: boolean) => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}
