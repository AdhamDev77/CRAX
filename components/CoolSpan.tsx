import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

type Props = {
  icon?: string;
  text: string;
};

export async function CoolSpan({ icon, text }: Props) {
  return (
    <div className="z-10 flex min-w-max items-center justify-center">
      <AnimatedGradientText>
        {icon && (
          <>
            {icon}
            <hr className="mx-2 h-3 w-px shrink-0 bg-gray-300" />{" "}
          </>
        )}

        <span
          className={cn(
            `text-sm inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
          )}
        >
          {text}
        </span>
      </AnimatedGradientText>
    </div>
  );
}
