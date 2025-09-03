import ReactMarkdown from 'react-markdown'

import termsContent from '../assets/terms.md?raw'

function Terms() {
  return (
    <main className="flex-grow w-full p-8">
      <article className="prose prose-slate mx-auto">
        <ReactMarkdown>{termsContent}</ReactMarkdown>
      </article>
    </main>
  )
}

export default Terms
