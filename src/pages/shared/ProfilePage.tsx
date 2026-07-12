import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profileImage || null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP files are allowed')
      return
    }

    setIsUploadingPhoto(true)
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewImage(result)
        
        // In a real app, you would upload to a server/storage service
        // For now, we'll store in local state and update user
        if (user) {
          dispatch(setUser({ ...user, profileImage: result }))
          toast.success('Profile photo updated successfully')
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Failed to upload photo')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (user) {
      dispatch(setUser({ ...user, profileImage: undefined }))
      toast.success('Profile photo removed')
    }
  }

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
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewImage || user?.profileImage} alt={user?.name} />
                <AvatarFallback className="text-2xl">{getInitials(user?.name || 'U')}</AvatarFallback>
              </Avatar>
              {previewImage && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                  title="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <p className="text-xs text-text-light">Max 5MB • JPG, PNG, WebP</p>
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
