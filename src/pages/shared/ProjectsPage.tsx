import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchProjects } from '../../redux/slices/projectsSlice'
import { PageHeader } from '../../components/common/PageHeader'
import { Card, CardContent } from '../../components/ui/card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Progress } from '../../components/ui/progress'
import { Skeleton } from '../../components/ui/skeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { Input } from '../../components/ui/input'
import { projectProgress, formatDate, formatCurrency } from '../../lib/utils'

interface Props {
  basePath: string
}

export default function ProjectsPage({ basePath }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { projects, loading } = useAppSelector((s) => s.projects)
  const [query, setQuery] = useState('')

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" subtitle="Browse and track all projects." />

      <Input
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />

      {loading && projects.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FolderKanban className="h-6 w-6" />} title="No projects found" description="Try adjusting your search or check back later." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card
              key={p._id}
              onClick={() => navigate(`${basePath}/${p._id}`)}
              className="cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight text-pretty">{p.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="line-clamp-2 text-sm text-text-light">{p.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-light">
                    <span>Progress</span>
                    <span>{projectProgress(p.status)}%</span>
                  </div>
                  <Progress value={projectProgress(p.status)} />
                </div>
                <div className="flex items-center justify-between pt-1 text-xs text-text-light">
                  <span>Due {formatDate(p.endDate)}</span>
                  {p.budget ? <span className="font-medium text-text">{formatCurrency(p.budget)}</span> : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
