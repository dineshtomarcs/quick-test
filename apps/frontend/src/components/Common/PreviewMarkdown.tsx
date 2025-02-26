import { marked } from "marked";
import DOMPurify from "dompurify";
import { t } from "i18next";

const PreviewMarkdown = ({ markdown, clickHandler = () => {} }: any) => {
  marked.setOptions({
    gfm: true,
    breaks: true,
  });
  const renderer = {
    // @ts-ignore
    image(href, text) {
      return `<div class="md:w-1/2"><a
      target="_blank"
      href=${href}
    >
    <img src="${href}" class="rounded-md" alt="${text}"/></a></div>`;
    },
  };

  marked.use({ renderer });

  const toMarkdown = () => {
    if (markdown) {
      const dirty = marked(markdown) as string;

      // https://github.com/cure53/DOMPurify/issues/317#issuecomment-698800327
      DOMPurify.addHook("afterSanitizeAttributes", function (node) {
        // set all elements owning target to target=_blank
        if ("target" in node) {
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener noreferrer");
        }
      });

      const clean = DOMPurify.sanitize(dirty, { FORBID_ATTR: ["id"] });
      return { __html: clean };
    }
    return { __html: t("Nothing to preview") };
  };
  return (
    <article
      id="#preview"
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={toMarkdown()}
      onClick={clickHandler}
    ></article>
  );
};

export default PreviewMarkdown;
