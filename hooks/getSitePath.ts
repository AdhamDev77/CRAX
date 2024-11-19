const getSitePath = () => {
  if (typeof window !== "undefined") {
    const pathArray = window.location.pathname.split("/");
    const siteIndex = pathArray.indexOf("site");

    if (siteIndex !== -1 && siteIndex + 1 < pathArray.length) {
      const sitePath = pathArray[siteIndex + 1];
      return sitePath;
    }
  }
};

export const fetchSiteRoot = async () => {
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

export default getSitePath;
