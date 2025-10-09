import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/axios";

export default function VerifyEmail() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [message, setMessage] = useState("Verifying...");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        const res = await api.get(`/verify-email/${uid}/${token}/`);
        setMessage(res.data.message);
        setIsVerified(true);
      } catch (err: any) {
        setMessage(err.response?.data?.error || "Verification failed");
        setIsVerified(false);
      }
    }
    verify();
  }, [uid, token]);

  return (
    <div className="flex flex-col items-center gap-10 min-h-screen bg-background-light">
      <div className="w-full">
        <h2 className="text-center mb-4 mt-2 bg-background text-lg">
          Email Verification
        </h2>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center gap-4">
        <p className="text-lg">{message}</p>

        {isVerified ? (
          <Link
            to="/login"
            className="border rounded bg-background-light hover:bg-background px-4 py-2"
          >
            Go to Login
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-blue-600 hover:underline text-sm"
          >
            Back to Login
          </Link>
        )}
      </div>

      <div className="bg-background w-full">
        <footer className="text-center p-4 text-xs">©KanjiLearner 2025</footer>
      </div>
    </div>
  );
}