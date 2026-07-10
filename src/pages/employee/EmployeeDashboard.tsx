import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, ListTodo, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'
import { fetchProjects } from '../../redux/slices/projectsSlice'
import { PageHeader } from '../../components/common/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { ChartCard } from '../../components/common/ChartCard'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Progress } from '../../components/ui/progress'
import { Skeleton } from '../../components/ui/skeleton'
import { projectProgress } from '../../lib/utils'

const STAT_ICONS = [FolderKanban, ListTodo, CheckCircle2, UserCheck]
const taskData = [
  { day: 'Mon', done: 5, added: 3 },
  { day: 'Tue', done: 7, added: 4 },
  { day: 'Wed', done: 4, added: 6 },
  { day: 'Thu', done: 8, added: 2 },
  { day: 'Fri', done: 6, added: 5 },
]

export default function EmployeeDashboard() {
  const dispatch = useAppDispatch()
  const { stats, loading } = useAppSelector((s) => s.dashboard)
  const { projects } = useAppSelector((s) => s.projects)
  const { user } = useAppSelector((s) => s.auth)

  useEffect(() => {
    dispatch(fetchDashboardStats('employee'))
    dispatch(fetchProjects())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <PageHeader title={`Hello, ${user?.name?.split(' ')[0] || 'there'}`} subtitle="Here's your workload for today." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading && stats.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          : stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} icon={STAT_ICONS[i % STAT_ICONS.length]} index={i} />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Task Activity" subtitle="Completed vs added this week" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={taskData} margin={{ left: -10, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--text-light))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--text-light))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--text))' }}
              />
              <Bar dataKey="done" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="added" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>My Projects</CardTitle>
            <Link to="/employee/projects" className="flex items-center gap-1 text-sm text-primary hover:underline">
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.slice(0, 4).map((p) => (
              <div key={p._id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{p.title}</span>
                  <StatusBadge status={p.status} />
                </div>
                <Progress value={projectProgress(p.status)} />
              </div>
            ))}
            {projects.length === 0 && <p className="py-4 text-center text-sm text-text-light">No projects assigned</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
