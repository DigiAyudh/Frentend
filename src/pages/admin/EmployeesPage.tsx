import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchEmployees, createEmployee, updateEmployee } from '../../redux/slices/employeesSlice'
import type { Employee } from '../../types'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable, type Column } from '../../components/common/DataTable'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../../components/ui/dialog'
import { FormField } from '../../components/common/FormField'
import { Input } from '../../components/ui/input'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { getInitials } from '../../lib/utils'

const employeeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  position: z.string().min(2, 'Position is required'),
  department: z.string().min(2, 'Department is required'),
  phone: z.string().min(6, 'Phone is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
})
type EmployeeForm = z.infer<typeof employeeSchema>

export default function EmployeesPage() {
  const dispatch = useAppDispatch()
  const { employees, loading } = useAppSelector((s) => s.employees)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState<Employee | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
  })

  useEffect(() => {
    dispatch(fetchEmployees('digiayudh'))
  }, [dispatch])

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', email: '', position: '', department: '', phone: '', city: '', country: '' })
    setDialogOpen(true)
  }

  const openEdit = (emp: Employee) => {
    setEditing(emp)
    reset({
      name: emp.name, email: emp.email, position: emp.position, department: emp.department,
      phone: emp.phone, city: emp.city, country: emp.country,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: EmployeeForm) => {
    try {
      if (editing) {
        await dispatch(updateEmployee({ id: editing._id, data })).unwrap()
        toast.success('Employee updated')
      } else {
        await dispatch(createEmployee(data)).unwrap()
        toast.success('Employee added')
      }
      setDialogOpen(false)
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Something went wrong')
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    // Soft delete via update (mock) — mark inactive
    await dispatch(updateEmployee({ id: deleting._id, data: { isActive: false } }))
    toast.success('Employee deactivated')
    setDeleting(null)
  }

  const columns: Column<Employee>[] = [
    {
      header: 'Employee',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarFallback>{getInitials(row.name)}</AvatarFallback></Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Position', accessor: 'position', sortable: true },
    { header: 'Department', accessor: 'department', cell: (row) => <Badge variant="outline">{row.department}</Badge> },
    { header: 'Location', accessor: 'city', cell: (row) => `${row.city}, ${row.country}` },
    {
      header: 'Status',
      accessor: 'isActive',
      cell: (row) => (
        <Badge variant={row.isActive ? 'success' : 'outline'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: '',
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleting(row)} aria-label="Delete" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Employees" subtitle="Manage your team members and their roles.">
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Employee</Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        searchPlaceholder="Search employees..."
        searchKeys={['name', 'email', 'position', 'department']}
        exportFileName="employees"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name" error={errors.name?.message}>
                <Input {...register('name')} placeholder="Jane Doe" />
              </FormField>
              <FormField label="Email" error={errors.email?.message}>
                <Input type="email" {...register('email')} placeholder="jane@company.com" />
              </FormField>
              <FormField label="Position" error={errors.position?.message}>
                <Input {...register('position')} placeholder="Senior Developer" />
              </FormField>
              <FormField label="Department" error={errors.department?.message}>
                <Input {...register('department')} placeholder="Engineering" />
              </FormField>
              <FormField label="Phone" error={errors.phone?.message}>
                <Input {...register('phone')} placeholder="+1 555 000 0000" />
              </FormField>
              <FormField label="City" error={errors.city?.message}>
                <Input {...register('city')} placeholder="New York" />
              </FormField>
              <FormField label="Country" error={errors.country?.message}>
                <Input {...register('country')} placeholder="USA" />
              </FormField>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{editing ? 'Save changes' : 'Add employee'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Deactivate employee?"
        description={`${deleting?.name} will be marked inactive. You can reactivate them later.`}
        confirmLabel="Deactivate"
        onConfirm={confirmDelete}
        destructive
      />
    </div>
  )
}
