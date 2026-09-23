import { useState, useEffect, useCallback } from "react";
import type { Order, FullUser } from "../../types";
import * as api from "../../services";

/**
 * Orders slice: the current user's orders (or all orders when an admin is
 * signed in) plus the refresh lifecycle.
 */
export function useOrdersData(
  customerUser: FullUser | null,
  isAdminLoggedIn: boolean
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const refreshOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const isAdmin = customerUser?.role === "ADMIN" || isAdminLoggedIn;
      const data = isAdmin ? await api.getAllOrders() : await api.getMyOrders();
      const mapped: Order[] = data.orders.map((o) => ({
        _id: o._id,
        id: o._id,
        items: o.items,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        customer: o.customer,
        delivery: o.delivery,
        payment: o.payment,
        customerName: typeof o.customer === "object" && o.customer ? o.customer.name : undefined,
        customerPhone: o.delivery?.phone || (typeof o.customer === "object" && o.customer ? o.customer.phone : undefined),
        deliveryAddress: o.delivery ? `${o.delivery.address}, ${o.delivery.city}` : undefined,
        paymentMethod: o.payment?.method,
      }));
      setOrders(mapped);
    } catch {
      /* silent */
    } finally {
      setIsLoadingOrders(false);
    }
  }, [customerUser, isAdminLoggedIn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (customerUser || isAdminLoggedIn) refreshOrders();
  }, [customerUser, isAdminLoggedIn, refreshOrders]);

  return {
    orders,
    setOrders,
    isLoadingOrders,
    refreshOrders,
  };
}