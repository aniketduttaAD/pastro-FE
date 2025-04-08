# Pastro (Next.js Edition)

**Paste. Share. Go.**

Pastro is a pastebin-style web application built with Next.js. It allows users to quickly paste, share, and retrieve text snippets using a minimal and modern UI.

---

## 🚀 Getting Started

### 1. Install Dependencies

First, install project dependencies:

    npm install

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

    NEXT_PUBLIC_API_BASE_URL=http://localhost:5001

Update the value of `NEXT_PUBLIC_API_BASE_URL` to match your backend API base URL (e.g., if you're running an Express server locally).

### 3. Run the Development Server

Start the Next.js development server:

    npm run dev
    # or
    yarn dev
    # or
    pnpm dev

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 What This App Does

- 🔍 Paste any text or code snippet  
- 🔗 Generate a unique URL to share your snippet  
- 🧾 View raw or formatted snippets  
- 🌙 Clean, responsive UI with optional dark mode  
- ⚡ Fast, server-rendered pages using Next.js App Router

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)  
- [API Routes in Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)  
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 📦 Deployment

This app can be deployed on [Vercel](https://vercel.com) or any Node.js-compatible hosting service.

Read more in the [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🙌 Acknowledgements

Built with ❤️ using Next.js by Vercel.
