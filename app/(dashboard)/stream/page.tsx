import { StreamList } from "@/components/features/stream/stream-list";
import { StreamPlayer } from "@/components/features/stream/stream-player";
import { Badge } from "@/components/ui/badge";
import { getStreetFighter6Streams } from "@/lib/twitch";
import { Radio } from "lucide-react";

type StreamPageProps = {
  searchParams: Promise<{ channel?: string }>;
};

export default async function StreamPage({ searchParams }: StreamPageProps) {
  const { channel } = await searchParams;

  if (channel) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <StreamPlayer channel={channel} />
      </div>
    );
  }

  const streams = await getStreetFighter6Streams();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div className="flex items-center gap-3">
        <Radio className="h-6 w-6 text-red-500" />
        <h1 className="text-3xl font-bold">Streams SF6</h1>
        {streams.length > 0 && (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          >
            {streams.length} en direct
          </Badge>
        )}
      </div>
      <StreamList streams={streams} />
    </div>
  );
}
