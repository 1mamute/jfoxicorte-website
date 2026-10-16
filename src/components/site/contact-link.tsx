import type { ComponentProps } from "react";

import { contactHref, type ContactChannel } from "@/config/site";

type ContactLinkProps = Omit<ComponentProps<"a">, "href"> & {
  channel: ContactChannel;
  /** Service name used in the pre-filled WhatsApp message. */
  service?: string;
};

/**
 * Link to a contact channel. When the channel is not configured yet it points
 * to the contact section and <ContactNotice> intercepts the click to explain
 * that the official channel is coming soon.
 */
export function ContactLink({ channel, service, ...props }: ContactLinkProps) {
  const href = contactHref(channel, service);

  if (!href)
    return (
      <a
        href="#contato"
        data-contact-notice={channel}
        data-analytics-channel={channel}
        data-analytics-service={service}
        {...props}
      />
    );

  const external = channel === "whatsapp" || channel === "instagram";
  return (
    <a
      href={href}
      data-analytics-name={
        channel === "email"
          ? "Enviar e-mail"
          : channel === "phone"
            ? "Ligar para a JF Oxicorte"
            : undefined
      }
      data-analytics-channel={channel}
      data-analytics-service={service}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    />
  );
}
