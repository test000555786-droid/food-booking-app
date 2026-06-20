import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";

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

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative bg-surface border-b border-border overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="mb-6">
            <Logo size="lg" href="/" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text mb-4">
            {restaurant?.name || "Your Restaurant"}
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
            {restaurant?.tagline || "Scan the QR code at your table to browse our menu and order directly from your phone."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-xl text-primary text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan QR Code
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl text-success text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Real-time Updates
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl text-primary text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              Fresh & Hot
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold text-text text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Scan QR Code", desc: "Point your camera at the QR code on your table" },
            { step: "2", title: "Browse & Order", desc: "Explore our menu and add items to your cart" },
            { step: "3", title: "Enjoy Your Meal", desc: "Track your order status and enjoy fresh food" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-text mb-1">{item.title}</h3>
              <p className="text-sm text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {restaurant?.categories && restaurant.categories.length > 0 && (
        <section className="bg-surface py-8 border-y border-border overflow-hidden">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x justify-start md:justify-center">
              {restaurant.categories.map((category) => (
                <div 
                  key={category.id} 
                  className="snap-center flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-bg rounded-2xl border border-border hover:border-primary/30 transition-colors shadow-sm"
                >
                  <span className="text-xl leading-none">{category.emoji}</span>
                  <span className="font-semibold text-text text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu Preview */}
      {restaurant?.menuItems && restaurant.menuItems.length > 0 && (
        <section className="bg-surface border-y border-border py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-text text-center mb-10">Popular Dishes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurant.menuItems.map((item) => (
                <div key={item.id} className="bg-bg rounded-2xl border border-border p-4 flex gap-3">
                  <div className="w-20 h-20 rounded-xl bg-white flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-text text-sm truncate">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-semibold text-primary">{formatPrice(Number(item.price))}</p>
                      {demoTableId && (
                        <Link 
                          href={`/menu/${demoTableId}`}
                          className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Order
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {restaurant?.reviews && restaurant.reviews.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-text text-center mb-10">What Our Guests Say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurant.reviews.map((review) => (
              <div key={review.id} className="bg-surface rounded-2xl border border-border p-4">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {review.comment && <p className="text-sm text-text">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Logo size="md" href="/" />
              <p className="text-sm text-text-muted mt-2">{restaurant?.address}</p>
              {restaurant?.phone && (
                <p className="text-sm text-text-muted mt-1">{restaurant.phone}</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <Link href="/staff" className="text-sm text-text-muted hover:text-text transition-colors">Staff Login</Link>
              <Link href="/admin" className="text-sm text-text-muted hover:text-text transition-colors">Admin</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-muted">
              Powered by TableScan — QR Ordering System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
