"use client"

export default function SimpleTrainerLogin() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-black mb-4">Trainer Login Test</h1>
        <p className="text-gray-600 mb-4">If you can see this, the page is working!</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
            Sign In (Test)
          </button>
        </form>
      </div>
    </div>
  )
}
