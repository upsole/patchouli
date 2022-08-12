import Head from "next/head";
interface MetaProps {
  title?: string;
  desc?: string;
  keywords?: string;
}
const Meta: React.FC<MetaProps> = ({title, desc, keywords}) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <meta name="description" content={desc} />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <title>{title}</title>
      </Head>
    </>
  );
};

Meta.defaultProps = {
  title: "Patchouli",
  desc: "Storage Productivity Study",
  keywords: "Storage Productivity Study"
}

export default Meta;
