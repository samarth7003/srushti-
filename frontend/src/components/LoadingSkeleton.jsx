import React from "react";

export const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-luxury-charcoal border border-gold-100/50 dark:border-stone-900/40 rounded-xl sm:rounded-2xl p-3 sm:p-5 animate-pulse flex flex-col justify-between h-[280px] sm:h-[360px]">
      <div>
        <div className="bg-stone-200 dark:bg-stone-800 rounded-lg sm:rounded-xl pt-[100%] w-full mb-3 sm:mb-4"></div>
        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4 mb-2"></div>
        <div className="h-2.5 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
      </div>
      <div className="flex justify-between items-center mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gold-100/10 dark:border-stone-800/20">
        <div className="h-4 sm:h-6 bg-stone-200 dark:bg-stone-800 rounded w-12 sm:w-20"></div>
        <div className="h-6 sm:h-8 bg-stone-200 dark:bg-stone-800 rounded w-10 sm:w-16"></div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 animate-pulse font-sans">
      <div className="space-y-4">
        <div className="bg-stone-200 dark:bg-stone-800 rounded-2xl pt-[100%] w-full"></div>
        <div className="flex gap-3">
          <div className="bg-stone-200 dark:bg-stone-800 rounded-lg h-20 w-20"></div>
          <div className="bg-stone-200 dark:bg-stone-800 rounded-lg h-20 w-20"></div>
          <div className="bg-stone-200 dark:bg-stone-800 rounded-lg h-20 w-20"></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/4"></div>
          <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
          <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-1/3"></div>
        </div>
        <div className="h-20 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
        <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
        <div className="flex gap-4">
          <div className="h-12 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
          <div className="h-12 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
