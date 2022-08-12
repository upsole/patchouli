import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400&family=IBM+Plex+Sans:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />{" "}
        <title>Patchouli</title>
      </Head>
      <body className="dark:bg-primary text-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
