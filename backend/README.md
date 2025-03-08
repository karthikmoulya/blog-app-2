# Blog Application

This is a **Blog Application** built using **NestJS** for the backend and **Angular** for the frontend. The app includes user authentication with Google and Facebook, JWT-based session management, and full CRUD operations for blog posts.

---

## 🚀 Technologies Used

### **Backend (NestJS + MongoDB)**

- NestJS (with Express)
- Mongoose (MongoDB ORM)
- PassportJS (Google & Facebook Authentication)
- JWT (JSON Web Token for authentication)
- Bcrypt (Password Hashing)
- Dotenv (Environment Variable Management)

### **Frontend (Angular)**

- Angular 17+
- Angular Router
- Angular Forms
- HttpClient
- Angular Guards (AuthGuard)
- Bootstrap (for styling)

---

## 📂 Folder Structure

### **Backend (**``**):**

```
backend/
│── src/
│   ├── auth/           # Authentication (Google, Facebook, JWT)
│   ├── users/          # User Model & Service
│   ├── posts/          # CRUD operations for blog posts
│   ├── config/         # Configuration files (Passport, JWT, MongoDB)
│   ├── main.ts         # Application entry point
│   ├── app.module.ts   # Main Module
│── .env                # Environment Variables
│── package.json        # Dependencies
│── tsconfig.json       # TypeScript Config
```

### **Frontend (**``**):**

```
frontend/
│── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/        # Login Page
│   │   │   ├── dashboard/    # Dashboard with posts
│   │   │   ├── create-post/  # Post Creation
│   │   │   ├── post-detail/  # Single Post Detail
│   │   ├── services/         # Auth & API Services
│   │   ├── guards/           # AuthGuard for routes
│   │   ├── app-routing.module.ts  # Angular Routes
│   │   ├── app.module.ts          # Main Module
│── environments/
│   ├── environment.ts        # Development Config
│   ├── environment.prod.ts   # Production Config
│── package.json             # Dependencies
│── angular.json             # Angular Config
```

---

## 🔧 Setup Instructions

### **1️⃣ Backend Setup**

```sh
cd backend
npm install
```

- Configure **MongoDB** and **Auth Credentials** in `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/blog-db
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

- Start the backend:

```sh
npm run start:dev
```

### **2️⃣ Frontend Setup**

```sh
cd frontend
npm install
```

- Configure **API URL** in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

- Start the frontend:

```sh
ng serve
```

---

## 🔑 Authentication Flow

1. Users can log in via **Google** or **Facebook**.
2. The backend verifies the authentication and issues a **JWT token**.
3. The frontend stores the JWT in **localStorage** and uses it for authenticated API requests.
4. The **AuthGuard** protects restricted routes (e.g., dashboard, post creation).

---

## 📝 API Endpoints (Backend)

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| POST   | /auth/google   | Google OAuth Login   |
| POST   | /auth/facebook | Facebook OAuth Login |
| POST   | /auth/login    | JWT Login            |
| GET    | /posts         | Fetch All Posts      |
| POST   | /posts         | Create New Post      |
| GET    | /posts/\:id    | Get Post Details     |
| PUT    | /posts/\:id    | Update Post          |
| DELETE | /posts/\:id    | Delete Post          |

---

## ✅ Features

✔ User authentication via **Google & Facebook**\
✔ JWT-based authentication & role-based access\
✔ CRUD operations for **blog posts**\
✔ Angular **Route Guards** for protected pages\
✔ Responsive **UI with Bootstrap**\
✔ MongoDB **storage for users & posts**\
✔ Environment-specific configuration support

## 📜 License

This project is open-source and available under the **MIT License**.

---

## 📬 Need Help?

If you have any questions or issues, feel free to reach out!
