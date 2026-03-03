import { LoginForm } from "@/components/auth/LoginForm"
import { PageTransition } from "@/components/common/layout/PageTransition"
export const path = "/"
export default function Home() {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Title</h1>
            <p className="text-foreground mt-2">Subtitle</p>
          </div>
          <LoginForm />
        </div>
      </main>
    </PageTransition>
  )
}