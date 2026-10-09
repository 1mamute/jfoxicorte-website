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
    <div className={cn("flex min-w-0 items-start gap-2.5", className)}>
      <Icon name={icon} className="size-6 shrink-0 text-[#bec3c7]" />
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
    <div className={cn("grid gap-[18px]", className)}>
      <InfoItem icon="pin" title="Região de atendimento">
        <p className={infoText}>
          {site.serviceRegion || "Consulte a disponibilidade para sua cidade."}
        </p>
      </InfoItem>
      <InfoItem icon="clock" title="Horário de atendimento">
        <p className={infoText}>
          {site.businessHours ||
            "Fale com a equipe para consultar os horários."}
        </p>
      </InfoItem>
    </div>
  );
}
