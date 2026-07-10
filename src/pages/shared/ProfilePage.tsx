import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setUser } from '../../redux/slices/authSlice'
import { PageHeader } from '../../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { FormField } from '../../components/common/FormField'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { StatusBadge } from '../../components/common/StatusBadge'
import { getInitials } from '../../utils/helpers'

interface FormValues {
  name: string
  phone: string
  companyName: string
  city: string
  country: string
  bio: string
}

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s) => s.auth)

  const { register, handleSubmit, formState: { isDirty } } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      companyName: user?.companyName || '',
      city: user?.city || '',
      country: user?.country || '',
      bio: user?.bio || '',
    },
  })

  const onSubmit = (values: FormValues) => {
    if (user) {
      dispatch(setUser({ ...user, ...values }))
      toast.success('Profile updated')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Manage your personal information." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profileImage} alt={user?.name} />
              <AvatarFallback className="text-2xl">{getInitials(user?.name || 'U')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user?.name}</h3>
              <p className="text-sm text-text-light">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={user?.role || 'client'} />
              {user?.verificationStatus && <StatusBadge status={user.verificationStatus} />}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Edit Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full Name"><Input {...register('name')} /></FormField>
                <FormField label="Phone"><Input {...register('phone')} /></FormField>
                <FormField label="Company"><Input {...register('companyName')} /></FormField>
                <FormField label="City"><Input {...register('city')} /></FormField>
                <FormField label="Country"><Input {...register('country')} /></FormField>
              </div>
              <FormField label="Bio"><Textarea rows={3} {...register('bio')} placeholder="A short bio..." /></FormField>
              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty}>Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
