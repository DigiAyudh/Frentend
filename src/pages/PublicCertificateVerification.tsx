import { useParams } from 'react-router-dom'
import { CheckCircle2, AlertCircle, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { formatDate } from '../lib/utils'

interface CertificateData {
  verificationToken: string
  employeeName: string
  title: string
  issueDate: string
  expiryDate?: string
  issuedBy: string
  isValid: boolean
  isExpired: boolean
}

// Mock certificate database - in production, this would come from your backend
const certificateDatabase: Record<string, CertificateData> = {
  verify_token_1: {
    verificationToken: 'verify_token_1',
    employeeName: 'James Wilson',
    title: 'AWS Solutions Architect Certified',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    issuedBy: 'Amazon Web Services',
    isValid: true,
    isExpired: false,
  },
  verify_token_2: {
    verificationToken: 'verify_token_2',
    employeeName: 'Maya Patel',
    title: 'Google Cloud Professional Data Engineer',
    issueDate: '2024-01-10',
    expiryDate: '2026-01-10',
    issuedBy: 'Google Cloud',
    isValid: true,
    isExpired: false,
  },
}

export default function PublicCertificateVerification() {
  const { token } = useParams<{ token: string }>()
  const certificate = token ? certificateDatabase[token] : null
  const isExpired = certificate?.expiryDate && new Date(certificate.expiryDate) < new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            {certificate ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Certificate Verification
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-destructive" />
                Invalid Certificate
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          {certificate ? (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                {isExpired ? (
                  <Badge variant="destructive" className="text-base px-4 py-2">
                    EXPIRED
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-base px-4 py-2 bg-green-600">
                    VALID & ACTIVE
                  </Badge>
                )}
              </div>

              {/* Certificate Details */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-text-light mb-1">Credential Title</p>
                  <h2 className="text-2xl font-bold text-foreground">{certificate.title}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-text-light mb-1">Earned By</p>
                    <p className="text-lg font-semibold">{certificate.employeeName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-text-light mb-1">Issued By</p>
                    <p className="text-lg font-semibold">{certificate.issuedBy}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-text-light">Issue Date</p>
                      <p className="font-medium">{formatDate(certificate.issueDate)}</p>
                    </div>
                  </div>

                  {certificate.expiryDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className={`h-5 w-5 ${isExpired ? 'text-destructive' : 'text-primary'} mt-1 flex-shrink-0`} />
                      <div>
                        <p className="text-sm text-text-light">
                          {isExpired ? 'Expired' : 'Valid Until'}
                        </p>
                        <p className={`font-medium ${isExpired ? 'text-destructive' : ''}`}>
                          {formatDate(certificate.expiryDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Information */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-300">Certificate is authentic</p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      This certificate has been verified and is authentic. It was issued by the organization mentioned above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Token */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-text-light mb-2">Verification Token</p>
                <p className="font-mono text-sm break-all text-foreground">{certificate.verificationToken}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h2 className="text-2xl font-bold">Certificate Not Found</h2>
                <p className="text-text-light mt-2">
                  {token
                    ? 'The certificate verification token is invalid or has expired.'
                    : 'No token provided. Please check the verification link.'}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-700 dark:text-red-400">
                  If you believe this is an error, please contact the issuing organization.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
