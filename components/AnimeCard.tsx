import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";

type Props = {
  id: number;
  title: string;
  image: string;
  score?: number;
};

export default function AnimeCard({
  id,
  title,
  image,
  score,
}: Props) {
  return (
    <Link href={`/${id}`}>

      <div className="group relative overflow-hidden rounded-2xl cursor-pointer bg-[#0f172a]">

        <div className="relative w-full h-[340px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 p-4 w-full">
          <h2 className="font-bold text-lg line-clamp-1">
            {title}
          </h2>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-yellow-400 text-sm">
              ⭐ {score || "N/A"}
            </span>
            <Button size="sm" className="rounded-full bg-purple-600 hover:bg-purple-700">
              Watch
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}