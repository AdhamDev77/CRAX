import { Link } from "@/i18n/routing";

export default function VerifyEmailPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-2xl font-bold mb-6">Verify Your Email</h1>
          <p className="mb-4">
            A verification link has been sent to your email. Please check your inbox and click the link to verify your
            account.
          </p>
          <p>
            Already verified?{" "}
            <Link href="/signin" className="text-blue-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    );
  }