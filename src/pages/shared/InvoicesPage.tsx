import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchInvoices } from '../../redux/slices/businessSlice'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable } from '../../components/common/DataTable'
import { StatusBadge } from '../../components/common/StatusBadge'
import { StatCard } from '../../components/common/StatCard'
import { FileText, DollarSign, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Invoice } from '../../types'

export default function InvoicesPage() {
  const dispatch = useAppDispatch()
  const { invoices, loading } = useAppSelector((s) => s.business)

  useEffect(() => {
    dispatch(fetchInvoices())
  }, [dispatch])

  const total = invoices.reduce((sum, i) => sum + i.total, 0)
  const paid = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)
  const overdue = invoices.filter((i) => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" subtitle="Billing history and payment status." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard stat={{ label: 'Total Billed', value: total, change: 0, trend: 'up', format: 'currency' }} icon={FileText} index={0} />
        <StatCard stat={{ label: 'Paid', value: paid, change: 0, trend: 'up', format: 'currency' }} icon={DollarSign} index={1} />
        <StatCard stat={{ label: 'Overdue', value: overdue, change: 0, trend: 'down', format: 'currency' }} icon={AlertCircle} index={2} />
      </div>

      <DataTable<Invoice>
        data={invoices}
        loading={loading}
        searchKeys={['number', 'clientName']}
        searchPlaceholder="Search invoices..."
        exportFileName="invoices"
        columns={[
          { header: 'Invoice', accessor: 'number', sortable: true, cell: (r) => <span className="font-medium">{r.number}</span> },
          { header: 'Client', accessor: 'clientName', sortable: true },
          { header: 'Issued', accessor: 'issueDate', sortable: true, cell: (r) => formatDate(r.issueDate) },
          { header: 'Due', accessor: 'dueDate', sortable: true, cell: (r) => formatDate(r.dueDate) },
          { header: 'Amount', accessor: 'total', sortable: true, cell: (r) => <span className="font-medium">{formatCurrency(r.total)}</span> },
          { header: 'Status', accessor: 'status', cell: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  )
}
