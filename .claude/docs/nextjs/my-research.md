# Next.js API Routes & Route Handlers Research

**Research Date:** 2025-10-05
**Next.js Version:** 15
**Focus:** App Router (Primary) and Pages Router (Legacy)

---

## Table of Contents

1. [Overview](#overview)
2. [Terminology: Route Handlers vs API Routes](#terminology-route-handlers-vs-api-routes)
3. [Route Handlers (App Router - Next.js 15)](#route-handlers-app-router---nextjs-15)
4. [API Routes (Pages Router - Legacy)](#api-routes-pages-router---legacy)
5. [When to Use API Routes vs Server Actions](#when-to-use-api-routes-vs-server-actions)
6. [Migration Guide](#migration-guide)
7. [Best Practices](#best-practices)

---

## Overview

Next.js provides two different approaches for creating API endpoints depending on which router you're using:

- **Route Handlers** (`route.ts`/`route.js`) - Modern approach for App Router (Next.js 13+)
- **API Routes** (`pages/api/*`) - Traditional approach for Pages Router

Both allow you to create server-side API endpoints, but they differ significantly in their implementation, capabilities, and use cases.

---

## Terminology: Route Handlers vs API Routes

### Route Handlers (App Router)
- **File Location:** `app/*/route.ts` or `app/*/route.js`
- **URL Pattern:** Any route segment in the `app` directory
- **Based On:** Web Request and Response APIs (standard)
- **TypeScript Types:** `Request`, `NextRequest`, `NextResponse`

### API Routes (Pages Router)
- **File Location:** `pages/api/*`
- **URL Pattern:** `/api/*` paths only
- **Based On:** Node.js `http.IncomingMessage` and `http.ServerResponse`
- **TypeScript Types:** `NextApiRequest`, `NextApiResponse`

**Important:** Route Handlers and API Routes **cannot coexist** in the same route segment. If you define both, Route Handlers will take precedence.

---

## Route Handlers (App Router - Next.js 15)

### 1. File Structure and Naming Conventions

Route Handlers are defined in special `route.ts` or `route.js` files within the `app` directory:

```
app/
├── api/
│   ├── users/
│   │   └── route.ts          # /api/users
│   ├── posts/
│   │   ├── route.ts          # /api/posts
│   │   └── [id]/
│   │       └── route.ts      # /api/posts/:id
│   └── auth/
│       └── login/
│           └── route.ts      # /api/auth/login
```

**Key Points:**
- File must be named `route.ts` or `route.js`
- Located anywhere in the `app` directory structure
- The directory path determines the URL route
- Cannot have a `page.tsx` and `route.ts` in the same directory

### 2. Supported HTTP Methods

Route Handlers support all standard HTTP methods:

```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  // Handle GET requests
}

export async function POST(request: Request) {
  // Handle POST requests
}

export async function PUT(request: Request) {
  // Handle PUT requests
}

export async function PATCH(request: Request) {
  // Handle PATCH requests
}

export async function DELETE(request: Request) {
  // Handle DELETE requests
}

export async function HEAD(request: Request) {
  // Handle HEAD requests
}

export async function OPTIONS(request: Request) {
  // Handle OPTIONS requests
}
```

**Important Notes:**
- If an unsupported method is called, Next.js returns `405 Method Not Allowed`
- If `OPTIONS` is not defined, Next.js automatically implements it with the appropriate `Allow` header
- Each HTTP method must be exported as a named async function

### 3. Request Handling

#### Basic Request Structure

```typescript
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Request handling logic
  return Response.json({ message: 'Hello World' })
}
```

#### Reading Request Body (JSON)

```typescript
export async function POST(request: Request) {
  const body = await request.json()

  return Response.json({
    received: body
  })
}
```

#### Reading FormData

```typescript
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')

  // Note: formData values are always strings
  // Use zod-form-data for validation and type conversion

  return Response.json({ name, email })
}
```

#### Reading Raw Text (Webhooks)

```typescript
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // Process the webhook payload

    return new Response('Success!', { status: 200 })
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }
}
```

**Note:** Unlike Pages Router API Routes, Route Handlers do NOT require `bodyParser` configuration.

#### Accessing URL Query Parameters

```typescript
import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello

  return Response.json({ query })
}
```

#### Reading Cookies

```typescript
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')

  return Response.json({ token })
}
```

#### Reading Headers (Using NextRequest)

```typescript
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const userAgent = requestHeaders.get('user-agent')

  return Response.json({ userAgent })
}
```

#### Reading Headers (Using next/headers)

```typescript
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

### 4. Response Handling

#### Basic JSON Response

```typescript
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

#### Response with Custom Status Code

```typescript
export async function GET() {
  return new Response('Not Found', { status: 404 })
}
```

#### Response with Custom Headers

```typescript
export async function GET() {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'X-Custom-Header': 'value',
    },
  })
}
```

#### Setting Cookies in Response

```typescript
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()

  cookieStore.set('name', 'lee')
  // or with options
  cookieStore.set('name', 'lee', {
    secure: true,
    httpOnly: true,
    path: '/',
  })

  return Response.json({ success: true })
}
```

#### Redirects

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect(new URL('/new-location', request.url))
}
```

#### Empty Response (204/304 Status)

```typescript
export async function DELETE() {
  // For 204 No Content or 304 Not Modified
  // You MUST send an empty body
  return new Response(null, { status: 204 })
}
```

**Important:** Sending a body with 204 or 304 status codes will cause an error.

### 5. Dynamic Route Segments

```typescript
// app/api/posts/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug // 'a', 'b', or 'c'

  return Response.json({ slug })
}
```

**Route Examples:**
- `/api/posts/[slug]/route.ts` → `/api/posts/hello`
- `/api/posts/[...slug]/route.ts` → `/api/posts/a/b/c` (catch-all)
- `/api/posts/[[...slug]]/route.ts` → `/api/posts` or `/api/posts/a/b` (optional catch-all)

### 6. Streaming Responses

```typescript
// Using Web APIs directly
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}
```

### 7. CORS Configuration

```typescript
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

**Note:** For broader CORS configuration, consider using Middleware or `next.config.js` headers.

### 8. Caching Behavior

**Important Change in Next.js 15:**

GET Route Handlers are **NOT cached by default** in Next.js 15. To enable caching:

```typescript
// Force static caching
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://api.example.com/data', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

**Route Segment Config Options:**
- `dynamic`: `'auto'` | `'force-dynamic'` | `'force-static'`
- `revalidate`: `false` | `number` (seconds)
- `runtime`: `'nodejs'` | `'edge'`

### 9. Non-UI Content Generation

Route Handlers can generate non-UI content like RSS feeds, sitemaps, robots.txt:

```typescript
// app/rss.xml/route.ts
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```

### 10. Error Handling

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Process request
    const result = await someAsyncOperation(body)

    return Response.json({ result }, { status: 200 })
  } catch (error) {
    console.error('Error processing request:', error)

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 11. TypeScript Support

```typescript
import { type NextRequest } from 'next/server'

// Basic type safety
export async function GET(request: NextRequest) {
  return Response.json({ message: 'Hello World' })
}

// With dynamic route params
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return Response.json({ id })
}
```

### 12. NextRequest and NextResponse Extensions

**NextRequest** extends the Web Request API with:
- `cookies`: Cookie management
- `nextUrl`: Enhanced URL parsing and manipulation

**NextResponse** extends the Web Response API with:
- `cookies`: Cookie manipulation methods
- `redirect()`: Easy redirects
- `rewrite()`: URL rewriting
- `next()`: Continue to next middleware

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Set a cookie
  const response = NextResponse.json({ success: true })
  response.cookies.set('visited', 'true')

  return response
}
```

---

## API Routes (Pages Router - Legacy)

### 1. File Structure

API Routes are defined in the `pages/api` directory:

```
pages/
└── api/
    ├── hello.ts              # /api/hello
    ├── users/
    │   ├── index.ts          # /api/users
    │   └── [id].ts           # /api/users/:id
    └── posts/
        └── [...slug].ts      # /api/posts/* (catch-all)
```

### 2. Basic Handler Structure

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

### 3. HTTP Method Handling

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process a POST request
    res.status(200).json({ message: 'POST request processed' })
  } else if (req.method === 'GET') {
    // Process a GET request
    res.status(200).json({ message: 'GET request processed' })
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
```

### 4. Request Helpers

```typescript
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Access cookies
  const cookies = req.cookies // { name: 'value' }

  // Access query parameters
  const { id, search } = req.query // { id: '123', search: 'term' }

  // Access request body (automatically parsed based on content-type)
  const body = req.body // Object or null

  res.status(200).json({ cookies, query: req.query, body })
}
```

### 5. Response Helpers

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set status code
  res.status(200)

  // Send JSON response
  res.json({ message: 'Success' })

  // Or chain them
  res.status(200).json({ message: 'Success' })

  // Send any response (string, object, or Buffer)
  res.send({ data: 'some data' })

  // Redirect
  res.redirect(307, '/new-location')

  // Revalidate a page (ISR)
  await res.revalidate('/path-to-revalidate')

  // End response without body
  res.end()
}
```

### 6. Dynamic Routes

```typescript
// pages/api/posts/[pid].ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

**Catch-all Routes:**

```typescript
// pages/api/posts/[...slug].ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  // slug is an array: ['a', 'b', 'c']
  res.end(`Post: ${slug.join(', ')}`)
}
```

Query examples:
- `/api/posts/a` → `{ slug: ['a'] }`
- `/api/posts/a/b` → `{ slug: ['a', 'b'] }`

**Optional Catch-all:**

```typescript
// pages/api/posts/[[...slug]].ts
// Matches:
// /api/posts → {}
// /api/posts/a → { slug: ['a'] }
// /api/posts/a/b → { slug: ['a', 'b'] }
```

### 7. Custom Configuration

```typescript
export const config = {
  api: {
    // Disable body parsing (useful for webhooks)
    bodyParser: false,

    // Or configure body parser
    bodyParser: {
      sizeLimit: '1mb',
    },

    // Set response size limit (default: 4MB in serverless)
    responseLimit: '8mb',
    // or disable
    responseLimit: false,

    // Disable warning for unresolved requests (when using external resolvers)
    externalResolver: true,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handler logic
}
```

### 8. Error Handling

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await someAsyncOperation()
    res.status(200).json({ result })
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).json({ error: 'Failed to load data' })
  }
}
```

### 9. TypeScript Support

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

// Define response data type
type Data = {
  name: string
  email: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    name: 'John Doe',
    email: 'john@example.com'
  })
}
```

### 10. Limitations

- **Same-origin only** by default (no CORS unless configured)
- **Not compatible** with static exports (`output: 'export'`)
- **Serverless function** size and execution time limits apply
- **Cannot coexist** with Route Handlers in the same path

---

## When to Use API Routes vs Server Actions

In Next.js 15 with the App Router, you have three options for server-side logic:

1. **Server Actions** (Preferred for mutations)
2. **Route Handlers** (For REST API endpoints)
3. **Server Components** (For data fetching)

### Use Server Actions When:

✅ **Form submissions and mutations**
```typescript
// app/actions.ts
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')

  // Validate and process
  await db.user.create({ data: { name, email } })

  revalidatePath('/users')
  redirect('/users')
}
```

✅ **Direct React component integration**
```typescript
'use client'
import { createUser } from './actions'

