import { defineField, defineType } from "sanity";
import { backingDefaults, companiesDefaults } from "../../content/homepage-sections";

const text = (name: string, title: string) => defineField({ name, title, type: "string", validation: (rule) => rule.required() });
const link = (name: string, title: string) => defineField({ name, title, type: "string", validation: (rule) => rule.required().custom((value) => !value || /^(\/(?!\/)|https:\/\/|mailto:)/.test(value) || "Use a site path, HTTPS URL, or mailto link.") });
const image = (name: string, title: string) => defineField({ name, title, type: "image", options: { hotspot: true } });
const assetPath = (name: string, title: string) => defineField({ name, title, type: "string", description: "Existing site asset path. An uploaded image takes priority.", validation: (rule) => rule.custom((value) => !value || /^\/(?!\/)/.test(value) || "Use a local asset path beginning with /. Upload new images above.") });
const companyFields = [text("name", "Company name"), link("href", "Portfolio link"), image("logoImage", "Logo"), assetPath("logo", "Existing logo path")];
const ctaFields = [text("ctaLabel", "Button label"), link("ctaHref", "Button link")];

export const homepageCompanies = defineType({
  name: "homepageCompanies", title: "Homepage — Companies We Back", type: "document",
  initialValue: { ...companiesDefaults, companies: companiesDefaults.companies.map((item, i) => ({ ...item, _key: `company-${i}`, _type: "company" })) },
  fields: [text("heading", "Section heading"), defineField({ name: "description", type: "text", validation: (rule) => rule.required() }), ...ctaFields,
    defineField({ name: "companies", title: "Companies (drag to reorder)", type: "array", validation: (rule) => rule.required().min(1), of: [{ type: "object", name: "company", fields: [...companyFields,
      defineField({ name: "width", title: "Logo width", type: "number", initialValue: 150, validation: (rule) => rule.required().positive() }),
      defineField({ name: "height", title: "Logo height", type: "number", initialValue: 50, validation: (rule) => rule.required().positive() }),
    ], validation: (rule) => rule.custom<Record<string, unknown>>((value) => !!(value?.logoImage || value?.logo) || "Upload a logo or supply an existing logo path."), preview: { select: { title: "name", media: "logoImage" } } }] }),
  ], preview: { prepare: () => ({ title: "Companies We Back" }) },
});

export const homepageBacking = defineType({
  name: "homepageBacking", title: "Homepage — What We Back & Popups", type: "document",
  initialValue: { ...backingDefaults, cards: backingDefaults.cards.map((card) => ({ ...card, _key: card.id, _type: "backingCard", companies: card.companies.map((item, i) => ({ ...item, _key: `company-${i}`, _type: "popupCompany" })) })) },
  fields: [text("kicker", "Section label"), text("heading", "Heading"), defineField({ name: "description", type: "text", validation: (rule) => rule.required() }), ...ctaFields, text("readMoreLabel", "Card button label"), text("aboutLabel", "Popup about label"), text("themesLabel", "Popup themes label"),
    defineField({ name: "cards", title: "Investment categories and popups", type: "array", validation: (rule) => rule.required().min(1).max(3).custom((cards) => !cards || new Set(cards.map((card) => (card as { id?: string }).id)).size === cards.length || "Choose a different category ID for each card."), of: [{ name: "backingCard", type: "object", fields: [
      defineField({ name: "id", title: "Layout / category ID", type: "string", options: { list: [{ title: "DeepTech", value: "deeptech" }, { title: "AI-Native", value: "ai-native" }, { title: "B2B (wide card)", value: "b2b" }] }, validation: (rule) => rule.required() }),
      text("title", "Category title"), image("cardImage", "Card and popup image"), assetPath("image", "Existing image path"), text("aboutLead", "Popup lead sentence"), defineField({ name: "copy", title: "Popup description", type: "text", validation: (rule) => rule.required() }),
      defineField({ name: "themes", title: "Popup themes", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(1) }),
      defineField({ name: "companies", title: "Popup companies", type: "array", validation: (rule) => rule.required().min(1), of: [{ name: "popupCompany", type: "object", fields: [...companyFields, image("whiteLogoImage", "White logo (hover)"), assetPath("logoWhite", "Existing white logo path")], validation: (rule) => rule.custom<Record<string, unknown>>((value) => !!(value?.logoImage || value?.logo) || "Add a logo."), preview: { select: { title: "name", media: "logoImage" } } }] }),
    ], validation: (rule) => rule.custom<Record<string, unknown>>((value) => !!(value?.cardImage || value?.image) || "Add a category image."), preview: { select: { title: "title", media: "cardImage" } } }] }),
  ], preview: { prepare: () => ({ title: "What We Back & Popups" }) },
});
