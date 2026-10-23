import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatGHS } from '../../utils/currency';
import { Address, Order } from '../../types';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Bell, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getProductPlaceholderSvg } from '../../config/assets';

const GHANA_REGIONS = [
  { value: 'Greater Accra', label: 'Greater Accra' },
  { value: 'Ashanti Region', label: 'Ashanti Region' },
  { value: 'Western Region', label: 'Western Region' },
  { value: 'Central Region', label: 'Central Region' },
  { value: 'Eastern Region', label: 'Eastern Region' },
  { value: 'Northern Region', label: 'Northern Region' },
];

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    logout,
    orders,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'payments' | 'notifications' | 'profile'>('overview');

  // Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressFullName, setAddressFullName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressRegion, setAddressRegion] = useState('Greater Accra');
  const [addressNotes, setAddressNotes] = useState('');
  const [addressIsDefault, setAddressIsDefault] = useState(false);

  // Delete address confirmation
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Profile edit state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');

  // Order Details Modal state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'pm-1', type: 'card', name: 'Visa ending in 4242', detail: 'Expires 11/28 · Paystack Tokenized', isDefault: true },
    { id: 'pm-2', type: 'momo', name: 'MTN Mobile Money', detail: '0244 ···· 456 · Verified Subscriber', isDefault: false },
  ]);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<'momo' | 'card'>('momo');
  const [newPaymentDetail, setNewPaymentDetail] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-semibold mb-2">Client Portal Sign-In Required</h2>
        <p className="text-xs text-[#716C64] mb-6">Please log in to manage your orders, addresses, and allocations.</p>
        <Button variant="primary" onClick={() => navigateTo('login')}>
          Sign In
        </Button>
      </div>
    );
  }

  // Open address modal for add or edit
  const openAddressModal = (addr?: Address) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddressLabel(addr.label);
      setAddressFullName(addr.fullName);
      setAddressPhone(addr.phone);
      setAddressStreet(addr.street);
      setAddressCity(addr.city);
      setAddressRegion(addr.region);
      setAddressNotes(addr.additionalNotes || '');
      setAddressIsDefault(addr.isDefault);
    } else {
      setEditingAddressId(null);
      setAddressLabel('Home - Accra');
      setAddressFullName(currentUser.name);
      setAddressPhone(currentUser.phone);
      setAddressStreet('');
      setAddressCity('');
      setAddressRegion('Greater Accra');
      setAddressNotes('');
      setAddressIsDefault(currentUser.addresses.length === 0);
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, {
        label: addressLabel,
        fullName: addressFullName,
        phone: addressPhone,
        street: addressStreet,
        city: addressCity,
        region: addressRegion,
        additionalNotes: addressNotes,
        isDefault: addressIsDefault,
      });
    } else {
      addAddress({
        label: addressLabel,
        fullName: addressFullName,
        phone: addressPhone,
        street: addressStreet,
        city: addressCity,
        region: addressRegion,
        additionalNotes: addressNotes,
        isDefault: addressIsDefault,
      });
    }
    setIsAddressModalOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: profileName, phone: profilePhone });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={15} /> },
    { id: 'orders', label: 'Orders', count: orders.length, icon: <Package size={15} /> },
    { id: 'addresses', label: 'Addresses', count: currentUser.addresses.length, icon: <MapPin size={15} /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={15} /> },
    { id: 'notifications', label: 'Notifications', count: notifications.filter((n) => !n.read).length, icon: <Bell size={15} /> },
    { id: 'profile', label: 'Profile Settings', icon: <Edit2 size={15} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left">
      <Breadcrumbs items={[{ label: 'Home', route: 'home' }, { label: 'Client Account' }]} />

      {/* Account Header */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block mb-1">
            Client Profile
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#171512] font-semibold">
            {currentUser.name}
          </h1>
          <p className="text-xs text-[#716C64] mt-0.5">
            {currentUser.email} · {currentUser.phone}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          leftIcon={<LogOut size={14} />}
        >
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs overflow-hidden">
          <nav className="divide-y divide-[#E4DED3]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#171512] text-[#F8F5EF]'
                      : 'text-[#171512] hover:bg-[#F0ECE5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#B69A59]' : 'text-[#716C64]'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-xs tabular-nums font-semibold ${
                        isActive ? 'bg-[#2A241F] text-[#B69A59]' : 'bg-[#E4DED3] text-[#171512]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#171512] mb-1">
                  Atelier Client Status
                </h3>
                <p className="text-xs text-[#716C64]">
                  Welcome back. Overview of your current orders and private allocations.
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs">
                  <span className="text-[11px] uppercase tracking-wider text-[#716C64] block mb-1">Total Orders</span>
                  <span className="font-serif text-2xl font-bold text-[#171512] tabular-nums">
                    {orders.length}
                  </span>
                </div>
                <div className="p-4 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs">
                  <span className="text-[11px] uppercase tracking-wider text-[#716C64] block mb-1">Saved Addresses</span>
                  <span className="font-serif text-2xl font-bold text-[#171512] tabular-nums">
                    {currentUser.addresses.length}
                  </span>
                </div>
                <div className="p-4 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs">
                  <span className="text-[11px] uppercase tracking-wider text-[#716C64] block mb-1">Atelier Tier</span>
                  <span className="font-serif text-2xl font-bold text-[#92733C]">
                    Connoisseur
                  </span>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4DED3]">
                  <h4 className="font-serif text-base font-semibold text-[#171512]">
                    Recent Order
                  </h4>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#92733C] hover:text-[#171512] underline underline-offset-4 cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="p-4 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif text-base font-semibold text-[#171512]">
                          {orders[0].reference}
                        </span>
                        <StatusBadge status={orders[0].fulfillmentStatus} type="fulfillment" />
                      </div>
                      <p className="text-xs text-[#716C64]">
                        {orders[0].items.map((i) => `${i.name} (${i.size})`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-serif text-base font-bold text-[#171512] tabular-nums">
                        {formatGHS(orders[0].total)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrderDetails(orders[0])}
                      >
                        Receipt
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#716C64]">No orders placed yet.</p>
                )}
              </div>
            </div>
          )}

          {/* 2. ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4DED3]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#171512]">Order History</h3>
                  <p className="text-xs text-[#716C64]">All verified transactions and delivery tracking.</p>
                </div>
                <span className="text-xs text-[#716C64] font-medium">{orders.length} Orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#716C64]">
                  No past orders found in your account.
                </div>
              ) : (
                <div className="divide-y divide-[#E4DED3]">
                  {orders.map((ord) => (
                    <div key={ord.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-serif text-base font-bold text-[#171512]">{ord.reference}</span>
                          <StatusBadge status={ord.fulfillmentStatus} type="fulfillment" />
                          <StatusBadge status={ord.paymentStatus} type="payment" />
                        </div>
                        <p className="text-xs text-[#716C64]">
                          Placed on {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {ord.shippingAddress.city}
                        </p>
                        <p className="text-xs text-[#171512] mt-1">
                          {ord.items.map((i) => `${i.quantity}× ${i.name} (${i.size})`).join(', ')}
                        </p>
                      </div>

                      <div className="text-right sm:self-center flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <span className="font-serif text-lg font-bold text-[#171512] tabular-nums">
                          {formatGHS(ord.total)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrderDetails(ord)}
                          rightIcon={<ExternalLink size={12} />}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4DED3]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#171512]">Saved Delivery Destinations</h3>
                  <p className="text-xs text-[#716C64]">Manage residential and office delivery locations in Ghana.</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAddressModal()}
                  leftIcon={<Plus size={14} />}
                >
                  Add Address
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 border rounded-xs relative transition-all ${
                      addr.isDefault ? 'border-[#171512] bg-[#FAF8F4]' : 'border-[#E4DED3] bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-serif text-base font-semibold text-[#171512]">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#92733C] bg-[#FAF8F4] px-2 py-0.5 border border-[#E4DED3] rounded-xs">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#171512] font-medium">{addr.fullName}</p>
                    <p className="text-xs text-[#716C64] leading-relaxed mt-0.5">
                      {addr.street}<br />
                      {addr.city}, {addr.region}
                    </p>
                    <p className="text-xs text-[#716C64] mt-2">Tel: {addr.phone}</p>

                    <div className="mt-4 pt-3 border-t border-[#E4DED3] flex items-center justify-between text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[#716C64] hover:text-[#171512] underline cursor-pointer"
                        >
                          Set as default
                        </button>
                      ) : (
                        <span className="text-emerald-800 flex items-center gap-1">
                          <Check size={12} /> Default destination
                        </span>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openAddressModal(addr)}
                          className="text-[#716C64] hover:text-[#171512] cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setAddressToDelete(addr.id)}
                          className="text-[#716C64] hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PAYMENT METHODS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4DED3]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#171512]">Saved Payment Methods</h3>
                  <p className="text-xs text-[#716C64]">
                    Encrypted authorization channels via Paystack. No sensitive raw CVV or PAN data is stored locally.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddPaymentModalOpen(true)}
                  leftIcon={<Plus size={14} />}
                >
                  Add Method
                </Button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className={`p-4 border rounded-xs flex items-center justify-between transition-all ${
                      pm.isDefault ? 'border-[#171512] bg-[#FAF8F4]' : 'border-[#E4DED3] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#171512] text-[#B69A59] rounded-xs">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#171512]">{pm.name}</p>
                        <p className="text-[11px] text-[#716C64]">{pm.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {pm.isDefault ? (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#92733C] px-2 py-0.5 bg-white border border-[#E4DED3]">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setPaymentMethods((prev) =>
                              prev.map((item) => ({ ...item, isDefault: item.id === pm.id }))
                            );
                          }}
                          className="text-xs text-[#716C64] hover:text-[#171512] underline cursor-pointer"
                        >
                          Make default
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setPaymentMethods((prev) => prev.filter((item) => item.id !== pm.id));
                        }}
                        className="text-[#716C64] hover:text-red-800 p-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4DED3]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#171512]">Notification Center</h3>
                  <p className="text-xs text-[#716C64]">Order dispatches and private reserve invitations.</p>
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-[#92733C] hover:text-[#171512] underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-[#E4DED3]">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`py-4 px-3 rounded-xs transition-colors cursor-pointer flex items-start gap-3 ${
                      !notif.read ? 'bg-[#FAF8F4]' : 'hover:bg-[#FAF8F4]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-[#B69A59]' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-semibold text-[#171512]">{notif.title}</h5>
                        <span className="text-[11px] text-[#716C64]">{notif.date}</span>
                      </div>
                      <p className="text-xs text-[#716C64] mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
              <div className="pb-4 border-b border-[#E4DED3]">
                <h3 className="font-serif text-xl font-semibold text-[#171512]">Personal Details</h3>
                <p className="text-xs text-[#716C64]">Update your client name and contact phone number.</p>
              </div>

              <Input
                label="Full Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                value={currentUser.email}
                disabled
                helperText="Email changes require security verification with client concierge"
              />

              <Input
                label="Ghana Phone Number"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="md">
                Save Preferences
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* ADDRESS MODAL (ADD / EDIT) */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddressId ? 'Edit Delivery Destination' : 'Add New Delivery Destination'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveAddress} className="space-y-4 text-left">
          <Input
            label="Label (e.g. Home, Office, Kumasi Residence)"
            value={addressLabel}
            onChange={(e) => setAddressLabel(e.target.value)}
            required
          />
          <Input
            label="Recipient Full Name"
            value={addressFullName}
            onChange={(e) => setAddressFullName(e.target.value)}
            required
          />
          <Input
            label="Recipient Phone Number"
            value={addressPhone}
            onChange={(e) => setAddressPhone(e.target.value)}
            placeholder="0244 123 456"
            required
          />
          <Input
            label="Street Address / House / Landmark"
            value={addressStreet}
            onChange={(e) => setAddressStreet(e.target.value)}
            placeholder="House 14, Patrice Lumumba Road"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Town / City"
              value={addressCity}
              onChange={(e) => setAddressCity(e.target.value)}
              placeholder="Airport Residential, Accra"
              required
            />
            <Select
              label="Region"
              value={addressRegion}
              onChange={(e) => setAddressRegion(e.target.value)}
              options={GHANA_REGIONS}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-[#171512] pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addressIsDefault}
              onChange={(e) => setAddressIsDefault(e.target.checked)}
              className="w-4 h-4 text-[#B69A59]"
            />
            <span>Set as primary delivery address</span>
          </label>

          <div className="pt-4 border-t border-[#E4DED3] flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE ADDRESS DIALOG */}
      <ConfirmDialog
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={() => {
          if (addressToDelete) {
            deleteAddress(addressToDelete);
            setAddressToDelete(null);
          }
        }}
        title="Remove Delivery Address"
        message="Are you certain you wish to delete this delivery address from your profile? This cannot be undone."
        confirmLabel="Delete Address"
        isDestructive
      />

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <Modal
          isOpen={!!selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          title={`Order ${selectedOrderDetails.reference}`}
          subtitle={`Placed on ${new Date(selectedOrderDetails.createdAt).toLocaleDateString('en-GB')}`}
          maxWidth="lg"
        >
          <div className="text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
              <div>
                <span className="text-[11px] text-[#716C64] uppercase block">Fulfillment</span>
                <StatusBadge status={selectedOrderDetails.fulfillmentStatus} type="fulfillment" />
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#716C64] uppercase block">Total Amount</span>
                <span className="font-serif text-lg font-bold text-[#171512] tabular-nums">
                  {formatGHS(selectedOrderDetails.total)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-[#E4DED3] max-h-56 overflow-y-auto">
              {selectedOrderDetails.items.map((i, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#171512]">{i.name}</span>
                    <p className="text-[#716C64]">{i.size} · Qty: {i.quantity}</p>
                  </div>
                  <span className="font-medium tabular-nums">{formatGHS(i.lineTotal)}</span>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            <div className="p-3 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs text-xs text-[#716C64]">
              <span className="font-semibold text-[#171512] block mb-1">Delivered to:</span>
              <p>{selectedOrderDetails.shippingAddress.fullName}</p>
              <p>{selectedOrderDetails.shippingAddress.street}, {selectedOrderDetails.shippingAddress.city}</p>
              <p>Phone: {selectedOrderDetails.shippingAddress.phone}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrderDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD PAYMENT METHOD MODAL */}
      <Modal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        title="Add Payment Channel"
        subtitle="Tokenized authorization via Paystack Ghana"
        maxWidth="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newPaymentDetail.trim()) return;
            const newMethod = {
              id: `pm-${Date.now()}`,
              type: newPaymentType,
              name: newPaymentType === 'momo' ? 'Mobile Money Wallet' : 'Payment Card',
              detail: newPaymentDetail,
              isDefault: false,
            };
            setPaymentMethods((prev) => [...prev, newMethod]);
            setIsAddPaymentModalOpen(false);
            setNewPaymentDetail('');
          }}
          className="space-y-4 text-left"
        >
          <div className="flex border-b border-[#E4DED3]">
            <button
              type="button"
              onClick={() => setNewPaymentType('momo')}
              className={`flex-1 py-2 text-xs font-semibold text-center cursor-pointer border-b-2 transition-colors ${
                newPaymentType === 'momo' ? 'border-[#B69A59] text-[#171512]' : 'border-transparent text-[#716C64]'
              }`}
            >
              Ghana Mobile Money
            </button>
            <button
              type="button"
              onClick={() => setNewPaymentType('card')}
              className={`flex-1 py-2 text-xs font-semibold text-center cursor-pointer border-b-2 transition-colors ${
                newPaymentType === 'card' ? 'border-[#B69A59] text-[#171512]' : 'border-transparent text-[#716C64]'
              }`}
            >
              Card (Visa / Mastercard)
            </button>
          </div>

          <Input
            label={newPaymentType === 'momo' ? 'Mobile Money Number (MTN / Telecel)' : 'Card Number (Last 4 Digits)'}
            value={newPaymentDetail}
            onChange={(e) => setNewPaymentDetail(e.target.value)}
            placeholder={newPaymentType === 'momo' ? '0244 000 000' : '•••• 5521'}
            required
          />

          <div className="pt-3 border-t border-[#E4DED3] flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Link Method
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
