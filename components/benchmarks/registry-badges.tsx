/** Live registry version badges (shields.io) for the three SDK packages. */
export function RegistryBadges() {
  const badges = [
    {
      src: "https://img.shields.io/pypi/v/py-chunks?style=flat-square&label=py-chunks&color=e8511e",
      alt: "py-chunks version on PyPI",
      width: 128,
    },
    {
      src: "https://img.shields.io/npm/v/js-chunks?style=flat-square&label=js-chunks&color=e8511e",
      alt: "js-chunks version on npm",
      width: 124,
    },
    {
      src: "https://img.shields.io/crates/v/rs-chunks?style=flat-square&label=rs-chunks&color=e8511e",
      alt: "rs-chunks version on crates.io",
      width: 128,
    },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {badges.map((b) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={b.alt}
          src={b.src}
          alt={b.alt}
          width={b.width}
          height={24}
          className="h-6 w-auto"
        />
      ))}
    </div>
  );
}
