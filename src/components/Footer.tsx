import { mono } from "../lib/theme";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(148,163,184,0.12)", padding: "18px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: mono, fontSize: 10, color: "#a3b1c9", letterSpacing: "0.04em" }}>
        © {new Date().getFullYear()} HolyPhoers. All rights reserved.
      </div>
    </footer>
  );
}
