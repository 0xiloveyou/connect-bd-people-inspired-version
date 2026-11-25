import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-inner">
          <span className="not-found-code">404 · পথ হারিয়ে গেছে</span>
          <h1>
            এই ঠিকানা
            <br />
            মানচিত্রে নেই
          </h1>
          <p>
            তুমি যে পেজ или প্রবাসীর কার্ড খুঁজছো, সেটি সরানো হয়েছে, বেসরকারি
            করা হয়েছে, অথবা লিংকটা ভুল। চিন্তা নেই — নিচের পথগুলো ধরে আবার
            মানচিত্রে ফিরে যাও।
          </p>
          <div className="btn-row">
            <Link href="/" className="btn btn-light">
              <Home size={16} /> হোমে ফিরে যাও
            </Link>
            <Link href="/map" className="btn btn-ghost">
              <Compass size={16} /> প্রবাসীদের মানচিত্র
            </Link>
            <Link href="/districts" className="btn btn-ghost">
              <ArrowLeft size={16} /> ৬৪ জেলা দেখো
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
