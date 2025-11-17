# 📝 Blogging System Documentation

A full-featured blogging system with administrative panel built with Next.js 15, Prisma, PostgreSQL, and NextAuth.js.

## Features

### ✨ Admin Panel
- **Dashboard** - Overview of posts, leads, and statistics
- **Post Management** - Create, edit, delete blog posts
- **Rich Text Editor** - WYSIWYG editor powered by Tiptap
- **Media Library** - Image management (placeholder for future implementation)
- **Lead Management** - View and manage contact form submissions
- **Categories & Tags** - Organize posts with categories and tags
- **SEO Optimization** - Custom meta titles and descriptions
- **Draft/Published Status** - Save drafts before publishing
- **Featured Posts** - Highlight important posts
- **View Counter** - Track post views

### 🎨 Frontend
- **Blog Listing** - Browse all published posts
- **Individual Post Pages** - Read full articles
- **Related Posts** - Intelligent post recommendations
- **Categories** - Filter posts by category
- **Tags** - Tag-based navigation
- **Responsive Design** - Mobile-friendly layouts
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards

### 🔐 Authentication
- **NextAuth.js v5** - Secure authentication
- **Role-based Access** - Admin, editor, viewer roles
- **Protected Routes** - Middleware-based protection
- **Session Management** - JWT-based sessions

### 📊 Database
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database access
- **Models**:
  - User - Admin users
  - Post - Blog posts
  - Category - Post categories
  - Tag - Post tags
  - Media - Uploaded files (future)
  - Lead - Contact form submissions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Editor**: Tiptap
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Language**: TypeScript

## Project Structure

```
dental-website/
├── prisma/
│   └── schema.prisma           # Database schema
├── scripts/
│   └── migrate-mdx-to-db.ts   # MDX migration script
├── src/
│   ├── app/
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── dashboard/     # Dashboard
│   │   │   ├── posts/         # Post management
│   │   │   ├── leads/         # Lead management
│   │   │   ├── media/         # Media library
│   │   │   └── settings/      # Settings
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── posts/         # Posts CRUD
│   │   │   ├── categories/    # Categories API
│   │   │   └── tags/          # Tags API
│   │   ├── blog/              # Public blog pages
│   │   └── login/             # Login page
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── PostForm.tsx
│   │   │   └── ...
│   │   ├── blog/              # Blog components
│   │   └── shared/            # Shared components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   └── db.ts              # Prisma client
│   └── middleware.ts          # Route protection
├── .env.example               # Environment template
├── RAILWAY_DEPLOYMENT.md      # Deployment guide
└── README_BLOGGING_SYSTEM.md  # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

### Local Development

1. **Clone the repository**

```bash
cd dental-website
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dental_db"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. **Set up database**

```bash
# Create database
createdb dental_db

# Run migrations
npm run db:push

# Or create migration
npm run db:migrate
```

5. **Create admin user**

You can create an admin user in two ways:

**Option A: Use the migration script**

```bash
npx ts-node scripts/migrate-mdx-to-db.ts
```

This creates a default admin: `admin@clinica.com` / `admin123`

**Option B: Use Prisma Studio**

```bash
npm run db:studio
```

Then manually create a user (remember to hash the password with bcrypt).

6. **Start development server**

```bash
npm run dev
```

7. **Access the application**

- Website: http://localhost:3000
- Admin: http://localhost:3000/login
- Prisma Studio: `npm run db:studio`

## Usage

### Creating a Blog Post

1. Login to admin panel at `/login`
2. Navigate to "Posts" → "New Post"
3. Fill in:
   - Title (required)
   - Slug (auto-generated from title)
   - Content (use rich text editor)
   - Excerpt (optional summary)
   - Featured image URL
   - Category & tags
   - SEO title & description
4. Save as Draft or Publish immediately

### Managing Categories & Tags

Categories and tags are created through the API or Prisma Studio:

**Using Prisma Studio:**

```bash
npm run db:studio
```

**Using API:**

```bash
# Create category
POST /api/categories
{
  "name": "Diagnóstico",
  "slug": "diagnostico",
  "description": "Artigos sobre diagnóstico"
}

# Create tag
POST /api/tags
{
  "name": "bruxismo",
  "slug": "bruxismo"
}
```

### Managing Leads

All contact form submissions are stored in the database and visible in the admin panel:

1. Go to Admin → Leads
2. View all submissions with:
   - Contact details
   - Treatment interest
   - UTM tracking data
   - Submission date

## API Routes

### Posts

- `GET /api/posts` - List all posts (with filters)
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category

### Tags

- `GET /api/tags` - List all tags
- `POST /api/tags` - Create tag

## Database Schema

### Key Models

**User**
- id, email, password, name, role
- Relations: posts, accounts, sessions

**Post**
- id, title, slug, content, excerpt
- status (draft/published/scheduled)
- featured, views, readingTime
- Relations: author, category, tags

**Category**
- id, name, slug, description
- Relations: posts

**Tag**
- id, name, slug
- Relations: posts

**Lead**
- id, name, email, phone, treatment, message
- UTM tracking fields
- status (new/contacted/qualified/converted)

## Deployment

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Railway

1. Push code to GitHub
2. Connect Railway to your repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

## Customization

### Changing Colors

Edit Tailwind config or use CSS variables defined in the components.

### Adding New Fields to Posts

1. Update Prisma schema
2. Run migration
3. Update API routes
4. Update PostForm component

### Custom Authentication

The system uses NextAuth with credentials provider. To add OAuth:

1. Update `src/lib/auth.ts`
2. Add provider (Google, GitHub, etc.)
3. Configure environment variables

## Security

- Passwords hashed with bcrypt
- JWT-based sessions
- Route protection via middleware
- CSRF protection through NextAuth
- SQL injection prevention via Prisma
- XSS prevention through React

## Performance

- Server-side rendering (SSR)
- Incremental Static Regeneration (ISR)
- Database query optimization
- Image optimization (Next.js Image)

## Troubleshooting

### "Prisma Client not found"

```bash
npm run db:generate
```

### Database connection errors

Check `DATABASE_URL` in `.env`

### NextAuth errors

Ensure `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your URL

### Build errors

```bash
rm -rf .next node_modules
npm install
npm run build
```

## Future Enhancements

- [ ] Image upload to cloud storage (Cloudinary/S3)
- [ ] Comment system
- [ ] Post scheduling
- [ ] Newsletter integration
- [ ] Analytics dashboard
- [ ] Post revisions/history
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Full-text search

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License]

## Support

For issues or questions:
- Create a GitHub issue
- Contact: [your-email@example.com]

---

Built with ❤️ using Next.js, Prisma, and PostgreSQL
