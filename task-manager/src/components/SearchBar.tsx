export default function SearchBar({ setSearch }: any) {
  return (
    <input
      placeholder="Search tasks..."
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
