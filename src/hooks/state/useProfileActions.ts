import { useState, useCallback, type Dispatch, type SetStateAction } from "react";
import type { Address, FullUser, PaymentMethod } from "../../types";
import * as api from "../../services";
import { getErrorMessage } from "../../services";
import { normalizeFullUser } from "../../utils/user";

/**
 * Profile slice: every mutation a signed-in user can perform on their own
 * account (profile, password, addresses, payment methods, appearance and
 * notification preferences), plus the feedback state shown by the settings UI.
 * Mutations refresh `customerUser` through the injected setter so the session
 * shape stays owned by the parent.
 */
export function useProfileActions(
  setCustomerUser: Dispatch<SetStateAction<FullUser | null>>
) {
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const applyUser = useCallback(
    (user: FullUser) => setCustomerUser(normalizeFullUser(user)),
    [setCustomerUser]
  );

  const handleUpdateProfile = async (data: {
    name?: string;
    phone?: string;
    email?: string;
  }) => {
    setUpdatingProfile(true);
    setProfileError(null);
    setProfileMessage(null);
    try {
      const { user } = await api.updateProfile(data);
      applyUser(user);
      setProfileMessage("Changes saved.");
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update your profile."));
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setChangingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);
    setProfileError(null);
    setProfileMessage(null);
    try {
      const { user } = await api.changePassword(data);
      applyUser(user);
      setPasswordMessage("Password updated.");
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Could not update your password."));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAddAddress = async (
    data: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => {
    setProfileError(null);
    try {
      const { user } = await api.addAddress(data);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not add the address."));
    }
  };

  const handleUpdateAddress = async (id: string, data: Partial<Omit<Address, "_id">>) => {
    setProfileError(null);
    try {
      const { user } = await api.updateAddress(id, data);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update the address."));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    setProfileError(null);
    try {
      const { user } = await api.deleteAddress(id);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not remove the address."));
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    setProfileError(null);
    try {
      const { user } = await api.setDefaultAddress(id);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not set the default address."));
    }
  };

  const handleAddPaymentMethod = async (
    data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => {
    setProfileError(null);
    try {
      const { user } = await api.addPaymentMethod(data);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not add the payment method."));
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    setProfileError(null);
    try {
      const { user } = await api.deletePaymentMethod(id);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not remove the payment method."));
    }
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    setProfileError(null);
    try {
      const { user } = await api.setDefaultPaymentMethod(id);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not set the default payment method."));
    }
  };

  const handleUpdateAppearance = async (data: { accentColor?: string }) => {
    setProfileError(null);
    try {
      const { user } = await api.updateAppearance(data);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update your appearance."));
    }
  };

  const handleUpdateNotificationPrefs = async (data: {
    orderUpdates?: boolean;
    promotions?: boolean;
    sms?: boolean;
    email?: boolean;
  }) => {
    setProfileError(null);
    try {
      const { user } = await api.updateNotificationPrefs(data);
      applyUser(user);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update your preferences."));
    }
  };

  return {
    updatingProfile,
    changingPassword,
    profileError,
    profileMessage,
    passwordError,
    passwordMessage,
    onUpdateProfile: handleUpdateProfile,
    onChangePassword: handleChangePassword,
    onAddAddress: handleAddAddress,
    onUpdateAddress: handleUpdateAddress,
    onDeleteAddress: handleDeleteAddress,
    onSetDefaultAddress: handleSetDefaultAddress,
    onAddPaymentMethod: handleAddPaymentMethod,
    onDeletePaymentMethod: handleDeletePaymentMethod,
    onSetDefaultPaymentMethod: handleSetDefaultPaymentMethod,
    onUpdateAppearance: handleUpdateAppearance,
    onUpdateNotificationPrefs: handleUpdateNotificationPrefs,
  };
}