export function SignupForm() {
  return <form action={createUser}>...</form>
}
```

✅ **Need built-in revalidation and redirect**
```typescript
'use server'

export async function updatePost(id: string, data: any) {
  await db.post.update({ where: { id }, data })

  revalidatePath('/posts')
  redirect(`/posts/${id}`)
}
```

✅ **Type-safe mutations with progressive enhancement**

**Advantages:**
- Seamless React integration
- Progressive enhancement support
- Built-in CSRF protection
- Automatic revalidation integration
- Type safety end-to-end

### Use Route Handlers When:

✅ **Building REST APIs for external consumption**
```typescript
// app/api/v1/users/route.ts
export async function GET() {
  const users = await db.user.findMany()
  return Response.json(users)
}
```

✅ **Webhook endpoints**
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const body = await request.text()

  // Verify and process webhook
  return new Response('Success', { status: 200 })
}
```

✅ **Third-party API integrations requiring special headers/auth**
```typescript
export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Process request
}
```

✅ **Non-UI content (RSS, sitemap, robots.txt)**
```typescript
export async function GET() {
  const sitemap = generateSitemap()

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
```

✅ **Streaming responses**
```typescript
export async function GET() {
  const stream = createReadableStream()
  return new Response(stream)
}
```

✅ **Custom CORS requirements**
```typescript
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://example.com',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
  })
}
```

