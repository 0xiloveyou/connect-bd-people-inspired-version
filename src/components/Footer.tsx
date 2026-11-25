import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo small />
            <p>
              যেখানেই থাকো, মন পড়ে থাকে দেশে। প্রবাসে বাংলাদেশের মানুষের
              মানচিত্র, গল্প আর শিকড়ের ঠিকানা।
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <b>ঘুরে দেখো</b>
              <Link href="/map">প্রবাসীদের মানচিত্র</Link>
              <Link href="/districts">৬৪ জেলা</Link>
              <Link href="/ranking">র‍্যাংকিং</Link>
            </div>
            <div className="footer-col">
              <b>যোগাযোগ</b>
              <Link href="/join">মানচিত্রে যোগ দাও</Link>
              <Link href="/idea">আইডিয়া পাঠাও</Link>
              <Link href="/profile">আমার প্রোফাইল</Link>
            </div>
            <div className="footer-col">
              <b>তথ্য</b>
              <Link href="/privacy">গোপনীয়তা</Link>
              <Link href="/terms">শর্তাবলি</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© ২০২৬ প্রবাসে · দেশে ফেরার এক সুতো</span>
          <span className="made">
            ভালোবাসায় তৈরি <span className="heart">♥</span> বাংলাদেশের প্রবাসীদের জন্য
          </span>
        </div>
      </div>
    </footer>
  );
}
