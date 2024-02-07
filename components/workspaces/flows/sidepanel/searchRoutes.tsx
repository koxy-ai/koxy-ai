"use client";

export default function SearchRoutes() {
  const search = (value: string) => {
    const routes = document.getElementsByClassName("routeFolder");
    for (const index in routes) {
      const route = routes[index];
      if (!route || !route?.id) {
        return;
      }
      if (route.id.includes(value)) {
        route.classList.remove("hidden");
      } else {
        route.classList.add("hidden");
      }
    }
  };

  return (
    <input
      onInput={(e) => {
        const target = e.target as HTMLInputElement;
        search(String(target.value).toLocaleLowerCase().replace(" ", "-"));
      }}
      className="text-xs bg-transparent outline-0 border-0 opacity-70 focus:opacity-100 mt-0.5"
      placeholder="Search routes..."
    />
  );
}
