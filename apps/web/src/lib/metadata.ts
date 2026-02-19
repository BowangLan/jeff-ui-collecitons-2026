type PageMetadata = {
  title: string;
  description?: string;
};

export function setPageMetadata({ title, description }: PageMetadata) {
  document.title = title;

  if (!description) {
    return;
  }

  let descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement("meta");
    descriptionMeta.setAttribute("name", "description");
    document.head.appendChild(descriptionMeta);
  }

  descriptionMeta.setAttribute("content", description);
}
