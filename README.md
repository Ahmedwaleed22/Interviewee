![![Banner]](https://banners.beyondco.de/Interviewee.png?theme=light&packageManager=&packageName=&pattern=architect&style=style_1&description=Practice.+Improve.+Succee.&md=1&showWatermark=0&fontSize=100px&images=annotation&widths=auto)


# Interviewee Frontend

Frontend application for the Interviewee AI Mock Interview Platform.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Yarn package manager

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Copy the environment variables file:
```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

### Development

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the files.

### Build

Build the application for production:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

### Linting

Run ESLint to check for code issues:

```bash
yarn lint
```

## Project Structure

- `app/` - Next.js app directory containing pages and API routes
  - `api/` - API route handlers
  - `interview/` - Interview session page
  - `end/` - Interview completion page
  - `test/` - Test/debug page
- `components/` - Reusable React components
- `public/` - Static assets (images, icons, etc.)

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **OpenAI API** - AI interview functionality

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
