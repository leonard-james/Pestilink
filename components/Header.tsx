import Link from "next/link";
import Button from "../components/Button";

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>
      </nav>
      <Button href="/signup" variant="ghost" className="signup-button">
        Sign Up
      </Button>
      <Button onClick={() => window.location.href = "/login"} variant="primary" className="login-button">
        Log In
      </Button>
    </header>
  );
}