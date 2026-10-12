import { defineType, defineField } from "sanity";
import defaults from "../../content/contact-faqs.json";
export const contactFaqs = defineType({
  name: "contactFaqs", title: "Contact — FAQs", type: "document", initialValue: defaults,
  fields: [
    defineField({ name: "kicker", title: "Section label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "text", rows: 2, validation: (rule) => rule.required() }),
    defineField({ name: "faqs", title: "FAQs (drag to reorder)", type: "array", validation: (rule) => rule.required().min(1), of: [{ type: "object", name: "faq", fields: [
      defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "answer", type: "array", validation: (rule) => rule.required().min(1), of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [{ title: "Bullet", value: "bullet" }, { title: "Numbered", value: "number" }], marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }], annotations: [{ name: "link", type: "object", title: "Link", fields: [{ name: "href", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https", "http", "mailto"], allowRelative: true }) }] }] } }] }),
    ], preview: { select: { title: "question" } } }] }),
  ], preview: { prepare: () => ({ title: "Contact FAQs" }) },
});
