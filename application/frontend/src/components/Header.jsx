import NavigationSearchBar from './NavigationSearchBar'

export default function Header({ query, setQuery, ...rest }) {
  return <NavigationSearchBar query={query} onQueryChange={setQuery} {...rest} />
}
