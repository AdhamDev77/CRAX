import getSitePath from "./getSitePath";

 const fetchSiteRoot = async () => {
    try {
      const response = await fetch(`/api/site/${getSitePath()}/root`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return {bgColor: data.bgColor,font: data.font}
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  export default fetchSiteRoot