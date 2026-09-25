function FestivalPurchaseTag({ festivalTags = [] }) {
  if (!festivalTags?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {festivalTags.map((festival) => (
        <span
          key={festival.id}
          className="inline-flex max-w-[220px] items-center gap-1 rounded-full border border-[#CA8549]/40 bg-gradient-to-l from-[#253c8a]/10 to-[#CA8549]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#253c8a]"
          title={festival.name}
        >
          <span className="shrink-0 text-[#CA8549]">جشنواره</span>
          <span className="truncate font-medium">{festival.name}</span>
        </span>
      ))}
    </div>
  );
}

export default FestivalPurchaseTag;
