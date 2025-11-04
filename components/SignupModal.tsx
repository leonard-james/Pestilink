"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function SignupModal() {
  const router = useRouter();

  function close() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    };
    console.log("signup:", payload);
    router.push("/");
  }

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 760,
          maxWidth: "92%",
          borderRadius: 16,
          padding: 40,
          backdropFilter: "blur(6px)",
          background: "rgba(255,255,255,0.04)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <button
          aria-label="Close"
          onClick={close}
          style={{
            position: "absolute",
            right: 20,
            top: 18,
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h1 style={{ margin: 0, fontSize: 32 }}>Sign up</h1>
        <p style={{ marginTop: 8, color: "rgba(255,255,255,0.75)" }}>
          Sign up to continue
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <input name="name" placeholder="Name" required
            style={{ padding: 12, borderRadius: 6, border: "none", background: "rgba(255,255,255,0.03)", color: "#fff" }} />

          <input name="email" type="email" placeholder="Email" required
            style={{ padding: 12, borderRadius: 6, border: "none", background: "rgba(255,255,255,0.03)", color: "#fff" }} />

          <input name="password" type="password" placeholder="Password" required
            style={{ padding: 12, borderRadius: 6, border: "none", background: "rgba(255,255,255,0.03)", color: "#fff" }} />

          <button type="submit" style={{ marginTop: 8, padding: 12, borderRadius: 999, background: "#000", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}