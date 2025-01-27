import TemplateGrid from "./components/TemplateGrid";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import Navbar from "../_components/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen">
        <div className="container mx-auto py-10 px-4">
          <h1 className="text-4xl font-bold mb-8">Template Marketplace</h1>
          <div className="mb-4">
            <SearchBar />
          </div>
          <div className="mb-4">
            <Filters />
          </div>
          <TemplateGrid />
        </div>
      </div>
    </>
  );
}
