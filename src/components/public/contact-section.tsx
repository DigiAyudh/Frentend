import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { submitContactRequest } from '@/redux/slices/contactSlice'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { FormField } from '../common/FormField'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Add a short subject'),
  message: z.string().min(10, 'Tell us a little more (min 10 chars)'),
})

type ContactForm = z.infer<typeof schema>

const details = [
  { icon: Mail, label: 'Email', value: 'hello@digiayudh.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 018-2049' },
  { icon: MapPin, label: 'Office', value: 'Bengaluru · Remote-first' },
]
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      countryCode: '+91',
      phone: '',
      country: 'India',
    },
  })

export function ContactSection() {
  const dispatch = useAppDispatch()
  const submitting = useAppSelector((s) => s.contact.submitting)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: ContactForm) => {
    const result = await dispatch(submitContactRequest(values))
    if (submitContactRequest.fulfilled.match(result)) {
      toast.success('Thanks! Our team will reach out shortly.')
      reset()
    } else {
      toast.error((result.payload as string) || 'Something went wrong. Try again.')
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">Let&apos;s talk</h2>
            <p className="mt-4 max-w-md text-pretty text-lg text-text-muted">
              Have a question or want a personalized demo? Send us a message and our team will get back to you.
            </p>
            <div className="mt-10 space-y-6">
              {details.map((d) => (
                <div key={d.label} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <d.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">{d.label}</div>
                    <div className="font-medium text-foreground">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" htmlFor="c-name" error={errors.name?.message} required>
                <Input id="c-name" placeholder="   Ayush" {...register('name')} />
              </FormField>
              <FormField label="Email" htmlFor="c-email" error={errors.email?.message} required>
                <Input id="c-email" type="email" placeholder="   ayush@company.com" {...register('email')} />
              </FormField>
                      <Field label="Phone Number" error={errors.phone?.message}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                country="in"
                enableSearch
                value={field.value}
                onChange={(value, country) => {
                  field.onChange(value)

                  if (country && typeof country !== 'string') {
                    setValue('countryCode', `+${country.dialCode}`)
                  }
                }}
                inputStyle={{
                  width: '100%',
                  height: '46px',
                  background: '#0F172A',
                  color: '#fff',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  paddingLeft: '52px',
                  fontSize: '14px',
                }}
                buttonStyle={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '12px 0 0 12px',
                }}
                dropdownStyle={{
                  background: '#0F172A',
                  color: '#fff',
                  border: '1px solid #334155',
                  maxHeight: '300px',
                }}
                searchStyle={{
                  background: '#1E293B',
                  color: '#fff',
                }}
              />
            )}
          />
        </Field>

        <input type="hidden" {...register('countryCode')} />
              <FormField label="Company" htmlFor="c-company" error={errors.company?.message}>
                <Input id="c-company" placeholder="   DigiAyudh." {...register('company')} />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Subject" htmlFor="c-subject" error={errors.subject?.message} required>
                <Input id="c-subject" placeholder="   How can we help?" {...register('subject')} />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Message" htmlFor="c-message" error={errors.message?.message} required>
                <Textarea id="c-message" rows={5} placeholder="Tell us about your team and goals..." {...register('message')} />
              </FormField>
            </div>
            <Button type="submit" className="mt-6 w-full" isLoading={submitting}>
              Send Message
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
