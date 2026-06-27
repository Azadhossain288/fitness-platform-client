# IronPulse — Fitness & Gym Management Platform

## Project Purpose
IronPulse is a comprehensive fitness management platform designed for fitness enthusiasts, gym trainers, and administrators. Users can discover fitness classes, book sessions, participate in community discussions, and track their fitness journey. Trainers can list their classes, manage attendees, and share knowledge. Administrators oversee the entire platform's operations, user roles, and community guidelines.

## 🔗 Live URL
**fitness-platform-client-rxw4.vercel.app**

##  Key Features

- **Authentication** — Email/password and Google login using Better Auth with JWT stored in HTTPOnly cookies
- **Browse & Search Classes** — Search by name ($regex) and filter by category ($in) with server-side pagination
- **Book Classes** — Stripe-powered checkout with duplicate booking prevention
- **Favorites** — Save and manage favorite classes from the dashboard
- **Community Forum** — Trainers and admins post content; users can like, dislike, comment and reply
- **Role-Based Dashboard** — Separate dashboards for User, Trainer, and Admin
- **Trainer Application** — Users can apply to become trainers; admins approve or reject with feedback
- **Admin Controls** — Manage users (block/unblock), classes (approve/reject/delete), trainers, transactions, and forum posts
- **Responsive Design** — Fully responsive for mobile, tablet, and desktop

##  NPM Packages Used

### Client
| Package | Version |
|---------|---------|
| `next` | 14+ |
| `better-auth` | latest |
| `@tanstack/react-query` | ^5 |
| `axios` | ^1 |
| `framer-motion` | ^11 |
| `@stripe/react-stripe-js` | ^2 |
| `@stripe/stripe-js` | ^3 |
| `react-hot-toast` | ^2 |
| `react-icons` | ^5 |
| `tailwindcss` | ^3 |
| `mongodb` | ^6 |

### Server
| Package | Version |
|---------|---------|
| `express` | ^4 |
| `mongodb` | ^6 |
| `jsonwebtoken` | ^9 |
| `cookie-parser` | ^1 |
| `cors` | ^2 |
| `dotenv` | ^16 |
| `stripe` | ^15 |
| `nodemon` | ^3 |

## 👤 Admin Credentials
- **Email:** admin123@gmail.com
- **Password:** Admin123
