import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  return (
    <section className="space-y-8">
      <h2 className="text-6xl font-bold text-center text-[#000B20]">FAQs on Amlodipine</h2>

      <p className="text-center">
        Have a more specific question?{" "}
        <a href="#" className="text-blue-600">
          Get in touch
        </a>
      </p>

      <Accordion type="single" collapsible className="space-y-6">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="bg-[#F8FEF9] rounded-[50px] border border-[#E7F2FE] px-8 py-12"
          >
            <AccordionTrigger className="text-gray-900 text-2xl font-medium">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-600 text-base">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

const faqs = [
  {
    question: "How much does Amlodipine Besylate cost without insurance?",
    answer:
      "Without insurance, the cost of Amlodipine Besylate can be $51.07 for 30, 5MG Tablet of Amlodipine Besylate. The retail cost of Amlodipine Besylate can vary depending on the strength and quantity prescribed...",
  },
  {
    question: "How much does Amlodipine Besylate cost with insurance?",
    answer: "The cost varies depending on your insurance plan...",
  },
  {
    question: "Does Medicare cover Amlodipine Besylate and how much does it cost?",
    answer: "Medicare coverage for Amlodipine Besylate depends on your specific plan...",
  },
  {
    question: "What is the brand name of Amlodipine Besylate?",
    answer: "The brand names for Amlodipine Besylate include Norvasc and Katerzia...",
  },
  {
    question: "Are Amlodipine Besylate and Norvasc the same?",
    answer: "Yes, Amlodipine Besylate is the generic version of Norvasc...",
  },
]

