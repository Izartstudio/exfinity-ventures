import { defineField, defineType } from "sanity";
import { fallbackFounders } from "../../content/homepage-founders";
export const homepageFounders = defineType({
  name: "homepageFounders", title: "Homepage — Founders / Portfolio Partners", type: "document",
  initialValue: { heading: "What Our Founders Say", layout: "three", founders: fallbackFounders.map((founder, index) => ({ ...founder, _type: "founder", _key: `founder-${index}` })) },
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "What Our Founders Say", validation: (rule) => rule.required() }),
    defineField({ name: "layout", title: "Portfolio partner layout", type: "string", initialValue: "three", options: { layout: "radio", list: [{ title: "3 visible images (launch)", value: "three" }, { title: "5 visible images", value: "five" }] }, description: "Keeps the current founder design and switching animation. Extra partners rotate through the selected number of visible slots (for example, 4 partners in 3 slots or 6 in 5 slots)." }),
    defineField({ name: "founders", title: "Partner slots (drag to reorder)", type: "array", validation: (rule) => rule.required().min(3).custom((value, context) => {
      const count = context.document?.layout === "five" ? 5 : 3;
      return (value?.length ?? 0) >= count || `Add at least ${count} complete partner slots for this layout.`;
    }), of: [{ name: "founder", type: "object", fields: [
      defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "role", title: "Role", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (rule) => rule.required() }),
      defineField({ name: "image", title: "Portrait", type: "image", options: { hotspot: true } }),
      defineField({ name: "imageUrl", title: "Existing portrait path", type: "string", description: "Upload a portrait above to replace this existing asset.", validation: (rule) => rule.custom((value) => !value || /^\/(?!\/)/.test(value) || "Use a local asset path.") }),
      defineField({ name: "logo", title: "Company logo", type: "image" }),
      defineField({ name: "logoUrl", title: "Existing logo path", type: "string", validation: (rule) => rule.custom((value) => !value || /^\/(?!\/)/.test(value) || "Use a local asset path.") }),
    ], validation: (rule) => rule.custom<Record<string, unknown>>((value) => !!(value?.image || value?.imageUrl) || "Add a portrait."), preview: { select: { title: "name", subtitle: "role", media: "image" } } }] }),
  ], preview: { prepare: () => ({ title: "Founders / Portfolio Partners" }) },
});
