export default function BlockRenderer({
  blocks,
  empty = "Nothing added yet.",
}) {
  if (!Array.isArray(blocks) || blocks.length === 0)
    return <p className="muted">{empty}</p>;
  return (
    <div className="blocks">
      {blocks.map((b, i) => {
        if (b.type === "heading") return <h3 key={i}>{b.content}</h3>;
        if (b.type === "paragraph") return <p key={i}>{b.content}</p>;
        if (b.type === "list")
          return (
            <ul key={i}>
              {(b.items || []).map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        return null;
      })}
    </div>
  );
}