**Advantages:**
- RESTful API patterns
- Full control over request/response
- CORS configuration
- Streaming support
- Standard HTTP semantics

### Use Server Components When:

✅ **Pure data fetching without mutations**
```typescript
// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await db.post.findMany()

  return <PostsList posts={posts} />
}
```

✅ **No client-side interaction needed**

**Advantages:**
- Automatic caching
- Parallel data fetching
- No waterfalls
- SEO-friendly

### Decision Matrix

| Scenario | Recommended Approach |
|----------|---------------------|
| Form submission | Server Action |
| Data mutation (create/update/delete) | Server Action |
| Data fetching for rendering | Server Component |
| REST API for external clients | Route Handler |
| Webhook endpoint | Route Handler |
| Third-party API integration | Route Handler |
| RSS/Sitemap generation | Route Handler |
| Real-time/Streaming data | Route Handler |
| CORS-enabled endpoint | Route Handler |

### Security Considerations

Both Server Actions and Route Handlers should be treated as **public API endpoints**:

```typescript
// Server Action with authorization
'use server'

import { verifySession } from '@/lib/dal'

export async function deletePost(formData: FormData) {
  const session = await verifySession()

  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // Proceed with deletion
}
```

```typescript
// Route Handler with authorization
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession()

  if (!session?.userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Proceed with deletion
}
```

