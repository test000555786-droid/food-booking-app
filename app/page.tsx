import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { prisma } from "@/lib/prisma";
import { HomeMenuPreview } from "@/components/home/HomeMenuPreview";
import { MenuLine } from "@/components/shared/MenuLine";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const restaurant = await prisma.restaurant.findFirst({
    include: {
      menuItems: {
        where: { isBestseller: true, isAvailable: true },
        take: 6,
        orderBy: { sortOrder: "asc" },
      },
      reviews: {
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
      tables: {
        take: 1,
      },
      categories: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return { restaurant };
}

export default async function HomePage() {
  const { restaurant } = await getHomeData();
  const demoTableId = restaurant?.tables?.[0]?.id;
  const demoTableNumber = restaurant?.tables?.[0]?.tableNumber ?? 1;

  // Convert Decimal prices to numbers to avoid Next.js Client Component serialization errors
  const safeMenuItems = restaurant?.menuItems.map(item => ({
    ...item,
    price: Number(item.price)
  })) || [];

  const safeRestaurant = restaurant ? {
    ...restaurant,
    menuItems: safeMenuItems
  } : null;

  // Chef's picks — up to 4 items for the preview strip
  const chefsPickItems = safeMenuItems.slice(0, 4);

  const restaurantName = restaurant?.name || "Spice Garden";

  return (
    <div className="min-h-screen" style={{ background: "var(--canvas)" }}>

      {/* ══════════════════════════════════════════
          HERO — full-bleed dark editorial split layout
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--ink)", minHeight: "560px" }}
      >
        {/* ── Background spice mandala pattern (SVG) ── */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{ opacity: 0.06 }}
          aria-hidden="true"
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mandala" x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
                <g transform="translate(110,110)" fill="none" stroke="#FBF6ED" strokeWidth="0.8">
                  <circle r="100"/><circle r="75"/><circle r="50"/><circle r="25"/>
                  {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
                    <line key={deg} x1="0" y1="0" x2={Math.cos(deg*Math.PI/180)*100} y2={Math.sin(deg*Math.PI/180)*100} />
                  ))}
                  {[0,45,90,135].map((deg) => (
                    <ellipse key={deg} rx="20" ry="8" transform={`rotate(${deg})`} />
                  ))}
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mandala)"/>
          </svg>
        </div>

        {/* ── Gold top accent line ── */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--gold)" }} />

        {/* ── Main content: left text / right food collage ── */}
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-12">

          {/* LEFT — text block */}
          <div className="flex-1 w-full min-w-0 text-center md:text-left">

            {/* Logo */}
            <div className="mb-8 flex justify-center md:justify-start">
              <Logo size="lg" href="/" light />
            </div>

            {/* Eyebrow */}
            <p
              className="font-mono text-xs uppercase tracking-[0.22em] mb-5"
              style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
            >
              Table {demoTableNumber} &middot; {restaurantName.toUpperCase()}
            </p>

            {/* Restaurant name */}
            <h1
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5 break-words"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 700,
                lineHeight: 1.0,
                color: "var(--canvas)",
                letterSpacing: "-0.01em",
              }}
            >
              {restaurantName}
            </h1>

            {/* Gold rule */}
            <div className="flex items-center gap-3 mb-5 justify-center md:justify-start">
              <div className="h-px w-8" style={{ background: "var(--gold)" }} />
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="var(--gold)">
                <path d="M8 0l1.6 4.8H16l-4.8 3.6 1.6 4.8L8 10.6 3.2 13.2l1.6-4.8L0 4.8h6.4z"/>
              </svg>
              <div className="h-px w-8" style={{ background: "var(--gold)" }} />
            </div>

            {/* Tagline */}
            <p
              className="text-base mb-10 mx-auto md:mx-0"
              style={{
                color: "rgba(251,246,237,0.65)",
                fontFamily: "var(--font-work-sans)",
                maxWidth: "min(100%, 360px)",
                lineHeight: 1.7,
              }}
            >
              {restaurant?.tagline || "Authentic Indian flavours, crafted fresh at your table."}
            </p>

            {/* CTA + pills row */}
            {demoTableId && (
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-8">
                <a
                  href={`/menu/preview`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    background: "var(--spice)",
                    color: "var(--canvas)",
                    fontFamily: "var(--font-work-sans)",
                  }}
                >
                  View Full Menu
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            )}

            {/* Feature pill badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{
                  border: "1px solid rgba(251,246,237,0.15)",
                  color: "rgba(251,246,237,0.6)",
                  fontFamily: "var(--font-work-sans)",
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Scan &amp; Order
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{
                  border: "1px solid rgba(251,246,237,0.15)",
                  color: "rgba(251,246,237,0.6)",
                  fontFamily: "var(--font-work-sans)",
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Real-time Updates
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{
                  border: "1px solid rgba(251,246,237,0.15)",
                  color: "rgba(251,246,237,0.6)",
                  fontFamily: "var(--font-work-sans)",
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                Fresh &amp; Hot
              </div>
            </div>
          </div>

          {/* RIGHT — food image collage */}
          <div className="flex-shrink-0 hidden md:block">
            <div className="relative w-[340px] h-[420px]">

              {/* Large primary image */}
              <div
                className="absolute top-0 left-0 w-52 h-52 rounded-2xl overflow-hidden"
                style={{ border: "3px solid rgba(184,137,43,0.4)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/menu/butter_chicken.png" alt="Butter Chicken" className="w-full h-full object-cover" />
              </div>

              {/* Secondary image — offset right + down */}
              <div
                className="absolute top-10 right-0 w-36 h-36 rounded-2xl overflow-hidden"
                style={{ border: "3px solid rgba(184,137,43,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/menu/paneer_tikka.png" alt="Paneer Tikka" className="w-full h-full object-cover" />
              </div>

              {/* Third image — bottom left */}
              <div
                className="absolute bottom-0 left-8 w-40 h-40 rounded-2xl overflow-hidden"
                style={{ border: "3px solid rgba(184,137,43,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/menu/dal_makhani.png" alt="Dal Makhani" className="w-full h-full object-cover" />
              </div>

              {/* Fourth — bottom right, smallest */}
              <div
                className="absolute bottom-4 right-0 w-32 h-32 rounded-2xl overflow-hidden"
                style={{ border: "3px solid rgba(184,137,43,0.3)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/menu/veg_biryani.png" alt="Veg Biryani" className="w-full h-full object-cover" />
              </div>

              {/* Gold floating label */}
              <div
                className="absolute top-[210px] left-[170px] px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                style={{
                  background: "var(--gold)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-work-sans)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  zIndex: 10,
                }}
              >
                ★ Chef&apos;s Picks
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — editorial layout
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--warm-ivory)" }}>
        <div className="max-w-5xl mx-auto px-4 py-20">
          <p
            className="font-mono text-xs uppercase tracking-[0.18em] text-center mb-2"
            style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
          >
            Simple &amp; Seamless
          </p>
          <h2
            className="font-display text-3xl md:text-4xl text-center mb-14"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontWeight: 600,
              color: "var(--ink)",
              lineHeight: 1.1,
            }}
          >
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
               style={{ borderColor: "var(--line)" }}>
            {[
              {
                step: "01",
                title: "Scan QR Code",
                desc: "Point your camera at the QR code on your table — no app download needed.",
              },
              {
                step: "02",
                title: "Browse & Order",
                desc: "Explore our full menu, add items to your cart, and add special requests.",
              },
              {
                step: "03",
                title: "Enjoy Your Meal",
                desc: "Track your order status in real-time and request the bill when you're ready.",
              },
            ].map((item) => (
              <div key={item.step} className="px-8 py-10 md:first:pl-0 md:last:pr-0 first:pt-0 md:first:pt-10">
                {/* Ghost numeral */}
                <p
                  className="font-mono text-5xl mb-5 select-none"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 400,
                    color: "var(--line)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.step}
                </p>
                <h3
                  className="font-display text-lg mb-2"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES & MENU PREVIEW (client component)
      ══════════════════════════════════════════ */}
      <HomeMenuPreview
        categories={safeRestaurant?.categories || []}
        popularItems={safeRestaurant?.menuItems || []}
        restaurantId={safeRestaurant?.id || ""}
        tableId={demoTableId || ""}
        isDemoMode={true}
      />

      {/* ══════════════════════════════════════════
          CHEF'S PICKS — dot-leader strip
      ══════════════════════════════════════════ */}
      {chefsPickItems.length > 0 && (
        <section className="border-t" style={{ borderColor: "var(--line)", background: "var(--canvas)" }}>
          <div className="max-w-2xl mx-auto px-4 py-16">
            <p
              className="font-mono text-xs uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
            >
              Today&apos;s Picks
            </p>
            <h2
              className="font-display text-3xl mb-10"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.1,
              }}
            >
              Chef&apos;s Picks
            </h2>

            <div className="flex flex-col">
              {chefsPickItems.map((item, i) => (
                <div
                  key={item.id}
                  className="py-5"
                  style={{
                    borderBottom: i < chefsPickItems.length - 1
                      ? "1px solid var(--line)"
                      : "none",
                  }}
                >
                  <MenuLine
                    name={item.name}
                    price={item.price}
                    tag="Chef's Pick"
                    caption={item.description || undefined}
                  />
                </div>
              ))}
            </div>

            {demoTableId && (
              <div className="mt-10">
                <a
                  href={`/menu/preview`}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--spice)", fontFamily: "var(--font-work-sans)" }}
                >
                  View Full Menu
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════════ */}
      {safeRestaurant?.reviews && safeRestaurant.reviews.length > 0 && (
        <section className="border-t" style={{ borderColor: "var(--line)", background: "var(--warm-ivory)" }}>
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2
              className="font-display text-3xl text-center mb-10"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              What Our Guests Say
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeRestaurant.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl p-4"
                  style={{ border: "1px solid var(--line)", background: "var(--canvas)" }}
                >
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4`}
                        viewBox="0 0 20 20"
                        style={{ fill: i < review.rating ? "var(--gold)" : "var(--line)" }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {review.comment && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-work-sans)" }}
                    >
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer
        className="border-t"
        style={{ borderColor: "var(--line)", background: "var(--canvas)" }}
      >
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Logo size="md" href="/" />
              {restaurant?.address && (
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
                >
                  {restaurant.address}
                </p>
              )}
              {restaurant?.phone && (
                <p
                  className="text-sm mt-1 font-mono"
                  style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {restaurant.phone}
                </p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/staff"
                className="text-sm transition-colors"
                style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
              >
                Staff Login
              </Link>
              <Link
                href="/admin"
                className="text-sm transition-colors"
                style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
              >
                Admin
              </Link>
            </div>
          </div>
          <div
            className="mt-8 pt-6 text-center"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <p
              className="text-xs font-mono"
              style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)" }}
            >
              Powered by TableScan — QR Ordering System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
