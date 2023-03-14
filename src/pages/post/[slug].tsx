import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import * as fs from "fs";
import path from "path";

type Props = { title: string; text: string };

export function getStaticPaths(
  _cx: GetStaticPathsContext
): GetStaticPathsResult<{ slug: string }> {
  const entryDir = path.resolve(process.cwd(), "src/entry");
  const entryFiles = fs.readdirSync(entryDir).map((filename) => {
    return {
      params: {
        slug: filename.split(".")[0],
      },
    };
  });
  return {
    paths: entryFiles,
    fallback: false,
  };
}
export function getStaticProps(
  cx: GetStaticPropsContext
): GetStaticPropsResult<Props> {
  const fileName = cx.params?.slug;
  if (typeof fileName !== "string") {
    return { props: { title: "404", text: "" } };
  }
  const filePath = path.resolve(process.cwd(), `src/entry/${fileName}.txt`);
  const content = fs.readFileSync(filePath, "ascii");
  return { props: { text: content, title: fileName } };
}

export default function BlogEntry({ text, title }: Props) {
  return (
    <>
      <h2>{title}</h2>
      <p>{text}</p>
    </>
  );
}
