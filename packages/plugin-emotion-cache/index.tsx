
import { useEffect, useState } from "react";

import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import * as React from "react";

const createEmotionCachePlugin = (key: string): any => {
  return {
    overrides: {
      iframe: ({ children, document }:{ children:any, document:any }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [cache, setCache] = useState<EmotionCache | null>(null);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (document) {
            setCache(
              createCache({
                key,
                container: document.head,
              })
            );
          }
        }, [document, key]);

        if (cache) {
          return <CacheProvider value={cache}>{children}</CacheProvider>;
        }

        return <>{children}</>;
      },
    },
  };
};

export default createEmotionCachePlugin;
