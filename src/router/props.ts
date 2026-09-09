import type {
  Product,
  Order,
  OrderItem,
  OrderStatus,
  CustomerUser,
  CustomerTab,
  AdminTab,
  AppView,
  FullUser,
  AppNotification,
  Address,
  PaymentMethod,
} from "../types";
import type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "./types";

/**
 * Props for the top-level <AppRouter /> and, by extension, every sub-router.
 * State is owned by the useAppState hook; these props are read-only surface.
 */
export interface AppRouterProps {
  view: AppView;
  products: Product[];
  orders: Order[];
  cart: OrderItem[];
  customerUser: FullUser | null;
  isAdminLoggedIn: boolean;
  customerTab: CustomerTab;
  adminTab: AdminTab;
  isLoadingProducts: boolean;
  productsError: string | null;
  recentlyAddedId: string | null;
  lastConfirmedOrder: Order | null;
  pendingOrdersCount: number;
  totalCartCount: number;
  notifications: AppNotification[];
  updatingProfile: boolean;
  changingPassword: boolean;
  profileError: string | null;
  profileMessage: string | null;
  passwordError: string | null;
  passwordMessage: string | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (view: AppView) => void;
  onCustomerTabChange: (tab: CustomerTab) => void;
  onAdminTabChange: (tab: AdminTab) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveCartItem: (productId: string) => void;
  onPlaceOrder: (data: PlaceOrderData) => Promise<void>;
  onConfirmPhysicalSale: (data: PhysicalSaleData) => void;
  onConfirmRestock: (productId: string, quantityAdded: number) => void;
  onAddProduct: (data: NewProductData) => void;
  onUpdateProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCreateAccount: (user: CustomerUser) => void;
  onRegister: (user: CustomerUser) => void;
  onLogin: (user: CustomerUser) => void;
  onLandingLogin: (user: CustomerUser) => void;
  onContinueAsGuest: () => void;
  onStartShopping: () => void;
  onGoToLogin: () => void;
  onRetryProducts: () => void;
  onAdminLoginSuccess: () => void;
  onAdminLogout: () => void;
  onCustomerLogout: () => void;
  onOpenDashboard: () => void;
  onUpdateProfile: (data: { name?: string; phone?: string; email?: string }) => void;
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => void;
  onAddAddress: (data: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }) => void;
  onUpdateAddress: (id: string, data: Partial<Omit<Address, "_id">>) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  onAddPaymentMethod: (data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }) => void;
  onDeletePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
  onUpdateAppearance: (data: { theme?: "light" | "dark" | "system"; accentColor?: string }) => void;
  onUpdateNotificationPrefs: (data: { orderUpdates?: boolean; promotions?: boolean; sms?: boolean; email?: boolean }) => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
}