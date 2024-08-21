# ![Favicon](https://raw.githubusercontent.com/pkunv/abc-blog/main/public/favicon.ico) ABC Blog

![GitHub package.json version](https://img.shields.io/github/package-json/v/pkunv/abc-blog)
![GitHub package.json next.js dependency version](https://img.shields.io/github/package-json/dependency-version/pkunv/abc-blog/next)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpkunv%2Fabc-blog)

## Overview

Full stack web application to create a personal blog.\
Easy to use and user friendly UI.

## Functionalities

- Rich text format
- Simple impression collecting system
- Copy & paste content from Word, HTML and Markdown
- Own About and Contact page
- Responsive design
- Blog posts categories (default by year and month)
- Drafts
- SEO-optimized
- Dark and light theme
- Search queries
- Data cache

## Tech stack

This project is scaffolded using [**Create T3 App**](https://create.t3.gg/en/introduction).
This is the fastest way to build type-safe web app using NEXT.js.

| **Subject**       | **Solution** |
| ----------------- | ------------ |
| Main framework    | NEXT.js      |
| Admin Auth        | NextAuth     |
| API Library       | tRPC         |
| Database ORM      | Prisma       |
| Database          | Postgres     |
| CSS Framework     | Tailwind CSS |
| Component library | shadcn/ui    |

## Installation

1. Create .env file or pass to your deployment platform values accordingly:

```
DATABASE_URL="postgres://" # PostgreSQL database url connection string
NEXTAUTH_SECRET="" # NextAuth secret key, you can copy & paste a new one from here: https://generate-secret.vercel.app/32
NEXTAUTH_URL="http://your-blog.com" # URL of your deployed blog

ADMIN_USERNAME="" # Admin dashboard username
ADMIN_PASSWORD="" # Admin dashboard password

BLOG_LANGUAGE="en-US" # Blog language, this value will displayed datetime format
BLOG_NAME="ABC Blog" # Global blog name appended in metadata, header and footer
BLOG_THEME="dark" # Blog theme, available "light" or "black"
BLOG_KEYWORDS="nextjs, prisma, next-auth, tailwindcss, blog" # Keywords for SEO

LOCALIZE_MONTHS_BY_LANG="1" # When enabled, standard "year-month" blog post category will be displayed in words.
```

> **Warning:**
> ABC Blog currently supports only one admin user that is configured by .env file.

2. Run `npm i` to install dependencies and populate your database.

3. Run `npm run dev` to run local development server.

4. Use `/api/auth/signin` link to sign in to admin dashboard.
