import { site } from "@/config/site";
import { cn } from "@/lib/utils";

import { Icon, type IconName } from "./icons";

function InfoItem({
  icon,
  title,
  className,
  children,
}: {
  icon: IconName;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 items-start gap-[15px]", className)}>
      <Icon name={icon} className="size-[26px] text-[#bec3c7] md:size-7" />
      <div className="min-w-0">
        <h3 className="mb-1.5 text-sm leading-normal font-semibold tracking-normal text-[#eceeef]">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

const infoText = "text-sm leading-[1.6] whitespace-pre-line text-[#aeb3b8]";

export function ServiceInfo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-[25px] border-t border-white/10 pt-[30px] xs:grid-cols-2 xs:gap-x-6 xs:gap-y-7 md:gap-7 md:pt-[38px]",
        className,
      )}
    >
      <InfoItem icon="pin" title="Região de atendimento">
        <p className={infoText}>
          {site.serviceRegion || "Consulte a disponibilidade para sua cidade."}
        </p>
      </InfoItem>
      <InfoItem
        icon="clock"
        title="Horário de atendimento"
        className="border-white/10 xs:border-l xs:pl-6 md:pl-7"
      >
        <p className={infoText}>
          {site.businessHours ||
            "Fale com a equipe para consultar os horários."}
        </p>
      </InfoItem>
    </div>
  );
}
