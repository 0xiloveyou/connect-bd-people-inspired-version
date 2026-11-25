import Link from "next/link";
import { Menu, UserRound, LogOut, Map, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { Avatar } from "./Avatar";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />

        <nav className="desk-nav" aria-label="প্রধান নেভিগেশন">
          <NavLinks />
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link href="/map" className="btn btn-ghost btn-sm" aria-label="মানচিত্র">
                <Map size={16} />
                <span className="btn-label-long">মানচিত্র</span>
              </Link>
              <details className="user-menu">
                <summary aria-label="প্রোফাইল মেনু">
                  <Avatar name={user.name} color={user.avatarColor} photoUrl={user.photoUrl} />
                  <span className="user-menu-name">{user.name.split(" ")[0]}</span>
                </summary>
                <div className="dropdown">
                  <Link href="/profile">
                    <UserRound size={15} /> আমার প্রোফাইল
                  </Link>
                  <Link href={`/card/${user.id}`}>
                    <ArrowRight size={15} /> শেয়ার কার্ড
                  </Link>
                  <div className="dropdown-sep" />
                  <form action="/api/auth/logout" method="post">
                    <button type="submit">
                      <LogOut size={15} /> সাইন আউট
                    </button>
                  </form>
                </div>
              </details>
            </>
          ) : (
            <>
              <Link href="/join?mode=login" className="btn btn-ghost btn-sm header-signin">
                সাইন ইন
              </Link>
              <Link href="/join" className="btn btn-red btn-sm">
                যোগ দাও
              </Link>
            </>
          )}

          <details className="mobile-nav">
            <summary aria-label="মেনু">
              <Menu size={20} />
            </summary>
            <div className="mobile-panel">
              <NavLinks mobile />
              <div className="mobile-actions">
                {user ? (
                  <>
                    <Link href="/profile">
                      <span>আমার প্রোফাইল</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                    <Link href={`/card/${user.id}`}>
                      <span>শেয়ার কার্ড</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                    <form action="/api/auth/logout" method="post">
                      <button type="submit" className="btn btn-outline btn-block">
                        সাইন আউট
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/join?mode=login" className="btn btn-outline btn-block">
                      সাইন ইন
                    </Link>
                    <Link href="/join" className="btn btn-red btn-block">
                      মানচিত্রে যোগ দাও
                    </Link>
                  </>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
