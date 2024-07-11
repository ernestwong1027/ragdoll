import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Ragdoll
        </h1>
        <p className="leading-normal text-muted-foreground">
          We take your code documentation to the next level. Built with RabbitMQ, PGVector and GPT-3.
          User interface is based on <ExternalLink href="https://github.com/vercel/ai-chatbot">this starter project. </ExternalLink><br/>
          Get started by uploading your docs <ExternalLink href="/upload">this starter project. </ExternalLink>.
        </p>
      </div>
    </div>
  )
}
