"use client";

import { useEffect, useRef, useState } from "react";

import type { ContactChannel } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Icon } from "./icons";

const titles: Record<ContactChannel, string> = {
  whatsapp: "WhatsApp em atualização",
  email: "E-mail em atualização",
  instagram: "Instagram em atualização",
};

/**
 * Single dialog shared by every contact link whose channel is not configured
 * (see <ContactLink>). Uses event delegation so the links stay server-rendered.
 */
export function ContactNotice() {
  const [channel, setChannel] = useState<ContactChannel | null>(null);
  const [open, setOpen] = useState(false);
  // The links are not Radix triggers, so focus is returned to them by hand.
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const link = (event.target as Element | null)?.closest?.<HTMLElement>(
        "[data-contact-notice]",
      );
      if (!link) return;
      event.preventDefault();
      opener.current = link;
      setChannel(link.dataset.contactNotice as ContactChannel);
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="gap-0"
        onCloseAutoFocus={(event) => {
          if (!opener.current?.isConnected) return;
          event.preventDefault();
          opener.current.focus();
        }}
      >
        <Icon name="mail" className="mb-6 size-9" />
        <p className="mb-2.5 eyebrow">JF Oxicorte</p>
        <DialogTitle className="mb-4 text-[2rem] leading-tight">
          {channel ? titles[channel] : "Contato em atualização"}
        </DialogTitle>
        <DialogDescription className="mb-6">
          O contato oficial da JF Oxicorte estará disponível aqui em breve.
          Obrigado pelo seu interesse!
        </DialogDescription>
        <DialogClose asChild>
          <Button className="justify-self-start">Entendi</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
