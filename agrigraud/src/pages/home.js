import Hero from "../components/Hero";
import Features from "../components/Features";

export default function Home({ content }) {
  return (
    <>
      <Hero content={content} />
      <Features text={content.features} featuresText={content.featuresText} />
    </>
  );
}
