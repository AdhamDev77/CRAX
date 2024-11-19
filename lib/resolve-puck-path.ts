const resolvePuckPath = (puckPath: string[] = []): { isEdit: boolean; path: string } => {
  const hasPath = puckPath.length > 0;

  const isEdit = hasPath ? puckPath[puckPath.length - 1] === "edit" : false;

  return {
    isEdit,
    path: `/${(isEdit
      ? [...puckPath].slice(0, puckPath.length - 1)
      : [...puckPath]
    ).join("/")}`,
  };
};

export default resolvePuckPath;
//asd