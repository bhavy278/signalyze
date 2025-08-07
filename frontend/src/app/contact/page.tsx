import { Button } from "../components/ui/Button";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900">Get In Touch</h1>
        <p className="mt-4 text-lg text-gray-600">
          Have questions, feedback, or need support? We'd love to hear from you.
        </p>
      </div>
      <div className="mt-16 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