---

## Migration Guide

### From API Routes to Route Handlers

**Before (Pages Router):**
```typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const users = await db.user.findMany()
    res.status(200).json(users)
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
```

**After (App Router):**
```typescript
// app/api/users/route.ts
export async function GET() {
  const users = await db.user.findMany()
  return Response.json(users)
}

// Next.js automatically handles 405 for unsupported methods
```

### Key Migration Changes

1. **File naming**: `pages/api/users.ts` → `app/api/users/route.ts`

2. **Export pattern**:
   - Before: `export default function handler(req, res)`
   - After: `export async function GET(request)`

3. **Request object**:
   - Before: `NextApiRequest` (Node.js API)
   - After: `Request` or `NextRequest` (Web API)

4. **Response pattern**:
   - Before: `res.status(200).json(data)`
   - After: `Response.json(data, { status: 200 })`

5. **Reading request body**:
   - Before: `req.body` (auto-parsed)
   - After: `await request.json()` or `await request.formData()`

6. **Query parameters**:
   - Before: `req.query`
   - After: `request.nextUrl.searchParams`

7. **Cookies**:
   - Before: `req.cookies`
   - After: `request.cookies` or `cookies()` from `next/headers`

8. **Headers**:
   - Before: `req.headers`
   - After: `request.headers` or `headers()` from `next/headers`

### Example: Complete Migration

**Before:**
```typescript
// pages/api/posts/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'GET') {
    const post = await db.post.findUnique({ where: { id: String(id) } })

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    return res.status(200).json(post)
  }

  if (req.method === 'PUT') {
    const post = await db.post.update({
      where: { id: String(id) },
      data: req.body,
    })

    return res.status(200).json(post)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
```

**After:**
```typescript
// app/api/posts/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const post = await db.post.findUnique({ where: { id } })

  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  return Response.json(post)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const post = await db.post.update({
    where: { id },
    data: body,
  })

  return Response.json(post)
}
```

---

## Best Practices

### 1. Authentication and Authorization

**Always verify user permissions in Route Handlers:**

```typescript
import { verifySession } from '@/lib/dal'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession()

  if (!session?.userId) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'admin') {
    return Response.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  // Proceed with deletion
}
```

**Use Middleware for route-wide authentication:**

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/dashboard']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
```

### 2. Input Validation

**Use Zod for type-safe validation:**

```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validated = createUserSchema.parse(body)

    // Process validated data
    const user = await db.user.create({ data: validated })

    return Response.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 3. Error Handling

