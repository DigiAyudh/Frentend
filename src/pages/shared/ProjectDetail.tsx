import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, DollarSign, Flag } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchProjects } from '../../redux/slices/projectsSlice'
import { fetchTasks } from '../../redux/slices/tasksSlice'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import PageLoader from '../../components/common/FullPageLoader'
import { projectProgress, formatDate, formatCurrency } from '../../lib/utils'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { projects, loading } = useAppSelector((s) => s.projects)
  const { tasks } = useAppSelector((s) => s.tasks)

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects())
    dispatch(fetchTasks(undefined))
  }, [dispatch, projects.length])

  const project = projects.find((p) => p._id === id)
  const projectTasks = tasks.filter((t) => t.projectId === id)

  if (loading && !project) return <PageLoader />
  if (!project) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        <p className="text-text-light">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2"><ArrowLeft className="mr-2 h-4 w-4" /> Back to projects</Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-balance">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="max-w-2xl text-text-light">{project.description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calendar className="h-5 w-5" /></div>
          <div><p className="text-xs text-text-light">Timeline</p><p className="text-sm font-medium">{formatDate(project.startDate)} - {formatDate(project.endDate)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><DollarSign className="h-5 w-5" /></div>
          <div><p className="text-xs text-text-light">Budget</p><p className="text-sm font-medium">{project.budget ? formatCurrency(project.budget) : '—'}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Flag className="h-5 w-5" /></div>
          <div><p className="text-xs text-text-light">Priority</p><p className="text-sm font-medium capitalize">{project.priority}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="space-y-2 p-5">
          <div className="flex justify-between text-sm"><span className="font-medium">Overall progress</span><span>{projectProgress(project.status)}%</span></div>
          <Progress value={projectProgress(project.status)} />
        </CardContent>
      </Card>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks ({projectTasks.length})</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {projectTasks.length === 0 && <p className="py-4 text-center text-sm text-text-light">No tasks yet.</p>}
              {projectTasks.map((t) => (
                <div key={t._id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-text-light">Due {formatDate(t.dueDate)}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-relaxed text-text-light">{project.description}</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
