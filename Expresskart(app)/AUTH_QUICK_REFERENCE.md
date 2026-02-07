# Authentication Quick Reference

## 🔐 Password Requirements

Your password must meet ALL of these criteria:

- ✅ At least **6 characters** long
- ✅ Contains at least **one uppercase letter** (A-Z)
- ✅ Contains at least **one lowercase letter** (a-z)
- ✅ Contains at least **one number** (0-9)

**Examples:**
- ✅ `Password123` - Valid
- ✅ `MyPass99` - Valid
- ❌ `password` - Missing uppercase and number
- ❌ `PASSWORD123` - Missing lowercase
- ❌ `MyPassword` - Missing number

## 📧 Login Credentials

### Test Accounts (from your database):

**Admin Account:**
- Email: `admin@test.com`
- Password: `password123`

**User Account:**
- Email: `user@test.com`
- Password: `password123`

**Vendor Account:**
- Email: `vendor@test.com`
- Password: `password123`

## 🎯 Common Issues & Solutions

### "No token available for request"
- **Status:** ✅ Normal (not an error!)
- **Why:** This message appeared for login requests (which don't need tokens)
- **Fixed:** This confusing warning has been removed

### "Invalid email or password"
- **Check:** Email format is correct
- **Check:** Password is typed correctly (case-sensitive)
- **Check:** Account exists in database

### "Password must contain uppercase, lowercase, and numbers"
- **Action:** Update password to meet requirements
- **Example:** Change `password` to `Password123`

### "Account has been deactivated"
- **Action:** Contact system administrator
- **Status Code:** 403 Forbidden

### "An account with this email already exists"
- **Action:** Use the login page instead
- **Action:** Or use "Forgot Password" to reset

## 📝 Registration Tips

1. **Name:** 2-50 characters, letters and spaces only
2. **Email:** Must be a valid email format
3. **Password:** Must meet all requirements above
4. **Confirm Password:** Must match exactly
5. **Phone:** Optional, international format supported

## 🚀 New Features

### Login Page
- ✅ Email format validation
- ✅ Specific error messages
- ✅ Network error detection
- ✅ Personalized welcome message

### Register Page
- ✅ Real-time validation
- ✅ Password strength checking
- ✅ Duplicate email detection
- ✅ Clear error messages

## 🔒 Security Improvements

1. **Strong passwords enforced**
2. **Input sanitization**
3. **Account deactivation check**
4. **Generic auth errors** (prevents email enumeration)
5. **Role-based access control**

## 📱 Testing Your Setup

### Quick Test:
1. Go to login page
2. Use demo credentials: `admin@test.com` / `password123`
3. You should see: "Welcome back, [Your Name]! 🎉"
4. You'll be redirected to dashboard

### Register New Account:
1. Go to register page
2. Fill all required fields
3. Password must meet all requirements
4. On success: "Welcome to ExpressKart, [Your Name]! 🎉"

## ⚠️ Error Messages Explained

| Error Message | What it means | What to do |
|---------------|---------------|------------|
| Invalid email or password | Credentials don't match | Check email/password carefully |
| Account deactivated | Admin disabled your account | Contact support |
| Email already exists | Account already registered | Use login instead |
| Cannot connect to server | Network/server issue | Check connection, try again |
| Password too weak | Doesn't meet requirements | Add uppercase, lowercase, numbers |
| Passwords do not match | Confirmation mismatch | Retype confirmation password |

## 🎨 UI Improvements

- Removed confusing console warnings
- Better error message placement
- Loading states with descriptive text
- Success messages with emojis
- Cleaner validation feedback

## 💡 Pro Tips

1. **Use the demo credentials shown on the login page** - They're always up-to-date
2. **Check password requirements before submitting** - Saves time
3. **Network errors?** - Check if both client and server are running
4. **Forgot password?** - Feature exists in backend, UI coming soon

## 🔧 For Developers

### Client is running on:
```
http://localhost:3000
```

### Server is running on:
```
http://localhost:5000
```

### API Base URL:
```
http://localhost:5000/api
```

### Auth Endpoints:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/create-admin` - Create admin (first time only)
- `GET /api/auth/check-admin` - Check if admin exists
- `GET /api/auth/me` - Get current user (requires token)

### Testing with cURL:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@test.com",
    "password":"Password123",
    "role":"user"
  }'
```
