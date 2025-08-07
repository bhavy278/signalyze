export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900">About Signalyze</h1>
          <p className="mt-4 text-lg text-gray-600">
            Our mission is to bring clarity and transparency to complex legal
            documents for everyone.
          </p>
        </div>
        <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
              The Problem We Solve
            </h2>
            <p className="mt-4 text-gray-600">
              Legal documents are often dense, confusing, and filled with
              jargon. Whether it's a rental lease, a new job contract, or the
              terms of service for a new app, most people sign without fully
              understanding what they're agreeing to. This information imbalance
              can lead to hidden costs, unexpected obligations, and significant
              risks.
            </p>
            <p className="mt-4 text-gray-600">
              Signalyze was born from the idea that understanding these
              documents shouldn't require a law degree. We leverage the power of
              advanced AI to act as your personal legal assistant, breaking down
              complex text into simple, actionable insights.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800">
              Our Technology
            </h3>
            <p className="mt-4 text-gray-600">
              We use state-of-the-art Large Language Models (LLMs) fine-tuned to
              recognize and interpret legal and contractual language. Our system
              extracts key financial details, identifies critical dates, flags
              potential traps, and summarizes the entire document so you can
              make informed decisions with confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
