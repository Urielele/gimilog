import Image from "next/image";
import { Container, PageShell, SearchBar } from "@/components/gm";

// Tepi ilustrasi memudar ke warna halaman, membentuk mangkuk terbalik.
const heroMask =
  "radial-gradient(ellipse 52% 100% at 50% 0%, #000 58%, transparent 100%)";

export default function HomePage() {
  return (
    <PageShell>
      <section
        aria-label="Gimilog"
        className="relative h-[320px] w-full overflow-hidden bg-page sm:h-[520px] lg:h-[680px]"
      >
        <div
          className="absolute inset-x-0 top-0 mx-auto h-full w-full max-w-[1280px]"
          style={{ maskImage: heroMask, WebkitMaskImage: heroMask }}
        >
          <Image
            src="/hero/hero.jpg"
            alt="Pink round character diving underwater with a snorkel mask"
            fill
            preload
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover object-top sm:object-center"
          />
        </div>

        <h1 className="absolute inset-x-0 bottom-20 z-10 px-6 text-center text-[22px] leading-[1.3] font-bold text-ink [text-shadow:0_2px_6px_rgba(80,50,30,0.35)] sm:text-[32px] sm:leading-[45px]">
          <span className="block">Log what you’re playing.</span>
          <span className="block">Wishlist what’s next.</span>
          <span className="block">Rate the games you finish.</span>
        </h1>
      </section>

      <Container className="pt-10 pb-24">
        <SearchBar variant="outlined" />
      </Container>
    </PageShell>
  );
}
