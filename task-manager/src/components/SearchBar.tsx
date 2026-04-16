export default function SearchBar({ setSearch }: any) {
  return (
    <input
      placeholder="Search..."
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
