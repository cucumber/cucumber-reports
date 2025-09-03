import ReactMarkdown from 'react-markdown'

import faqsContent from '../assets/faqs.md?raw'

function Faqs() {
  return (
    <main className="flex-grow w-full p-8">
      <article className="prose prose-slate mx-auto">
        <ReactMarkdown>{faqsContent}</ReactMarkdown>
      </article>
    </main>
  )
}

export default Faqs
