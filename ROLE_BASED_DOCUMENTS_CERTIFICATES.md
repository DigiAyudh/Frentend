# Role-Based Documents & Certificates Implementation

## Overview
Enhanced the document upload system with role-based authorization and restricted certificates to admin-only management.

---

## 1. Employee Document Uploads

### Changes Made:
- **DocumentsPage.tsx** - Enhanced to support uploads from employees in addition to clients
- Role-based authorization checks determine upload capabilities
- Employees can upload and share documents with admins and clients

### Authorization Levels:
- **Clients**: Can upload/share documents with admins and employees
- **Employees**: Can upload/share documents with admins and clients
- **Admins**: Can upload/share documents with all team members

### Features:
- Upload files (up to 50MB)
- Add external resource links
- Delete own uploads (or admins can delete any)
- Tab-based interface (Files | Links)
- Info banner showing user's upload permissions
- Sample employee documents included (e.g., "Technical Implementation Guide")

### Code Updates:
```typescript
const isEmployee = user?.role === 'employee'
const isAdmin = user?.role === 'admin'
const canUpload = isClient || isEmployee || isAdmin

// Delete authorization check:
if (user?.email !== uploadedBy && !isAdmin) {
  toast.error('You can only delete documents you uploaded')
  return
}
```

---

## 2. Certificates Section - Client Dashboard Hidden

### Changes Made:
- **ProfilePage.tsx** - Added role-based conditional rendering
- Certificates section now hidden for clients
- Visible to employees and admins only

### Implementation:
```typescript
const isClient = user?.role === 'client'

// Render certificates only for non-clients:
{!isClient && employeeCertificates.length > 0 && (
  <Card>
    {/* Certificates section */}
  </Card>
)}
```

### Rationale:
- Admins are responsible for issuing certificates to employees
- Clients don't have certificates (they're business partners, not staff)
- Only employees can view their own credentials on their profiles

---

## 3. Admin-Only Certificate Management

### Changes Made:
- **CertificatesPage.tsx** - Added admin-only information banner
- Clarifies that only admins can create and manage certificates
- Explains employees will see certificates on their profiles

### Information Banner:
- Styled Card component with AlertCircle icon
- Informs about admin-only restriction
- Notes that employees receive public verification links

---

## 4. Feature Summary

### Documents & Links:
| Feature | Client | Employee | Admin |
|---------|--------|----------|-------|
| Upload Files | ✓ | ✓ | ✓ |
| Add Links | ✓ | ✓ | ✓ |
| Delete Own | ✓ | ✓ | ✓ |
| Delete Any | ✗ | ✗ | ✓ |
| View All | ✓ | ✓ | ✓ |

### Certificates:
| Feature | Client | Employee | Admin |
|---------|--------|----------|-------|
| View Certificates | ✗ | ✓ | ✓ |
| Issue Certificates | ✗ | ✗ | ✓ |
| Share Public Link | ✗ | ✓ | ✓ |

---

## 5. User Experience Enhancements

### DocumentsPage:
- Info banner explains what each role can do with documents
- Visual indicators for upload-capable users
- Clear delete restrictions with error messages
- Tab-based organization (Files vs Links)

### ProfilePage:
- Clients see no certificates section (cleaner interface)
- Employees see their earned credentials
- Admins see their own certificates (if any)

### CertificatesPage:
- Clear admin-only banner at top
- Explains certificate distribution to employees
- Professional, informative interface

---

## 6. Sample Data

### Documents:
1. **Client Upload**: "Project Requirement Document" (PDF, 2MB)
2. **Client Link**: "API Documentation" (External link)
3. **Employee Upload**: "Technical Implementation Guide" (3MB)
4. **Employee Link**: "GitHub Repository" (Private to admin/employee)

### Visibility:
- Client docs: Visible to [admin, employee, client]
- Employee docs: Visible to [admin, employee] or [admin, employee, client]
- Admin docs: Visible to all

---

## 7. Files Modified

1. `/vercel/share/v0-project/src/pages/shared/DocumentsPage.tsx`
   - Added role checks and upload authorization
   - Enhanced delete logic
   - Added info banner
   - Added employee sample documents

2. `/vercel/share/v0-project/src/pages/shared/ProfilePage.tsx`
   - Added isClient check
   - Conditional rendering of certificates

3. `/vercel/share/v0-project/src/pages/admin/CertificatesPage.tsx`
   - Added admin-only information banner
   - Clarified certificate management restrictions

---

## 8. Technical Details

### Authorization Pattern:
- Role-based access control (RBAC)
- Email-based ownership checks for deletions
- Admin override capability for all documents
- Non-intrusive for client experience (hidden when not applicable)

### Error Handling:
- Toast notifications for unauthorized actions
- Graceful degradation (no errors, just hidden UI)
- Clear messaging about permissions

---

## 9. Testing Checklist

- [ ] Login as client - upload documents works
- [ ] Login as client - no certificates section visible
- [ ] Login as employee - upload documents works
- [ ] Login as employee - can see certificates
- [ ] Login as employee - can delete own documents
- [ ] Login as admin - upload documents works
- [ ] Login as admin - can delete any document
- [ ] Admin dashboard - certificates management page accessible
- [ ] Info banners display correctly for each role

---

## 10. Future Enhancements

1. Add document version control
2. Implement document approval workflow
3. Add certificate expiry notifications
4. Create certificate templates
5. Add document access logs
6. Implement document sharing with external parties
7. Add bulk certificate upload for admins
