import Image from "next/image";
import { Container, PageShell, SearchBar } from "@/components/gm";

export default function HomePage() {
  return (
    <PageShell>
      <section
        aria-label="Gimilog"
        className="relative w-full bg-page md:h-[520px] lg:h-[680px]"
      >
        <div className="relative h-[min(125vw,560px)] w-full overflow-hidden md:absolute md:inset-0 md:h-full">
          <div
            className="absolute inset-x-0 top-0 mx-auto h-full w-full max-w-[1280px] [mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)] md:[mask-image:radial-gradient(ellipse_52%_100%_at_50%_0%,#000_58%,transparent_100%)] md:[-webkit-mask-image:radial-gradient(ellipse_52%_100%_at_50%_0%,#000_58%,transparent_100%)]"
          >
            <Image
              src="/hero/hero.jpg"
              alt="Pink round character diving underwater with a snorkel mask"
              fill
              preload
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover object-[50%_30%] md:object-center"
            />
          </div>
        </div>

        <h1 className="relative z-10 -mt-6 px-5 text-center text-[20px] leading-[29px] font-bold text-ink [text-shadow:0_2px_6px_rgba(80,50,30,0.35)] min-[400px]:px-8 md:absolute md:inset-x-0 md:bottom-20 md:mt-0 md:px-6 md:text-[32px] md:leading-[45px]">
          <span className="block">Log what you’re playing.</span>
          <span className="block">Wishlist what’s next.</span>
          <span className="block">Rate the games you finish.</span>
        </h1>
      </section>

      <Container className="pt-8 pb-24 md:pt-10">
        <SearchBar variant="outlined" />
      </Container>
    </PageShell>
  );
}
