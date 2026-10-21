"use client";

import { PointerEvent, useRef } from "react";

interface FounderProfileCardProps { name: string; role: string; href: string; }

export default function FounderProfileCard({ name, role, href }: FounderProfileCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--profile-x", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--profile-y", `${(y * 100).toFixed(1)}%`);
    card.style.setProperty("--profile-rotate-x", `${((0.5 - y) * 9).toFixed(2)}deg`);
    card.style.setProperty("--profile-rotate-y", `${((x - 0.5) * 11).toFixed(2)}deg`);
  };
  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--profile-rotate-x", "0deg");
    card.style.setProperty("--profile-rotate-y", "0deg");
    card.style.setProperty("--profile-x", "50%");
    card.style.setProperty("--profile-y", "50%");
  };
  return (
    <a ref={cardRef} className="founder-profile-card" href={href} target="_blank" rel="noreferrer" onPointerMove={handlePointerMove} onPointerLeave={resetTilt} aria-label={`Visit ${name}'s portfolio`}>
      <span className="founder-card-grid" aria-hidden="true" />
      <span className="founder-card-foil" aria-hidden="true" />
      <span className="founder-card-status">available for thoughtful work</span>
      <span className="founder-card-mark" aria-hidden="true">CM</span>
      <span className="founder-card-copy"><span className="founder-card-name">{name}</span><span className="founder-card-role">{role}</span></span>
      <span className="founder-card-link">Open portfolio ↗</span>
    </a>
  );
}
