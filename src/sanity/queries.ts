import { defineQuery } from "next-sanity";

const image = /* groq */ `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  crop,
  hotspot,
  alt
}`;

const artworkFields = /* groq */ `
  "id": _id,
  title,
  "slug": slug.current,
  "category": category->{ title, "slug": slug.current },
  "images": images[]${image},
  status,
  price,
  "featured": coalesce(featured, false),
  "description": coalesce(description, []),
  dimensions,
  materials,
  year
`;

const published = /* groq */ `_type == "artwork" && defined(slug.current) && count(images) > 0`;

export const artworksQuery = defineQuery(`
  *[${published}] | order(_createdAt desc) { ${artworkFields} }
`);

export const artworkBySlugQuery = defineQuery(`
  *[${published} && slug.current == $slug][0] { ${artworkFields} }
`);

export const categoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(order asc, title asc) {
    title,
    "slug": slug.current,
    description,
    "cover": coalesce(
      cover${image},
      (*[${published} && references(^._id)] | order(_createdAt desc))[0].images[0]${image}
    ),
    "count": count(*[${published} && references(^._id)])
  }
`);

export const settingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    title,
    tagline,
    "portrait": portrait${image},
    "about": coalesce(about, []),
    "contacts": { telegram, whatsapp, instagram, vk, email }
  }
`);
