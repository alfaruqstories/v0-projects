"use client"

import { useRef, useEffect } from "react"
import { ArrowLeft, FileText, ExternalLink, Share2, Bookmark, Send, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useChat } from "ai/react"

// Mock data - in a real app, this would come from an API or database
const policies = {
  "1": {
    id: "1",
    title: "Affordable Care Act",
    category: "Healthcare",
    summary:
      "Comprehensive health insurance reform law enacted in March 2010, expanding healthcare coverage to millions of uninsured Americans.",
    description: `# Affordable Care Act

The Affordable Care Act (ACA) is a comprehensive healthcare reform law enacted in March 2010. The law has 3 primary goals:

1. Make affordable health insurance available to more people
2. Expand the Medicaid program to cover all adults with income below 138% of the federal poverty level
3. Support innovative medical care delivery methods designed to lower the costs of healthcare generally

## Key Provisions

- **Pre-existing Conditions**: Requires insurance plans to cover people with pre-existing health conditions
- **Subsidies**: Provides subsidies to make coverage more affordable
- **Medicaid Expansion**: Expands Medicaid eligibility in participating states
- **Individual Mandate**: Required most Americans to have health insurance or pay a tax penalty (this provision was effectively eliminated in 2019)
- **Young Adult Coverage**: Allows young adults to stay on their parents' insurance until age 26

## History

The ACA was signed into law by President Barack Obama on March 23, 2010. Since then, it has faced numerous legal challenges and attempts at repeal, but many of its core provisions remain in effect.`,
    sources: [
      {
        title: "HealthCare.gov",
        url: "https://www.healthcare.gov/where-can-i-read-the-affordable-care-act/",
      },
      {
        title: "Centers for Medicare & Medicaid Services",
        url: "https://www.cms.gov/CCIIO/Resources/Fact-Sheets-and-FAQs/aca-timeline",
      },
      {
        title: "Kaiser Family Foundation",
        url: "https://www.kff.org/health-reform/fact-sheet/summary-of-the-affordable-care-act/",
      },
    ],
    relatedPolicies: [
      { id: "2", title: "Medicare Modernization Act" },
      { id: "3", title: "Health Insurance Portability and Accountability Act" },
      { id: "4", title: "Children's Health Insurance Program" },
    ],
    lastUpdated: "2023-04-15",
  },
  // Other policies would be defined here
}

export default function PolicyPage({ params }: { params: { id: string } }) {
  const policy = policies[params.id]
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `I'm your Policy Assistant for the ${policy?.title || "policy"}. How can I help you understand this policy better? You can ask me about specific details, implications, or how it might affect you.`,
      },
    ],
    body: {
      policyId: params.id,
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!policy) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Policy Not Found</h1>
        <p className="mb-6">The policy you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    )
  }

  // Function to convert markdown to HTML
  const formatMarkdown = (markdown: string): string => {
    // This is a simple implementation - in a real app, you'd use a proper Markdown parser
    const formatted = markdown
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
      // Convert markdown lists
      .replace(/^\* (.*$)/gm, '<li class="ml-6 mb-1">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-1">$1</li>')
      // Convert markdown bold
      .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
      // Convert markdown italic
      .replace(/\*(.*)\*/gm, "<em>$1</em>")
      // Convert markdown links
      .replace(/\[(.*?)\]$$(.*?)$$/gm, '<a href="$2" class="text-primary underline" target="_blank">$1</a>')
      // Convert line breaks
      .replace(/\n\n/gm, "<br /><br />")

    return formatted
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
              <Badge>{policy.category}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <div className="border-b">
            <div className="max-w-4xl mx-auto w-full px-4">
              <TabsList className="h-12">
                <TabsTrigger value="overview" className="h-12">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="chat" className="h-12">
                  Chat with Policy
                </TabsTrigger>
                <TabsTrigger value="sources" className="h-12">
                  Sources
                </TabsTrigger>
                <TabsTrigger value="related" className="h-12">
                  Related
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="flex-1 overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{policy.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{policy.summary}</p>

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(policy.description) }}
              />

              <div className="mt-8 text-sm text-muted-foreground">Last updated: {policy.lastUpdated}</div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-4xl mx-auto space-y-8">
                {messages.map((message) => (
                  <div key={message.id} className="flex">
                    {message.role === "assistant" ? (
                      <Avatar className="h-8 w-8 mr-4 mt-1 flex-shrink-0">
                        <div className="h-full w-full flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground">
                          PV
                        </div>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 mr-4 mt-1 flex-shrink-0">
                        <div className="h-full w-full flex items-center justify-center text-xs font-medium bg-muted text-muted-foreground">
                          You
                        </div>
                      </Avatar>
                    )}

                    <div className="flex-1">
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex">
                    <Avatar className="h-8 w-8 mr-4 mt-1 flex-shrink-0">
                      <div className="h-full w-full flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground">
                        PV
                      </div>
                    </Avatar>
                    <div className="flex space-x-2 mt-2">
                      <div className="h-3 w-3 bg-muted-foreground/30 rounded-full animate-bounce"></div>
                      <div className="h-3 w-3 bg-muted-foreground/30 rounded-full animate-bounce delay-100"></div>
                      <div className="h-3 w-3 bg-muted-foreground/30 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about this policy..."
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="flex-1 overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Sources & References</h2>
              <div className="space-y-4">
                {policy.sources.map((source, index) => (
                  <div key={index} className="flex items-start p-4 rounded border">
                    <FileText className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{source.title}</p>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm hover:underline flex items-center mt-1"
                      >
                        {source.url}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    <Button variant="outline" size="sm">
                      Visit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="related" className="flex-1 overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Related Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policy.relatedPolicies.map((relatedPolicy) => (
                  <Link href={`/policies/${relatedPolicy.id}`} key={relatedPolicy.id}>
                    <div className="p-4 rounded border hover:border-primary hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium">{relatedPolicy.title}</h3>
                      <div className="flex items-center text-primary text-sm mt-2">
                        <span>View policy</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Helper function to format message content with Markdown
function formatMessage(content: string): string {
  // This is a simple implementation - in a real app, you'd use a proper Markdown parser
  const formatted = content
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-2">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-4">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2 mt-3">$1</h3>')
    // Convert markdown lists
    .replace(/^\* (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    // Convert markdown bold
    .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
    // Convert markdown italic
    .replace(/\*(.*)\*/gm, "<em>$1</em>")
    // Convert markdown links
    .replace(/\[(.*?)\]$$(.*?)$$/gm, '<a href="$2" class="text-primary underline" target="_blank">$1</a>')
    // Convert line breaks
    .replace(/\n/gm, "<br />")

  return formatted
}

