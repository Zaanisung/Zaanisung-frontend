import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { formatGHS } from '../../utils/currency';
import { Search, UserCheck } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Demonstration customer roster reflecting authorization model without leaking sensitive secrets
  const customers = [
    {
      id: 'usr-001',
      name: 'Kwame Mensah',
      email: 'kwame.mensah@example.com',
      phone: '0244123456',
      city: 'Airport Residential, Accra',
      ordersCount: 3,
      totalSpent: 9740,
      role: 'Client',
      status: 'Active',
      registeredDate: '12 Nov 2025',
    },
    {
      id: 'usr-002',
      name: 'Ama Serwaa',
      email: 'ama.serwaa@example.com',
      phone: '0559876543',
      city: 'Ahodwo, Kumasi',
      ordersCount: 2,
      totalSpent: 6140,
      role: 'Client',
      status: 'Active',
      registeredDate: '14 Jan 2026',
    },
    {
      id: 'usr-003',
      name: 'Dr. Kofi Annan-Bonsu',
      email: 'k.annanbonsu@example.com',
      phone: '0208112233',
      city: 'Cantonments, Accra',
      ordersCount: 5,
      totalSpent: 16850,
      role: 'VIP Collector',
      status: 'Active',
      registeredDate: '03 Feb 2026',
    },
    {
      id: 'usr-004',
      name: 'Esi Osei',
      email: 'esi.osei@example.com',
      phone: '0277334455',
      city: 'Takoradi Beach Road',
      ordersCount: 1,
      totalSpent: 1850,
      role: 'Client',
      status: 'Active',
      registeredDate: '29 Aug 2026',
    },
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-[#FAF8F4] flex flex-col text-left">
      <AdminHeader
        title="Clientele & Customer Accounts"
        subtitle={`Viewing ${customers.length} registered clientele across Ghana`}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Search */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] p-4 rounded-xs shadow-xs flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clientele by name, email, or city..."
              className="w-full bg-[#FAF8F4] text-[#171512] pl-9 pr-4 py-2 text-xs border border-[#E4DED3] rounded-xs focus:border-[#171512] outline-none"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#716C64]" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] text-[#716C64] uppercase tracking-wider text-[11px] border-b border-[#E4DED3]">
                <tr>
                  <th className="px-5 py-3.5">Client</th>
                  <th className="px-5 py-3.5">Primary Location</th>
                  <th className="px-5 py-3.5">Tier / Role</th>
                  <th className="px-5 py-3.5">Total Orders</th>
                  <th className="px-5 py-3.5">Total Spent</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DED3]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-serif text-sm font-semibold text-[#171512]">{c.name}</div>
                      <div className="text-[11px] text-[#716C64]">{c.email} · {c.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[#171512]">{c.city}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-[#92733C]">{c.role}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold tabular-nums text-[#171512]">{c.ordersCount} orders</td>
                    <td className="px-5 py-3.5 font-bold tabular-nums text-[#171512]">{formatGHS(c.totalSpent)}</td>
                    <td className="px-5 py-3.5 text-[#716C64]">{c.registeredDate}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-800 text-[11px] font-semibold">
                        <UserCheck size={13} />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