**Comprehensive error handling pattern:**

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation
    if (!body.email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Business logic
    const result = await performOperation(body)

    return Response.json(result, { status: 200 })
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof ValidationError) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error instanceof NotFoundError) {
      return Response.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 4. Type Safety

**Define proper TypeScript types:**

```typescript
import { NextRequest } from 'next/server'

interface User {
  id: string
  name: string
  email: string
}

export async function GET(request: NextRequest): Promise<Response> {
  const users: User[] = await db.user.findMany()

  return Response.json(users)
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json()

  const user: User = await db.user.create({ data: body })

  return Response.json(user, { status: 201 })
}
```

### 5. Caching Strategy

**Be explicit about caching behavior:**

```typescript
// Static generation (cached)
export const dynamic = 'force-static'

export async function GET() {
  const data = await fetchStaticData()
  return Response.json(data)
}
```

```typescript
// Dynamic (never cached)
export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await fetchDynamicData()
  return Response.json(data)
}
```

```typescript
// Revalidate every 60 seconds
export const revalidate = 60

export async function GET() {
  const data = await fetchData()
  return Response.json(data)
}
```

### 6. CORS Configuration

**For public APIs:**

```typescript
// app/api/public/route.ts
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  })
}

export async function GET() {
  const data = await fetchData()

  return Response.json(data, {
    headers: corsHeaders(),
  })
}
```

### 7. Rate Limiting

**Implement rate limiting for public endpoints:**

```typescript
import { ratelimit } from '@/lib/ratelimit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  const { success, limit, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return Response.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    )
  }

  // Process request
}
```

### 8. Logging and Monitoring

**Structured logging:**

```typescript
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    const body = await request.json()

    logger.info('Processing request', {
      path: request.url,
      method: 'POST',
      body,
    })

    const result = await processRequest(body)

    logger.info('Request successful', {
      duration: Date.now() - startTime,
    })

    return Response.json(result)
  } catch (error) {
    logger.error('Request failed', {
      error: error.message,
      duration: Date.now() - startTime,
    })

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 9. Environment Variables

**Validate environment variables:**

```typescript
import { env } from '@/lib/env'

export async function GET() {
  // env is validated using @t3-oss/env-core
  const apiKey = env.EXTERNAL_API_KEY

  const response = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  const data = await response.json()
  return Response.json(data)
}
```

### 10. Webhook Security

**Verify webhook signatures:**

```typescript
import { verifyWebhookSignature } from '@/lib/webhook'

export async function POST(request: Request) {
  const signature = request.headers.get('x-webhook-signature')
  const body = await request.text()

  if (!signature || !verifyWebhookSignature(body, signature)) {
    return Response.json(
      { error: 'Invalid signature' },
      { status: 401 }
    )
  }

  // Process verified webhook
  const data = JSON.parse(body)
  await processWebhook(data)

  return Response.json({ received: true })
}
```

---

## Summary

### Key Takeaways for ComboTrack (Next.js 15 App Router)

1. **Prefer Server Actions for mutations**:
   - Form submissions
   - Data updates
   - User actions
   - Leverage built-in revalidation and redirect

2. **Use Route Handlers for**:
   - External API endpoints
   - Webhook receivers
   - Third-party integrations
   - Non-UI content generation

3. **Always implement**:
   - Authentication and authorization checks
   - Input validation (use Zod)
   - Comprehensive error handling
   - Type safety with TypeScript
   - Appropriate logging

4. **Next.js 15 Changes**:
   - GET handlers are NOT cached by default
   - Use `export const dynamic = 'force-static'` for caching
   - Route Handlers use Web APIs (not Node.js APIs)

5. **Security First**:
   - Treat all handlers as public endpoints
   - Verify user permissions
   - Validate all inputs
   - Use CSRF protection (built-in for Server Actions)

6. **For your ComboTrack project**:
   - Keep using Server Actions for note creation/updates
   - Use Route Handlers if you need a REST API for mobile apps
   - Implement proper session verification for all mutations
   - Consider using next-safe-action for additional type safety

---

## Additional Resources

- [Next.js Route Handlers Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Web Request API](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [Web Response API](https://developer.mozilla.org/en-US/docs/Web/API/Response)
