import React, { useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  const [displayError, setError] = useState<string | undefined>(undefined);

  return (
    <>
      {displayError ? (
        <p>{displayError}</p>
      ) : (
        <div>
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
        </div>
      )}
    </>
  );
};

export default App;
