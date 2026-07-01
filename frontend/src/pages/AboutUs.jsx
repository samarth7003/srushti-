import React from "react";
import { Link } from "react-router-dom";
import { Award, Compass, ShieldAlert, HeartHandshake } from "lucide-react";

export const AboutUs = () => {
  const values = [
    {
      icon: <Award className="text-gold-500" size={32} />,
      title: "Purity Uncompromised",
      desc: "Every gram of gold is 100% BIS Hallmarked (916 purity) and every diamond is certified by global laboratories (IGI, GIA) for cut, color, clarity, and carat weight."
    },
    {
      icon: <Compass className="text-gold-500" size={32} />,
      title: "Artistic Heritage",
      desc: "We support generational karigars (artisans) across India, keeping ancient techniques like Kundan meenakari, Nakshi temple engraving, and diamond filigree alive."
    },
    {
      icon: <HeartHandshake className="text-gold-500" size={32} />,
      title: "Bespoke Relationships",
      desc: "Jewellery is a personal heritage. We offer one-on-one custom bridal consults, lifetime exchange values, and absolute transparency in pricing."
    }
  ];

  return (
    <div className="bg-white dark:bg-luxury-black transition-colors duration-300 font-sans text-left">
      {/* 1. Page Header banner */}
      <section className="relative bg-stone-950 py-24 px-6 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.1),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&auto=format&fit=crop&q=80')" }}></div>
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-gold-400 font-medium tracking-[0.3em] uppercase text-xs sm:text-sm block">
            Crafting Elegance Since 1994
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-wide">
            Our Legacy & Story
          </h1>
          <p className="text-stone-300 max-w-lg text-sm sm:text-base font-light mx-auto leading-relaxed">
            Discover the passion, devotion, and timeless artistry that shapes the house of Srushti Jewellery.
          </p>
        </div>
      </section>

      {/* 2. Brand Story Narrative */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-gold-600 dark:text-gold-400 font-semibold tracking-wider text-xs uppercase">
            A Legacy of Splendor
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black dark:text-white leading-tight">
            Sculpting Traditions for the Modern Era
          </h2>
          <div className="h-0.5 w-16 bg-gold-500"></div>

          <div className="text-sm font-light text-gray-600 dark:text-gray-400 space-y-4 leading-relaxed">
            <p>
              Srushti Jewellery was founded in 1994 as a boutique family showroom. Our founder set out with a simple mission: to restore the transparency of goldsmithing and bring the finest Indian temple craftsmanship to patrons.
            </p>
            <p>
              Over the last three decades, Srushti has expanded from a small regional workshop into an award-winning jewelry label, renowned for bridal couture and lightweight contemporary diamond lines. Yet, our heart remains at the artisan's workbench.
            </p>
            <p>
              Every pattern is sketched by hand in our Bengaluru studio before our master karigars bring it to life using certified metals and handpicked precious gemstones. We blend traditional motifs with clean silhouettes to create heirlooms designed for generations.
            </p>
          </div>
        </div>

        {/* Story visual images */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
              alt="Bespoke jewelry sketching"
              className="rounded-2xl w-full object-cover aspect-[3/4] shadow-sm hover:scale-[1.02] transition-transform"
            />
            <div className="bg-gold-500 text-stone-950 p-6 rounded-2xl text-center space-y-1 shadow-sm">
              <p className="font-serif text-3xl font-bold leading-none">32+</p>
              <p className="text-[10px] uppercase font-bold tracking-widest leading-none">Years of Legacy</p>
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="bg-stone-900 text-gold-200 p-6 rounded-2xl text-center space-y-1 shadow-sm border border-gold-800/30">
              <p className="font-serif text-3xl font-bold leading-none">10K+</p>
              <p className="text-[10px] uppercase font-bold tracking-widest leading-none">Happy Brides</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
              alt="Artisanal goldsmith"
              className="rounded-2xl w-full object-cover aspect-[3/4] shadow-sm hover:scale-[1.02] transition-transform"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-20 px-6 bg-ivory-100 dark:bg-stone-900/50 border-y border-gold-200/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-gold-600 dark:text-gold-400 font-medium tracking-[0.2em] uppercase text-xs block text-center">
              Our Principles
            </span>
            <h2 className="text-3xl font-bold text-luxury-black dark:text-white text-center">
              The Srushti Foundations
            </h2>
            <div className="h-0.5 w-16 bg-gold-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-stone-50/70 dark:bg-luxury-charcoal p-8 rounded-3xl border border-gold-200/30 dark:border-stone-850/40 shadow-sm space-y-4 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-gold-50 dark:bg-stone-900/60 w-fit rounded-2xl border border-gold-200/20">
                  {v.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white">
                  {v.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Luxury Showroom Gallery */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-gold-600 dark:text-gold-400 font-medium tracking-[0.2em] uppercase text-xs block text-center">
            Our Showrooms
          </span>
          <h2 className="text-3xl font-bold text-luxury-black dark:text-white text-center">
            Step Inside Srushti
          </h2>
          <div className="h-0.5 w-16 bg-gold-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80"
              alt="High Jewellery Lounge"
              className="rounded-3xl w-full object-cover aspect-[4/3] shadow-md"
            />
            <h4 className="font-serif text-lg font-bold text-luxury-black dark:text-white">
              The Grand High-Jewellery Solitaire Lounge
            </h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Designed with bespoke consultation suites for brides and families. Enjoy personal curations by our chief designers.
            </p>
          </div>
          <div className="space-y-4">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80"
              alt="Boutique Counter"
              className="rounded-3xl w-full object-cover aspect-[4/3] shadow-md"
            />
            <h4 className="font-serif text-lg font-bold text-luxury-black dark:text-white">
              The Heritage Kundan & Gold Room
            </h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Explore traditional collections housed in modular climate-controlled drawers showing detailed weight breakdowns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
