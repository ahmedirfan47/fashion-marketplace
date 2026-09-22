"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function WaitlistCopyButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(emails.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (emails.length === 0) return null;

  return (
    <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? "Copied" : "Copy all emails"}
    </Button>
  );
}