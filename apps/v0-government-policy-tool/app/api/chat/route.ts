import { StreamingTextResponse } from "ai"
import { streamText } from "ai" // Import from AI SDK [^1]
import { openai } from "@ai-sdk/openai" // Import from AI SDK [^1]

// Mock policy database - in a real app, this would be fetched from a database
const policyDetails = {
  "affordable care act": {
    title: "Affordable Care Act",
    fullText: `The Affordable Care Act (ACA) is a comprehensive healthcare reform law enacted in March 2010. 
    The law has 3 primary goals: Make affordable health insurance available to more people, expand the Medicaid program to cover all adults with income below 138% of the federal poverty level, and support innovative medical care delivery methods designed to lower the costs of healthcare generally.
    
    Key provisions include:
    - Requiring insurance plans to cover people with pre-existing health conditions
    - Providing subsidies to make coverage more affordable
    - Expanding Medicaid eligibility in participating states
    - Requiring most Americans to have health insurance or pay a tax penalty (individual mandate)
    - Allowing young adults to stay on their parents' insurance until age 26
    
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
    ],
  },
  "clean air act": {
    title: "Clean Air Act",
    fullText: `The Clean Air Act (CAA) is a United States federal law designed to control air pollution on a national level. It is one of the United States' first and most influential modern environmental laws, and one of the most comprehensive air quality laws in the world.
    
    The Clean Air Act was passed in 1963 and significantly amended in 1970, 1977, and 1990. The 1970 amendments greatly expanded the federal mandate, requiring comprehensive federal and state regulations for both stationary (industrial) pollution sources and mobile sources.
    
    Key provisions include:
    - National Ambient Air Quality Standards (NAAQS) for six "criteria" pollutants
    - State Implementation Plans (SIPs) for achieving these standards
    - New Source Performance Standards (NSPS) for new and modified sources
    - National Emission Standards for Hazardous Air Pollutants (NESHAPs)
    - Prevention of Significant Deterioration (PSD) program for areas meeting NAAQS
    - Operating permits for major sources of air pollution
    
    The Environmental Protection Agency (EPA) is responsible for implementing the CAA.`,
    sources: [
      {
        title: "Environmental Protection Agency",
        url: "https://www.epa.gov/clean-air-act-overview",
      },
      {
        title: "Congressional Research Service",
        url: "https://crsreports.congress.gov/product/pdf/RL/RL30853",
      },
    ],
  },
  "higher education act": {
    title: "Higher Education Act",
    fullText: `The Higher Education Act of 1965 (HEA) is a federal law that governs the administration of federal student aid programs. It was passed as part of President Lyndon Johnson's Great Society domestic agenda and was intended to strengthen the educational resources of colleges and universities and provide financial assistance for students in postsecondary and higher education.
    
    The HEA has been reauthorized and amended multiple times since its original passage. Key provisions include:
    
    - Federal Student Aid Programs: Establishes various financial aid programs including Pell Grants, Federal Work-Study, and federal student loans
    - TRIO Programs: Creates programs to support students from disadvantaged backgrounds
    - Institutional Aid: Provides funding for institutions serving underrepresented populations
    - Teacher Quality Enhancement: Supports improving teacher preparation programs
    - International Education Programs: Promotes international study and research
    
    The law requires reauthorization every five years, though this process has often been delayed. The most recent comprehensive reauthorization was the Higher Education Opportunity Act of 2008.`,
    sources: [
      {
        title: "U.S. Department of Education",
        url: "https://www2.ed.gov/policy/highered/leg/hea08/index.html",
      },
      {
        title: "Congressional Research Service",
        url: "https://crsreports.congress.gov/product/pdf/R/R45115",
      },
    ],
  },
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  const userQuery = lastMessage.content.toLowerCase()

  // Check if the query directly matches a known policy
  let matchedPolicy = null
  let policyInfo = ""
  let sources = []

  for (const [key, policy] of Object.entries(policyDetails)) {
    if (userQuery.includes(key)) {
      matchedPolicy = policy
      policyInfo = policy.fullText
      sources = policy.sources
      break
    }
  }

  // Create a system prompt
  let systemPrompt = `You are a helpful assistant that specializes in explaining government policies.
  Your name is Policy Vault AI.
  
  When answering questions:
  1. Be accurate and factual based on the policy information provided
  2. If you don't know something or if it's not in the policy information, admit that
  3. Explain complex terms in simple language
  4. Be concise but thorough
  5. Remain neutral and objective
  6. Format your responses with Markdown for better readability
  7. Include headings, bullet points, and emphasis where appropriate
  
  Always cite your sources at the end of your response.`

  if (matchedPolicy) {
    systemPrompt += `\n\nYou are currently explaining the "${matchedPolicy.title}" policy.\n\nHere is the full text of the policy:\n${policyInfo}\n\nSources:\n`

    for (const source of sources) {
      systemPrompt += `- ${source.title}: ${source.url}\n`
    }
  } else {
    systemPrompt += `\n\nIf you don't have specific information about a policy mentioned in the query, explain that you have limited information and provide general guidance on where the user might find authoritative information about that policy.`
  }

  // Create a stream using the AI SDK
  const stream = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: lastMessage.content,
  })

  // Return a StreamingTextResponse, which will stream the response to the client
  return new StreamingTextResponse(stream.textStream)
}

