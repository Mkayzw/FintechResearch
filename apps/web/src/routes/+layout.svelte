<script lang="ts">
  import { page } from "$app/state";
  import "../app.css";

  let { children } = $props();

  const siteUrl = "https://fieldlab.berelabs.co.zw";
  const defaultSeo = {
    title: "Fieldlab Physics — Zimbabwe A-Level Interactive Studies",
    description:
      "Interactive, research-led Physics laboratories for Zimbabwe Forms 5–6.",
  };

  const seoByPath: Record<string, { title: string; description: string }> = {
    "/": {
      title: "Fieldlab Physics — Zimbabwe A-Level Interactive Studies",
      description:
        "A map of interactive, research-led Physics laboratories for Zimbabwe Forms 5–6.",
    },
    "/mechanics/": {
      title: "A-Level Mechanics — Fieldlab Physics",
      description:
        "A complete interactive provisional ZIMSEC A-Level Newtonian Mechanics course covering kinematics, dynamics, forces, energy, circular motion and gravitation.",
    },
    "/mechanics/projectile-motion/": {
      title: "Beyond 45° — Projectile Motion | Fieldlab Physics",
      description:
        "An interactive Zimbabwe A-Level study of projectile motion, vectors, drag, uncertainty and range.",
    },
    "/mechanics/double-pendulum/": {
      title: "Strange Loops — Advanced Mechanics | Fieldlab Physics",
      description:
        "A literature-grounded interactive investigation of deterministic chaos in the double pendulum.",
    },
  };

  let canonicalPath = $derived(
    page.url.pathname === "/" || page.url.pathname.endsWith("/")
      ? page.url.pathname
      : `${page.url.pathname}/`,
  );
  let seo = $derived(seoByPath[canonicalPath] ?? defaultSeo);
  let canonicalUrl = $derived(`${siteUrl}${canonicalPath}`);
</script>

<svelte:head>
  <meta
    name="robots"
    content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
  />
  <link rel="canonical" href={canonicalUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Fieldlab Physics" />
  <meta property="og:locale" content="en_ZW" />
  <meta property="og:title" content={seo.title} />
  <meta property="og:description" content={seo.description} />
  <meta property="og:url" content={canonicalUrl} />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={seo.title} />
  <meta name="twitter:description" content={seo.description} />
</svelte:head>

{@render children()}
