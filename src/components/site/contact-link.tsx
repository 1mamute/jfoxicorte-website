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
    return <a href="#contato" data-contact-notice={channel} {...props} />;

  const external = channel !== "email";
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    />
  );
}
