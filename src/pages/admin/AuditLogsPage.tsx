import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchAuditLogs } from '../../redux/slices/businessSlice'
import type { AuditLog } from '../../types'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable, type Column } from '../../components/common/DataTable'
import { Badge } from '../../components/ui/badge'
import { formatDateTime } from '../../lib/utils'

export default function AuditLogsPage() {
  const dispatch = useAppDispatch()
  const { auditLogs } = useAppSelector((s) => s.business)

  useEffect(() => {
    dispatch(fetchAuditLogs())
  }, [dispatch])

  const columns: Column<AuditLog>[] = [
    { header: 'User', accessor: 'actorName', sortable: true },
    { header: 'Action', accessor: 'action', cell: (row) => <Badge variant="outline">{row.action}</Badge> },
    { header: 'Entity', accessor: 'entity', sortable: true },
    { header: 'Details', accessor: 'details', cell: (row) => <span className="text-muted-foreground">{row.details || '—'}</span> },
    { header: 'IP', accessor: 'ipAddress', cell: (row) => row.ipAddress || '—' },
    { header: 'Time', accessor: 'createdAt', cell: (row) => formatDateTime(row.createdAt), sortable: true },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" subtitle="A chronological record of system activity." />
      <DataTable
        columns={columns}
        data={auditLogs}
        searchPlaceholder="Search logs..."
        searchKeys={['actorName', 'action', 'entity', 'details']}
        exportFileName="audit-logs"
        pageSize={12}
      />
    </div>
  )
}
