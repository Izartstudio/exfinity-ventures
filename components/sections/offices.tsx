import Image from "next/image";

export type Office = {
  city: string;
  country: string;
  image: string;
  imagePosition?: string;
};

const defaultOffices: Office[] = [
  { city: "Bangalore", country: "India", image: "/team/offices/bangalore.jpg" },
  { city: "Singapore City", country: "Singapore", image: "/team/offices/singapore.jpg" },
  { city: "Silicon Valley", country: "USA", image: "/team/offices/silicon-valley.jpg" },
];

export function Offices({
  title = "We stay close to the markets our founders build for",
  offices = defaultOffices,
}: {
  title?: string;
  offices?: Office[];
}) {
  return (
    <section className="offices-section" aria-labelledby="offices-title">
      <div className="container">
        <div className="section-kicker"><span>Offices</span></div>
        <h2 id="offices-title">{title}</h2>
        <div className="offices-grid">
          {offices.map((office) => (
            <article className="office-card" key={`${office.city}-${office.country}`}>
              <Image
                src={office.image}
                alt={`${office.city}, ${office.country}`}
                fill
                sizes="(max-width: 650px) calc(100vw - 2.5rem), (max-width: 900px) 48vw, 31vw"
                style={{ objectPosition: office.imagePosition ?? "center center" }}
              />
              <div className="office-card-overlay" aria-hidden="true" />
              <div className="office-card-copy">
                <h3>{office.city}</h3>
                <p>{office.country}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
