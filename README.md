# biterush — MongoDB-backed user data

Your food delivery app now stores everything tied to a logged-in user —
profile, cart, saved addresses, applied coupon, and full order history — in
MongoDB instead of the browser's localStorage. That means it follows the
user to any device or browser the moment they log back in.

## What changed

- **`backend/`** — a small Node/Express + Mongoose API (new).
- **`frontend/FoodDeliveryApp.jsx`** — your original component, edited to call
  that API instead of `localStorage` for everything except the login token
  itself. UI, styling, WhatsApp order alerts, and all other logic are untouched.

Data model:
- **User** — name, email, hashed password, phone, avatar, `cart`, `addresses`, `appliedCoupon`
- **Order** — one document per placed order, linked to the user who placed it

## 1. Get a MongoDB database

Pick one:
- **MongoDB Atlas (free, no install)** — create a free cluster at
  https://www.mongodb.com/cloud/atlas, add a database user, allow your IP
  (or `0.0.0.0/0` for quick testing), and copy the connection string.
- **Local MongoDB** — install it and it'll run at `mongodb://127.0.0.1:27017`.

## 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=<your connection string>
JWT_SECRET=<a long random string>
PORT=5000
```

Generate a `JWT_SECRET` quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

(Optional) recreate the two demo accounts the app used to ship with, so the
"Quick demo" login hint keeps working:
```bash
npm run seed
# creates vasu@bitrush.com / 1234  and  demo@bitrush.com / demo
```

Start the server:
```bash
npm start          # or: npm run dev  (auto-restarts on changes, needs nodemon)
```

You should see:
```
✅ MongoDB connected
🚀 API server running on http://localhost:5000
```

## 3. Point the frontend at your backend

In `frontend/FoodDeliveryApp.jsx`, near the top:
```js
const API_BASE_URL = "http://localhost:5000/api";
```
Change this to wherever you deploy the backend (e.g. `https://your-api.onrender.com/api`).

Then drop `FoodDeliveryApp.jsx` into your React project exactly as before —
nothing else about how you build/run the frontend changes.

## API reference

All routes are prefixed with `/api`. Endpoints under `/user` and `/orders`
require an `Authorization: Bearer <token>` header, obtained from
`/auth/login` or `/auth/signup`.

| Method | Path              | Body                    | Purpose                          |
|--------|-------------------|--------------------------|-----------------------------------|
| POST   | `/auth/signup`    | `{name,email,password,phone}` | Create account, returns `{token,user}` |
| POST   | `/auth/login`     | `{email,password}`       | Log in, returns `{token,user}`   |
| GET    | `/auth/me`        | —                        | Restore session from token       |
| PUT    | `/user/cart`      | `{cart}`                 | Save current cart                |
| PUT    | `/user/addresses` | `{addresses}`            | Save address list                |
| PUT    | `/user/coupon`    | `{coupon}`               | Save applied coupon              |
| GET    | `/orders`         | —                        | List this user's past orders     |
| POST   | `/orders`         | `{order}`                | Place a new order                |

## Notes

- Passwords are hashed with bcrypt before hitting the database — never stored in plain text.
- The frontend still keeps the JWT itself in `localStorage` (just the token,
  not any user data) so a refresh doesn't log the user out; everything else
  is fetched fresh from MongoDB.
- CORS is wide open (`cors()`) for easy local development — tighten it
  (`cors({ origin: "https://your-frontend-domain" })`) before going to production.
- The WhatsApp order-alert integration (UltraMsg) is unchanged and still
  fires from the frontend directly, as it did before.
