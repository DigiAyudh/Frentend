import { useEffect } from 'react'
import { FileText, Download, File, FileImage, FileArchive } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchDocuments } from '../../redux/slices/businessSlice'
import { PageHeader } from '../../components/common/PageHeader'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { formatFileSize, formatDate } from '../../lib/utils'

const ICONS: Record<string, typeof File> = {
  contract: FileText,
  invoice: FileText,
  report: FileText,
  asset: FileImage,
  other: FileArchive,
}

export default function DocumentsPage() {
  const dispatch = useAppDispatch()
  const { documents, loading } = useAppSelector((s) => s.business)

  useEffect(() => {
    dispatch(fetchDocuments())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="Contracts, reports and shared files." />

      {loading && documents.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState icon={<FileText className="h-6 w-6" />} title="No documents" description="Uploaded files will appear here." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const Icon = ICONS[doc.category] || File
            return (
              <Card key={doc._id}>
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-light">
                      <Badge variant="outline" className="capitalize">{doc.category}</Badge>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                    <p className="mt-1 text-xs text-text-light">{formatDate(doc.createdAt)}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Download ${doc.name}`}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
